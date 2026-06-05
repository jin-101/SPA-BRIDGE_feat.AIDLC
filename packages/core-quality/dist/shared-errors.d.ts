import { type Result } from '@spa-bridge/core-model';
export type QualityErrorCode = 'INVALID_REQUEST' | 'INVALID_GATE' | 'INVALID_RUNNER' | 'VALIDATION_FAILED' | 'BLOCKED' | 'MANUAL_REVIEW_REQUIRED' | 'PBT_REPLAY_FAILED';
export declare class QualityError extends Error {
    readonly code: QualityErrorCode;
    readonly details: string[];
    constructor(code: QualityErrorCode, message: string, details?: string[]);
}
export declare const createQualityError: (code: QualityErrorCode, message: string, details?: string[]) => QualityError;
export declare const createQualityErrorResult: <T>(code: QualityErrorCode, message: string, details?: string[]) => Result<T, QualityError>;
export declare const createQualityOk: <T>(value: T) => import("@spa-bridge/core-model").Ok<T>;
export declare const stableStringify: (value: unknown) => string;
export declare const createStableHash: (value: unknown) => string;
//# sourceMappingURL=shared-errors.d.ts.map