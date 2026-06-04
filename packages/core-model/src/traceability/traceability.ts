import { z } from 'zod';

import { createSafeDisplayString, SafeDisplayStringSchema } from '../redaction/redaction.js';
import { ok, type Result } from '../result/result.js';
import { createValidationError, validateSchema } from '../validation/validation.js';

export const SourceRefSchema = z.object({
  kind: z.literal('source'),
  path: z.string().min(1),
  symbol: z.string().optional(),
  location: z.string().optional(),
});

export const IrRefSchema = z.object({
  kind: z.literal('ir'),
  id: z.string().min(1),
});

export const GeneratedArtifactRefSchema = z.object({
  kind: z.literal('generated'),
  path: z.string().min(1),
  segment: z.string().optional(),
});

export type SourceRef = z.infer<typeof SourceRefSchema>;
export type IrRef = z.infer<typeof IrRefSchema>;
export type GeneratedArtifactRef = z.infer<typeof GeneratedArtifactRefSchema>;

export const TraceLinkSchema = z.object({
  id: z.string().min(1),
  source: SourceRefSchema,
  target: z.union([IrRefSchema, GeneratedArtifactRefSchema]),
  relation: z.enum(['maps-to', 'derived-from', 'emits', 'references']),
  confidence: z.number().min(0).max(1).default(1),
  notes: SafeDisplayStringSchema.optional(),
});

export type TraceLink = z.infer<typeof TraceLinkSchema>;

export const TraceabilityMapSchema = z.object({
  schemaVersion: z.number().int().positive(),
  traceLinks: z.array(TraceLinkSchema),
});

export type TraceabilityMap = z.infer<typeof TraceabilityMapSchema>;

export type TraceabilityIndexes = {
  bySourcePath: Map<string, TraceLink[]>;
  byTargetId: Map<string, TraceLink[]>;
};

export const buildTraceabilityIndexes = (traceabilityMap: TraceabilityMap): TraceabilityIndexes => {
  const bySourcePath = new Map<string, TraceLink[]>();
  const byTargetId = new Map<string, TraceLink[]>();

  for (const link of traceabilityMap.traceLinks) {
    const sourceBucket = bySourcePath.get(link.source.path) ?? [];
    sourceBucket.push(link);
    bySourcePath.set(link.source.path, sourceBucket);

    const targetId = link.target.kind === 'ir' ? link.target.id : link.target.path;
    const targetBucket = byTargetId.get(targetId) ?? [];
    targetBucket.push(link);
    byTargetId.set(targetId, targetBucket);
  }

  return { bySourcePath, byTargetId };
};

export const validateTraceabilityMap = (input: unknown): Result<TraceabilityMap, ReturnType<typeof createValidationError>> =>
  validateSchema(TraceabilityMapSchema, input);

export const createTraceLink = (link: TraceLink): TraceLink =>
  TraceLinkSchema.parse({
    ...link,
    notes: link.notes ? createSafeDisplayString(link.notes) : undefined,
  });
