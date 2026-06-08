import type { AiDecision, CanonicalConversionReport, ManualReviewItem, ReportDiagnostic, ReportExportMetadata, ReportGroup, ReportMetadata, ReportInputBundle, ReportQualitySection, ReportTraceabilitySection } from '../types.js';
type ReportInputBundleWithPartial = Omit<ReportInputBundle, 'metadata'> & {
    metadata: ReportInputBundle['metadata'] & {
        partial?: boolean;
    };
};
export type CanonicalReportBuildInput = {
    reportId?: string;
    inputBundle: ReportInputBundleWithPartial;
    metadata: ReportMetadata;
    diagnostics: ReportDiagnostic[];
    aiDecisions: AiDecision[];
    manualReviewItems: ManualReviewItem[];
    manualReviewGroups: ReportGroup[];
    quality: ReportQualitySection;
    traceability: ReportTraceabilitySection;
    exportMetadata: ReportExportMetadata;
};
export declare const buildCanonicalConversionReport: (input: CanonicalReportBuildInput) => CanonicalConversionReport;
export {};
//# sourceMappingURL=canonical-report-builder.d.ts.map