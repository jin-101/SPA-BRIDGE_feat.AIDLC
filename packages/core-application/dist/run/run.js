import { z } from 'zod';
import { err, ok, validateSchema, } from '@spa-bridge/core-model';
export const ManifestStatusSchema = z.enum(['pending', 'running', 'completed', 'failed']);
export const RunCheckpointSchema = z.object({
    id: z.string().min(1),
    stepId: z.string().min(1),
    completedAt: z.string().datetime(),
    artifactRefs: z.array(z.object({
        kind: z.literal('generated'),
        path: z.string().min(1),
        segment: z.string().optional(),
    })).default([]),
});
export const RunWorkspaceManifestSchema = z.object({
    schemaVersion: z.literal(1),
    runId: z.string().min(1),
    projectRoot: z.string().min(1),
    inputPath: z.string().min(1),
    outputPath: z.string().min(1),
    status: ManifestStatusSchema,
    startedAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    artifactRefs: z.array(z.object({
        kind: z.literal('generated'),
        path: z.string().min(1),
        segment: z.string().optional(),
    })).default([]),
    checkpoints: z.array(RunCheckpointSchema).default([]),
    manualReviewItems: z.array(z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(['open', 'resolved', 'deferred']),
    })).default([]),
    reportExports: z.record(z.string()).default({}),
    lastCompletedStepId: z.string().optional(),
    lastFailureStepId: z.string().optional(),
    lastFailureMessage: z.string().optional(),
});
export const validateRunWorkspaceManifest = (input) => validateSchema(RunWorkspaceManifestSchema, input);
export class ManifestStateMachine {
    createRunningManifest(input) {
        return RunWorkspaceManifestSchema.parse({
            schemaVersion: 1,
            runId: input.runId,
            projectRoot: input.projectRoot,
            inputPath: input.inputPath,
            outputPath: input.outputPath,
            status: 'running',
            startedAt: input.startedAt,
            updatedAt: input.startedAt,
            artifactRefs: [],
            checkpoints: [],
            manualReviewItems: [],
            reportExports: {},
            lastCompletedStepId: undefined,
            lastFailureStepId: undefined,
            lastFailureMessage: undefined,
        });
    }
    recordCheckpoint(manifest, checkpoint) {
        if (manifest.status !== 'running') {
            return err({
                code: 'WORKFLOW_FAILED',
                message: `Cannot record a checkpoint when run status is '${manifest.status}'.`,
            });
        }
        const completedAt = checkpoint.completedAt ?? new Date().toISOString();
        const next = {
            ...manifest,
            updatedAt: completedAt,
            lastCompletedStepId: checkpoint.stepId,
            checkpoints: [
                ...manifest.checkpoints,
                RunCheckpointSchema.parse({
                    ...checkpoint,
                    completedAt,
                }),
            ],
            artifactRefs: [...manifest.artifactRefs, ...checkpoint.artifactRefs],
        };
        return ok(RunWorkspaceManifestSchema.parse(next));
    }
    addManualReviewItem(manifest, item) {
        return RunWorkspaceManifestSchema.parse({
            ...manifest,
            manualReviewItems: [...manifest.manualReviewItems, item],
            updatedAt: new Date().toISOString(),
        });
    }
    addArtifactRef(manifest, artifactRef) {
        return RunWorkspaceManifestSchema.parse({
            ...manifest,
            artifactRefs: [...manifest.artifactRefs, artifactRef],
            updatedAt: new Date().toISOString(),
        });
    }
    finalizeCompleted(manifest, finishedAt) {
        const timestamp = finishedAt ?? new Date().toISOString();
        return RunWorkspaceManifestSchema.parse({
            ...manifest,
            status: 'completed',
            updatedAt: timestamp,
        });
    }
    finalizeFailed(manifest, reason, finishedAt) {
        const timestamp = finishedAt ?? new Date().toISOString();
        return RunWorkspaceManifestSchema.parse({
            ...manifest,
            status: 'failed',
            updatedAt: timestamp,
            lastFailureStepId: manifest.lastCompletedStepId,
            lastFailureMessage: reason,
        });
    }
    finalizeCancelled(manifest, finishedAt) {
        const timestamp = finishedAt ?? new Date().toISOString();
        return RunWorkspaceManifestSchema.parse({
            ...manifest,
            status: 'failed',
            updatedAt: timestamp,
            lastFailureMessage: 'Cancelled by user.',
        });
    }
    canResume(manifest) {
        return manifest.status === 'failed' || manifest.status === 'running';
    }
}
export class RunStatusReader {
    fileSystem;
    manifestPathForRun;
    constructor(fileSystem, manifestPathForRun) {
        this.fileSystem = fileSystem;
        this.manifestPathForRun = manifestPathForRun;
    }
    async read(projectRoot, runId) {
        const pathResult = this.manifestPathForRun(projectRoot, runId);
        if (!pathResult.ok) {
            return pathResult;
        }
        const manifestResult = await this.fileSystem.readText(pathResult.value);
        if (!manifestResult.ok) {
            return err({
                code: 'NOT_FOUND',
                message: manifestResult.error.message,
                cause: manifestResult.error,
            });
        }
        const parsed = validateRunWorkspaceManifest(JSON.parse(manifestResult.value));
        if (!parsed.ok) {
            return err({
                code: 'VALIDATION_FAILED',
                message: 'Run manifest is invalid.',
                cause: parsed.error,
            });
        }
        return ok({
            runId: parsed.value.runId,
            status: parsed.value.status,
            updatedAt: parsed.value.updatedAt,
            checkpointCount: parsed.value.checkpoints.length,
            lastCompletedStepId: parsed.value.lastCompletedStepId,
            runRoot: pathResult.value.replace(/\/manifest\.json$/, ''),
        });
    }
}
//# sourceMappingURL=run.js.map