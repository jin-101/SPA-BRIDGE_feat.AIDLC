import { ok } from '@spa-bridge/core-model';
export class ResumePlanner {
    plan(manifest, stepIds) {
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
//# sourceMappingURL=resume.js.map