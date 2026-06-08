import type { GeneratedArtifactRef } from '@spa-bridge/core-model';
import { type ReportError } from '../shared-errors.js';
import type { ReportTraceabilitySection, TraceCoverageSummary } from '../types.js';
export declare const buildTraceCoverageSummary: (traceability: ReportTraceabilitySection, generatedRefs: GeneratedArtifactRef[]) => TraceCoverageSummary;
export declare const validateTraceCoverage: (traceability: ReportTraceabilitySection, generatedRefs: GeneratedArtifactRef[]) => {
    ok: true;
    value: TraceCoverageSummary;
} | {
    ok: false;
    error: ReportError;
};
//# sourceMappingURL=trace-coverage-validator.d.ts.map