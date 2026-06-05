import { ok, type Result } from '@spa-bridge/core-model';

import {
  createSecurityError,
  type SecurityAuditEvent,
  type SecurityConfig,
  type SecurityEvaluationRequest,
  type SecurityEvaluationResult,
} from '../types.js';
import { SecurityConfigResolver } from '../config/security-config.js';
import { SensitiveDataDetector, FindingMerger } from '../detection/sensitive-data-detector.js';
import { SecurityRulePackRegistry } from '../rule-packs/security-rule-pack-registry.js';
import { TokenVault } from '../token-vault/token-vault.js';
import { MaskingPipeline } from '../masking/masking-pipeline.js';
import { ProviderPolicyGate } from '../policy/provider-policy-gate.js';
import { SafeAuditEventBuilder } from '../audit/safe-audit-event-builder.js';
import { AccessControlHookEvaluator } from '../access/access-control-hook-evaluator.js';

export class SecurityEvaluationPipeline {
  private readonly configResolver = new SecurityConfigResolver();
  private readonly detector = new SensitiveDataDetector();
  private readonly merger = new FindingMerger();
  private readonly policyGate = new ProviderPolicyGate();
  private readonly auditBuilder = new SafeAuditEventBuilder();
  private readonly accessEvaluator = new AccessControlHookEvaluator();

  evaluate(input: SecurityEvaluationRequest): Result<SecurityEvaluationResult, ReturnType<typeof createSecurityError>> {
    const configResult = this.configResolver.resolve({
      projectRoot: 'workspace',
      runId: `run-${input.schemaVersion}`,
      correlationId: `correlation-${input.schemaVersion}`,
      rawConfig: input.rawConfig,
      overrides: input.overrides,
    });
    if (!configResult.ok) {
      return configResult;
    }

    const config = configResult.value;
    const rulePackRegistry = new SecurityRulePackRegistry();
    const packResult = rulePackRegistry.registerAll(input.rulePacks);
    if (!packResult.ok) {
      return packResult;
    }
    const resolvedRulePacks = rulePackRegistry.resolve(config.rulePackIds);

    const detectionResult = this.detector.detect({
      payload: input.payload,
      sourceRefs: input.sourceRefs,
      payloadId: 'payload',
      rulePacks: resolvedRulePacks,
    });
    if (!detectionResult.ok) {
      return detectionResult;
    }

    const findings = this.merger.merge(detectionResult.value.findings);
    const tokenVault = new TokenVault(config.tokenTtlMs);
    const maskingPipeline = new MaskingPipeline({ tokenVault });
    const maskingResult = maskingPipeline.mask({
      payloadId: detectionResult.value.payloadRef.id,
      payload: detectionResult.value.normalizedPayload,
      findings,
      mode: config.redactOutputs ? 'redacted' : 'tokenized',
      scope: {
        runId: config.runId,
        correlationId: config.correlationId,
        purpose: 'security-evaluation',
      },
      allowRestoration: config.preservePartialArtifacts,
    });
    if (!maskingResult.ok) {
      return maskingResult;
    }

    const policyDecision = this.policyGate.evaluate({
      providerMode: input.providerMode,
      config,
      externalProviderRequested: input.externalProviderRequested,
      maskingReady: maskingResult.value.safe,
      auditReady: config.auditEnabled,
      rulePacksResolved: resolvedRulePacks.length > 0 || config.rulePackIds.length === 0,
      policyKnown: true,
      providerKnown: true,
      findingsPresent: findings.length > 0,
    });
    if (!policyDecision.ok) {
      return policyDecision;
    }

    const auditEventResult = this.auditBuilder.build({
      eventType: 'security-evaluation',
      severity: policyDecision.value.decision === 'block' ? 'warning' : 'info',
      message: policyDecision.value.reason,
      runId: config.runId,
      correlationId: config.correlationId,
      safeRefs: [...input.sourceRefs, ...input.generatedRefs],
      counts: {
        findings: findings.length,
        redactions: maskingResult.value.mode === 'redacted' ? findings.length : 0,
        tokenizations: maskingResult.value.tokenRefs.length,
        blockedDecisions: policyDecision.value.decision === 'block' ? 1 : 0,
      },
      reasonCodes: [policyDecision.value.reasonCode],
      metadata: {
        providerMode: input.providerMode,
        externalProviderRequested: String(input.externalProviderRequested),
      },
    });
    if (!auditEventResult.ok) {
      return auditEventResult;
    }

    const accessDecision = this.accessEvaluator.evaluate({
      policyKnown: true,
      explicitGrant: policyDecision.value.decision !== 'block',
      renderSafe: true,
      requestedScope: 'security-evaluation',
      grantedScopes: policyDecision.value.decision === 'allow' ? ['security-evaluation'] : [],
    });
    if (!accessDecision.ok) {
      return accessDecision;
    }

    return ok({
      schemaVersion: 1,
      config,
      findings,
      maskedPayload: maskingResult.value,
      policyDecision: policyDecision.value,
      auditEvent: auditEventResult.value,
      accessDecision: accessDecision.value,
      rulePacks: resolvedRulePacks,
    });
  }
}
