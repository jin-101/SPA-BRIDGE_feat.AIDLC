import fc from 'fast-check';

import { createSafeDisplayString } from '@spa-bridge/core-model';
import {
  type ProviderCapability,
  type ProviderDescriptor,
  type ProviderNeutralRefinementRequest,
  type ProviderPolicyDecision,
  type ProviderResponse,
  type TargetCapabilityPack,
} from '../types.js';

const safeString = fc.string({ minLength: 1, maxLength: 24 }).map((value) => createSafeDisplayString(value));
const providerIdArb = fc.string({ minLength: 3, maxLength: 14 }).filter((value) => /^[a-z0-9-]+$/i.test(value));

const providerCapabilityArb = fc.record({
  category: fc.constantFrom('template', 'lifecycle', 'di', 'route', 'state', 'form', 'i18n', 'animation', 'map', 'media', 'qr', 'barcode', 'service-worker', 'unknown' as const),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 4 }),
  supportsStructuredResponse: fc.boolean(),
  supportsSafeRationale: fc.boolean(),
  maxContextItems: fc.integer({ min: 1, max: 50 }),
}) as fc.Arbitrary<ProviderCapability>;

export const providerDescriptorArb: fc.Arbitrary<ProviderDescriptor> = fc.record({
  providerId: providerIdArb,
  adapterKind: fc.constantFrom('local-internal', 'external', 'mock' as const),
  displayName: safeString,
  capabilities: fc.array(providerCapabilityArb, { maxLength: 4 }),
  priority: fc.integer({ min: 0, max: 100 }),
  enabled: fc.boolean(),
  requiresExternalPolicy: fc.boolean(),
  metadata: fc.dictionary(fc.string({ minLength: 1, maxLength: 8 }), fc.string({ minLength: 1, maxLength: 12 }), {
    maxKeys: 3,
  }),
});

export const providerPolicyDecisionArb: fc.Arbitrary<ProviderPolicyDecision> = fc.record({
  decision: fc.constantFrom('allow', 'block', 'manual-review' as const),
  reasonCode: fc.string({ minLength: 1, maxLength: 16 }),
  reason: safeString,
  providerMode: fc.constantFrom('local-first', 'external-only', 'auto' as const),
  externalProviderAllowed: fc.boolean(),
  maskingRequired: fc.boolean(),
  auditRequired: fc.boolean(),
  findingsPresent: fc.boolean(),
});

export const providerNeutralRequestArb: fc.Arbitrary<ProviderNeutralRefinementRequest> = fc.record({
  mappingRequestId: fc.string({ minLength: 1, maxLength: 16 }),
  category: fc.constantFrom('template', 'lifecycle', 'di', 'route', 'state', 'form', 'i18n', 'animation', 'map', 'media', 'qr', 'barcode', 'service-worker', 'unknown' as const),
  sourceRefs: fc.array(
    fc.record({
      kind: fc.constant('source' as const),
      path: fc.string({ minLength: 1, maxLength: 16 }),
      symbol: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
      location: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
    }),
    { maxLength: 3 },
  ),
  draftRefs: fc.array(
    fc.record({
      kind: fc.constant('generated' as const),
      path: fc.string({ minLength: 1, maxLength: 16 }),
      segment: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
    }),
    { maxLength: 3 },
  ),
  ruleIds: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 4 }),
  diagnosticRefs: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 4 }),
  safeContext: fc.dictionary(
    fc.string({ minLength: 1, maxLength: 12 }).filter((value) => !value.toLowerCase().includes('raw')),
    fc.oneof(fc.string({ minLength: 1, maxLength: 12 }), fc.integer({ min: 0, max: 20 }), fc.boolean(), fc.array(fc.string({ minLength: 1, maxLength: 8 }), { maxLength: 3 })),
    { maxKeys: 5 },
  ),
});

export const providerResponseArb: fc.Arbitrary<ProviderResponse> = fc.record({
  mappingRequestId: fc.string({ minLength: 1, maxLength: 16 }),
  suggestions: fc.array(
    fc.record({
      suggestionId: fc.string({ minLength: 1, maxLength: 16 }),
      mappingRequestId: fc.string({ minLength: 1, maxLength: 16 }),
      category: fc.constantFrom('template', 'lifecycle', 'di', 'route', 'state', 'form', 'i18n', 'animation', 'map', 'media', 'qr', 'barcode', 'service-worker', 'unknown' as const),
      safeSummary: safeString,
      safeRationale: safeString,
      confidence: fc.float({ min: 0, max: 1 }),
      sourceRefs: fc.array(
        fc.record({
          kind: fc.constant('source' as const),
          path: fc.string({ minLength: 1, maxLength: 16 }),
          symbol: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
          location: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
        }),
        { maxLength: 2 },
      ),
      generatedRefs: fc.array(
        fc.record({
          kind: fc.constant('generated' as const),
          path: fc.string({ minLength: 1, maxLength: 16 }),
          segment: fc.option(fc.string({ minLength: 1, maxLength: 8 }), { nil: undefined }),
        }),
        { maxLength: 2 },
      ),
      provenance: fc.record({
        providerId: providerIdArb,
        adapterKind: fc.constantFrom('local-internal', 'external', 'mock' as const),
        modelLabel: fc.option(safeString, { nil: undefined }),
        invokedAt: fc.option(safeString, { nil: undefined }),
        policyDecisionRef: fc.option(safeString, { nil: undefined }),
        auditEventRef: fc.option(safeString, { nil: undefined }),
      }),
    }),
    { maxLength: 3 },
  ),
  modelLabel: fc.option(safeString, { nil: undefined }),
});

export const targetCapabilityPackArb: fc.Arbitrary<TargetCapabilityPack> = fc.record({
  packId: fc.string({ minLength: 1, maxLength: 16 }),
  version: fc.integer({ min: 1, max: 10 }),
  capabilityTags: fc.array(fc.string({ minLength: 1, maxLength: 10 }), { maxLength: 6 }),
  supportedFrameworks: fc.array(fc.constantFrom('angular', 'react', 'vite', 'storybook' as const), { maxLength: 4 }),
  forbiddenMetadataFields: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 4 }),
});
