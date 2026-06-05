import { createDiagnostic, ok, err } from '@spa-bridge/core-model';
const phaseOrder = new Map([
    ['component', 1],
    ['template', 2],
    ['behavior', 3],
    ['service', 4],
    ['route', 5],
    ['state', 6],
    ['finalize', 7],
]);
export class ExecutionPlanner {
    plan(rules) {
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
        const visiting = new Set();
        const visited = new Set();
        const orderedRules = [];
        const byId = new Map(orderedCandidates.map((rule) => [rule.ruleId, rule]));
        const visit = (rule) => {
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
        const plan = {
            planId: `plan-${orderedRules.map((rule) => rule.ruleId).join('-')}`,
            orderedRules,
            skippedRules: [],
            diagnostics: [],
        };
        return ok(plan);
    }
    toDiagnostic(message) {
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
//# sourceMappingURL=execution-planner.js.map