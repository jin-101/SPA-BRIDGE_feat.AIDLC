import { type Diagnostic, type ManualReviewItem } from '@spa-bridge/core-model';
export type SafeReviewDiagnosticInput = {
    category: 'template' | 'lifecycle' | 'di' | 'route' | 'state' | 'form' | 'unknown';
    ruleId: string;
    message: string;
    sourcePaths?: string[];
    generatedPaths?: string[];
    remediationHint?: string;
};
export declare class SafeReviewDiagnosticBuilder {
    private readonly ids;
    build(input: SafeReviewDiagnosticInput): {
        diagnostic: Diagnostic;
        reviewItem: ManualReviewItem;
    };
}
//# sourceMappingURL=safe-review-diagnostic-builder.d.ts.map