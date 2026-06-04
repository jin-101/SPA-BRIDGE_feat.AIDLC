import { err, ok, type Result } from '@spa-bridge/core-model';

import type { ApplicationError } from '../types.js';
import type { RunWorkspaceManifest } from '../run/run.js';

export type ResumePlan = {
  recoverable: boolean;
  reason: string;
  nextStepIndex: number;
  lastCheckpointId?: string;
  preservedArtifactRefs: Array<{ kind: 'generated'; path: string; segment?: string }>;
};

export class ResumePlanner {
  plan(manifest: RunWorkspaceManifest, stepIds: string[]): Result<ResumePlan, ApplicationError> {
    if (manifest.status === 'completed') {
      return ok({
        recoverable: false,
        reason: 'Completed runs do not need a resume plan.',
        nextStepIndex: stepIds.length,
        preservedArtifactRefs: manifest.artifactRefs,
      });
    }

    if (manifest.checkpoints.length === 0 && manifest.status !== 'running') {
      return ok({
        recoverable: false,
        reason: 'No safe checkpoint is available to resume from.',
        nextStepIndex: 0,
        preservedArtifactRefs: manifest.artifactRefs,
      });
    }

    const lastCheckpoint = manifest.checkpoints[manifest.checkpoints.length - 1];
    const nextStepIndex = lastCheckpoint ? Math.min(stepIds.indexOf(lastCheckpoint.stepId) + 1, stepIds.length) : 0;

    return ok({
      recoverable: true,
      reason: 'A valid manifest and checkpoint were found.',
      nextStepIndex,
      lastCheckpointId: lastCheckpoint?.id,
      preservedArtifactRefs: manifest.artifactRefs,
    });
  }
}
