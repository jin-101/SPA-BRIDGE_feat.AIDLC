import { err, ok, type Result } from '@spa-bridge/core-model';

import {
  createSecurityError,
  type SecurityRulePack,
  SecurityRulePackSchema,
} from '../types.js';

export class SecurityRulePackValidator {
  validate(input: SecurityRulePack): Result<SecurityRulePack, ReturnType<typeof createSecurityError>> {
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
  private readonly validator = new SecurityRulePackValidator();
  private readonly packs = new Map<string, SecurityRulePack>();

  register(pack: SecurityRulePack): Result<SecurityRulePack, ReturnType<typeof createSecurityError>> {
    const validated = this.validator.validate(pack);
    if (!validated.ok) {
      return validated;
    }

    const existing = this.packs.get(validated.value.id);
    if (existing && validated.value.version < existing.version) {
      return err(
        createSecurityError(
          'DOWNGRADE_BLOCKED',
          `Rule pack '${validated.value.id}' version ${validated.value.version} would downgrade existing version ${existing.version}.`,
        ),
      );
    }

    this.packs.set(validated.value.id, validated.value);
    return ok(validated.value);
  }

  registerAll(packs: SecurityRulePack[]): Result<SecurityRulePack[], ReturnType<typeof createSecurityError>> {
    const registered: SecurityRulePack[] = [];
    for (const pack of packs) {
      const result = this.register(pack);
      if (!result.ok) {
        return result;
      }
      registered.push(result.value);
    }
    return ok(registered);
  }

  resolve(enabledPackIds: string[] = []): SecurityRulePack[] {
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

  list(): SecurityRulePack[] {
    return this.resolve();
  }
}
