import type { TargetGenerationRequest } from '../types.js';
import type { TargetStrategyDescriptor } from '../types.js';
import { TargetStrategyRegistry } from './target-strategy-registry.js';

export const selectTargetStrategy = (
  request: TargetGenerationRequest,
  registry: TargetStrategyRegistry,
): TargetStrategyDescriptor => {
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
