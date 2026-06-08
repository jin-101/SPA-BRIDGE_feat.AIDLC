import fc from 'fast-check';
import type { WebReviewInput, WebRemediationRequest, WebReviewRole, WebReviewTab } from '../types.js';
export declare const webReviewRoleArbitrary: fc.Arbitrary<WebReviewRole>;
export declare const webReviewTabArbitrary: fc.Arbitrary<WebReviewTab>;
export declare const webReviewInputArbitrary: fc.Arbitrary<WebReviewInput>;
export declare const remediationRequestArbitrary: fc.Arbitrary<WebRemediationRequest>;
export declare const reportDiagnosticListArbitrary: fc.Arbitrary<{
    id: string;
    severity: "critical" | "blocking" | "warning" | "info";
    reasonCode: string;
    safeMessage: string;
    sourceRef?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | undefined;
    generatedRef?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    } | undefined;
    storyArea?: string | undefined;
    reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
}[]>;
export declare const manualReviewItemListArbitrary: fc.Arbitrary<{
    id: string;
    severity: "critical" | "blocking" | "warning" | "info";
    reasonCode: string;
    category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
    safeSummary: string;
    sourceRef?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | undefined;
    generatedRef?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    } | undefined;
    storyArea?: string | undefined;
    remediationHint?: string | undefined;
}[]>;
//# sourceMappingURL=generators.d.ts.map