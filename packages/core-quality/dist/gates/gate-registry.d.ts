import type { QualityGateDefinition } from '../types.js';
export declare class GateRegistry {
    private readonly definitions;
    register(definition: QualityGateDefinition): void;
    get(gateId: string): QualityGateDefinition | undefined;
    list(): QualityGateDefinition[];
    resolve(selectedGateIds?: string[]): QualityGateDefinition[];
}
export declare const createDefaultGateRegistry: () => GateRegistry;
//# sourceMappingURL=gate-registry.d.ts.map