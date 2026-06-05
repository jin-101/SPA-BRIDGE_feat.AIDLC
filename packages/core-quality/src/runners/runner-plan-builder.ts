import type { QualityGateDefinition, QualityRequest, RunnerPlanEntry } from '../types.js';

export class RunnerPlanBuilder {
  build(request: QualityRequest, gates: QualityGateDefinition[]): RunnerPlanEntry[] {
    return [...gates]
      .sort((left, right) => left.order - right.order || left.gateId.localeCompare(right.gateId))
      .map((gate) => ({
        gateId: gate.gateId,
        blocking: gate.blocking,
        request: {
          toolKind: gate.kind,
          commandRef: gate.toolRef,
          args: [gate.gateId, gate.displayName],
          workspaceRoot: request.workspaceRoot,
          seed: request.seed,
        },
      }));
  }
}

