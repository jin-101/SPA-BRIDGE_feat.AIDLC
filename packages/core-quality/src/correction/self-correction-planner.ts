import { createQualityError, type QualityError } from '../shared-errors.js';
import type { QualityGateDefinition, QualityGateRun, SelfCorrectionPlan } from '../types.js';
import { CorrectionCandidateFactory } from './correction-candidate-factory.js';

export type SelfCorrectionPolicy = {
  retryBudget: number;
};

export class SelfCorrectionPlanner {
  constructor(private readonly candidateFactory = new CorrectionCandidateFactory()) {}

  plan(gate: QualityGateDefinition, gateRun: QualityGateRun, policy: SelfCorrectionPolicy): SelfCorrectionPlan | undefined {
    if (!gate.blocking || gateRun.status !== 'failed') {
      return undefined;
    }

    const retryBudget = Math.max(0, Math.min(policy.retryBudget, 3));
    if (retryBudget <= 0) {
      return {
        planId: `correction-${gate.gateId}-${gateRun.attempts}`,
        targetGateId: gate.gateId,
        retryBudget: 0,
        correctionCandidates: [],
        stopReason: 'retry-budget-exhausted',
        traceRefs: [...gateRun.traceRefs],
      };
    }

    return {
      planId: `correction-${gate.gateId}-${gateRun.attempts}`,
      targetGateId: gate.gateId,
      retryBudget,
      correctionCandidates: this.candidateFactory.createFromGateRun(gateRun),
      traceRefs: [...gateRun.traceRefs],
    };
  }

  ensureCanCorrect(gate: QualityGateDefinition, gateRun: QualityGateRun, policy: SelfCorrectionPolicy): QualityError | undefined {
    if (!gate.blocking) {
      return createQualityError('MANUAL_REVIEW_REQUIRED', `Gate ${gate.gateId} is non-blocking and does not need correction.`);
    }

    if (gateRun.status !== 'failed') {
      return createQualityError('VALIDATION_FAILED', `Gate ${gate.gateId} is not in a failed state.`);
    }

    if (policy.retryBudget <= 0) {
      return createQualityError('BLOCKED', `No retry budget available for ${gate.gateId}.`);
    }

    return undefined;
  }
}

