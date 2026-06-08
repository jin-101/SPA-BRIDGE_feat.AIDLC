import fc from 'fast-check';

import type {
  AiDecision,
  CanonicalConversionReport,
  ManualReviewItem,
  ReportDiagnostic,
  ReportGenerationRequest,
  ReportGroup,
  ReportInputBundle,
  ReportMetadata,
  ReportQualitySection,
  ReportTraceLink,
  ReportTraceabilitySection,
  ReportViewModel,
} from '../types.js';
import { ReportSchemaVersion } from '../types.js';

const safeTextArbitrary = fc
  .string({ minLength: 1, maxLength: 24 })
  .filter((value) => !/[<>{}]/.test(value) && !/javascript:/i.test(value) && !/on\w+=/i.test(value));

const safePathArbitrary = fc
  .string({ minLength: 1, maxLength: 24 })
  .filter((value) => !value.startsWith('/') && !value.includes('..') && !value.includes('\\') && !/[<>{}]/.test(value));

export const safeSourceRefArbitrary = fc.record({
  kind: fc.constant('source' as const),
  path: safePathArbitrary,
  symbol: fc.option(safeTextArbitrary, { nil: undefined }),
  location: fc.option(safeTextArbitrary, { nil: undefined }),
});

export const safeGeneratedArtifactRefArbitrary = fc.record({
  kind: fc.constant('generated' as const),
  path: safePathArbitrary,
  segment: fc.option(safeTextArbitrary, { nil: undefined }),
});

export const reportTraceLinkArbitrary: fc.Arbitrary<ReportTraceLink> = fc.record({
  id: safeTextArbitrary,
  source: safeSourceRefArbitrary,
  target: fc.oneof(
    fc.record({
      kind: fc.constant('ir' as const),
      id: safeTextArbitrary,
    }),
    safeGeneratedArtifactRefArbitrary,
  ),
  relation: fc.constantFrom('maps-to', 'derived-from', 'emits', 'references'),
  confidence: fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
  notes: fc.option(safeTextArbitrary, { nil: undefined }),
});

export const reportDiagnosticArbitrary: fc.Arbitrary<ReportDiagnostic> = fc.record({
  id: safeTextArbitrary,
  severity: fc.constantFrom('critical', 'blocking', 'warning', 'info'),
  reasonCode: safeTextArbitrary,
  safeMessage: safeTextArbitrary,
  sourceRef: fc.option(safeSourceRefArbitrary, { nil: undefined }),
  generatedRef: fc.option(safeGeneratedArtifactRefArbitrary, { nil: undefined }),
  storyArea: fc.option(safeTextArbitrary, { nil: undefined }),
  reviewCategory: fc.option(
    fc.constantFrom('mapping', 'security', 'quality', 'provider', 'target-generation', 'reporting', 'source-analysis', 'transformation', 'unknown'),
    { nil: undefined },
  ),
});

export const manualReviewItemArbitrary: fc.Arbitrary<ManualReviewItem> = fc.record({
  id: safeTextArbitrary,
  severity: fc.constantFrom('critical', 'blocking', 'warning', 'info'),
  category: fc.constantFrom('mapping', 'security', 'quality', 'provider', 'target-generation', 'reporting', 'source-analysis', 'transformation', 'unknown'),
  reasonCode: safeTextArbitrary,
  safeSummary: safeTextArbitrary,
  remediationHint: fc.option(safeTextArbitrary, { nil: undefined }),
  sourceRef: fc.option(safeSourceRefArbitrary, { nil: undefined }),
  generatedRef: fc.option(safeGeneratedArtifactRefArbitrary, { nil: undefined }),
  storyArea: fc.option(safeTextArbitrary, { nil: undefined }),
});

export const aiDecisionArbitrary: fc.Arbitrary<AiDecision> = fc.record({
  id: safeTextArbitrary,
  mappingRequestId: safeTextArbitrary,
  providerCategory: fc.constantFrom('local', 'internal', 'mock', 'external-disabled', 'external-opt-in'),
  policyStatus: fc.constantFrom('allowed', 'blocked', 'disabled', 'review-required'),
  confidence: fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
  provenanceRef: safeTextArbitrary,
  safeRationale: safeTextArbitrary,
});

