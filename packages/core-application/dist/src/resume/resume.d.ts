import { type Result } from '@spa-bridge/core-model';
import type { ApplicationError } from '../types.js';
import type { RunWorkspaceManifest } from '../run/run.js';
export type ResumePlan = {
    recoverable: boolean;
    reason: string;
    nextStepIndex: number;
    lastCheckpointId?: string;
    preservedArtifactRefs: Array<{
        kind: 'generated';
        path: string;
        segment?: string;
    }>;
};
export declare class ResumePlanner {
    plan(manifest: RunWorkspaceManifest, stepIds: string[]): Result<ResumePlan, ApplicationError>;
}
//# sourceMappingURL=resume.d.ts.map