import { z } from 'zod';
import { type ManualReviewItem, type GeneratedArtifactRef, type RunStatus, type SafeDisplayString, type Result, type ValidationError } from '@spa-bridge/core-model';
import type { ApplicationError } from '../types.js';
export declare const ManifestStatusSchema: z.ZodEnum<["pending", "running", "completed", "failed"]>;
export type ManifestStatus = z.infer<typeof ManifestStatusSchema>;
export declare const RunCheckpointSchema: z.ZodObject<{
    id: z.ZodString;
    stepId: z.ZodString;
    completedAt: z.ZodString;
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
    stepId: string;
    id: string;
    completedAt: string;
    artifactRefs: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[];
}, {
    stepId: string;
    id: string;
    completedAt: string;
    artifactRefs?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[] | undefined;
}>;
export type RunCheckpoint = z.infer<typeof RunCheckpointSchema>;
export declare const RunWorkspaceManifestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
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
    checkpoints: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        stepId: z.ZodString;
        completedAt: z.ZodString;
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
        stepId: string;
        id: string;
        completedAt: string;
        artifactRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
    }, {
        stepId: string;
        id: string;
        completedAt: string;
        artifactRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    }>, "many">>;
    manualReviewItems: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<["open", "resolved", "deferred"]>;
    }, "strip", z.ZodTypeAny, {
        status: "open" | "resolved" | "deferred";
        id: string;
        title: string;
        description?: string | undefined;
    }, {
        status: "open" | "resolved" | "deferred";
        id: string;
        title: string;
        description?: string | undefined;
    }>, "many">>;
    reportExports: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    lastCompletedStepId: z.ZodOptional<z.ZodString>;
    lastFailureStepId: z.ZodOptional<z.ZodString>;
    lastFailureMessage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "running" | "completed" | "failed";
    outputPath: string;
    schemaVersion: 1;
    projectRoot: string;
    inputPath: string;
    runId: string;
    artifactRefs: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[];
    startedAt: string;
    updatedAt: string;
    checkpoints: {
        stepId: string;
        id: string;
        completedAt: string;
        artifactRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
    }[];
    manualReviewItems: {
        status: "open" | "resolved" | "deferred";
        id: string;
        title: string;
        description?: string | undefined;
    }[];
    reportExports: Record<string, string>;
    lastCompletedStepId?: string | undefined;
    lastFailureStepId?: string | undefined;
    lastFailureMessage?: string | undefined;
}, {
    status: "pending" | "running" | "completed" | "failed";
    outputPath: string;
    schemaVersion: 1;
    projectRoot: string;
    inputPath: string;
    runId: string;
    startedAt: string;
    updatedAt: string;
    artifactRefs?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[] | undefined;
    checkpoints?: {
        stepId: string;
        id: string;
        completedAt: string;
        artifactRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    }[] | undefined;
    manualReviewItems?: {
        status: "open" | "resolved" | "deferred";
        id: string;
        title: string;
        description?: string | undefined;
    }[] | undefined;
    reportExports?: Record<string, string> | undefined;
    lastCompletedStepId?: string | undefined;
    lastFailureStepId?: string | undefined;
    lastFailureMessage?: string | undefined;
}>;
export type RunWorkspaceManifest = z.infer<typeof RunWorkspaceManifestSchema>;
export declare const validateRunWorkspaceManifest: (input: unknown) => Result<any, ValidationError>;
export type CreateManifestInput = {
    runId: string;
    projectRoot: string;
    inputPath: string;
    outputPath: string;
    startedAt: string;
};
export declare class ManifestStateMachine {
    createRunningManifest(input: CreateManifestInput): RunWorkspaceManifest;
    recordCheckpoint(manifest: RunWorkspaceManifest, checkpoint: Omit<RunCheckpoint, 'completedAt'> & {
        completedAt?: string;
    }): Result<RunWorkspaceManifest, ApplicationError>;
    addManualReviewItem(manifest: RunWorkspaceManifest, item: ManualReviewItem): RunWorkspaceManifest;
    addArtifactRef(manifest: RunWorkspaceManifest, artifactRef: GeneratedArtifactRef): RunWorkspaceManifest;
    finalizeCompleted(manifest: RunWorkspaceManifest, finishedAt?: string): RunWorkspaceManifest;
    finalizeFailed(manifest: RunWorkspaceManifest, reason: string, finishedAt?: string): RunWorkspaceManifest;
    finalizeCancelled(manifest: RunWorkspaceManifest, finishedAt?: string): RunWorkspaceManifest;
    canResume(manifest: RunWorkspaceManifest): boolean;
}
export type RunStatusSnapshot = {
    runId: string;
    status: RunStatus;
    updatedAt: string;
    checkpointCount: number;
    lastCompletedStepId?: string;
    runRoot: string;
};
export declare class RunStatusReader {
    private readonly fileSystem;
    private readonly manifestPathForRun;
    constructor(fileSystem: {
        readText: (path: string) => Promise<Result<string, {
            code: string;
            message: SafeDisplayString;
            cause?: unknown;
        }>>;
    }, manifestPathForRun: (projectRoot: string, runId: string) => Result<string, ApplicationError>);
    read(projectRoot: string, runId: string): Promise<Result<RunStatusSnapshot, ApplicationError>>;
}
//# sourceMappingURL=run.d.ts.map