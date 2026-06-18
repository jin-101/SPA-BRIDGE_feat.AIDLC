import type { GeneratedTargetValidationResult } from '../types.js';
export declare class ValidationResultClassifier {
    classify(input: {
        commandId: string;
        kind: GeneratedTargetValidationResult['kind'];
        safeOutputSummary: string;
        exitCode?: number;
        durationMs?: number;
    }): GeneratedTargetValidationResult;
    private diagnostic;
    private sanitize;
    private fixerIdsFor;
}
//# sourceMappingURL=validation-result-classifier.d.ts.map