export const reportMetadataArbitrary: fc.Arbitrary<ReportMetadata> = fc.record({
  runId: safeTextArbitrary,
  correlationId: safeTextArbitrary,
  projectLabel: safeTextArbitrary,
  sourceFramework: safeTextArbitrary,
  targetFramework: safeTextArbitrary,
  generatedAt: fc.constant('2026-06-07T00:00:00.000Z'),
  partial: fc.boolean(),
});

export const reportInputMetadataArbitrary = fc.record({
  runId: safeTextArbitrary,
  correlationId: safeTextArbitrary,
  projectLabel: safeTextArbitrary,
  sourceFramework: safeTextArbitrary,
  targetFramework: safeTextArbitrary,
  generatedAt: fc.constant('2026-06-07T00:00:00.000Z'),
});

export const reportQualitySectionArbitrary: fc.Arbitrary<ReportQualitySection> = fc.record({
  gateStatus: fc.constantFrom('passed', 'failed', 'skipped', 'blocked'),
  gateRuns: fc.array(
    fc.record({
      gateId: safeTextArbitrary,
      status: fc.constantFrom('passed', 'failed', 'skipped', 'blocked'),
      durationMs: fc.nat(1000),
      safeSummary: safeTextArbitrary,
      diagnosticRefs: fc.array(safeTextArbitrary, { maxLength: 3 }),
      traceRefs: fc.array(safeTextArbitrary, { maxLength: 3 }),
    }),
    { maxLength: 3 },
  ),
  pbtRuns: fc.array(
    fc.record({
      planId: safeTextArbitrary,
      subject: safeTextArbitrary,
      generatorFamily: safeTextArbitrary,
      propertyName: safeTextArbitrary,
      seed: fc.option(fc.nat(), { nil: undefined }),
      status: fc.constantFrom('passed', 'failed', 'skipped', 'blocked'),
      shrunk: fc.boolean(),
      safeSummary: fc.option(safeTextArbitrary, { nil: undefined }),
      diagnosticRefs: fc.array(safeTextArbitrary, { maxLength: 3 }),
      traceRefs: fc.array(safeTextArbitrary, { maxLength: 3 }),
    }),
    { maxLength: 3 },
  ),
  correctionAttempts: fc.nat(3),
  evidenceCounts: fc.record({
    total: fc.nat(10),
    blocked: fc.nat(5),
    safe: fc.nat(10),
  }),
  conversionQualityScore: fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
  targetPercent: fc.integer({ min: 0, max: 100 }),
  targetMet: fc.boolean(),
});

export const reportTraceabilitySectionArbitrary: fc.Arbitrary<ReportTraceabilitySection> = fc.record({
  links: fc.array(reportTraceLinkArbitrary, { maxLength: 3 }),
  syntheticOrigins: fc.array(safeGeneratedArtifactRefArbitrary, { maxLength: 3 }),
  coverageSummary: fc.record({
    covered: fc.nat(10),
    uncovered: fc.nat(10),
  }),
});

export const reportInputBundleArbitrary: fc.Arbitrary<ReportInputBundle> = fc.record({
  metadata: reportInputMetadataArbitrary,
  sourceInventory: fc.record({
    artifactCounts: fc.dictionary(safeTextArbitrary, fc.nat(10), { maxKeys: 3 }),
    detectedCategories: fc.array(safeTextArbitrary, { maxLength: 3 }),
    sourceRefs: fc.array(safeSourceRefArbitrary, { maxLength: 3 }),
    diagnosticRefs: fc.array(safeTextArbitrary, { maxLength: 3 }),
  }),
  conversionOutput: fc.record({
    generatedArtifactCounts: fc.dictionary(safeTextArbitrary, fc.nat(10), { maxKeys: 3 }),
    generatedRefs: fc.array(safeGeneratedArtifactRefArbitrary, { maxLength: 3 }),
    targetProject: fc.record({
      targetStrategy: safeTextArbitrary,
      targetFramework: safeTextArbitrary,
    }),
    convertedArtifactCount: fc.nat(10),
    totalCandidateArtifactCount: fc.nat(10),
    unresolvedCount: fc.nat(10),
  }),
  diagnostics: fc.array(reportDiagnosticArbitrary, { maxLength: 3 }),
  aiDecisions: fc.array(aiDecisionArbitrary, { maxLength: 3 }),
  manualReview: fc.array(manualReviewItemArbitrary, { maxLength: 3 }),
  quality: reportQualitySectionArbitrary,
  traceability: reportTraceabilitySectionArbitrary,
});

