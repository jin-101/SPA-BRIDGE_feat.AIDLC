import { z } from 'zod';
import { GeneratedArtifactRefSchema, SourceRefSchema, TraceLinkSchema } from '@spa-bridge/core-model';
import { createSafeDisplayString } from '@spa-bridge/core-model';
export const ReportSeveritySchema = z.enum(['critical', 'blocking', 'warning', 'info']);
export const ReportCategorySchema = z.enum([
    'mapping',
    'security',
    'quality',
    'provider',
    'target-generation',
    'reporting',
    'source-analysis',
    'transformation',
    'unknown',
]);
export const ReportStatusSchema = z.enum(['passed', 'partial', 'blocked']);
export const ReportFormatSchema = z.enum(['json', 'markdown', 'html']);
const UNSAFE_TEXT_PATTERN = /<\s*script|<\/\s*script|javascript:|on\w+\s*=|<\s*iframe|<\s*object|<\s*embed/i;
const ABSOLUTE_PATH_PATTERN = /^(?:[A-Za-z]:[\\/]|\/)/;
const TRAVERSAL_PATTERN = /(^|[\\/])\.\.([\\/]|$)/;
export const isSafeRelativePath = (value) => value.trim().length > 0 &&
    !ABSOLUTE_PATH_PATTERN.test(value) &&
    !TRAVERSAL_PATTERN.test(value) &&
    !value.includes('\0');
export const SafeReportTextSchema = z
    .string()
    .min(1)
    .refine((value) => !UNSAFE_TEXT_PATTERN.test(value), {
    message: 'Unsafe content is not allowed in report text fields.',
})
    .transform((value) => createSafeDisplayString(value));
