import { z } from 'zod';

import { GeneratedArtifactRefSchema, SourceRefSchema } from '../traceability/traceability.js';
import { SafeDisplayStringSchema, createSafeDisplayString } from '../redaction/redaction.js';
import { validateSchema, type ValidationError } from '../validation/validation.js';
import type { Result } from '../result/result.js';

export const DiagnosticSeveritySchema = z.enum([
  'info',
  'warning',
  'error',
  'manual-review',
  'security-blocker',
]);

export type DiagnosticSeverity = z.infer<typeof DiagnosticSeveritySchema>;

export const DiagnosticSchema = z.object({
  code: z.string().min(1),
  severity: DiagnosticSeveritySchema,
  message: SafeDisplayStringSchema,
  sourceRefs: z.array(SourceRefSchema).default([]),
  generatedRefs: z.array(GeneratedArtifactRefSchema).default([]),
  tags: z.array(z.string().min(1)).default([]),
  remediationHint: SafeDisplayStringSchema.optional(),
});

export type Diagnostic = z.infer<typeof DiagnosticSchema>;

export const DiagnosticsCollectionSchema = z.object({
  schemaVersion: z.number().int().positive(),
  diagnostics: z.array(DiagnosticSchema),
});

export type DiagnosticsCollection = z.infer<typeof DiagnosticsCollectionSchema>;

export const validateDiagnosticsCollection = (input: unknown): Result<any, ValidationError> =>
  validateSchema(DiagnosticsCollectionSchema, input);

export const createDiagnostic = (input: Omit<Diagnostic, 'message' | 'remediationHint'> & {
  message: string;
  remediationHint?: string;
}): Diagnostic =>
  DiagnosticSchema.parse({
    ...input,
    message: createSafeDisplayString(input.message),
    remediationHint: input.remediationHint ? createSafeDisplayString(input.remediationHint) : undefined,
  });
