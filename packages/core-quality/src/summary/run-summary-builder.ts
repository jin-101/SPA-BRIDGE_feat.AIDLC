import type { QualityGateRun, QualityRunSummary, QualityRunStatus } from '../types.js';

export class RunSummaryBuilder {
  build(input: {
    runId: string;
    gateRuns: QualityGateRun[];
    seed?: number;
    durationMs: number;
    manualReviewCount: number;
    retryCount: number;
  }): QualityRunSummary {
    const passedGates = input.gateRuns.filter((entry) => entry.status === 'passed').length;
    const failedGates = input.gateRuns.filter((entry) => entry.status === 'failed').length;
    const blockedGates = input.gateRuns.filter((entry) => entry.status === 'blocked').length;
    const gateOrder = input.gateRuns.map((entry) => entry.gateId);

    const overallStatus: QualityRunStatus =
      blockedGates > 0
        ? 'blocked'
        : input.manualReviewCount > 0
          ? 'manual-review'
          : failedGates > 0
            ? 'partial'
            : 'passed';

    return {
      runId: input.runId,
      overallStatus,
      totalGates: input.gateRuns.length,
      passedGates,
      failedGates,
      blockedGates,
      manualReviewCount: input.manualReviewCount,
      seed: input.seed,
      retryCount: input.retryCount,
      durationMs: input.durationMs,
      gateOrder,
    };
  }
}