export const SafeRelativePathSchema = z
    .string()
    .min(1)
    .refine((value) => isSafeRelativePath(value), {
    message: 'Report refs must be safe relative paths.',
});
export const SafeSourceRefSchema = SourceRefSchema.extend({
    path: SafeRelativePathSchema,
});
export const SafeGeneratedArtifactRefSchema = GeneratedArtifactRefSchema.extend({
    path: SafeRelativePathSchema,
});
export const SafeTraceLinkSchema = TraceLinkSchema.extend({
    source: SafeSourceRefSchema,
    target: z.union([
        z.object({ kind: z.literal('ir'), id: z.string().min(1) }),
        SafeGeneratedArtifactRefSchema,
    ]),
});
export const ReportDiagnosticSchema = z.object({
    id: z.string().min(1),
    severity: ReportSeveritySchema,
    reasonCode: z.string().min(1),
    safeMessage: SafeReportTextSchema,
    sourceRef: SafeSourceRefSchema.optional(),
    generatedRef: SafeGeneratedArtifactRefSchema.optional(),
    storyArea: SafeReportTextSchema.optional(),
    reviewCategory: ReportCategorySchema.optional(),
});
export const ManualReviewItemSchema = z.object({
    id: z.string().min(1),
    severity: ReportSeveritySchema,
    category: ReportCategorySchema,
    reasonCode: z.string().min(1),
    safeSummary: SafeReportTextSchema,
    remediationHint: SafeReportTextSchema.optional(),
    sourceRef: SafeSourceRefSchema.optional(),
    generatedRef: SafeGeneratedArtifactRefSchema.optional(),
    storyArea: SafeReportTextSchema.optional(),
});
export const AiDecisionSchema = z.object({
    id: z.string().min(1),
    mappingRequestId: z.string().min(1),
    providerCategory: z.enum(['local', 'internal', 'mock', 'external-disabled', 'external-opt-in']),
    policyStatus: z.enum(['allowed', 'blocked', 'disabled', 'review-required']),
    confidence: z.number().min(0).max(1),
    provenanceRef: SafeReportTextSchema,
    safeRationale: SafeReportTextSchema,
});
export const ReportGroupSchema = z.object({
    id: z.string().min(1),
    severity: ReportSeveritySchema,
    sourceRef: SafeSourceRefSchema.optional(),
    generatedRef: SafeGeneratedArtifactRefSchema.optional(),
    storyArea: SafeReportTextSchema.optional(),
    reviewCategory: ReportCategorySchema.optional(),
    itemIds: z.array(z.string().min(1)),
});
export const ReportSourceInventorySchema = z.object({
    artifactCounts: z.record(z.string().min(1), z.number().int().nonnegative()).default({}),
    detectedCategories: z.array(z.string().min(1)).default([]),
    sourceRefs: z.array(SafeSourceRefSchema).default([]),
    diagnosticRefs: z.array(z.string().min(1)).default([]),
});
export const ReportConversionTargetSchema = z.object({
    targetStrategy: z.string().min(1),
    targetFramework: z.string().min(1),
});
export const ReportConversionOutputSchema = z.object({
    generatedArtifactCounts: z.record(z.string().min(1), z.number().int().nonnegative()).default({}),
    generatedRefs: z.array(SafeGeneratedArtifactRefSchema).default([]),
    targetProject: ReportConversionTargetSchema,
    convertedArtifactCount: z.number().int().nonnegative(),
    totalCandidateArtifactCount: z.number().int().nonnegative(),
    unresolvedCount: z.number().int().nonnegative().default(0),
});
export const QualityGateStatusSchema = z.enum(['passed', 'failed', 'skipped', 'blocked']);
export const QualityGateRunSchema = z.object({
    gateId: z.string().min(1),
    status: QualityGateStatusSchema,
    durationMs: z.number().int().nonnegative(),
    safeSummary: SafeReportTextSchema,
    diagnosticRefs: z.array(z.string().min(1)).default([]),
    traceRefs: z.array(z.string().min(1)).default([]),
});
export const PbtOutcomeSchema = z.object({
    planId: z.string().min(1),
    subject: z.string().min(1),
    generatorFamily: z.string().min(1),
    propertyName: z.string().min(1),
    seed: z.number().int().optional(),
    status: QualityGateStatusSchema,
    shrunk: z.boolean().default(false),
    safeSummary: SafeReportTextSchema.optional(),
    diagnosticRefs: z.array(z.string().min(1)).default([]),
    traceRefs: z.array(z.string().min(1)).default([]),
});
export const QualityEvidenceSummarySchema = z.object({
    evidenceId: z.string().min(1),
    summaryRef: z.string().min(1),
    gateRefs: z.array(z.string().min(1)).default([]),
    traceRefs: z.array(z.string().min(1)).default([]),
    diagnosticRefs: z.array(z.string().min(1)).default([]),
});
export const ReportQualitySectionSchema = z.object({
    gateStatus: QualityGateStatusSchema,
    gateRuns: z.array(QualityGateRunSchema).default([]),
    pbtRuns: z.array(PbtOutcomeSchema).default([]),
    correctionAttempts: z.number().int().nonnegative().default(0),
    selfCorrection: z
        .object({
        status: z.enum(['passed', 'degraded', 'blocked', 'skipped']),
        plannedCommands: z.number().int().nonnegative().default(0),
        appliedFixes: z.number().int().nonnegative().default(0),
        aiRepairRequests: z.number().int().nonnegative().default(0),
        remainingBlockers: z.number().int().nonnegative().default(0),
        artifactRefs: z.array(SafeRelativePathSchema).default([]),
    })
        .optional(),
    enterpriseParity: z
        .object({
        registrySafeEntries: z.number().int().nonnegative().default(0),
        registrySecretPlaceholders: z.number().int().nonnegative().default(0),
        generatedScripts: z.number().int().nonnegative().default(0),
        reviewedScripts: z.number().int().nonnegative().default(0),
        environmentVariables: z.number().int().nonnegative().default(0),
        secretEnvironmentVariables: z.number().int().nonnegative().default(0),
        manualReviewItems: z.number().int().nonnegative().default(0),
    })
        .optional(),
    evidenceCounts: z.object({
        total: z.number().int().nonnegative().default(0),
        blocked: z.number().int().nonnegative().default(0),
        safe: z.number().int().nonnegative().default(0),
    }),
    conversionQualityScore: z.number().min(0).max(1),
    targetPercent: z.number().min(0).max(100),
    targetMet: z.boolean(),
});
export const TraceCoverageSummarySchema = z.object({
    covered: z.number().int().nonnegative(),
    uncovered: z.number().int().nonnegative(),
});
export const ReportTraceabilitySectionSchema = z.object({
    links: z.array(SafeTraceLinkSchema).default([]),
    syntheticOrigins: z.array(SafeGeneratedArtifactRefSchema).default([]),
    coverageSummary: TraceCoverageSummarySchema,
});
export const ReportMetadataSchema = z.object({
    runId: z.string().min(1),
    correlationId: z.string().min(1),
    projectLabel: SafeReportTextSchema,
    sourceFramework: SafeReportTextSchema,
    targetFramework: SafeReportTextSchema,
    generatedAt: z.string().datetime(),
    partial: z.boolean().default(false),
});
export const ReportExportMetadataSchema = z.object({
    formats: z.array(ReportFormatSchema).default([]),
    contentHashes: z
        .array(z.object({
        format: ReportFormatSchema,
        hash: z.string().min(1),
    }))
        .default([]),
    rendererVersion: z.string().min(1),
    exportedAt: z.string().datetime(),
    canonicalReportRef: z.string().min(1),
    partial: z.boolean().default(false),
});
export const CanonicalConversionReportSchema = z.object({
    reportId: z.string().min(1),
    schemaVersion: z.number().int().positive(),
    metadata: ReportMetadataSchema,
    sourceInventory: ReportSourceInventorySchema,
    conversionOutput: ReportConversionOutputSchema,
    diagnostics: z.array(ReportDiagnosticSchema).default([]),
    aiDecisions: z.array(AiDecisionSchema).default([]),
    manualReview: z.object({
        items: z.array(ManualReviewItemSchema).default([]),
        groups: z.array(ReportGroupSchema).default([]),
        blockingCount: z.number().int().nonnegative().default(0),
    }),
    quality: ReportQualitySectionSchema,
    traceability: ReportTraceabilitySectionSchema,
    exportMetadata: ReportExportMetadataSchema,
});
export const ReportViewModelSchema = z.object({
    reportId: z.string().min(1),
    metadata: ReportMetadataSchema,
    sections: z.object({
        sourceInventory: z.array(z.record(z.string(), z.string())).default([]),
        conversionOutput: z.array(z.record(z.string(), z.string())).default([]),
        diagnostics: z.array(z.record(z.string(), z.string())).default([]),
        aiDecisions: z.array(z.record(z.string(), z.string())).default([]),
        manualReview: z.array(z.record(z.string(), z.string())).default([]),
        quality: z.array(z.record(z.string(), z.string())).default([]),
        traceability: z.array(z.record(z.string(), z.string())).default([]),
    }),
});
export const ReportGenerationRequestSchema = z.object({
    inputBundle: z.object({
        metadata: ReportMetadataSchema.omit({ partial: true }),
        sourceInventory: ReportSourceInventorySchema,
        conversionOutput: ReportConversionOutputSchema,
        diagnostics: z.array(ReportDiagnosticSchema).default([]),
        aiDecisions: z.array(AiDecisionSchema).default([]),
        manualReview: z.array(ManualReviewItemSchema).default([]),
        quality: ReportQualitySectionSchema,
        traceability: ReportTraceabilitySectionSchema,
    }),
    requestedFormats: z.array(ReportFormatSchema).default(['json', 'markdown', 'html']),
    rendererVersion: z.string().min(1),
    generatedAt: z.string().datetime(),
    qualityTargetPercent: z.number().min(0).max(100).default(85),
    partial: z.boolean().default(false),
});
export const ReportInputBundleSchema = ReportGenerationRequestSchema.shape.inputBundle;
export const ReportExportSetSchema = z.object({
    json: z.string().min(1),
    markdown: z.string().optional(),
    html: z.string().optional(),
    metadata: ReportExportMetadataSchema,
});
export const ReportGenerationResultSchema = z.object({
    report: CanonicalConversionReportSchema,
    exports: ReportExportSetSchema,
    diagnostics: z.array(ReportDiagnosticSchema).default([]),
});
export const ReportSchemaVersion = 1;
//# sourceMappingURL=types.js.map