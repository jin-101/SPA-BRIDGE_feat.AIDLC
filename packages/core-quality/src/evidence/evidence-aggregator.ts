import type { QualityEvidenceBundle, QualityGateRun, QualityRunSummary } from '../types.js';
import { createStableHash } from '../shared-errors.js';

export class EvidenceAggregator {
  build(runId: string, gateRuns: QualityGateRun[], summary: QualityRunSummary, diagnosticRefs: string[], traceRefs: string[]): QualityEvidenceBundle {
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