export const reportGenerationRequestArbitrary: fc.Arbitrary<ReportGenerationRequest> = fc.record({
  inputBundle: reportInputBundleArbitrary,
  requestedFormats: fc.shuffledSubarray(['json', 'markdown', 'html'] as const, { minLength: 1, maxLength: 3 }),
  rendererVersion: safeTextArbitrary,
  generatedAt: fc.constant('2026-06-07T00:00:00.000Z'),
  qualityTargetPercent: fc.integer({ min: 0, max: 100 }),
  partial: fc.boolean(),
});

export const canonicalConversionReportArbitrary: fc.Arbitrary<CanonicalConversionReport> = fc.record({
  reportId: safeTextArbitrary,
  schemaVersion: fc.constant(ReportSchemaVersion),
  metadata: reportMetadataArbitrary,
  sourceInventory: reportInputBundleArbitrary.map((bundle) => bundle.sourceInventory),
  conversionOutput: reportInputBundleArbitrary.map((bundle) => bundle.conversionOutput),
  diagnostics: fc.array(reportDiagnosticArbitrary, { maxLength: 3 }),
  aiDecisions: fc.array(aiDecisionArbitrary, { maxLength: 3 }),
  manualReview: fc.record({
    items: fc.array(manualReviewItemArbitrary, { maxLength: 3 }),
    groups: fc.array(
      fc.record({
        id: safeTextArbitrary,
        severity: fc.constantFrom('critical', 'blocking', 'warning', 'info'),
        sourceRef: fc.option(safeSourceRefArbitrary, { nil: undefined }),
        generatedRef: fc.option(safeGeneratedArtifactRefArbitrary, { nil: undefined }),
        storyArea: fc.option(safeTextArbitrary, { nil: undefined }),
        reviewCategory: fc.option(
          fc.constantFrom('mapping', 'security', 'quality', 'provider', 'target-generation', 'reporting', 'source-analysis', 'transformation', 'unknown'),
          { nil: undefined },
        ),
        itemIds: fc.array(safeTextArbitrary, { maxLength: 3 }),
      }),
      { maxLength: 3 },
    ),
    blockingCount: fc.nat(10),
  }),
  quality: reportQualitySectionArbitrary,
  traceability: reportTraceabilitySectionArbitrary,
  exportMetadata: fc.record({
    formats: fc.shuffledSubarray(['json', 'markdown', 'html'] as const, { minLength: 1, maxLength: 3 }),
    contentHashes: fc.array(
      fc.record({
        format: fc.constantFrom('json', 'markdown', 'html'),
        hash: safeTextArbitrary,
      }),
      { maxLength: 3 },
    ),
    rendererVersion: safeTextArbitrary,
    exportedAt: fc.constant('2026-06-07T00:00:00.000Z'),
    canonicalReportRef: safeTextArbitrary,
    partial: fc.boolean(),
  }),
});

export const reportViewModelArbitrary: fc.Arbitrary<ReportViewModel> = fc.record({
  reportId: safeTextArbitrary,
  metadata: reportMetadataArbitrary,
  sections: fc.record({
    sourceInventory: fc.array(fc.record({ label: safeTextArbitrary, value: safeTextArbitrary }), { maxLength: 4 }),
    conversionOutput: fc.array(fc.record({ label: safeTextArbitrary, value: safeTextArbitrary }), { maxLength: 4 }),
    diagnostics: fc.array(fc.record({ label: safeTextArbitrary, value: safeTextArbitrary }), { maxLength: 4 }),
    aiDecisions: fc.array(fc.record({ label: safeTextArbitrary, value: safeTextArbitrary }), { maxLength: 4 }),
    manualReview: fc.array(fc.record({ label: safeTextArbitrary, value: safeTextArbitrary }), { maxLength: 4 }),
    quality: fc.array(fc.record({ label: safeTextArbitrary, value: safeTextArbitrary }), { maxLength: 4 }),
    traceability: fc.array(fc.record({ label: safeTextArbitrary, value: safeTextArbitrary }), { maxLength: 4 }),
  }),
});
