import { z } from 'zod';
import { SafeDisplayStringSchema } from '../redaction/redaction.js';
export const AngularSourceModelRefSchema = z.object({
    projectPath: z.string().min(1),
    entryFile: z.string().min(1),
    projectKind: z.enum(['application', 'library', 'workspace']),
});
export const AngularSourceModelBoundarySchema = z.object({
    schemaVersion: z.number().int().positive(),
    sourceModelRef: AngularSourceModelRefSchema,
    entryPoints: z.array(z.string().min(1)).default([]),
    notes: z.array(SafeDisplayStringSchema).default([]),
});
//# sourceMappingURL=angular-source-model.js.map