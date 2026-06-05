import type { Result } from '@spa-bridge/core-model';

import { TransformationPipeline } from '../pipeline/transformation-pipeline.js';
import type { TransformationError, TransformationPipelineOptions, TransformationRequest, TransformationResult } from '../types.js';

export class TransformationService {
  constructor(private readonly pipeline = new TransformationPipeline()) {}

  transform(request: TransformationRequest): Result<TransformationResult, TransformationError> {
    return this.pipeline.execute(request);
  }
}

export const createTransformationService = (options?: TransformationPipelineOptions): TransformationService =>
  new TransformationService(options ? new TransformationPipeline(options) : new TransformationPipeline());
