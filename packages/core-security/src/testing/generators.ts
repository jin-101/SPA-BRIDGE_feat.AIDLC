import fc from 'fast-check';

import { createSafeDisplayString } from '@spa-bridge/core-model';

import { type SecurityAuditEvent, type SecurityConfig, type SecurityEvaluationRequest, type SecurityRulePack } from '../types.js';

const safeString = fc
  .string({ minLength: 1, maxLength: 24 })
  .map((value) => createSafeDisplayString(value.replace(/\s+/g, ' ').trim()));

const scopeArb = fc.record({
  runId: fc.string({ minLength: 1, maxLength: 12 }),
  correlationId: fc.string({ minLength: 1, maxLength: 12 }),
  purpose: fc.string({ minLength: 1, maxLength: 12 }),
});

const securityConfigArb = fc.record({
  schemaVersion: fc.constant(1 as const),
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
  defaultProviderMode: fc.constantFrom('local-first', 'external-only', 'auto' as const),
  targetAwareRulePacks: fc.boolean(),
}).map((value) => value as SecurityConfig);

const securityRulePackArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 12 }),
  version: fc.integer({ min: 1, max: 5 }),
  precedence: fc.integer({ min: 0, max: 20 }),
  target: fc.constantFrom('generic', 'angular-15', 'korean-air', 'ngrx' as const),
  categories: fc.array(
    fc.constantFrom('email', 'bearer-token', 'jwt', 'api-key', 'session-cookie', 'credit-card' as const),
    { maxLength: 4 },
  ),
  redactionMode: fc.constantFrom('redacted', 'tokenized', 'mixed' as const),
  tokenizationAllowed: fc.boolean(),
  allowExternalProviderUse: fc.boolean(),
  metadata: fc.dictionary(fc.string({ minLength: 1, maxLength: 8 }), fc.string({ minLength: 1, maxLength: 12 }), {
    maxKeys: 3,
  }),
}).map((value) => value as SecurityRulePack);

const securityEvaluationRequestArb = fc.record({
  schemaVersion: fc.constant(1 as const),
  payload: fc.oneof(
    safeString,
    fc.record({
      auth: safeString,
      cookies: safeString,
      email: safeString,
    }),
    fc.array(safeString, { maxLength: 4 }),
  ),
  rawConfig: fc.option(fc.record({}), { nil: undefined }),
  overrides: fc.option(fc.record({}), { nil: undefined }),
  providerMode: fc.constantFrom('local-first', 'external-only', 'auto' as const),
  externalProviderRequested: fc.boolean(),
  rulePacks: fc.array(securityRulePackArb, { maxLength: 4 }),
  sourceRefs: fc.array(
    fc.record({
      kind: fc.constant('source' as const),
      path: fc.string({ minLength: 1, maxLength: 12 }),
      location: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
    }),
    { maxLength: 2 },
  ),
  generatedRefs: fc.array(
    fc.record({
      kind: fc.constant('generated' as const),
      path: fc.string({ minLength: 1, maxLength: 12 }),
      segment: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
    }),
    { maxLength: 2 },
  ),
});

const securityAuditEventArb = fc.record({
  eventType: fc.string({ minLength: 1, maxLength: 12 }),
  severity: fc.constantFrom('info', 'warning', 'error', 'critical' as const),
  runId: fc.option(fc.string({ minLength: 1, maxLength: 12 }), { nil: undefined }),
  correlationId: fc.option(fc.string({ minLength: 1, maxLength: 12 }), { nil: undefined }),
  safeMessage: safeString,
  safeRefs: fc.array(
    fc.oneof(
      fc.record({
        kind: fc.constant('source' as const),
        path: fc.string({ minLength: 1, maxLength: 12 }),
        location: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
      }),
      fc.record({
        kind: fc.constant('generated' as const),
        path: fc.string({ minLength: 1, maxLength: 12 }),
        segment: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
      }),
    ),
    { maxLength: 4 },
  ),
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
}).map((value) => value as SecurityAuditEvent);

export const securityArbitraries = {
  safeString,
  scopeArb,
  securityConfigArb,
  securityRulePackArb,
  securityEvaluationRequestArb,
  securityAuditEventArb,
};

export type TokenVaultCommand =
  | { kind: 'issue'; scope: { runId: string; correlationId: string; purpose: string }; category: string; secret: string }
  | { kind: 'restore'; scope: { runId: string; correlationId: string; purpose: string }; token: string }
  | { kind: 'purge-expired'; now: number };

export const tokenVaultCommandArb: fc.Arbitrary<TokenVaultCommand> = fc.oneof(
  fc.record({
    kind: fc.constant('issue' as const),
    scope: scopeArb,
    category: fc.string({ minLength: 1, maxLength: 12 }),
    secret: safeString,
  }),
  fc.record({
    kind: fc.constant('restore' as const),
    scope: scopeArb,
    token: fc.string({ minLength: 1, maxLength: 24 }),
  }),
  fc.record({
    kind: fc.constant('purge-expired' as const),
    now: fc.integer({ min: 0, max: 10_000 }),
  }),
);
