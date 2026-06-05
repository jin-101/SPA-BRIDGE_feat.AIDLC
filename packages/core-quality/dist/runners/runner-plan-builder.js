export class RunnerPlanBuilder {
    build(request, gates) {
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
//# sourceMappingURL=runner-plan-builder.js.map