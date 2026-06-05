export class PbtCoordinator {
    runners;
    constructor(runners = new Map()) {
        this.runners = runners;
    }
    async runPlans(plans) {
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
                };
            }
            const request = {
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
    toRun(plan, result) {
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
//# sourceMappingURL=pbt-coordinator.js.map