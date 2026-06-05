export class GateSelectionPolicy {
    select(request, registry) {
        return registry.resolve(request.selectedGateIds);
    }
}
//# sourceMappingURL=gate-selection-policy.js.map