import { createSafeDisplayString, err, ok, type Result } from '@spa-bridge/core-model';

import {
  createSecurityError,
  type ProviderPolicyDecision,
  type SecurityConfig,
  type SecurityPolicyMode,
} from '../types.js';

export type ProviderReadiness = {
  ready: boolean;
  missingPrerequisites: string[];
};

export class ProviderReadinessEvaluator {
  evaluate(input: {
    config: SecurityConfig;
    maskingReady: boolean;
    auditReady: boolean;
    rulePacksResolved: boolean;
  }): Result<ProviderReadiness, ReturnType<typeof createSecurityError>> {
    const missingPrerequisites: string[] = [];
    if (!input.config.externalProviderOptIn) {
      missingPrerequisites.push('external-provider-opt-in');
    }
    if (!input.config.allowExternalProviderUse) {
      missingPrerequisites.push('external-provider-enabled');
    }
    if (!input.maskingReady) {
      missingPrerequisites.push('masking-ready');
    }
    if (!input.auditReady) {
      missingPrerequisites.push('audit-ready');
    }
    if (!input.rulePacksResolved) {
      missingPrerequisites.push('rule-packs-resolved');
    }

    return ok({
      ready: missingPrerequisites.length === 0,
      missingPrerequisites,
    });
  }
}

export class ProviderPolicyGate {
  private readonly readinessEvaluator = new ProviderReadinessEvaluator();

  evaluate(input: {
    providerMode: SecurityPolicyMode;
    config: SecurityConfig;
    externalProviderRequested: boolean;
    maskingReady: boolean;
    auditReady: boolean;
    rulePacksResolved: boolean;
    policyKnown: boolean;
    providerKnown: boolean;
    findingsPresent: boolean;
  }): Result<ProviderPolicyDecision, ReturnType<typeof createSecurityError>> {
    if (!input.policyKnown) {
      return ok({
        decision: 'block',
        reasonCode: 'POLICY_UNKNOWN',
        reason: createSafeDisplayString('Provider policy is unknown, so use is blocked.'),
        providerMode: input.providerMode,
        externalProviderAllowed: false,
        maskingRequired: true,
        auditRequired: true,
        findingsPresent: input.findingsPresent,
      });
    }

    if (input.providerMode === 'external-only' || input.externalProviderRequested) {
      const readiness = this.readinessEvaluator.evaluate({
        config: input.config,
        maskingReady: input.maskingReady,
        auditReady: input.auditReady,
        rulePacksResolved: input.rulePacksResolved,
      });
      if (!readiness.ok) {
        return err(readiness.error);
      }

      if (!readiness.value.ready) {
        return ok({
          decision: 'block',
          reasonCode: 'EXTERNAL_PROVIDER_NOT_READY',
          reason: createSafeDisplayString(
            `External provider is not ready because: ${readiness.value.missingPrerequisites.join(', ')}`,
          ),
          providerMode: input.providerMode,
          externalProviderAllowed: false,
          maskingRequired: true,
          auditRequired: true,
          findingsPresent: input.findingsPresent,
        });
      }
    }

    if (!input.providerKnown) {
      return ok({
        decision: 'block',
        reasonCode: 'UNKNOWN_PROVIDER',
        reason: createSafeDisplayString('Unknown provider is blocked by policy.'),
        providerMode: input.providerMode,
        externalProviderAllowed: false,
        maskingRequired: true,
        auditRequired: true,
        findingsPresent: input.findingsPresent,
      });
    }

    if (input.findingsPresent && !input.maskingReady) {
      return ok({
        decision: 'block',
        reasonCode: 'MASKING_REQUIRED',
        reason: createSafeDisplayString('Sensitive findings require masking before provider use.'),
        providerMode: input.providerMode,
        externalProviderAllowed: false,
        maskingRequired: true,
        auditRequired: true,
        findingsPresent: input.findingsPresent,
      });
    }

    if (!input.config.externalProviderOptIn && input.externalProviderRequested) {
      return ok({
        decision: 'block',
        reasonCode: 'EXTERNAL_PROVIDER_NOT_OPTED_IN',
        reason: createSafeDisplayString('External provider use has not been explicitly opted in.'),
        providerMode: input.providerMode,
        externalProviderAllowed: false,
        maskingRequired: true,
        auditRequired: true,
        findingsPresent: input.findingsPresent,
      });
    }

    if (!input.config.allowExternalProviderUse && input.externalProviderRequested) {
      return ok({
        decision: 'block',
        reasonCode: 'EXTERNAL_PROVIDER_DISABLED',
        reason: createSafeDisplayString('External provider use is disabled by configuration.'),
        providerMode: input.providerMode,
        externalProviderAllowed: false,
        maskingRequired: true,
        auditRequired: true,
        findingsPresent: input.findingsPresent,
      });
    }

    if (input.providerMode === 'external-only' && !input.externalProviderRequested) {
      return ok({
        decision: 'block',
        reasonCode: 'EXTERNAL_PROVIDER_REQUIRED',
        reason: createSafeDisplayString('Configuration requires an external provider, but none was requested.'),
        providerMode: input.providerMode,
        externalProviderAllowed: false,
        maskingRequired: true,
        auditRequired: true,
        findingsPresent: input.findingsPresent,
      });
    }

    return ok({
      decision: input.findingsPresent ? 'manual-review' : 'allow',
      reasonCode: input.findingsPresent ? 'MANUAL_REVIEW_REQUIRED' : 'ALLOW_LOCAL_PROVIDER',
      reason: createSafeDisplayString(
        input.findingsPresent
          ? 'Sensitive findings were resolved safely, but manual review remains recommended.'
          : 'Provider use is permitted by policy.',
      ),
      providerMode: input.providerMode,
      externalProviderAllowed: input.providerMode !== 'local-first' || input.externalProviderRequested,
      maskingRequired: input.findingsPresent,
      auditRequired: true,
      findingsPresent: input.findingsPresent,
    });
  }
}
