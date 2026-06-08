import type { CanonicalConversionReport } from '@spa-bridge/core-reporting';
import type { QualityRunSummary } from '@spa-bridge/core-quality';
import { err, type Result } from '@spa-bridge/core-model';

import { buildAccessGateState } from '../access/role-hook.js';
import { resolveResponsiveLayout } from '../layout/responsive-layout.js';
import { resolveNavigationState } from '../navigation/navigation-state.js';
import { buildDashboardViewModel } from './dashboard-view-model-builder.js';
import { buildReportBrowserSectionsWithSecurity, buildWebReportViewModel, safeReportSummary } from './report-view-model-builder.js';
import { buildReviewTriageViewModel } from './review-triage-view-model-builder.js';
import type {
  WebReviewInput,
  WebReviewState,
  WebAccessState,
} from '../types.js';
import { createWebUiError, type WebUiError } from '../shared-errors.js';
import { renderSafeText } from '../rendering/safe-content-renderer.js';

const deriveQualitySummary = (report: CanonicalConversionReport): QualityRunSummary => ({
  runId: report.metadata.runId,
  overallStatus: report.quality.gateStatus === 'blocked' ? 'blocked' : report.quality.targetMet ? 'passed' : 'partial',
  totalGates: report.quality.gateRuns.length,
  passedGates: report.quality.gateRuns.filter((gateRun) => gateRun.status === 'passed').length,
  failedGates: report.quality.gateRuns.filter((gateRun) => gateRun.status === 'failed').length,
  blockedGates: report.quality.gateRuns.filter((gateRun) => gateRun.status === 'blocked').length,
  manualReviewCount: report.manualReview.items.length,
  seed: undefined,
  retryCount: report.quality.correctionAttempts,
  durationMs: report.quality.gateRuns.reduce((sum, gateRun) => sum + gateRun.durationMs, 0),
  gateOrder: report.quality.gateRuns.map((gateRun) => gateRun.gateId),
});

export const buildWebReviewState = (input: WebReviewInput): Result<WebReviewState, WebUiError> => {
  const accessResult = buildAccessGateState({
    role: input.role,
    policyKnown: input.policyKnown,
    explicitGrant: input.explicitGrant,
    renderSafe: input.renderSafe,
    requestedScope: input.requestedScope,
    grantedScopes: input.grantedScopes,
  });

  if (!accessResult.ok) {
    return err(accessResult.error);
  }

  const reportViewModel = buildWebReportViewModel(input.report);
  const qualitySummary = deriveQualitySummary(input.report);
  const layout = resolveResponsiveLayout(input.viewportWidth);
  const navigation = resolveNavigationState({
    activeTab: input.activeTab,
    query: input.query,
    reportId: input.report.reportId,
  });

  const dashboard = buildDashboardViewModel(input.report, qualitySummary, accessResult.value, navigation, layout);
  const reportBrowser = {
    reportViewModel,
    sections: buildReportBrowserSectionsWithSecurity(input.report, accessResult.value),
    access: accessResult.value,
    navigation,
    layout,
  };
  const triage = buildReviewTriageViewModel(input.report, accessResult.value);

  const safeSummaryText = safeReportSummary(input.report);
  const safeSummary = renderSafeText(safeSummaryText);

  return {
    ok: true,
    value: {
      report: input.report,
      qualitySummary,
      access: accessResult.value,
      navigation,
      layout,
      dashboard,
      reportBrowser,
      triage,
      safeSummary,
      diagnostics: input.report.diagnostics,
      manualReviewItems: input.report.manualReview.items,
      manualReviewGroups: input.report.manualReview.groups,
    },
  };
};

export const createWebReviewStateOrThrow = (input: WebReviewInput): WebReviewState => {
  const result = buildWebReviewState(input);
  if (!result.ok) {
    throw new Error(result.error.message);
  }
  return result.value;
};

export const buildWebReviewAccess = (input: WebReviewInput): Result<WebAccessState, WebUiError> =>
  buildAccessGateState({
    role: input.role,
    policyKnown: input.policyKnown,
    explicitGrant: input.explicitGrant,
    renderSafe: input.renderSafe,
    requestedScope: input.requestedScope,
    grantedScopes: input.grantedScopes,
  });
