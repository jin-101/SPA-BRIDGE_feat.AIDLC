import type { TargetStrategyDescriptor } from '../types.js';

export class TargetStrategyRegistry {
  private readonly strategies = new Map<string, TargetStrategyDescriptor>();

  register(strategy: TargetStrategyDescriptor): void {
    if (this.strategies.has(strategy.id)) {
      throw new Error(`Duplicate target strategy id '${strategy.id}'.`);
    }

    this.strategies.set(strategy.id, strategy);
  }

  get(strategyId: string): TargetStrategyDescriptor | undefined {
    return this.strategies.get(strategyId);
  }

  list(): TargetStrategyDescriptor[] {
    return [...this.strategies.values()].sort((left, right) => {
      if (left.defaultStrategy !== right.defaultStrategy) {
        return left.defaultStrategy ? -1 : 1;
      }

      return left.id.localeCompare(right.id);
    });
  }
}
