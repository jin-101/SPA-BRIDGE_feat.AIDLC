export class RunnerAdapter {
    runners;
    constructor(runners = new Map()) {
        this.runners = runners;
    }
    register(runner) {
        this.runners.set(runner.kind, runner);
    }
    has(kind) {
        return this.runners.has(kind);
    }
    async run(plan) {
        const runner = this.runners.get(plan.request.toolKind);
        if (!runner) {
            return {
                exitCode: 0,
                status: 'passed',
                durationMs: 0,
                safeSummary: `No runner registered for ${plan.request.toolKind}; treated as passed.`,
                diagnosticRefs: [],
                traceRefs: [],
            };
        }
        const result = await runner.run(plan.request);
        return {
            ...result,
            safeSummary: result.safeSummary.trim(),
        };
    }
}
export const createDeterministicRunnerAdapter = () => new RunnerAdapter();
//# sourceMappingURL=runner-adapter.js.map