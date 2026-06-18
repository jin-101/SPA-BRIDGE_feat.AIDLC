import type { GeneratedTargetAiRepairRequest, GeneratedTargetValidationDiagnostic } from '../types.js';

export class AiRepairBoundary {
  prepare(input: {
    runId: string;
    diagnostics: GeneratedTargetValidationDiagnostic[];
    allowExternalProvider?: boolean;
    allowLocalProvider?: boolean;
  }): GeneratedTargetAiRepairRequest[] {
    const blocking = input.diagnostics.filter((diagnostic) => diagnostic.severity === 'blocking' || diagnostic.severity === 'manual-review');
    if (blocking.length === 0) return [];

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
        safeContextRefs: [...new Set(blocking.flatMap((diagnostic) => [diagnostic.safeRef].filter(Boolean) as string[]))].sort(),
        policyStatus: providerMode === 'external-disabled' ? 'disabled' : 'allowed',
      },
    ];
  }
}
