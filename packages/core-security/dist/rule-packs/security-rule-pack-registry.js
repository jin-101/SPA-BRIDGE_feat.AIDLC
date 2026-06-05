import { err, ok } from '@spa-bridge/core-model';
import { createSecurityError, SecurityRulePackSchema, } from '../types.js';
export class SecurityRulePackValidator {
    validate(input) {
        const parsed = SecurityRulePackSchema.safeParse(input);
        if (!parsed.success) {
            return err(createSecurityError('INVALID_RULE_PACK', 'Rule pack schema validation failed.', parsed.error));
        }
        const pack = parsed.data;
        if (new Set(pack.categories).size !== pack.categories.length) {
            return err(createSecurityError('INVALID_RULE_PACK', `Rule pack '${pack.id}' has duplicate categories.`));
        }
        if (pack.redactionMode === 'tokenized' && !pack.tokenizationAllowed) {
            return err(createSecurityError('INVALID_RULE_PACK', `Rule pack '${pack.id}' enables tokenization without allowing it.`));
        }
        return ok(pack);
    }
}
export class SecurityRulePackRegistry {
    validator = new SecurityRulePackValidator();
    packs = new Map();
    register(pack) {
        const validated = this.validator.validate(pack);
        if (!validated.ok) {
            return validated;
        }
        const existing = this.packs.get(validated.value.id);
        if (existing && validated.value.version < existing.version) {
            return err(createSecurityError('DOWNGRADE_BLOCKED', `Rule pack '${validated.value.id}' version ${validated.value.version} would downgrade existing version ${existing.version}.`));
        }
        this.packs.set(validated.value.id, validated.value);
        return ok(validated.value);
    }
    registerAll(packs) {
        const registered = [];
        for (const pack of packs) {
            const result = this.register(pack);
            if (!result.ok) {
                return result;
            }
            registered.push(result.value);
        }
        return ok(registered);
    }
    resolve(enabledPackIds = []) {
        const ordered = [...this.packs.values()].sort((left, right) => {
            const precedenceDelta = right.precedence - left.precedence;
            if (precedenceDelta !== 0) {
                return precedenceDelta;
            }
            const versionDelta = right.version - left.version;
            if (versionDelta !== 0) {
                return versionDelta;
            }
            return left.id.localeCompare(right.id);
        });
        if (enabledPackIds.length === 0) {
            return ordered;
        }
        const enabled = new Set(enabledPackIds);
        return ordered.filter((pack) => enabled.has(pack.id));
    }
    list() {
        return this.resolve();
    }
}
//# sourceMappingURL=security-rule-pack-registry.js.map