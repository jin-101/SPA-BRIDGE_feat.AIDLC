import type { QualityCorrectionCandidate, QualityGateRun } from '../types.js';

export class CorrectionCandidateFactory {
  createFromGateRun(gateRun: QualityGateRun): QualityCorrectionCandidate[] {
    return [{
      id: `candidate-${gateRun.gateId}-${gateRun.attempts}`,
      summary: gateRun.safeSummary,
      evidenceRefs: [...gateRun.traceRefs, ...gateRun.diagnosticRefs],
    }];
  }
}

