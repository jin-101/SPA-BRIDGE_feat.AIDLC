import { z } from 'zod';

import {
  GeneratedArtifactRefSchema,
  SafeDisplayStringSchema,
  SourceRefSchema,
  createSafeDisplayString,
  type GeneratedArtifactRef,
  type SourceRef,
} from '@spa-bridge/core-model';
import { ProviderPolicyDecisionSchema, type ProviderPolicyDecision as CoreProviderPolicyDecision } from '@spa-bridge/core-security';

export const ProviderModeSchema = z.enum(['local-first', 'external-only', 'auto']);
export type ProviderMode = z.infer<typeof ProviderModeSchema>;

export const ProviderAdapterKindSchema = z.enum(['local-internal', 'external', 'mock']);
export type ProviderAdapterKind = z.infer<typeof ProviderAdapterKindSchema>;

export const ProviderCapabilityCategorySchema = z.enum([
  'template',
  'lifecycle',
  'di',
  'route',
  'state',
  'form',
  'i18n',
  'animation',
  'map',
  'media',
  'qr',
  'barcode',
  'service-worker',
  'unknown',
]);
export type ProviderCapabilityCategory = z.infer<typeof ProviderCapabilityCategorySchema>;

export const ProviderSafeContextValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
]);
export type ProviderSafeContextValue = z.infer<typeof ProviderSafeContextValueSchema>;

export const ProviderSafeContextSchema = z.record(ProviderSafeContextValueSchema);
export type ProviderSafeContext = Record<string, ProviderSafeContextValue>;

export const ProviderErrorCodeSchema = z.enum([
  'INVALID_PROVIDER_DESCRIPTOR',
  'DUPLICATE_PROVIDER_ID',
  'INVALID_TARGET_CAPABILITY_PACK',
  'UNSAFE_PROVIDER_CONTEXT',
  'MISSING_POLICY_DECISION',
  'POLICY_BLOCKED',
  'NO_MATCHING_PROVIDER',
  'TIMEOUT',
  'INVALID_RESPONSE',
  'UNSAFE_RESPONSE',
  'EXTERNAL_PROVIDER_DISABLED',
  'ADAPTER_FAILED',
  'UNKNOWN_PROVIDER',
  'VALIDATION_FAILED',
  'UNSUPPORTED_PROVIDER_MODE',
]);
export type ProviderErrorCode = z.infer<typeof ProviderErrorCodeSchema>;

export const ProviderErrorSchema = z.object({
  code: ProviderErrorCodeSchema,
  message: SafeDisplayStringSchema,
  providerId: z.string().min(1).optional(),
  retryable: z.boolean().default(false),
  causeCategory: z.string().min(1).optional(),
});
export type ProviderError = z.infer<typeof ProviderErrorSchema>;

export const ProviderCapabilitySchema = z.object({
  category: ProviderCapabilityCategorySchema,
  tags: z.array(z.string().min(1)).default([]),
  supportsStructuredResponse: z.boolean().default(true),
  supportsSafeRationale: z.boolean().default(true),
  maxContextItems: z.number().int().positive().default(50),
});
export type ProviderCapability = z.infer<typeof ProviderCapabilitySchema>;

export const TargetCapabilityPackSchema = z.object({
  packId: z.string().min(1),
  version: z.number().int().positive(),
  capabilityTags: z.array(z.string().min(1)).default([]),
  supportedFrameworks: z.array(z.string().min(1)).default(['angular', 'react']),
  forbiddenMetadataFields: z.array(z.string().min(1)).default([]),
});
export type TargetCapabilityPack = z.infer<typeof TargetCapabilityPackSchema>;

export const ProviderDescriptorSchema = z.object({
  providerId: z.string().min(1),
  adapterKind: ProviderAdapterKindSchema,
  displayName: SafeDisplayStringSchema,
  capabilities: z.array(ProviderCapabilitySchema).default([]),
  priority: z.number().int().default(0),
  enabled: z.boolean().default(true),
  requiresExternalPolicy: z.boolean().default(false),
  metadata: z.record(z.string()).default({}),
});
export type ProviderDescriptor = z.infer<typeof ProviderDescriptorSchema>;

