export class RunSummaryBuilder {
    build(input) {
        const passedGates = input.gateRuns.filter((entry) => entry.status === 'passed').length;
        const failedGates = input.gateRuns.filter((entry) => entry.status === 'failed').length;
        const blockedGates = input.gateRuns.filter((entry) => entry.status === 'blocked').length;
        const gateOrder = input.gateRuns.map((entry) => entry.gateId);
        const overallStatus = blockedGates > 0
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
//# sourceMappingURL=run-summary-builder.js.map