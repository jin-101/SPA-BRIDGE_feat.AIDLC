import { z } from 'zod';

import { DiagnosticsCollectionSchema } from '../diagnostics/diagnostics.js';
import { RunManifestSchema } from '../manifest/manifest.js';
import { SafeDisplayStringSchema } from '../redaction/redaction.js';
import { TraceabilityMapSchema } from '../traceability/traceability.js';
import { validateSchema, type ValidationError } from '../validation/validation.js';
import type { Result } from '../result/result.js';

export const QualityGateNameSchema = z.enum([
  'typecheck',
  'lint',
  'format',
  'build',
  'unit-tests',
  'property-tests',
]);

export const QualityResultSchema = z.object({
  gate: QualityGateNameSchema,
  status: z.enum(['passed', 'failed', 'skipped']),
  durationMs: z.number().int().nonnegative().optional(),
  summary: SafeDisplayStringSchema.optional(),
});

export const AiDecisionRecordSchema = z.object({
  provider: z.string().min(1),
  model: z.string().min(1).optional(),
  decision: SafeDisplayStringSchema,
  rationale: SafeDisplayStringSchema.optional(),
});

export const ManualReviewItemSchema = z.object({
  id: z.string().min(1),
  title: SafeDisplayStringSchema,
  description: SafeDisplayStringSchema.optional(),
  status: z.enum(['open', 'resolved', 'deferred']),
});

export const SecurityEventRecordSchema = z.object({
  eventType: z.string().min(1),
  severity: z.enum(['info', 'warning', 'error', 'critical']),
  detail: SafeDisplayStringSchema,
});

export const ConvertedFileRecordSchema = z.object({
  sourcePath: z.string().min(1),
  outputPath: z.string().min(1),
  status: z.enum(['generated', 'updated', 'unchanged', 'skipped']),
});

export const RunSummarySchema = z.object({
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime().optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  totalConvertedFiles: z.number().int().nonnegative(),
  totalDiagnostics: z.number().int().nonnegative(),
});

export const ConversionReportSchema = z.object({
  schemaVersion: z.number().int().positive(),
  runManifest: RunManifestSchema,
  runSummary: RunSummarySchema,
  convertedFiles: z.array(ConvertedFileRecordSchema).default([]),
  diagnostics: DiagnosticsCollectionSchema,
  qualityResults: z.array(QualityResultSchema).default([]),
  traceabilityMap: TraceabilityMapSchema,
  aiDecisionRecords: z.array(AiDecisionRecordSchema).default([]),
  securityEvents: z.array(SecurityEventRecordSchema).default([]),
  manualReviewItems: z.array(ManualReviewItemSchema).default([]),
});

export type QualityResult = z.infer<typeof QualityResultSchema>;
export type AiDecisionRecord = z.infer<typeof AiDecisionRecordSchema>;
export type ManualReviewItem = z.infer<typeof ManualReviewItemSchema>;
export type SecurityEventRecord = z.infer<typeof SecurityEventRecordSchema>;
export type ConvertedFileRecord = z.infer<typeof ConvertedFileRecordSchema>;
export type RunSummary = z.infer<typeof RunSummarySchema>;
export type ConversionReport = z.infer<typeof ConversionReportSchema>;

export const validateConversionReport = (input: unknown): Result<any, ValidationError> =>
  validateSchema(ConversionReportSchema, input);
