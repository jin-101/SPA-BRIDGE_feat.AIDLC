import { PathGuard } from '../path/path-guard.js';
import type { SourceAliasModel } from '../types.js';
export declare class AliasAnalyzer {
    private readonly pathGuard;
    constructor(pathGuard?: PathGuard);
    analyze(projectRoot: string, sourceRoot: string): Promise<SourceAliasModel>;
    private readTsConfigChain;
    private readTsConfigRecursive;
    private resolveBaseUrl;
    private buildPathAliases;
    private readAngularJson;
    private buildWorkspaceProjects;
    private buildAssetRoots;
    private diagnosticsForMapping;
    private toAliasDiagnostic;
}
//# sourceMappingURL=alias-analyzer.d.ts.map