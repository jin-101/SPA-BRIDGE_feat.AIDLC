import { type Result } from '@spa-bridge/core-model';
import type { AnalysisError } from '../types.js';
export type SafePathRef = {
    absolutePath: string;
    relativePath: string;
};
export declare class PathGuard {
    canonicalize(input: string): string;
    contains(basePath: string, candidatePath: string): Result<SafePathRef, AnalysisError>;
    validateRunId(runId: string): Result<string, AnalysisError>;
}
//# sourceMappingURL=path-guard.d.ts.map