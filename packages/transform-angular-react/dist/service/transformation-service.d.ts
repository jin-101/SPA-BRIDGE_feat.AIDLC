import type { Result } from '@spa-bridge/core-model';
import { TransformationPipeline } from '../pipeline/transformation-pipeline.js';
import type { TransformationError, TransformationPipelineOptions, TransformationRequest, TransformationResult } from '../types.js';
export declare class TransformationService {
    private readonly pipeline;
    constructor(pipeline?: TransformationPipeline);
    transform(request: TransformationRequest): Result<TransformationResult, TransformationError>;
}
export declare const createTransformationService: (options?: TransformationPipelineOptions) => TransformationService;
//# sourceMappingURL=transformation-service.d.ts.map