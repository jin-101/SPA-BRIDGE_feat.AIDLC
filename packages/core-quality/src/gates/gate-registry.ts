import type { QualityGateDefinition, QualityGateKind } from '../types.js';

const gateOrder = ['build', 'lint', 'format', 'unit', 'integration', 'property'] as const;

export class GateRegistry {
  private readonly definitions = new Map<string, QualityGateDefinition>();

  register(definition: QualityGateDefinition): void {
    if (this.definitions.has(definition.gateId)) {
      throw new Error(`Duplicate gate id: ${definition.gateId}`);
    }

    this.definitions.set(definition.gateId, definition);
  }

  get(gateId: string): QualityGateDefinition | undefined {
    return this.definitions.get(gateId);
  }

  list(): QualityGateDefinition[] {
    return [...this.definitions.values()].sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order;
      }

      const leftKind = gateOrder.indexOf(left.kind as (typeof gateOrder)[number]);
      const rightKind = gateOrder.indexOf(right.kind as (typeof gateOrder)[number]);
      if (leftKind !== rightKind) {
        return leftKind - rightKind;
      }

      return left.gateId.localeCompare(right.gateId);
    });
  }

  resolve(selectedGateIds?: string[]): QualityGateDefinition[] {
    const selected = selectedGateIds && selectedGateIds.length > 0
      ? new Set(selectedGateIds)
      : undefined;

    return this.list().filter((definition) => !selected || selected.has(definition.gateId));
  }
}

export const createDefaultGateRegistry = (): GateRegistry => {
  const registry = new GateRegistry();
  registry.register({
    gateId: 'build',
    displayName: 'Build',
    order: 10,
    kind: 'build' satisfies QualityGateKind,
    blocking: true,
    toolRef: 'npm run build',
    summaryTemplate: 'Build {status}',
    tags: ['build'],
  });
  registry.register({
    gateId: 'lint',
    displayName: 'Lint',
    order: 20,
    kind: 'lint' satisfies QualityGateKind,
    blocking: true,
    toolRef: 'npm run lint',
    summaryTemplate: 'Lint {status}',
    tags: ['lint'],
  });
  registry.register({
    gateId: 'format',
    displayName: 'Format',
    order: 30,
    kind: 'format' satisfies QualityGateKind,
    blocking: true,
    toolRef: 'npm run format',
    summaryTemplate: 'Format {status}',
    tags: ['format'],
  });
  registry.register({
    gateId: 'unit',
    displayName: 'Unit Tests',
    order: 40,
    kind: 'unit' satisfies QualityGateKind,
    blocking: true,
    toolRef: 'npm run test:unit',
    summaryTemplate: 'Unit {status}',
    tags: ['unit'],
  });
  registry.register({
    gateId: 'integration',
    displayName: 'Integration Tests',
    order: 50,
    kind: 'integration' satisfies QualityGateKind,
    blocking: true,
    toolRef: 'npm run test:integration',
    summaryTemplate: 'Integration {status}',
    tags: ['integration'],
  });
  registry.register({
    gateId: 'property',
    displayName: 'Property-Based Tests',
    order: 60,
    kind: 'property' satisfies QualityGateKind,
    blocking: true,
    toolRef: 'npm run test:property',
    summaryTemplate: 'Property {status}',
    tags: ['property'],
  });

  return registry;
};

