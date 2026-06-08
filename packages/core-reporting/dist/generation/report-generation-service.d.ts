import type { Result } from '@spa-bridge/core-model';
import { type ReportError } from '../shared-errors.js';
import type { ReportGenerationRequest, ReportGenerationResult } from '../types.js';
export type ReportGenerationServiceOptions = {
    defaultRendererVersion?: string;
};
export declare class ReportGenerationService {
    private readonly options;
    constructor(options?: ReportGenerationServiceOptions);
    generate(request: ReportGenerationRequest): Result<ReportGenerationResult, ReportError>;
}
export declare const generateConversionReport: (request: ReportGenerationRequest, options?: ReportGenerationServiceOptions) => Result<ReportGenerationResult, ReportError>;
//# sourceMappingURL=report-generation-service.d.ts.map