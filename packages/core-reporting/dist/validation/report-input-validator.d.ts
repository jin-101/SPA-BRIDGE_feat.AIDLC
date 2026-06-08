import type { Result } from '@spa-bridge/core-model';
import { type ReportError } from '../shared-errors.js';
import type { ReportGenerationRequest, ReportInputBundle } from '../types.js';
export declare const validateReportInputBundle: (input: unknown) => Result<ReportInputBundle, ReportError>;
export declare const validateReportGenerationRequest: (input: unknown) => Result<ReportGenerationRequest, ReportError>;
//# sourceMappingURL=report-input-validator.d.ts.map