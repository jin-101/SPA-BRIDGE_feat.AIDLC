import type { QualityRunner, QualityRunnerMap, RunnerPlanEntry, RunnerRequest, RunnerResult } from '../types.js';
export declare class RunnerAdapter {
    private readonly runners;
    constructor(runners?: QualityRunnerMap);
    register(runner: QualityRunner): void;
    has(kind: RunnerRequest['toolKind']): boolean;
    run(plan: RunnerPlanEntry): Promise<RunnerResult>;
}
export declare const createDeterministicRunnerAdapter: () => RunnerAdapter;
//# sourceMappingURL=runner-adapter.d.ts.map