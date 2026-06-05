import type { TransformationRule, RuleRegistryPack } from '../types.js';

export class RuleRegistry {
  private readonly builtInRules: TransformationRule[] = [];
  private readonly packs = new Map<string, RuleRegistryPack>();

  registerBuiltInRules(...rules: TransformationRule[]): void {
    this.builtInRules.push(...rules);
  }

  registerRulePack(packId: string, ...rules: TransformationRule[]): void {
    this.packs.set(packId, { packId, rules });
  }

  listRules(enabledPackIds: string[]): TransformationRule[] {
    const selectedPacks = enabledPackIds.map((packId) => this.packs.get(packId)).filter((pack): pack is RuleRegistryPack => !!pack);
    return [...this.builtInRules, ...selectedPacks.flatMap((pack) => pack.rules)];
  }
}
