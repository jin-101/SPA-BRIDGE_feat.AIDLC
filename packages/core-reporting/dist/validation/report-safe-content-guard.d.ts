import type { Result } from '@spa-bridge/core-model';
import { type ReportError } from '../shared-errors.js';
export declare const containsUnsafeText: (value: string) => boolean;
export declare const guardSafeReportText: (value: string, fieldPath: string) => Result<string, ReportError>;
export declare const guardSafeRelativePath: (value: string, fieldPath: string) => Result<string, ReportError>;
export declare const scanForUnsafeContent: (value: unknown, path?: Array<string | number>) => Result<void, ReportError>;
//# sourceMappingURL=report-safe-content-guard.d.ts.map