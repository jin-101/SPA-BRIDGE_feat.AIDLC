import type { CanonicalConversionReport, ReportExportMetadata } from '../types.js';
export type ReportExportArtifact = {
    json: string;
    markdown?: string;
    html?: string;
};
export declare const buildReportExportMetadata: (report: CanonicalConversionReport, exports: ReportExportArtifact, rendererVersion: string, exportedAt: string) => ReportExportMetadata;
//# sourceMappingURL=report-export-metadata-builder.d.ts.map