import type { QualityGateDefinition, QualityRequest } from '../types.js';
import type { GateRegistry } from './gate-registry.js';
export declare class GateSelectionPolicy {
    select(request: QualityRequest, registry: GateRegistry): QualityGateDefinition[];
}
//# sourceMappingURL=gate-selection-policy.d.ts.map