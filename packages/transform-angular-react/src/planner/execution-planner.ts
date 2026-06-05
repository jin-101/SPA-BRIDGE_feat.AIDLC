import { createDiagnostic, ok, err, type Result } from '@spa-bridge/core-model';

import type { RuleExecutionPlan, TransformationError, TransformationRule } from '../types.js';

const phaseOrder = new Map<TransformationRule['phase'], number>([
  ['component', 1],
  ['template', 2],
  ['behavior', 3],
  ['service', 4],
  ['route', 5],
  ['state', 6],
  ['finalize', 7],
]);

export class ExecutionPlanner {
  plan(rules: TransformationRule[]): Result<RuleExecutionPlan, TransformationError> {
    const orderedCandidates = [...rules].sort((left, right) => {
      const phaseDelta = (phaseOrder.get(left.phase) ?? 999) - (phaseOrder.get(right.phase) ?? 999);
      if (phaseDelta !== 0) {
        return phaseDelta;
      }
      if (left.priority !== right.priority) {
        return left.priority - right.priority;
      }
      return left.ruleId.localeCompare(right.ruleId);
    });

    const visiting = new Set<string>();
    const visited = new Set<string>();
    const orderedRules: TransformationRule[] = [];
    const byId = new Map(orderedCandidates.map((rule) => [rule.ruleId, rule] as const));

    const visit = (rule: TransformationRule): Result<void, TransformationError> => {
      if (visited.has(rule.ruleId)) {
        return ok(undefined);
      }
      if (visiting.has(rule.ruleId)) {
        return err({
          code: 'INVALID_REGISTRY',
          message: `Cycle detected while ordering rule '${rule.ruleId}'.`,
        });
      }
      visiting.add(rule.ruleId);
      for (const requirement of rule.requires ?? []) {
        const required = byId.get(requirement);
        if (!required) {
          return err({
            code: 'INVALID_REGISTRY',
            message: `Missing dependency '${requirement}' required by rule '${rule.ruleId}'.`,
          });
        }
        const dependencyResult = visit(required);
        if (!dependencyResult.ok) {
          return dependencyResult;
        }
      }
      visiting.delete(rule.ruleId);
      visited.add(rule.ruleId);
      orderedRules.push(rule);
      return ok(undefined);
    };

    for (const candidate of orderedCandidates) {
      const result = visit(candidate);
      if (!result.ok) {
        return result;
      }
    }

    const plan: RuleExecutionPlan = {
      planId: `plan-${orderedRules.map((rule) => rule.ruleId).join('-')}`,
      orderedRules,
      skippedRules: [],
      diagnostics: [],
    };

    return ok(plan);
  }

  toDiagnostic(message: string): ReturnType<typeof createDiagnostic> {
    return createDiagnostic({
      code: 'UOW04-PLAN-001',
      severity: 'error',
      message,
      sourceRefs: [],
      generatedRefs: [],
      tags: ['uow04', 'planner'],
    });
  }
}
