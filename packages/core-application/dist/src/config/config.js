import { z } from 'zod';
import { createDiagnostic } from '@spa-bridge/core-model';
import { err, ok } from '@spa-bridge/core-model';
import { validateSchema } from '@spa-bridge/core-model';
import { ConversionOverridesSchema, ProviderModeSchema, QualityOptionsSchema, RawProjectConfigSchema, ReportFormatSchema, TargetStrategySchema, } from '../types.js';
const ReportFormatListSchema = z.array(ReportFormatSchema);
export const ResolvedConversionConfigSchema = z.object({
    schemaVersion: z.literal(1),
    projectRoot: z.string().min(1),
    inputPath: z.string().min(1),
    outputPath: z.string().min(1),
    targetStrategy: TargetStrategySchema,
    providerMode: ProviderModeSchema,
    reportFormats: ReportFormatListSchema,
    preservePartialArtifacts: z.boolean(),
    manualReviewEnabled: z.boolean(),
    quality: QualityOptionsSchema,
});
export const validateRawProjectConfig = (input) => validateSchema(RawProjectConfigSchema, input);
export const validateOverrides = (input) => validateSchema(ConversionOverridesSchema, input);
export class ConfigPipeline {
    resolve(input) {
        const rawProjectConfigResult = validateRawProjectConfig(input.rawProjectConfig ?? {});
        if (!rawProjectConfigResult.ok) {
            return err(rawProjectConfigResult.error);
        }
        const overridesResult = validateOverrides(input.overrides ?? {});
        if (!overridesResult.ok) {
            return err(overridesResult.error);
        }
        const rawProjectConfig = rawProjectConfigResult.value;
        const overrides = overridesResult.value;
        const diagnostics = [];
        const outputPath = overrides.outputPath ?? rawProjectConfig.outputPath ?? './dist';
        const targetStrategy = overrides.targetStrategy ?? rawProjectConfig.targetStrategy ?? 'vite-react-typescript';
        const providerMode = overrides.providerMode ?? rawProjectConfig.providerMode ?? 'local-first';
        const reportFormats = overrides.reportFormats ?? rawProjectConfig.reportFormats ?? ['json', 'markdown'];
        const preservePartialArtifacts = overrides.preservePartialArtifacts ?? rawProjectConfig.preservePartialArtifacts ?? true;
        const manualReviewEnabled = overrides.manualReviewEnabled ?? rawProjectConfig.manualReviewEnabled ?? true;
        const quality = {
            ...QualityOptionsSchema.parse({}),
            ...rawProjectConfig.quality,
            ...overrides.quality,
        };
        if (rawProjectConfig.outputPath && overrides.outputPath && rawProjectConfig.outputPath !== overrides.outputPath) {
            diagnostics.push(createDiagnostic({
                code: 'CFG-OVERRIDE-001',
                severity: 'info',
                message: `Override outputPath '${overrides.outputPath}' replaced project config outputPath '${rawProjectConfig.outputPath}'.`,
                sourceRefs: [],
                generatedRefs: [],
                tags: ['config', 'override'],
            }));
        }
        const config = ResolvedConversionConfigSchema.parse({
            schemaVersion: 1,
            projectRoot: input.projectRoot,
            inputPath: input.inputPath,
            outputPath,
            targetStrategy,
            providerMode,
            reportFormats,
            preservePartialArtifacts,
            manualReviewEnabled,
            quality,
        });
        return ok({ config, diagnostics });
    }
}
//# sourceMappingURL=config.js.map