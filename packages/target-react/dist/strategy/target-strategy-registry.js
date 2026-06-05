export class TargetStrategyRegistry {
    strategies = new Map();
    register(strategy) {
        if (this.strategies.has(strategy.id)) {
            throw new Error(`Duplicate target strategy id '${strategy.id}'.`);
        }
        this.strategies.set(strategy.id, strategy);
    }
    get(strategyId) {
        return this.strategies.get(strategyId);
    }
    list() {
        return [...this.strategies.values()].sort((left, right) => {
            if (left.defaultStrategy !== right.defaultStrategy) {
                return left.defaultStrategy ? -1 : 1;
            }
            return left.id.localeCompare(right.id);
        });
    }
}
//# sourceMappingURL=target-strategy-registry.js.map