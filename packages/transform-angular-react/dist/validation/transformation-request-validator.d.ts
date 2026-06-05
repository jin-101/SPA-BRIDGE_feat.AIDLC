import { createDiagnostic, type Result } from '@spa-bridge/core-model';
import type { TransformationError, TransformationRequest } from '../types.js';
export declare class TransformationRequestValidator {
    validate(request: TransformationRequest): Result<TransformationRequest, TransformationError>;
    toDiagnostic(message: string, path: string): ReturnType<typeof createDiagnostic>;
}
//# sourceMappingURL=transformation-request-validator.d.ts.map