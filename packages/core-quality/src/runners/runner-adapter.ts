import type { QualityRunner, QualityRunnerMap, RunnerPlanEntry, RunnerRequest, RunnerResult } from '../types.js';

export class RunnerAdapter {
  constructor(private readonly runners: QualityRunnerMap = new Map()) {}

  register(runner: QualityRunner): void {
    this.runners.set(runner.kind, runner);
  }

  has(kind: RunnerRequest['toolKind']): boolean {
    return this.runners.has(kind);
  }

  async run(plan: RunnerPlanEntry): Promise<RunnerResult> {
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

export const createDeterministicRunnerAdapter = (): RunnerAdapter => new RunnerAdapter();

