import { type Result } from '@spa-bridge/core-model';
import type { TransformationContext, TransformationError, TransformationRequest } from '../types.js';
export declare class ContextNormalizer {
    private readonly ids;
    normalize(request: TransformationRequest): Result<TransformationContext, TransformationError>;
}
//# sourceMappingURL=context-normalizer.d.ts.map