import fc from 'fast-check';
import type { AiDecision, CanonicalConversionReport, ManualReviewItem, ReportDiagnostic, ReportGenerationRequest, ReportInputBundle, ReportMetadata, ReportQualitySection, ReportTraceLink, ReportTraceabilitySection, ReportViewModel } from '../types.js';
export declare const safeSourceRefArbitrary: fc.Arbitrary<{
    kind: "source";
    path: string;
    symbol: string | undefined;
    location: string | undefined;
}>;
export declare const safeGeneratedArtifactRefArbitrary: fc.Arbitrary<{
    kind: "generated";
    path: string;
    segment: string | undefined;
}>;
export declare const reportTraceLinkArbitrary: fc.Arbitrary<ReportTraceLink>;
export declare const reportDiagnosticArbitrary: fc.Arbitrary<ReportDiagnostic>;
export declare const manualReviewItemArbitrary: fc.Arbitrary<ManualReviewItem>;
export declare const aiDecisionArbitrary: fc.Arbitrary<AiDecision>;
export declare const reportMetadataArbitrary: fc.Arbitrary<ReportMetadata>;
export declare const reportInputMetadataArbitrary: fc.Arbitrary<{
    runId: string;
    correlationId: string;
    projectLabel: string;
    sourceFramework: string;
    targetFramework: string;
    generatedAt: string;
}>;
export declare const reportQualitySectionArbitrary: fc.Arbitrary<ReportQualitySection>;
export declare const reportTraceabilitySectionArbitrary: fc.Arbitrary<ReportTraceabilitySection>;
export declare const reportInputBundleArbitrary: fc.Arbitrary<ReportInputBundle>;
export declare const reportGenerationRequestArbitrary: fc.Arbitrary<ReportGenerationRequest>;
export declare const canonicalConversionReportArbitrary: fc.Arbitrary<CanonicalConversionReport>;
export declare const reportViewModelArbitrary: fc.Arbitrary<ReportViewModel>;
//# sourceMappingURL=generators.d.ts.map