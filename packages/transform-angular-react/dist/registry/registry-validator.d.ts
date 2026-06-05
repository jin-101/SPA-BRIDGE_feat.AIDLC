import { createDiagnostic, type Result } from '@spa-bridge/core-model';
import type { TransformationError, TransformationRule } from '../types.js';
export declare class RegistryValidator {
    validate(rules: TransformationRule[]): Result<TransformationRule[], TransformationError>;
    toDiagnostic(message: string): ReturnType<typeof createDiagnostic>;
}
//# sourceMappingURL=registry-validator.d.ts.map