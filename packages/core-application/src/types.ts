import { z } from 'zod';

import type { ReportFormat } from '@spa-bridge/core-model';

export const ProviderModeSchema = z.enum(['local-first', 'external-only', 'auto']);
export type ProviderMode = z.infer<typeof ProviderModeSchema>;

export const TargetStrategySchema = z.enum(['vite-react-typescript', 'user-selected', 'custom']);
export type TargetStrategy = z.infer<typeof TargetStrategySchema>;

export const ReportFormatSchema = z.enum(['json', 'markdown', 'html']);
export type AppReportFormat = z.infer<typeof ReportFormatSchema>;

export const QualityOptionsSchema = z.object({
  typecheck: z.boolean().default(true),
  lint: z.boolean().default(true),
  format: z.boolean().default(true),
  build: z.boolean().default(true),
  unitTests: z.boolean().default(true),
  propertyTests: z.boolean().default(false),
});

export type QualityOptions = z.infer<typeof QualityOptionsSchema>;

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

export type RawProjectConfig = z.infer<typeof RawProjectConfigSchema>;

export const ConversionOverridesSchema = z.object({
  targetStrategy: TargetStrategySchema.optional(),
  providerMode: ProviderModeSchema.optional(),
  outputPath: z.string().min(1).optional(),
  reportFormats: z.array(ReportFormatSchema).optional(),
  preservePartialArtifacts: z.boolean().optional(),
  manualReviewEnabled: z.boolean().optional(),
  quality: QualityOptionsSchema.partial().optional(),
});

export type ConversionOverrides = z.infer<typeof ConversionOverridesSchema>;

export type ResolvedConversionConfig = {
  schemaVersion: number;
  projectRoot: string;
  inputPath: string;
  outputPath: string;
  targetStrategy: TargetStrategy;
  providerMode: ProviderMode;
  reportFormats: ReportFormat[];
  preservePartialArtifacts: boolean;
  manualReviewEnabled: boolean;
  quality: QualityOptions;
};

export type ApplicationErrorCode =
  | 'VALIDATION_FAILED'
  | 'PATH_INVALID'
  | 'PORT_ERROR'
  | 'WORKFLOW_FAILED'
  | 'NOT_FOUND'
  | 'RESUME_NOT_POSSIBLE'
  | 'POLICY_BLOCKED';

export type ApplicationError = {
  code: ApplicationErrorCode;
  message: string;
  cause?: unknown;
};

export type StartConversionRequest = {
  projectRoot: string;
  inputPath: string;
  projectConfig?: RawProjectConfig;
  overrides?: ConversionOverrides;
  runId?: string;
  outputPath?: string;
};

export type GetRunStatusRequest = {
  projectRoot: string;
  runId: string;
};

export type ResumeRunRequest = {
  projectRoot: string;
  runId: string;
};

export type ExportReportRequest = {
  projectRoot: string;
  runId: string;
  format: ReportFormat;
};
