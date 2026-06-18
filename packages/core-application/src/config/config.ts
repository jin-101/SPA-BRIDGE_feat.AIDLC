import { z } from 'zod';

import { createDiagnostic, type Diagnostic } from '@spa-bridge/core-model';
import { err, ok, type Result } from '@spa-bridge/core-model';
import { validateSchema, type ValidationError } from '@spa-bridge/core-model';

import {
  ConversionOverridesSchema,
  ProviderModeSchema,
  QualityOptionsSchema,
  RawProjectConfigSchema,
  ReportFormatSchema,
  TargetStrategySchema,
  type ConversionOverrides,
  type RawProjectConfig,
  type ResolvedConversionConfig,
} from '../types.js';

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

export type ResolvedConfigResult = {
  config: ResolvedConversionConfig;
  diagnostics: Diagnostic[];
};

export const validateRawProjectConfig = (input: unknown): Result<RawProjectConfig, ValidationError> =>
  validateSchema(RawProjectConfigSchema, input);

export const validateOverrides = (input: unknown): Result<ConversionOverrides, ValidationError> =>
  validateSchema(ConversionOverridesSchema, input);

export class ConfigPipeline {
  resolve(input: {
    projectRoot: string;
    inputPath: string;
    rawProjectConfig?: unknown;
    overrides?: unknown;
  }): Result<ResolvedConfigResult, ValidationError> {
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
    const diagnostics: Diagnostic[] = [];

    const outputPath = overrides.outputPath ?? rawProjectConfig.outputPath ?? './dist';
    const targetStrategy = overrides.targetStrategy ?? rawProjectConfig.targetStrategy ?? 'nextjs-typescript';
    const providerMode = overrides.providerMode ?? rawProjectConfig.providerMode ?? 'local-first';
    const reportFormats = overrides.reportFormats ?? rawProjectConfig.reportFormats ?? ['json', 'markdown'];
    const preservePartialArtifacts =
      overrides.preservePartialArtifacts ?? rawProjectConfig.preservePartialArtifacts ?? true;
    const manualReviewEnabled =
      overrides.manualReviewEnabled ?? rawProjectConfig.manualReviewEnabled ?? true;
    const quality = {
      ...QualityOptionsSchema.parse({}),
      ...rawProjectConfig.quality,
      ...overrides.quality,
    };

    if (rawProjectConfig.outputPath && overrides.outputPath && rawProjectConfig.outputPath !== overrides.outputPath) {
      diagnostics.push(
        createDiagnostic({
          code: 'CFG-OVERRIDE-001',
          severity: 'info',
          message: `Override outputPath '${overrides.outputPath}' replaced project config outputPath '${rawProjectConfig.outputPath}'.`,
          sourceRefs: [],
          generatedRefs: [],
          tags: ['config', 'override'],
        }),
      );
    }

    const config: ResolvedConversionConfig = ResolvedConversionConfigSchema.parse({
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
