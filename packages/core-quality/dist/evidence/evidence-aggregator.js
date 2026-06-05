import { createStableHash } from '../shared-errors.js';
export class EvidenceAggregator {
    build(runId, gateRuns, summary, diagnosticRefs, traceRefs) {
        const evidenceId = `evidence-${createStableHash({ runId, gateRuns: gateRuns.map((entry) => entry.gateId), summary })}`.slice(0, 40);
        return {
            evidenceId,
            runRef: runId,
            gateRefs: gateRuns.map((entry) => entry.gateId),
            summaryRef: `summary-${createStableHash(summary).slice(0, 16)}`,
            traceRefs: [...traceRefs],
            diagnosticRefs: [...diagnosticRefs],
        };
    }
}
//# sourceMappingURL=evidence-aggregator.js.map