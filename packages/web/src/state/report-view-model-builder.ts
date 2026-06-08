import type { CanonicalConversionReport, ReportViewModel } from '@spa-bridge/core-reporting';
import { buildReportViewModel } from '@spa-bridge/core-reporting';
import { createSafeDisplayString } from '@spa-bridge/core-model';

import { createKeyValueRow, createSectionModel, renderSafeText } from '../rendering/safe-content-renderer.js';
import type { WebAccessState, WebSectionModel } from '../types.js';

const toRow = (record: Record<string, string>) => {
  const entries = Object.entries(record);
  const [label = 'value', value = ''] = entries[0] ?? [];
  return createKeyValueRow(label, value);
};

const sectionFromRows = (id: string, title: string, rows: Array<Record<string, string>>, detail?: string): WebSectionModel =>
  createSectionModel(id, title, rows.map(toRow), detail);

const sectionFromViewModel = (id: string, title: string, rows: Array<Record<string, string>>): WebSectionModel =>
  sectionFromRows(id, title, rows);

export const buildWebReportViewModel = (report: CanonicalConversionReport): ReportViewModel => buildReportViewModel(report);

export const buildReportBrowserSections = (reportViewModel: ReportViewModel): WebSectionModel[] => [
  sectionFromViewModel('source-inventory', 'Source Inventory', reportViewModel.sections.sourceInventory),
  sectionFromViewModel('conversion-output', 'Conversion Output', reportViewModel.sections.conversionOutput),
  sectionFromViewModel('diagnostics', 'Diagnostics', reportViewModel.sections.diagnostics),
  sectionFromViewModel('ai-decisions', 'AI Decisions', reportViewModel.sections.aiDecisions),
  sectionFromViewModel('manual-review', 'Manual Review', reportViewModel.sections.manualReview),
  sectionFromViewModel('quality', 'Quality', reportViewModel.sections.quality),
  sectionFromViewModel('traceability', 'Traceability', reportViewModel.sections.traceability),
];

export const buildReportHeaderRows = (report: CanonicalConversionReport): WebSectionModel[] => [
  createSectionModel('report-meta', 'Report Metadata', [
    createKeyValueRow('Report ID', report.reportId),
    createKeyValueRow('Project', report.metadata.projectLabel),
    createKeyValueRow('Source Framework', report.metadata.sourceFramework),
    createKeyValueRow('Target Framework', report.metadata.targetFramework),
    createKeyValueRow('Generated At', report.metadata.generatedAt),
    createKeyValueRow('Partial', report.metadata.partial ? 'true' : 'false'),
  ]),
  createSectionModel('export-meta', 'Export Metadata', [
    createKeyValueRow('Renderer Version', report.exportMetadata.rendererVersion),
    createKeyValueRow('Canonical Ref', report.exportMetadata.canonicalReportRef),
    createKeyValueRow('Partial', report.exportMetadata.partial ? 'true' : 'false'),
    createKeyValueRow('Formats', report.exportMetadata.formats.join(', ') || 'none'),
  ]),
];

export const buildReportSecurityRows = (report: CanonicalConversionReport): WebSectionModel[] => [
  createSectionModel('report-safety', 'Safe Display Summary', [
    createKeyValueRow('Diagnostics Count', String(report.diagnostics.length)),
    createKeyValueRow('Manual Review Count', String(report.manualReview.items.length)),
    createKeyValueRow('Blocking Count', String(report.manualReview.blockingCount)),
    createKeyValueRow('Quality Target', `${report.quality.targetPercent}%`),
    createKeyValueRow('Target Met', report.quality.targetMet ? 'true' : 'false'),
  ]),
];

export const buildReportBrowserSectionsWithSecurity = (
  report: CanonicalConversionReport,
  access: WebAccessState,
): WebSectionModel[] => [
  ...buildReportHeaderRows(report),
  ...buildReportBrowserSections(buildWebReportViewModel(report)),
  ...buildReportSecurityRows(report),
  createSectionModel('access', 'Access', [
    createKeyValueRow('Role', access.role),
    createKeyValueRow('Decision', access.decision.decision),
    createKeyValueRow('Reason', access.decision.reason),
    createKeyValueRow('Render Safe', access.decision.renderSafe ? 'true' : 'false'),
    createKeyValueRow('Allowed Tabs', access.allowedTabs.join(', ') || 'none'),
    createKeyValueRow('Allowed Actions', access.allowedActions.join(', ') || 'none'),
  ]),
];

export const safeReportTitle = (report: CanonicalConversionReport): string =>
  createSafeDisplayString(`${report.metadata.projectLabel} Review`);

export const safeReportSubtitle = (report: CanonicalConversionReport): string =>
  createSafeDisplayString(`${report.conversionOutput.convertedArtifactCount}/${report.conversionOutput.totalCandidateArtifactCount} artifacts converted`);

export const safeReportSummary = (report: CanonicalConversionReport): string =>
  renderSafeText(`${report.quality.gateStatus} :: ${report.manualReview.blockingCount} manual-review items`).text;
