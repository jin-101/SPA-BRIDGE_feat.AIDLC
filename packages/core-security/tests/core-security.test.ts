import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  AccessControlHookEvaluator,
  AuditPrivacyGuard,
  FindingMerger,
  MaskingPipeline,
  ProviderPolicyGate,
  SafeAuditEventBuilder,
  SecurityConfigResolver,
  SecurityEvaluationPipeline,
  SecurityRulePackRegistry,
  SensitiveDataDetector,
  TokenVault,
  createSecurityError,
  securityArbitraries,
} from '../src/index.js';

const expectOk = <T, E>(result: { ok: true; value: T } | { ok: false; error: E }): T => {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error('Expected result to be ok');
  }
  return result.value;
};

describe('SecurityConfigResolver', () => {
  it('merges defaults and overrides deterministically', () => {
    const resolver = new SecurityConfigResolver();
    const first = expectOk(
      resolver.resolve({
        projectRoot: '/repo',
        runId: 'run-1',
        correlationId: 'corr-1',
        rawConfig: {
          allowExternalProviderUse: true,
          rulePackIds: ['b', 'a'],
          manualReviewEnabled: false,
        },
        overrides: {
          rulePackIds: ['c', 'a'],
          redactOutputs: false,
        },
      }),
    );
    const second = expectOk(
      resolver.resolve({
        projectRoot: '/repo',
        runId: 'run-1',
        correlationId: 'corr-1',
        rawConfig: {
          allowExternalProviderUse: true,
          rulePackIds: ['b', 'a'],
          manualReviewEnabled: false,
        },
        overrides: {
          rulePackIds: ['c', 'a'],
          redactOutputs: false,
        },
      }),
    );

    expect(first).toStrictEqual(second);
    expect(first.rulePackIds).toEqual(['b', 'a', 'c']);
    expect(first.redactOutputs).toBe(false);
  });
});

describe('Rule pack registry', () => {
  it('blocks downgrade attempts and orders packs by precedence', () => {
    const registry = new SecurityRulePackRegistry();
    expect(
      registry.register({
        id: 'generic',
        version: 2,
        precedence: 1,
        target: 'generic',
        categories: ['email'],
        redactionMode: 'redacted',
        tokenizationAllowed: false,
        allowExternalProviderUse: false,
        metadata: {},
      }).ok,
    ).toBe(true);

    const downgrade = registry.register({
      id: 'generic',
      version: 1,
      precedence: 2,
      target: 'generic',
      categories: ['jwt'],
      redactionMode: 'tokenized',
      tokenizationAllowed: true,
      allowExternalProviderUse: false,
      metadata: {},
    });
    expect(downgrade.ok).toBe(false);
    expect(registry.list()[0]?.id).toBe('generic');
  });
});

describe('Detection and masking', () => {
  it('detects sensitive payloads and redacts them deterministically', () => {
    const detector = new SensitiveDataDetector();
    const detection = expectOk(
      detector.detect({
        payload: 'hello email test@example.com and harmless text',
        payloadId: 'payload-1',
      }),
    );

    expect(detection.findings.length).toBeGreaterThan(0);

    const merger = new FindingMerger();
    const merged = merger.merge(detection.findings);
    expect(merged.length).toBe(detection.findings.length);

    const tokenVault = new TokenVault(60_000);
    const maskingPipeline = new MaskingPipeline({ tokenVault });
    const masked = expectOk(
      maskingPipeline.mask({
        payloadId: detection.payloadRef.id,
        payload: detection.normalizedPayload,
        findings: merged,
        mode: 'tokenized',
        scope: {
          runId: 'run-1',
          correlationId: 'corr-1',
          purpose: 'test',
        },
      }),
    );

    expect(masked.redactedText).not.toContain('test@example.com');
    expect(masked.redactedText).toMatch(/sec_[a-f0-9]{24}/);
    expect(masked.tokenRefs).toHaveLength(merged.length);
  });

  it('rejects unsafe output fields', () => {
    const guard = new AuditPrivacyGuard();
    expect(
      guard.sanitize({
        eventType: 'audit',
        excerpt: 'unsafe',
      }),
    ).toMatchObject({ ok: false });
  });
});

