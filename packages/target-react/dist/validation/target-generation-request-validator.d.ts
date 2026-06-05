import { type Diagnostic, type Result } from '@spa-bridge/core-model';
import { createTargetGenerationError } from '../shared-errors.js';
import type { TargetGenerationRequest } from '../types.js';
export declare class TargetGenerationRequestValidator {
    validate(request: TargetGenerationRequest): Result<TargetGenerationRequest, ReturnType<typeof createTargetGenerationError>>;
    toDiagnostic(message: string, sourcePath?: string): Diagnostic;
}
//# sourceMappingURL=target-generation-request-validator.d.ts.map