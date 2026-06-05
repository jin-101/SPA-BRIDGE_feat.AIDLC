import { type Result } from '@spa-bridge/core-model';
import { PathGuard } from '../path/path-guard.js';
import type { AnalysisError, AngularWorkspaceProfile } from '../types.js';
export declare class WorkspaceProfiler {
    private readonly pathGuard;
    constructor(pathGuard?: PathGuard);
    profile(projectRoot: string, explicitSourceRoot?: string): Promise<Result<AngularWorkspaceProfile, AnalysisError>>;
    private readProjectName;
}
//# sourceMappingURL=workspace-profiler.d.ts.map