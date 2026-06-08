import type { ValidationIssue } from '@spa-bridge/core-model';
export type ReportErrorCode = 'VALIDATION_FAILED' | 'UNSAFE_CONTENT' | 'TRACE_COVERAGE_FAILED' | 'QUALITY_TARGET_FAILED' | 'SCHEMA_VERSION_MISMATCH' | 'UNSUPPORTED_FORMAT' | 'INTERNAL_ERROR';
export type ReportError = {
    name: 'ReportError';
    code: ReportErrorCode;
    message: string;
    issues: ValidationIssue[];
};
export declare const createReportError: (code: ReportErrorCode, message: string, issues?: ValidationIssue[]) => ReportError;
export declare const validationIssueFromPath: (path: Array<string | number>, message: string, code?: string) => ValidationIssue;
//# sourceMappingURL=shared-errors.d.ts.map