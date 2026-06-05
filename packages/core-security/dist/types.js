import { z } from 'zod';
import { GeneratedArtifactRefSchema, SafeDisplayStringSchema, SourceRefSchema, createSafeDisplayString, } from '@spa-bridge/core-model';
import { MaskTokenSchema } from '@spa-bridge/core-model';
export const SecurityPolicyModeSchema = z.enum(['local-first', 'external-only', 'auto']);
export const SecuritySeveritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export const SecurityErrorCodeSchema = z.enum([
    'INVALID_CONFIG',
    'INVALID_RULE_PACK',
    'DETECTION_FAILED',
    'MASKING_FAILED',
    'TOKEN_EXPIRED',
    'TOKEN_SCOPE_MISMATCH',
    'POLICY_BLOCKED',
    'POLICY_UNKNOWN',
    'AUDIT_REJECTED',
    'ACCESS_DENIED',
    'VALIDATION_FAILED',
    'UNKNOWN_PROVIDER',
    'DOWNGRADE_BLOCKED',
    'SAFE_OUTPUT_REJECTED',
]);
export const SecurityErrorSchema = z.object({
    code: SecurityErrorCodeSchema,
    message: SafeDisplayStringSchema,
    cause: z.unknown().optional(),
});
export const PayloadRefSchema = z.object({
    kind: z.literal('payload'),
    id: z.string().min(1),
    category: z.string().min(1),
    sourceRef: SourceRefSchema.optional(),
});
export const SensitiveFindingSpanSchema = z.object({
    start: z.number().int().nonnegative(),
    end: z.number().int().nonnegative(),
});
export const SensitiveFindingSchema = z.object({
    id: z.string().min(1),
    category: z.string().min(1),
    severity: SecuritySeveritySchema,
    message: SafeDisplayStringSchema,
    sourceRefs: z.array(SourceRefSchema).default([]),
    payloadRefs: z.array(PayloadRefSchema).default([]),
    span: SensitiveFindingSpanSchema.optional(),
    rulePackId: z.string().min(1).optional(),
    reasonCode: z.string().min(1),
});
export const TokenScopeSchema = z.object({
    runId: z.string().min(1),
    correlationId: z.string().min(1),
    purpose: z.string().min(1),
});
export const MaskingModeSchema = z.enum(['redacted', 'tokenized', 'mixed']);
export const MaskedPayloadSchema = z.object({
    id: z.string().min(1),
    mode: MaskingModeSchema,
    redactedText: SafeDisplayStringSchema,
    tokenRefs: z.array(MaskTokenSchema).default([]),
    findings: z.array(SensitiveFindingSchema).default([]),
    safe: z.boolean().default(true),
});
export const ProviderPolicyDecisionSchema = z.object({
    decision: z.enum(['allow', 'block', 'manual-review']),
    reasonCode: z.string().min(1),
    reason: SafeDisplayStringSchema,
    providerMode: SecurityPolicyModeSchema,
    externalProviderAllowed: z.boolean(),
    maskingRequired: z.boolean(),
    auditRequired: z.boolean(),
    findingsPresent: z.boolean(),
});
export const AccessControlDecisionSchema = z.object({
    decision: z.enum(['allow', 'deny', 'manual-review']),
    reasonCode: z.string().min(1),
    reason: SafeDisplayStringSchema,
    renderSafe: z.boolean(),
});
export const SecurityAuditEventCountsSchema = z.object({
    findings: z.number().int().nonnegative().default(0),
    redactions: z.number().int().nonnegative().default(0),
    tokenizations: z.number().int().nonnegative().default(0),
    blockedDecisions: z.number().int().nonnegative().default(0),
});
export const SecurityAuditEventSchema = z.object({
    eventType: z.string().min(1),
    severity: z.enum(['info', 'warning', 'error', 'critical']),
    runId: z.string().min(1).optional(),
    correlationId: z.string().min(1).optional(),
    safeMessage: SafeDisplayStringSchema,
    safeRefs: z.array(z.union([SourceRefSchema, GeneratedArtifactRefSchema])).default([]),
    counts: SecurityAuditEventCountsSchema.default({ findings: 0, redactions: 0, tokenizations: 0, blockedDecisions: 0 }),
    reasonCodes: z.array(z.string().min(1)).default([]),
    metadata: z.record(z.string()).default({}),
});
export const SecurityRulePackSchema = z.object({
    id: z.string().min(1),
    version: z.number().int().positive(),
    precedence: z.number().int().nonnegative(),
    target: z.string().min(1),
    categories: z.array(z.string().min(1)).default([]),
    redactionMode: MaskingModeSchema.default('redacted'),
    tokenizationAllowed: z.boolean().default(false),
    allowExternalProviderUse: z.boolean().default(false),
    metadata: z.record(z.string()).default({}),
});
export const SecurityConfigSchema = z.object({
    schemaVersion: z.literal(1),
    projectRoot: z.string().min(1),
    runId: z.string().min(1),
    correlationId: z.string().min(1),
    detectSensitiveData: z.boolean().default(true),
    redactOutputs: z.boolean().default(true),
    allowExternalProviderUse: z.boolean().default(false),
    externalProviderOptIn: z.boolean().default(false),
    auditEnabled: z.boolean().default(true),
    manualReviewEnabled: z.boolean().default(true),
    preservePartialArtifacts: z.boolean().default(true),
    tokenTtlMs: z.number().int().positive().default(15 * 60 * 1000),
    rulePackIds: z.array(z.string().min(1)).default([]),
    defaultProviderMode: SecurityPolicyModeSchema.default('local-first'),
    targetAwareRulePacks: z.boolean().default(true),
});
export const SecurityConfigInputSchema = SecurityConfigSchema.omit({ schemaVersion: true })
    .partial()
    .passthrough();
export const SecurityEvaluationRequestSchema = z.object({
    schemaVersion: z.literal(1),
    payload: z.union([z.string(), z.record(z.unknown()), z.array(z.unknown())]),
    rawConfig: z.unknown().optional(),
    overrides: z.unknown().optional(),
    providerMode: SecurityPolicyModeSchema.default('local-first'),
    externalProviderRequested: z.boolean().default(false),
    rulePacks: z.array(SecurityRulePackSchema).default([]),
    sourceRefs: z.array(SourceRefSchema).default([]),
    generatedRefs: z.array(GeneratedArtifactRefSchema).default([]),
});
export const SecurityEvaluationResultSchema = z.object({
    schemaVersion: z.literal(1),
    config: SecurityConfigSchema,
    findings: z.array(SensitiveFindingSchema),
    maskedPayload: MaskedPayloadSchema,
    policyDecision: ProviderPolicyDecisionSchema,
    auditEvent: SecurityAuditEventSchema,
    accessDecision: AccessControlDecisionSchema,
    rulePacks: z.array(SecurityRulePackSchema),
});
export const createSecurityError = (code, message, cause) => SecurityErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    cause,
});
//# sourceMappingURL=types.js.map