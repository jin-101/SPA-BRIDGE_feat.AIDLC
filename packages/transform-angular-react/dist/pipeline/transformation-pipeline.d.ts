import { createDiagnostic, type Result } from '@spa-bridge/core-model';
import type { TransformationError, TransformationPipelineOptions, TransformationRequest, TransformationResult } from '../types.js';
export declare class TransformationPipeline {
    private readonly options;
    private readonly requestValidator;
    private readonly contextNormalizer;
    private readonly registryValidator;
    private readonly planner;
    private readonly draftValidator;
    private readonly passSummaryCollector;
    private readonly artifactFactory;
    constructor(options?: TransformationPipelineOptions);
    execute(request: TransformationRequest): Result<TransformationResult, TransformationError>;
    toDiagnostic(message: string): ReturnType<typeof createDiagnostic>;
}
//# sourceMappingURL=transformation-pipeline.d.ts.map