export const ProviderSelectionRequestSchema = z.object({
  runId: z.string().min(1),
  correlationId: z.string().min(1),
  mappingRequestId: z.string().min(1),
  providerMode: ProviderModeSchema,
  category: ProviderCapabilityCategorySchema,
  capabilityTags: z.array(z.string().min(1)).default([]),
  policyDecision: ProviderPolicyDecisionSchema,
});
export type ProviderSelectionRequest = z.infer<typeof ProviderSelectionRequestSchema>;

export const ProviderSelectionResultSchema = z.object({
  status: z.enum(['selected', 'blocked', 'manual-review']),
  provider: ProviderDescriptorSchema.optional(),
  reasonCode: z.string().min(1),
  diagnostics: z.array(z.string().min(1)).default([]),
});
export type ProviderSelectionResult = z.infer<typeof ProviderSelectionResultSchema>;

export const ProviderNeutralRefinementRequestSchema = z.object({
  mappingRequestId: z.string().min(1),
  category: ProviderCapabilityCategorySchema,
  sourceRefs: z.array(SourceRefSchema).default([]),
  draftRefs: z.array(GeneratedArtifactRefSchema).default([]),
  ruleIds: z.array(z.string().min(1)).default([]),
  diagnosticRefs: z.array(z.string().min(1)).default([]),
  safeContext: ProviderSafeContextSchema.default({}),
});
export type ProviderNeutralRefinementRequest = z.infer<typeof ProviderNeutralRefinementRequestSchema>;

export const MinimizedProviderContextSchema = z.object({
  contextId: z.string().min(1),
  mappingRequestId: z.string().min(1),
  category: ProviderCapabilityCategorySchema,
  safeContext: ProviderSafeContextSchema,
  safeRefs: z.array(z.union([SourceRefSchema, GeneratedArtifactRefSchema])).default([]),
  policyEvidenceRef: SafeDisplayStringSchema,
  masked: z.boolean().default(true),
});
export type MinimizedProviderContext = z.infer<typeof MinimizedProviderContextSchema>;

export const ProviderInvocationRequestSchema = z.object({
  providerId: z.string().min(1),
  adapterKind: ProviderAdapterKindSchema,
  context: MinimizedProviderContextSchema,
  timeoutMs: z.number().int().positive(),
  requestMetadata: z.record(z.string()).default({}),
});
export type ProviderInvocationRequest = z.infer<typeof ProviderInvocationRequestSchema>;

export const ProviderProvenanceSchema = z.object({
  providerId: z.string().min(1),
  adapterKind: ProviderAdapterKindSchema,
  modelLabel: SafeDisplayStringSchema.optional(),
  invokedAt: SafeDisplayStringSchema.optional(),
  policyDecisionRef: SafeDisplayStringSchema.optional(),
  auditEventRef: SafeDisplayStringSchema.optional(),
});
export type ProviderProvenance = z.infer<typeof ProviderProvenanceSchema>;

export const RefinementSuggestionSchema = z.object({
  suggestionId: z.string().min(1),
  mappingRequestId: z.string().min(1),
  category: ProviderCapabilityCategorySchema,
  safeSummary: SafeDisplayStringSchema,
  safeRationale: SafeDisplayStringSchema,
  confidence: z.number().min(0).max(1),
  sourceRefs: z.array(SourceRefSchema).default([]),
  generatedRefs: z.array(GeneratedArtifactRefSchema).default([]),
  provenance: ProviderProvenanceSchema,
});
export type RefinementSuggestion = z.infer<typeof RefinementSuggestionSchema>;

export const ProviderResponseSchema = z.object({
  mappingRequestId: z.string().min(1),
  suggestions: z.array(RefinementSuggestionSchema).default([]),
  modelLabel: SafeDisplayStringSchema.optional(),
});
export type ProviderResponse = z.infer<typeof ProviderResponseSchema>;

export const ProviderAuditEventCountsSchema = z.object({
  suggestions: z.number().int().nonnegative().default(0),
  blockedDecisions: z.number().int().nonnegative().default(0),
  manualReviewItems: z.number().int().nonnegative().default(0),
});

