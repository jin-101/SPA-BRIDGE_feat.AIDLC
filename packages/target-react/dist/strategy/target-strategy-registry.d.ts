import type { TargetStrategyDescriptor } from '../types.js';
export declare class TargetStrategyRegistry {
    private readonly strategies;
    register(strategy: TargetStrategyDescriptor): void;
    get(strategyId: string): TargetStrategyDescriptor | undefined;
    list(): TargetStrategyDescriptor[];
}
//# sourceMappingURL=target-strategy-registry.d.ts.map