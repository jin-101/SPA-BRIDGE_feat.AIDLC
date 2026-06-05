import type { TraceLink } from '@spa-bridge/core-model';
import type { QualityGateRun, QualityRequest, QualityRunSummary } from '../types.js';
export declare const createQualitySummaryTraceId: (runId: string) => string;
export declare const createQualityGateTraceId: (runId: string, gateId: string) => string;
export declare const createQualityArtifactTraceId: (runId: string, artifactPath: string, index: number) => string;
export declare class QualityTraceBuilder {
    build(request: QualityRequest, gateRuns: QualityGateRun[], summary: QualityRunSummary): TraceLink[];
}
//# sourceMappingURL=quality-trace-builder.d.ts.map