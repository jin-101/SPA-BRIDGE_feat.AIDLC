import type { ManualReviewItem, ReportDiagnostic, ReportGroup } from '../types.js';
export declare const compareDiagnostics: (left: ReportDiagnostic, right: ReportDiagnostic) => number;
export declare const compareManualReviewItems: (left: ManualReviewItem, right: ManualReviewItem) => number;
export declare const buildManualReviewGroups: (items: ManualReviewItem[]) => ReportGroup[];
export declare const sortDiagnostics: (diagnostics: ReportDiagnostic[]) => ReportDiagnostic[];
//# sourceMappingURL=report-grouping-service.d.ts.map