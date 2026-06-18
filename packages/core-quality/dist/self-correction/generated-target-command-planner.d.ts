import type { GeneratedTargetCommandPlan } from '../types.js';
export type GeneratedTargetCommandPlannerInput = {
    runId: string;
    targetRoot: string;
    packageJson?: {
        scripts?: Record<string, string>;
        packageManager?: string;
    };
    packageManager?: 'npm' | 'pnpm' | 'yarn';
    includeSmokeStart?: boolean;
};
export declare class GeneratedTargetCommandPlanner {
    plan(input: GeneratedTargetCommandPlannerInput): GeneratedTargetCommandPlan;
    private detectPackageManager;
    private script;
    private command;
}
//# sourceMappingURL=generated-target-command-planner.d.ts.map