import { createDiagnostic, type Result } from '@spa-bridge/core-model';
import type { RuleExecutionPlan, TransformationError, TransformationRule } from '../types.js';
export declare class ExecutionPlanner {
    plan(rules: TransformationRule[]): Result<RuleExecutionPlan, TransformationError>;
    toDiagnostic(message: string): ReturnType<typeof createDiagnostic>;
}
//# sourceMappingURL=execution-planner.d.ts.map