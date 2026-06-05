import { type Result } from '@spa-bridge/core-model';
import { createSecurityError, type SecurityRulePack } from '../types.js';
export declare class SecurityRulePackValidator {
    validate(input: SecurityRulePack): Result<SecurityRulePack, ReturnType<typeof createSecurityError>>;
}
export declare class SecurityRulePackRegistry {
    private readonly validator;
    private readonly packs;
    register(pack: SecurityRulePack): Result<SecurityRulePack, ReturnType<typeof createSecurityError>>;
    registerAll(packs: SecurityRulePack[]): Result<SecurityRulePack[], ReturnType<typeof createSecurityError>>;
    resolve(enabledPackIds?: string[]): SecurityRulePack[];
    list(): SecurityRulePack[];
}
//# sourceMappingURL=security-rule-pack-registry.d.ts.map