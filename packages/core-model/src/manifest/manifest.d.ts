import { z } from 'zod';
import { type ValidationError } from '../validation/validation.js';
import type { Result } from '../result/result.js';
export declare const RunStatusSchema: z.ZodEnum<["pending", "running", "completed", "failed"]>;
export type RunStatus = z.infer<typeof RunStatusSchema>;
export declare const RunManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodNumber;
    runId: z.ZodString;
    projectRoot: z.ZodString;
    inputPath: z.ZodString;
    outputPath: z.ZodString;
    status: z.ZodEnum<["pending", "running", "completed", "failed"]>;
    startedAt: z.ZodString;
    updatedAt: z.ZodString;
    artifactRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"generated">;
        path: z.ZodString;
        segment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "running" | "completed" | "failed";
    artifactRefs: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[];
    schemaVersion: number;
    runId: string;
    projectRoot: string;
    inputPath: string;
    outputPath: string;
    startedAt: string;
    updatedAt: string;
}, {
    status: "pending" | "running" | "completed" | "failed";
    schemaVersion: number;
    runId: string;
    projectRoot: string;
    inputPath: string;
    outputPath: string;
    startedAt: string;
    updatedAt: string;
    artifactRefs?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[] | undefined;
}>;
export type RunManifest = z.infer<typeof RunManifestSchema>;
export declare const validateRunManifest: (input: unknown) => Result<any, ValidationError>;
//# sourceMappingURL=manifest.d.ts.map