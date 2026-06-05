import type { QualityEvidenceBundle, QualityGateRun, QualityRunSummary } from '../types.js';
export declare class EvidenceAggregator {
    build(runId: string, gateRuns: QualityGateRun[], summary: QualityRunSummary, diagnosticRefs: string[], traceRefs: string[]): QualityEvidenceBundle;
}
//# sourceMappingURL=evidence-aggregator.d.ts.map