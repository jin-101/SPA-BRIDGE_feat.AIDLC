import type { GeneratedTargetAiRepairRequest, GeneratedTargetValidationDiagnostic } from '../types.js';
export declare class AiRepairBoundary {
    prepare(input: {
        runId: string;
        diagnostics: GeneratedTargetValidationDiagnostic[];
        allowExternalProvider?: boolean;
        allowLocalProvider?: boolean;
    }): GeneratedTargetAiRepairRequest[];
}
//# sourceMappingURL=ai-repair-boundary.d.ts.map