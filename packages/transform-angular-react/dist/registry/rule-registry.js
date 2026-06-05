export class RuleRegistry {
    builtInRules = [];
    packs = new Map();
    registerBuiltInRules(...rules) {
        this.builtInRules.push(...rules);
    }
    registerRulePack(packId, ...rules) {
        this.packs.set(packId, { packId, rules });
    }
    listRules(enabledPackIds) {
        const selectedPacks = enabledPackIds.map((packId) => this.packs.get(packId)).filter((pack) => !!pack);
        return [...this.builtInRules, ...selectedPacks.flatMap((pack) => pack.rules)];
    }
}
//# sourceMappingURL=rule-registry.js.map