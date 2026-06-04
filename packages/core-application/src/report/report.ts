import {
  err,
  ok,
  type ConversionReport,
  type DiagnosticsCollection,
  type GeneratedArtifactRef,
  type ReportExporterPort,
  type ReportFormat,
  type Result,
  type TraceabilityMap,
} from '@spa-bridge/core-model';

import type { ApplicationError } from '../types.js';
import type { RunWorkspaceManifest } from '../run/run.js';

export type ReportSnapshotInput = {
  manifest: RunWorkspaceManifest;
  diagnostics: DiagnosticsCollection;
  traceabilityMap: TraceabilityMap;
  convertedFiles?: Array<{ sourcePath: string; outputPath: string; status: 'generated' | 'updated' | 'unchanged' | 'skipped' }>;
  qualityResults?: ConversionReport['qualityResults'];
  aiDecisionRecords?: ConversionReport['aiDecisionRecords'];
  securityEvents?: ConversionReport['securityEvents'];
  manualReviewItems?: ConversionReport['manualReviewItems'];
};

export class ReportHandoff {
  constructor(private readonly exporter: ReportExporterPort) {}

  buildSnapshot(input: ReportSnapshotInput): ConversionReport {
    const convertedFiles = input.convertedFiles ?? [];
    const diagnosticsCount = input.diagnostics.diagnostics.length;
    const finishedAt = input.manifest.status === 'completed' || input.manifest.status === 'failed'
      ? input.manifest.updatedAt
      : undefined;
    const manifest = input.manifest;

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

  async export(report: ConversionReport, format: ReportFormat): Promise<Result<string, ApplicationError>> {
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
