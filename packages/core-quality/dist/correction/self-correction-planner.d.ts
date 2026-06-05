import { type QualityError } from '../shared-errors.js';
import type { QualityGateDefinition, QualityGateRun, SelfCorrectionPlan } from '../types.js';
import { CorrectionCandidateFactory } from './correction-candidate-factory.js';
export type SelfCorrectionPolicy = {
    retryBudget: number;
};
export declare class SelfCorrectionPlanner {
    private readonly candidateFactory;
    constructor(candidateFactory?: CorrectionCandidateFactory);
    plan(gate: QualityGateDefinition, gateRun: QualityGateRun, policy: SelfCorrectionPolicy): SelfCorrectionPlan | undefined;
    ensureCanCorrect(gate: QualityGateDefinition, gateRun: QualityGateRun, policy: SelfCorrectionPolicy): QualityError | undefined;
}
//# sourceMappingURL=self-correction-planner.d.ts.map