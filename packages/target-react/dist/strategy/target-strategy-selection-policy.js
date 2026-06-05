export const selectTargetStrategy = (request, registry) => {
    if (request.strategyId) {
        const explicit = registry.get(request.strategyId);
        if (!explicit) {
            throw new Error(`Unknown target strategy '${request.strategyId}'.`);
        }
        return explicit;
    }
    const defaultStrategy = registry.list().find((strategy) => strategy.defaultStrategy);
    if (!defaultStrategy) {
        throw new Error('No default target strategy is registered.');
    }
    return defaultStrategy;
};
//# sourceMappingURL=target-strategy-selection-policy.js.map