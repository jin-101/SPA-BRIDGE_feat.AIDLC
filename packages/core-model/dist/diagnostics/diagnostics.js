import { z } from 'zod';
import { GeneratedArtifactRefSchema, SourceRefSchema } from '../traceability/traceability.js';
import { SafeDisplayStringSchema, createSafeDisplayString } from '../redaction/redaction.js';
import { validateSchema } from '../validation/validation.js';
export const DiagnosticSeveritySchema = z.enum([
    'info',
    'warning',
    'error',
    'manual-review',
    'security-blocker',
]);
export const DiagnosticSchema = z.object({
    code: z.string().min(1),
    severity: DiagnosticSeveritySchema,
    message: SafeDisplayStringSchema,
    sourceRefs: z.array(SourceRefSchema).default([]),
    generatedRefs: z.array(GeneratedArtifactRefSchema).default([]),
    tags: z.array(z.string().min(1)).default([]),
    remediationHint: SafeDisplayStringSchema.optional(),
});
export const DiagnosticsCollectionSchema = z.object({
    schemaVersion: z.number().int().positive(),
    diagnostics: z.array(DiagnosticSchema),
});
export const validateDiagnosticsCollection = (input) => validateSchema(DiagnosticsCollectionSchema, input);
export const createDiagnostic = (input) => DiagnosticSchema.parse({
    ...input,
    message: createSafeDisplayString(input.message),
    remediationHint: input.remediationHint ? createSafeDisplayString(input.remediationHint) : undefined,
});
//# sourceMappingURL=diagnostics.js.map