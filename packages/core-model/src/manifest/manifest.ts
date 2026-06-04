import { z } from 'zod';

import { GeneratedArtifactRefSchema } from '../traceability/traceability.js';
import { validateSchema, type ValidationError } from '../validation/validation.js';
import type { Result } from '../result/result.js';

export const RunStatusSchema = z.enum(['pending', 'running', 'completed', 'failed']);

export type RunStatus = z.infer<typeof RunStatusSchema>;

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

export type RunManifest = z.infer<typeof RunManifestSchema>;

export const validateRunManifest = (input: unknown): Result<any, ValidationError> =>
  validateSchema(RunManifestSchema, input);
