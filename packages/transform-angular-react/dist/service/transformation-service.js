import { TransformationPipeline } from '../pipeline/transformation-pipeline.js';
export class TransformationService {
    pipeline;
    constructor(pipeline = new TransformationPipeline()) {
        this.pipeline = pipeline;
    }
    transform(request) {
        return this.pipeline.execute(request);
    }
}
export const createTransformationService = (options) => new TransformationService(options ? new TransformationPipeline(options) : new TransformationPipeline());
//# sourceMappingURL=transformation-service.js.map