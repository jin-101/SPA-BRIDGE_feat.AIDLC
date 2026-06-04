import { err, ok, } from '@spa-bridge/core-model';
export class ReportHandoff {
    exporter;
    constructor(exporter) {
        this.exporter = exporter;
    }
    buildSnapshot(input) {
        const convertedFiles = input.convertedFiles ?? [];
        const diagnosticsCount = input.diagnostics.diagnostics.length;
        const finishedAt = input.manifest.status === 'completed' || input.manifest.status === 'failed'
            ? input.manifest.updatedAt
            : undefined;
        const manifest = input.manifest.status === 'cancelled'
            ? { ...input.manifest, status: 'failed' }
            : input.manifest;
        return {
            schemaVersion: 1,
            runManifest: manifest,
            runSummary: {
                startedAt: manifest.startedAt,
                finishedAt,
                status: manifest.status,
                totalConvertedFiles: convertedFiles.length,
                totalDiagnostics: diagnosticsCount,
            },
            convertedFiles,
            diagnostics: input.diagnostics,
            qualityResults: input.qualityResults ?? [],
            traceabilityMap: input.traceabilityMap,
            aiDecisionRecords: input.aiDecisionRecords ?? [],
            securityEvents: input.securityEvents ?? [],
            manualReviewItems: input.manualReviewItems ?? manifest.manualReviewItems,
        };
    }
    async export(report, format) {
        const exported = await this.exporter.exportReport(report, format);
        if (!exported.ok) {
            return err({
                code: 'PORT_ERROR',
                message: exported.error.message,
                cause: exported.error,
            });
        }
        return ok(exported.value);
    }
}
//# sourceMappingURL=report.js.map