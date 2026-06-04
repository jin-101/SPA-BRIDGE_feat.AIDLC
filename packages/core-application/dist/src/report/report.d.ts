import { type ConversionReport, type DiagnosticsCollection, type ReportExporterPort, type ReportFormat, type Result, type TraceabilityMap } from '@spa-bridge/core-model';
import type { ApplicationError } from '../types.js';
import type { RunWorkspaceManifest } from '../run/run.js';
export type ReportSnapshotInput = {
    manifest: RunWorkspaceManifest;
    diagnostics: DiagnosticsCollection;
    traceabilityMap: TraceabilityMap;
    convertedFiles?: Array<{
        sourcePath: string;
        outputPath: string;
        status: 'generated' | 'updated' | 'unchanged' | 'skipped';
    }>;
    qualityResults?: ConversionReport['qualityResults'];
    aiDecisionRecords?: ConversionReport['aiDecisionRecords'];
    securityEvents?: ConversionReport['securityEvents'];
    manualReviewItems?: ConversionReport['manualReviewItems'];
};
export declare class ReportHandoff {
    private readonly exporter;
    constructor(exporter: ReportExporterPort);
    buildSnapshot(input: ReportSnapshotInput): ConversionReport;
    export(report: ConversionReport, format: ReportFormat): Promise<Result<string, ApplicationError>>;
}
//# sourceMappingURL=report.d.ts.map