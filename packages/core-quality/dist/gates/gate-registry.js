const gateOrder = ['build', 'lint', 'format', 'unit', 'integration', 'property'];
export class GateRegistry {
    definitions = new Map();
    register(definition) {
        if (this.definitions.has(definition.gateId)) {
            throw new Error(`Duplicate gate id: ${definition.gateId}`);
        }
        this.definitions.set(definition.gateId, definition);
    }
    get(gateId) {
        return this.definitions.get(gateId);
    }
    list() {
        return [...this.definitions.values()].sort((left, right) => {
            if (left.order !== right.order) {
                return left.order - right.order;
            }
            const leftKind = gateOrder.indexOf(left.kind);
            const rightKind = gateOrder.indexOf(right.kind);
            if (leftKind !== rightKind) {
                return leftKind - rightKind;
            }
            return left.gateId.localeCompare(right.gateId);
        });
    }
    resolve(selectedGateIds) {
        const selected = selectedGateIds && selectedGateIds.length > 0
            ? new Set(selectedGateIds)
            : undefined;
        return this.list().filter((definition) => !selected || selected.has(definition.gateId));
    }
}
export const createDefaultGateRegistry = () => {
    const registry = new GateRegistry();
    registry.register({
        gateId: 'build',
        displayName: 'Build',
        order: 10,
        kind: 'build',
        blocking: true,
        toolRef: 'npm run build',
        summaryTemplate: 'Build {status}',
        tags: ['build'],
    });
    registry.register({
        gateId: 'lint',
        displayName: 'Lint',
        order: 20,
        kind: 'lint',
        blocking: true,
        toolRef: 'npm run lint',
        summaryTemplate: 'Lint {status}',
        tags: ['lint'],
    });
    registry.register({
        gateId: 'format',
        displayName: 'Format',
        order: 30,
        kind: 'format',
        blocking: true,
        toolRef: 'npm run format',
        summaryTemplate: 'Format {status}',
        tags: ['format'],
    });
    registry.register({
        gateId: 'unit',
        displayName: 'Unit Tests',
        order: 40,
        kind: 'unit',
        blocking: true,
        toolRef: 'npm run test:unit',
        summaryTemplate: 'Unit {status}',
        tags: ['unit'],
    });
    registry.register({
        gateId: 'integration',
        displayName: 'Integration Tests',
        order: 50,
        kind: 'integration',
        blocking: true,
        toolRef: 'npm run test:integration',
        summaryTemplate: 'Integration {status}',
        tags: ['integration'],
    });
    registry.register({
        gateId: 'property',
        displayName: 'Property-Based Tests',
        order: 60,
        kind: 'property',
        blocking: true,
        toolRef: 'npm run test:property',
        summaryTemplate: 'Property {status}',
        tags: ['property'],
    });
    return registry;
};
//# sourceMappingURL=gate-registry.js.map