describe('Policy and access control', () => {
  it('fails closed for external providers without opt-in', () => {
    const gate = new ProviderPolicyGate();
    const decision = expectOk(
      gate.evaluate({
        providerMode: 'external-only',
        config: {
          schemaVersion: 1,
          projectRoot: '/repo',
          runId: 'run-1',
          correlationId: 'corr-1',
          detectSensitiveData: true,
          redactOutputs: true,
          allowExternalProviderUse: false,
          externalProviderOptIn: false,
          auditEnabled: true,
          manualReviewEnabled: true,
          preservePartialArtifacts: true,
          tokenTtlMs: 60_000,
          rulePackIds: [],
          defaultProviderMode: 'local-first',
          targetAwareRulePacks: true,
        },
        externalProviderRequested: true,
        maskingReady: false,
        auditReady: true,
        rulePacksResolved: false,
        policyKnown: true,
        providerKnown: true,
        findingsPresent: true,
      }),
    );

    expect(decision.decision).toBe('block');
  });

  it('denies access by default unless a scope is explicitly granted', () => {
    const evaluator = new AccessControlHookEvaluator();
    const denied = expectOk(
      evaluator.evaluate({
        policyKnown: true,
        explicitGrant: false,
        renderSafe: true,
      }),
    );

    expect(denied.decision).toBe('deny');
  });
});

describe('Evaluation pipeline', () => {
  it('produces a stable evaluation result for safe local-first flows', () => {
    const pipeline = new SecurityEvaluationPipeline();
    const request = {
      schemaVersion: 1 as const,
      payload: 'email: test@example.com',
      providerMode: 'local-first' as const,
      externalProviderRequested: false,
      rulePacks: [
        {
          id: 'generic',
          version: 1,
          precedence: 1,
          target: 'generic',
          categories: ['email'],
          redactionMode: 'redacted' as const,
          tokenizationAllowed: false,
          allowExternalProviderUse: false,
          metadata: {},
        },
      ],
      sourceRefs: [],
      generatedRefs: [],
    };

    const first = expectOk(pipeline.evaluate(request));
    const second = expectOk(pipeline.evaluate(request));

    expect(first).toStrictEqual(second);
    expect(first.auditEvent.safeMessage.length).toBeGreaterThan(0);
  });
});

describe('Property-based security invariants', () => {
  it('resolves the same config repeatedly for the same inputs', () => {
    fc.assert(
      fc.property(
        securityArbitraries.securityConfigArb,
        (config) => {
          const resolver = new SecurityConfigResolver();
          const input = {
            projectRoot: config.projectRoot,
            runId: config.runId,
            correlationId: config.correlationId,
            rawConfig: {
              allowExternalProviderUse: config.allowExternalProviderUse,
              externalProviderOptIn: config.externalProviderOptIn,
              rulePackIds: config.rulePackIds,
              redactOutputs: config.redactOutputs,
            },
            overrides: {
              auditEnabled: config.auditEnabled,
              preservePartialArtifacts: config.preservePartialArtifacts,
            },
          };

          const first = expectOk(resolver.resolve(input));
          const second = expectOk(resolver.resolve(input));
          expect(first).toStrictEqual(second);
        },
      ),
      {
        seed: 20260605,
        numRuns: 20,
      },
    );
  });

  it('preserves token vault round-trip behavior inside a fixed scope', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 16 }), fc.string({ minLength: 1, maxLength: 16 }), (category, secret) => {
        const vault = new TokenVault(10_000);
        const scope = {
          runId: 'run-1',
          correlationId: 'corr-1',
          purpose: 'property-test',
        };
        const issued = expectOk(vault.issueToken({ scope, category, secret }));
        const restored = expectOk(vault.restoreToken({ scope, token: issued.token }));
        expect(restored.secret).toBe(secret);
        expect(restored.category).toBe(category);
      }),
      {
        seed: 20260605,
        numRuns: 20,
      },
    );
  });

  it('keeps audit events safe across generated inputs', () => {
    fc.assert(
      fc.property(securityArbitraries.securityAuditEventArb, (event) => {
        const builder = new SafeAuditEventBuilder();
        const built = expectOk(
          builder.build({
            eventType: event.eventType,
            severity: event.severity,
            message: event.safeMessage,
            runId: event.runId,
            correlationId: event.correlationId,
            safeRefs: event.safeRefs,
            counts: event.counts,
            reasonCodes: event.reasonCodes,
            metadata: event.metadata,
          }),
        );
        expect(built.safeMessage).toBeTruthy();
      }),
      {
        seed: 20260605,
        numRuns: 20,
      },
    );
  });
});
