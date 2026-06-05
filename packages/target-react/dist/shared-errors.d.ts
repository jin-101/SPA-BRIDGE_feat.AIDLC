import type { TargetGenerationError, TargetGenerationErrorCode } from './types.js';
export declare const createTargetGenerationError: (code: TargetGenerationErrorCode, message: string, details?: string[]) => TargetGenerationError;
export declare const isTargetGenerationError: (value: unknown) => value is TargetGenerationError;
//# sourceMappingURL=shared-errors.d.ts.map