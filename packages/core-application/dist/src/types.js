import { z } from 'zod';
export const ProviderModeSchema = z.enum(['local-first', 'external-only', 'auto']);
export const TargetStrategySchema = z.enum(['vite-react-typescript', 'user-selected', 'custom']);
export const ReportFormatSchema = z.enum(['json', 'markdown', 'html']);
export const QualityOptionsSchema = z.object({
    typecheck: z.boolean().default(true),
    lint: z.boolean().default(true),
    format: z.boolean().default(true),
    build: z.boolean().default(true),
    unitTests: z.boolean().default(true),
    propertyTests: z.boolean().default(false),
});
export const RawProjectConfigSchema = z
    .object({
    targetStrategy: TargetStrategySchema.optional(),
    providerMode: ProviderModeSchema.optional(),
    outputPath: z.string().min(1).optional(),
    reportFormats: z.array(ReportFormatSchema).optional(),
    preservePartialArtifacts: z.boolean().optional(),
    manualReviewEnabled: z.boolean().optional(),
    quality: QualityOptionsSchema.partial().optional(),
})
    .passthrough();
export const ConversionOverridesSchema = z.object({
    targetStrategy: TargetStrategySchema.optional(),
    providerMode: ProviderModeSchema.optional(),
    outputPath: z.string().min(1).optional(),
    reportFormats: z.array(ReportFormatSchema).optional(),
    preservePartialArtifacts: z.boolean().optional(),
    manualReviewEnabled: z.boolean().optional(),
    quality: QualityOptionsSchema.partial().optional(),
});
//# sourceMappingURL=types.js.map