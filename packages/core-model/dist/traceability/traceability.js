import { z } from 'zod';
import { createSafeDisplayString, SafeDisplayStringSchema } from '../redaction/redaction.js';
import { validateSchema } from '../validation/validation.js';
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
export const TraceLinkSchema = z.object({
    id: z.string().min(1),
    source: SourceRefSchema,
    target: z.union([IrRefSchema, GeneratedArtifactRefSchema]),
    relation: z.enum(['maps-to', 'derived-from', 'emits', 'references']),
    confidence: z.number().min(0).max(1).default(1),
    notes: SafeDisplayStringSchema.optional(),
});
export const TraceabilityMapSchema = z.object({
    schemaVersion: z.number().int().positive(),
    traceLinks: z.array(TraceLinkSchema),
});
export const buildTraceabilityIndexes = (traceabilityMap) => {
    const bySourcePath = new Map();
    const byTargetId = new Map();
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
export const validateTraceabilityMap = (input) => validateSchema(TraceabilityMapSchema, input);
export const createTraceLink = (link) => TraceLinkSchema.parse({
    ...link,
    notes: link.notes ? createSafeDisplayString(link.notes) : undefined,
});
//# sourceMappingURL=traceability.js.map