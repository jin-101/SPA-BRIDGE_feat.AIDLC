import type { GeneratedTargetSelfCorrectionResult, GeneratedTargetValidationResult } from '../types.js';
import { AiRepairBoundary } from './ai-repair-boundary.js';
import { DeterministicFixerRegistry } from './deterministic-fixer-registry.js';
import { GeneratedTargetCommandPlanner, type GeneratedTargetCommandPlannerInput } from './generated-target-command-planner.js';
export declare class GeneratedTargetSelfCorrectionService {
    private readonly planner;
    private readonly fixerRegistry;
    private readonly aiBoundary;
    constructor(planner?: GeneratedTargetCommandPlanner, fixerRegistry?: DeterministicFixerRegistry, aiBoundary?: AiRepairBoundary);
    evaluate(input: GeneratedTargetCommandPlannerInput & {
        validationResults?: GeneratedTargetValidationResult[];
        maxAttempts?: number;
        allowLocalAiRepair?: boolean;
        allowExternalAiRepair?: boolean;
    }): GeneratedTargetSelfCorrectionResult;
}
//# sourceMappingURL=generated-target-self-correction-service.d.ts.map