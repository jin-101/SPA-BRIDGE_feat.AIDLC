import { z } from 'zod';

import {
  createDiagnostic,
  type ConvertedFileRecord,
  type Diagnostic,
  type ManualReviewItem,
  type GeneratedArtifactRef,
  type ReportFormat,
  type RunManifest,
  type RunStatus,
  type SafeDisplayString,
  type Result,
  err,
  ok,
  validateSchema,
  type ValidationError,
} from '@spa-bridge/core-model';

import type { ApplicationError } from '../types.js';

export const ManifestStatusSchema = z.enum(['pending', 'running', 'completed', 'failed']);
export type ManifestStatus = z.infer<typeof ManifestStatusSchema>;

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

export type RunCheckpoint = z.infer<typeof RunCheckpointSchema>;

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

export type RunWorkspaceManifest = z.infer<typeof RunWorkspaceManifestSchema>;

export const validateRunWorkspaceManifest = (input: unknown): Result<any, ValidationError> =>
  validateSchema(RunWorkspaceManifestSchema, input);

export type CreateManifestInput = {
  runId: string;
  projectRoot: string;
  inputPath: string;
  outputPath: string;
  startedAt: string;
};

export class ManifestStateMachine {
  createRunningManifest(input: CreateManifestInput): RunWorkspaceManifest {
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
    }) as RunWorkspaceManifest;
  }

  recordCheckpoint(
    manifest: RunWorkspaceManifest,
    checkpoint: Omit<RunCheckpoint, 'completedAt'> & { completedAt?: string },
  ): Result<RunWorkspaceManifest, ApplicationError> {
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

  addManualReviewItem(manifest: RunWorkspaceManifest, item: ManualReviewItem): RunWorkspaceManifest {
    return RunWorkspaceManifestSchema.parse({
      ...manifest,
      manualReviewItems: [...manifest.manualReviewItems, item],
      updatedAt: new Date().toISOString(),
    });
  }

  addArtifactRef(manifest: RunWorkspaceManifest, artifactRef: GeneratedArtifactRef): RunWorkspaceManifest {
    return RunWorkspaceManifestSchema.parse({
      ...manifest,
      artifactRefs: [...manifest.artifactRefs, artifactRef],
      updatedAt: new Date().toISOString(),
    });
  }

  finalizeCompleted(manifest: RunWorkspaceManifest, finishedAt?: string): RunWorkspaceManifest {
    const timestamp = finishedAt ?? new Date().toISOString();
    return RunWorkspaceManifestSchema.parse({
      ...manifest,
      status: 'completed',
      updatedAt: timestamp,
    });
  }

  finalizeFailed(manifest: RunWorkspaceManifest, reason: string, finishedAt?: string): RunWorkspaceManifest {
    const timestamp = finishedAt ?? new Date().toISOString();
    return RunWorkspaceManifestSchema.parse({
      ...manifest,
      status: 'failed',
      updatedAt: timestamp,
      lastFailureStepId: manifest.lastCompletedStepId,
      lastFailureMessage: reason,
    });
  }

  finalizeCancelled(manifest: RunWorkspaceManifest, finishedAt?: string): RunWorkspaceManifest {
    const timestamp = finishedAt ?? new Date().toISOString();
    return RunWorkspaceManifestSchema.parse({
      ...manifest,
      status: 'failed',
      updatedAt: timestamp,
      lastFailureMessage: 'Cancelled by user.',
    });
  }

  canResume(manifest: RunWorkspaceManifest): boolean {
    return manifest.status === 'failed' || manifest.status === 'running';
  }
}

export type RunStatusSnapshot = {
  runId: string;
  status: RunStatus;
  updatedAt: string;
  checkpointCount: number;
  lastCompletedStepId?: string;
  runRoot: string;
};

export class RunStatusReader {
  constructor(
    private readonly fileSystem: {
      readText: (path: string) => Promise<Result<string, { code: string; message: SafeDisplayString; cause?: unknown }>>;
    },
    private readonly manifestPathForRun: (projectRoot: string, runId: string) => Result<string, ApplicationError>,
  ) {}

  async read(projectRoot: string, runId: string): Promise<Result<RunStatusSnapshot, ApplicationError>> {
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