export const ProviderAuditEventSchema = z.object({
  eventId: z.string().min(1),
  eventType: z.string().min(1),
  severity: z.enum(['info', 'warning', 'error', 'critical']),
  runId: z.string().min(1),
  correlationId: z.string().min(1),
  mappingRequestId: z.string().min(1),
  providerId: z.string().min(1).optional(),
  adapterKind: ProviderAdapterKindSchema.optional(),
  reasonCodes: z.array(z.string().min(1)).default([]),
  safeMessage: SafeDisplayStringSchema,
  safeRefs: z.array(z.union([SourceRefSchema, GeneratedArtifactRefSchema])).default([]),
  counts: ProviderAuditEventCountsSchema.default({ suggestions: 0, blockedDecisions: 0, manualReviewItems: 0 }),
});
export type ProviderAuditEvent = z.infer<typeof ProviderAuditEventSchema>;

export const ManualReviewItemSchema = z.object({
  itemId: z.string().min(1),
  mappingRequestId: z.string().min(1),
  reviewCategory: z.string().min(1),
  reasonCode: z.string().min(1),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  safeRefs: z.array(z.union([SourceRefSchema, GeneratedArtifactRefSchema])).default([]),
  safeMessage: SafeDisplayStringSchema,
});
export type ManualReviewItem = z.infer<typeof ManualReviewItemSchema>;

export const ProviderInvocationResultSchema = z.object({
  status: z.enum(['succeeded', 'failed', 'timed-out', 'blocked']),
  providerId: z.string().min(1),
  adapterKind: ProviderAdapterKindSchema,
  response: ProviderResponseSchema.optional(),
  error: ProviderErrorSchema.optional(),
  auditEvidence: ProviderAuditEventSchema.optional(),
});
export type ProviderInvocationResult = z.infer<typeof ProviderInvocationResultSchema>;

export const RefinementResultSchema = z.object({
  status: z.enum(['succeeded', 'partial', 'blocked', 'manual-review']),
  suggestions: z.array(RefinementSuggestionSchema).default([]),
  diagnostics: z.array(z.string().min(1)).default([]),
  manualReviewItems: z.array(ManualReviewItemSchema).default([]),
  auditEvents: z.array(ProviderAuditEventSchema).default([]),
  provenance: z.array(ProviderProvenanceSchema).default([]),
});
export type RefinementResult = z.infer<typeof RefinementResultSchema>;

export const MockProviderMatchSchema = z.object({
  scriptId: z.string().min(1).optional(),
  mappingRequestId: z.string().min(1).optional(),
  category: ProviderCapabilityCategorySchema.optional(),
  capabilityTags: z.array(z.string().min(1)).optional(),
});
export type MockProviderMatch = z.infer<typeof MockProviderMatchSchema>;

export const MockProviderScriptSchema = z.object({
  scriptId: z.string().min(1),
  match: MockProviderMatchSchema,
  response: ProviderResponseSchema.optional(),
  failure: ProviderErrorSchema.optional(),
  seed: z.number().int().optional(),
});
export type MockProviderScript = z.infer<typeof MockProviderScriptSchema>;

export const ProviderAdapterRecordSchema = z.object({
  providerId: z.string().min(1),
  adapterKind: ProviderAdapterKindSchema,
  enabled: z.boolean().default(true),
  descriptor: ProviderDescriptorSchema,
});
export type ProviderAdapterRecord = z.infer<typeof ProviderAdapterRecordSchema>;

export const ProviderRegistrySchema = z.object({
  registryId: z.string().min(1),
  providers: z.array(ProviderDescriptorSchema).default([]),
});
export type ProviderRegistry = z.infer<typeof ProviderRegistrySchema>;

export const createProviderNeutralRequest = (
  input: Omit<ProviderNeutralRefinementRequest, 'mappingRequestId'> & { mappingRequestId?: string },
): ProviderNeutralRefinementRequest =>
  ProviderNeutralRefinementRequestSchema.parse({
    ...input,
    mappingRequestId: input.mappingRequestId ?? `mapping-${createSafeDisplayString(input.category)}`,
  });

export type ProviderPolicyDecision = CoreProviderPolicyDecision;
