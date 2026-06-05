import fc from 'fast-check';
import { createSafeDisplayString } from '@spa-bridge/core-model';
const safeString = fc
    .string({ minLength: 1, maxLength: 24 })
    .map((value) => createSafeDisplayString(value.replace(/\s+/g, ' ').trim()));
const scopeArb = fc.record({
    runId: fc.string({ minLength: 1, maxLength: 12 }),
    correlationId: fc.string({ minLength: 1, maxLength: 12 }),
    purpose: fc.string({ minLength: 1, maxLength: 12 }),
});
const securityConfigArb = fc.record({
    schemaVersion: fc.constant(1),
    projectRoot: fc.constant('/workspace/project'),
    runId: fc.string({ minLength: 1, maxLength: 12 }),
    correlationId: fc.string({ minLength: 1, maxLength: 12 }),
    detectSensitiveData: fc.boolean(),
    redactOutputs: fc.boolean(),
    allowExternalProviderUse: fc.boolean(),
    externalProviderOptIn: fc.boolean(),
    auditEnabled: fc.boolean(),
    manualReviewEnabled: fc.boolean(),
    preservePartialArtifacts: fc.boolean(),
    tokenTtlMs: fc.integer({ min: 1_000, max: 100_000 }),
    rulePackIds: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 4 }),
    defaultProviderMode: fc.constantFrom('local-first', 'external-only', 'auto'),
    targetAwareRulePacks: fc.boolean(),
}).map((value) => value);
const securityRulePackArb = fc.record({
    id: fc.string({ minLength: 1, maxLength: 12 }),
    version: fc.integer({ min: 1, max: 5 }),
    precedence: fc.integer({ min: 0, max: 20 }),
    target: fc.constantFrom('generic', 'angular-15', 'korean-air', 'ngrx'),
    categories: fc.array(fc.constantFrom('email', 'bearer-token', 'jwt', 'api-key', 'session-cookie', 'credit-card'), { maxLength: 4 }),
    redactionMode: fc.constantFrom('redacted', 'tokenized', 'mixed'),
    tokenizationAllowed: fc.boolean(),
    allowExternalProviderUse: fc.boolean(),
    metadata: fc.dictionary(fc.string({ minLength: 1, maxLength: 8 }), fc.string({ minLength: 1, maxLength: 12 }), {
        maxKeys: 3,
    }),
}).map((value) => value);
const securityEvaluationRequestArb = fc.record({
    schemaVersion: fc.constant(1),
    payload: fc.oneof(safeString, fc.record({
        auth: safeString,
        cookies: safeString,
        email: safeString,
    }), fc.array(safeString, { maxLength: 4 })),
    rawConfig: fc.option(fc.record({}), { nil: undefined }),
    overrides: fc.option(fc.record({}), { nil: undefined }),
    providerMode: fc.constantFrom('local-first', 'external-only', 'auto'),
    externalProviderRequested: fc.boolean(),
    rulePacks: fc.array(securityRulePackArb, { maxLength: 4 }),
    sourceRefs: fc.array(fc.record({
        kind: fc.constant('source'),
        path: fc.string({ minLength: 1, maxLength: 12 }),
        location: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
    }), { maxLength: 2 }),
    generatedRefs: fc.array(fc.record({
        kind: fc.constant('generated'),
        path: fc.string({ minLength: 1, maxLength: 12 }),
        segment: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
    }), { maxLength: 2 }),
});
const securityAuditEventArb = fc.record({
    eventType: fc.string({ minLength: 1, maxLength: 12 }),
    severity: fc.constantFrom('info', 'warning', 'error', 'critical'),
    runId: fc.option(fc.string({ minLength: 1, maxLength: 12 }), { nil: undefined }),
    correlationId: fc.option(fc.string({ minLength: 1, maxLength: 12 }), { nil: undefined }),
    safeMessage: safeString,
    safeRefs: fc.array(fc.oneof(fc.record({
        kind: fc.constant('source'),
        path: fc.string({ minLength: 1, maxLength: 12 }),
        location: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
    }), fc.record({
        kind: fc.constant('generated'),
        path: fc.string({ minLength: 1, maxLength: 12 }),
        segment: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
    })), { maxLength: 4 }),
    counts: fc.record({
        findings: fc.integer({ min: 0, max: 10 }),
        redactions: fc.integer({ min: 0, max: 10 }),
        tokenizations: fc.integer({ min: 0, max: 10 }),
        blockedDecisions: fc.integer({ min: 0, max: 10 }),
    }),
    reasonCodes: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 4 }),
    metadata: fc.dictionary(fc.string({ minLength: 1, maxLength: 8 }), fc.string({ minLength: 1, maxLength: 12 }), {
        maxKeys: 3,
    }),
}).map((value) => value);
export const securityArbitraries = {
    safeString,
    scopeArb,
    securityConfigArb,
    securityRulePackArb,
    securityEvaluationRequestArb,
    securityAuditEventArb,
};
export const tokenVaultCommandArb = fc.oneof(fc.record({
    kind: fc.constant('issue'),
    scope: scopeArb,
    category: fc.string({ minLength: 1, maxLength: 12 }),
    secret: safeString,
}), fc.record({
    kind: fc.constant('restore'),
    scope: scopeArb,
    token: fc.string({ minLength: 1, maxLength: 24 }),
}), fc.record({
    kind: fc.constant('purge-expired'),
    now: fc.integer({ min: 0, max: 10_000 }),
}));
//# sourceMappingURL=generators.js.map