import type { QualityGateDefinition, QualityRequest } from '../types.js';
import type { GateRegistry } from './gate-registry.js';

export class GateSelectionPolicy {
  select(request: QualityRequest, registry: GateRegistry): QualityGateDefinition[] {
    return registry.resolve(request.selectedGateIds);
  }
}

