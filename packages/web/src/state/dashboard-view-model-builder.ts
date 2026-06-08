import type { CanonicalConversionReport } from '@spa-bridge/core-reporting';
import type { QualityRunSummary } from '@spa-bridge/core-quality';
import { createSafeDisplayString } from '@spa-bridge/core-model';

import { createKeyValueRow, createSectionModel, renderSafeText } from '../rendering/safe-content-renderer.js';
import type { WebAccessState, WebDashboardViewModel, WebLayoutState, WebNavigationState, WebSectionModel } from '../types.js';

const toCount = (value: number): string => String(value);

const makeSummaryCard = (id: string, title: string, rows: Array<[string, string]>): WebSectionModel =>
  createSectionModel(id, title, rows.map(([label, value]) => createKeyValueRow(label, value)));

const deriveQualityStatus = (report: CanonicalConversionReport, summary: QualityRunSummary): string => {
  const gateStatus = report.quality.gateStatus;
  if (gateStatus === 'blocked') {
    return 'blocked';
  }

  if (summary.overallStatus === 'manual-review') {
    return 'manual-review';
  }

  return report.quality.targetMet ? 'passed' : 'partial';
};

export const buildDashboardViewModel = (
  report: CanonicalConversionReport,
  qualitySummary: QualityRunSummary,
  access: WebAccessState,
  navigation: WebNavigationState,
  layout: WebLayoutState,
): WebDashboardViewModel => {
  const summaryStatus = deriveQualityStatus(report, qualitySummary);
  const totalDiagnostics = report.diagnostics.length;
  const manualReviewCount = report.manualReview.items.length;
  const exportFormats = report.exportMetadata.formats.join(', ') || 'none';

  return {
    title: createSafeDisplayString(`${report.metadata.projectLabel} review dashboard`),
    subtitle: renderSafeText(
      `${summaryStatus} :: ${report.conversionOutput.convertedArtifactCount}/${report.conversionOutput.totalCandidateArtifactCount} converted`,
    ).text,
    summaryCards: [
      makeSummaryCard('dashboard-status', 'Status', [
        ['Gate Status', report.quality.gateStatus],
        ['Quality Status', summaryStatus],
        ['Target Met', report.quality.targetMet ? 'true' : 'false'],
      ]),
      makeSummaryCard('dashboard-conversion', 'Conversion', [
        ['Converted', toCount(report.conversionOutput.convertedArtifactCount)],
        ['Candidate', toCount(report.conversionOutput.totalCandidateArtifactCount)],
        ['Unresolved', toCount(report.conversionOutput.unresolvedCount)],
        ['Formats', exportFormats],
      ]),
      makeSummaryCard('dashboard-review', 'Review', [
        ['Diagnostics', toCount(totalDiagnostics)],
        ['Manual Review Items', toCount(manualReviewCount)],
        ['Blocking Count', toCount(report.manualReview.blockingCount)],
      ]),
      makeSummaryCard('dashboard-quality', 'Quality Summary', [
        ['Summary Run', qualitySummary.runId],
        ['Gate Count', toCount(qualitySummary.totalGates)],
        ['Failed Gates', toCount(qualitySummary.failedGates)],
        ['Blocked Gates', toCount(qualitySummary.blockedGates)],
      ]),
    ],
    sections: [
      createSectionModel('dashboard-meta', 'Metadata', [
        createKeyValueRow('Report ID', report.reportId),
        createKeyValueRow('Project', report.metadata.projectLabel),
        createKeyValueRow('Source Framework', report.metadata.sourceFramework),
        createKeyValueRow('Target Framework', report.metadata.targetFramework),
        createKeyValueRow('Generated At', report.metadata.generatedAt),
      ]),
      createSectionModel('dashboard-access', 'Access', [
        createKeyValueRow('Role', access.role),
        createKeyValueRow('Decision', access.decision.decision),
        createKeyValueRow('Reason', access.decision.reason),
        createKeyValueRow('Allowed Tabs', access.allowedTabs.join(', ') || 'none'),
        createKeyValueRow('Allowed Actions', access.allowedActions.join(', ') || 'none'),
      ]),
      createSectionModel('dashboard-layout', 'Layout', [
        createKeyValueRow('Mode', layout.mode),
        createKeyValueRow('Columns', toCount(layout.columns)),
        createKeyValueRow('Sidebar', layout.showSidebar ? 'visible' : 'hidden'),
        createKeyValueRow('Detail Pane', layout.showDetailPane ? 'visible' : 'hidden'),
      ]),
    ],
    access,
    navigation,
    layout,
  };
};
