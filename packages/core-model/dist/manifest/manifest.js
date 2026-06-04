import { z } from 'zod';
import { GeneratedArtifactRefSchema } from '../traceability/traceability.js';
import { validateSchema } from '../validation/validation.js';
export const RunStatusSchema = z.enum(['pending', 'running', 'completed', 'failed']);
export const RunManifestSchema = z.object({
    schemaVersion: z.number().int().positive(),
    runId: z.string().min(1),
    projectRoot: z.string().min(1),
    inputPath: z.string().min(1),
    outputPath: z.string().min(1),
    status: RunStatusSchema,
    startedAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    artifactRefs: z.array(GeneratedArtifactRefSchema).default([]),
});
export const validateRunManifest = (input) => validateSchema(RunManifestSchema, input);
//# sourceMappingURL=manifest.js.map