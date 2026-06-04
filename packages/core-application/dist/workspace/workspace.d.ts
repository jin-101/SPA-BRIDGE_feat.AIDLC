import { type Result } from '@spa-bridge/core-model';
import type { PortError } from '@spa-bridge/core-model';
import type { ApplicationError } from '../types.js';
export type PathSafetyError = ApplicationError;
export type RunWorkspacePaths = {
    projectRoot: string;
    runId: string;
    runRoot: string;
    manifestPath: string;
    resolvedConfigPath: string;
    diagnosticsPath: string;
    artifactsDir: string;
    reportsDir: string;
    checkpointsDir: string;
    locksDir: string;
};
export declare class PathGuard {
    normalize(input: string): string;
    ensureContained(basePath: string, candidatePath: string): Result<string, PathSafetyError>;
    deriveRunWorkspace(projectRoot: string, runId: string): Result<RunWorkspacePaths, PathSafetyError>;
}
export type RunWorkspace = RunWorkspacePaths & {
    initializedAt: string;
};
export declare class RunWorkspaceManager {
    private readonly pathGuard;
    constructor(pathGuard?: PathGuard);
    derive(projectRoot: string, runId: string, initializedAt: string): Result<RunWorkspace, PathSafetyError>;
    ensureWorkspaceFitsRoot(workspace: RunWorkspace): Result<RunWorkspace, PathSafetyError>;
}
export declare const isPortError: (error: unknown) => error is PortError;
//# sourceMappingURL=workspace.d.ts.map