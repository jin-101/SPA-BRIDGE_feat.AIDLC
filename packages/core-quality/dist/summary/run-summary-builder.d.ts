import type { QualityGateRun, QualityRunSummary } from '../types.js';
export declare class RunSummaryBuilder {
    build(input: {
        runId: string;
        gateRuns: QualityGateRun[];
        seed?: number;
        durationMs: number;
        manualReviewCount: number;
        retryCount: number;
    }): QualityRunSummary;
}
//# sourceMappingURL=run-summary-builder.d.ts.map