export class AiRepairBoundary {
    prepare(input) {
        const blocking = input.diagnostics.filter((diagnostic) => diagnostic.severity === 'blocking' || diagnostic.severity === 'manual-review');
        if (blocking.length === 0)
            return [];
        const providerMode = input.allowLocalProvider === false
            ? input.allowExternalProvider
                ? 'external-policy-approved'
                : 'external-disabled'
            : 'local-ollama';
        return [
            {
                requestId: `ai-repair-${input.runId}-1`,
                providerMode,
                modelHint: providerMode === 'local-ollama' ? 'exaone3.5' : 'external-policy-controlled',
                diagnosticIds: blocking.map((diagnostic) => diagnostic.id).sort(),
                safeContextRefs: [...new Set(blocking.flatMap((diagnostic) => [diagnostic.safeRef].filter(Boolean)))].sort(),
                policyStatus: providerMode === 'external-disabled' ? 'disabled' : 'allowed',
            },
        ];
    }
}
//# sourceMappingURL=ai-repair-boundary.js.map