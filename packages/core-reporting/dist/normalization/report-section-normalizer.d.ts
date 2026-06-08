import type { AiDecision, ManualReviewItem, ReportDiagnostic, ReportInputBundle, ReportQualitySection, ReportTraceLink } from '../types.js';
export declare const normalizeDiagnostics: (diagnostics: ReportDiagnostic[]) => ReportDiagnostic[];
export declare const normalizeManualReviewItems: (items: ManualReviewItem[]) => ManualReviewItem[];
export declare const normalizeAiDecisions: (items: AiDecision[]) => AiDecision[];
export declare const normalizeTraceLinks: (links: ReportTraceLink[]) => ReportTraceLink[];
export declare const normalizeQualitySection: (quality: ReportQualitySection, targetPercent: number) => ReportQualitySection;
export declare const normalizeReportInputBundle: (bundle: ReportInputBundle, targetPercent?: number) => ReportInputBundle;
//# sourceMappingURL=report-section-normalizer.d.ts.map