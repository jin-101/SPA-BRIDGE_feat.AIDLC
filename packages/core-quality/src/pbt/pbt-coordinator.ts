import type { QualityDiagnostic } from '../types.js';
import type { PropertyTestPlan, PropertyTestRun, RunnerRequest, RunnerResult } from '../types.js';
import type { QualityRunnerMap } from '../types.js';

export class PbtCoordinator {
  constructor(private readonly runners: QualityRunnerMap = new Map()) {}

  async runPlans(plans: PropertyTestPlan[]): Promise<PropertyTestRun[]> {
    const runner = this.runners.get('property');

    return Promise.all(plans.map(async (plan) => {
      if (!runner) {
        return {
          planId: plan.planId,
          status: 'skipped',
          seed: plan.seed,
          shrunk: false,
          diagnosticRefs: [],
          traceRefs: [],
        } satisfies PropertyTestRun;
      }

      const request: RunnerRequest = {
        toolKind: 'property',
        commandRef: plan.subject,
        args: [plan.generatorFamily, plan.propertyName, plan.shrinkStrategy],
        workspaceRoot: '.',
        seed: plan.seed,
      };

      const result = await runner.run(request);
      return this.toRun(plan, result);
    }));
  }

  private toRun(plan: PropertyTestPlan, result: RunnerResult): PropertyTestRun {
    return {
      planId: plan.planId,
      status: result.status,
      seed: plan.seed,
      counterexample: result.status === 'failed' ? `shrunk:${plan.propertyName}` : undefined,
      shrunk: result.status === 'failed',
      diagnosticRefs: [...result.diagnosticRefs],
      traceRefs: [...result.traceRefs],
    };
  }
}

