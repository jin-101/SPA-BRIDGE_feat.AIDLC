import type { CanonicalConversionReport, ReportViewModel } from '@spa-bridge/core-reporting';
import type { WebAccessState, WebSectionModel } from '../types.js';
export declare const buildWebReportViewModel: (report: CanonicalConversionReport) => ReportViewModel;
export declare const buildReportBrowserSections: (reportViewModel: ReportViewModel) => WebSectionModel[];
export declare const buildReportHeaderRows: (report: CanonicalConversionReport) => WebSectionModel[];
export declare const buildReportSecurityRows: (report: CanonicalConversionReport) => WebSectionModel[];
export declare const buildReportBrowserSectionsWithSecurity: (report: CanonicalConversionReport, access: WebAccessState) => WebSectionModel[];
export declare const safeReportTitle: (report: CanonicalConversionReport) => string;
export declare const safeReportSubtitle: (report: CanonicalConversionReport) => string;
export declare const safeReportSummary: (report: CanonicalConversionReport) => string;
//# sourceMappingURL=report-view-model-builder.d.ts.map