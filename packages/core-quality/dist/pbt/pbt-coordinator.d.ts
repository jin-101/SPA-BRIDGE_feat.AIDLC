import type { PropertyTestPlan, PropertyTestRun } from '../types.js';
import type { QualityRunnerMap } from '../types.js';
export declare class PbtCoordinator {
    private readonly runners;
    constructor(runners?: QualityRunnerMap);
    runPlans(plans: PropertyTestPlan[]): Promise<PropertyTestRun[]>;
    private toRun;
}
//# sourceMappingURL=pbt-coordinator.d.ts.map