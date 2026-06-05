import { createDiagnostic, ok, err } from '@spa-bridge/core-model';
export class RegistryValidator {
    validate(rules) {
        const seen = new Map();
        const diagnostics = [];
        for (const rule of rules) {
            if (seen.has(rule.ruleId)) {
                return err({
                    code: 'INVALID_REGISTRY',
                    message: `Duplicate rule id '${rule.ruleId}'.`,
                });
            }
            seen.set(rule.ruleId, rule);
        }
        for (const rule of rules) {
            for (const dependency of rule.requires ?? []) {
                if (!seen.has(dependency)) {
                    return err({
                        code: 'INVALID_REGISTRY',
                        message: `Rule '${rule.ruleId}' depends on unknown rule '${dependency}'.`,
                    });
                }
            }
            for (const conflict of rule.conflictsWith ?? []) {
                if (seen.has(conflict)) {
                    return err({
                        code: 'INVALID_REGISTRY',
                        message: `Rule '${rule.ruleId}' conflicts with '${conflict}'.`,
                    });
                }
            }
        }
        const validPhases = new Set(['component', 'template', 'behavior', 'service', 'route', 'state', 'finalize']);
        for (const rule of rules) {
            if (!validPhases.has(rule.phase)) {
                return err({
                    code: 'INVALID_REGISTRY',
                    message: `Rule '${rule.ruleId}' has unsupported phase '${rule.phase}'.`,
                });
            }
        }
        return ok(rules);
    }
    toDiagnostic(message) {
        return createDiagnostic({
            code: 'UOW04-REGISTRY-001',
            severity: 'error',
            message,
            sourceRefs: [],
            generatedRefs: [],
            tags: ['uow04', 'registry'],
        });
    }
}
//# sourceMappingURL=registry-validator.js.map