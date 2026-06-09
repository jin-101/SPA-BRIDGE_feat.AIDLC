import { type Result } from '@spa-bridge/core-model';
import type { AnalysisError, AngularAnalysisResult, SourceAngularAnalysisRequest } from '../types.js';
export declare class SourceAngularAnalysisService {
    private readonly pathGuard;
    private readonly workspaceProfiler;
    private readonly aliasAnalyzer;
    private readonly inventoryBuilder;
    private readonly tsParser;
    private readonly templateParser;
    private readonly routeAnalyzer;
    private readonly graphBuilder;
    private readonly diagnosticBuilder;
    private readonly artifactMapper;
    analyze(request: SourceAngularAnalysisRequest): Promise<Result<AngularAnalysisResult, AnalysisError>>;
    private findOwningComponent;
}
//# sourceMappingURL=source-angular-analysis-service.d.ts.map