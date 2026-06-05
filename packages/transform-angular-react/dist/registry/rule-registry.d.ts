import type { TransformationRule } from '../types.js';
export declare class RuleRegistry {
    private readonly builtInRules;
    private readonly packs;
    registerBuiltInRules(...rules: TransformationRule[]): void;
    registerRulePack(packId: string, ...rules: TransformationRule[]): void;
    listRules(enabledPackIds: string[]): TransformationRule[];
}
//# sourceMappingURL=rule-registry.d.ts.map