import fc from 'fast-check';
import { describe, expect, test } from 'vitest';

import { createSafeDisplayString } from '@spa-bridge/core-model';
import { canonicalConversionReportArbitrary } from '@spa-bridge/core-reporting';

import { buildAccessGateState } from '../src/access/role-hook.js';
import { buildConfirmationDialog, resolveConfirmation } from '../src/actions/confirmation-dialog.js';
import { createRemediationBridge, requestRemediation } from '../src/actions/remediation-bridge.js';
import { buildWebReviewDashboardComponent } from '../src/components/web-review-dashboard.js';
import { buildReportBrowserPanel } from '../src/components/report-browser-panel.js';
import { buildReviewTriagePanel } from '../src/components/review-triage-panel.js';
import { resolveResponsiveLayout } from '../src/layout/responsive-layout.js';
import { resolveNavigationState } from '../src/navigation/navigation-state.js';
import { renderSafeText, renderSectionsToHtml } from '../src/rendering/safe-content-renderer.js';
import { buildDashboardViewModel } from '../src/state/dashboard-view-model-builder.js';
import { buildReportBrowserSectionsWithSecurity } from '../src/state/report-view-model-builder.js';
import { buildReviewTriageViewModel } from '../src/state/review-triage-view-model-builder.js';
import { buildWebReviewState, createWebReviewStateOrThrow } from '../src/state/web-state-adapter.js';
import { generateWebUiReviewWorkflow } from '../src/generation/web-ui-service.js';
import { webReviewInputArbitrary, remediationRequestArbitrary } from '../src/testing/generators.js';

describe('safe content rendering', () => {
  test('escapes html and normalizes whitespace', () => {
    const fragment = renderSafeText('  <script>alert(1)</script>   safe text  ');
    expect(fragment.text).toContain('<script>');
    expect(fragment.html).toContain('&lt;script&gt;');
    expect(fragment.text).toBe(fragment.text.trim());
  });

  test('renders stable html for safe sections', () => {
    const html = renderSectionsToHtml([
      {
        id: 'panel',
        title: 'Panel',
        rows: [{ label: 'Label', value: renderSafeText('Value') }],
      },
    ]);
    expect(html).toContain('<section');
    expect(html).toContain('Panel');
  });
});

describe('access gating', () => {
  test('denies access without an explicit grant', () => {
    const result = buildAccessGateState({
      role: 'viewer',
      policyKnown: true,
      explicitGrant: false,
      renderSafe: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.decision.decision).toBe('deny');
      expect(result.value.allowedTabs).toContain('dashboard');
    }
  });
});

describe('navigation and layout', () => {
  test('navigation resolves routes deterministically', () => {
    expect(resolveNavigationState({ activeTab: 'triage' }).route).toBe('/review/triage');
    expect(resolveNavigationState({ requestedRoute: '/review/quality' }).activeTab).toBe('quality');
  });

  test('layout resolves compact and wide modes', () => {
    expect(resolveResponsiveLayout(360).mode).toBe('compact');
    expect(resolveResponsiveLayout(1440).mode).toBe('wide');
  });
});

describe('web review state', () => {
  test('builds a deterministic state bundle from canonical reports', () => {
    const report = fc.sample(canonicalConversionReportArbitrary, 1)[0];
    const result = buildWebReviewState({
      report,
      role: 'reviewer',
      viewportWidth: 1280,
      policyKnown: true,
      explicitGrant: true,
      renderSafe: true,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.dashboard.title).toContain('review');
      expect(result.value.reportBrowser.sections.length).toBeGreaterThan(0);
      expect(result.value.triage.reviewItems.length).toBeGreaterThanOrEqual(0);
    }
  });

  test('headless component render models compose stable sections', () => {
    const report = fc.sample(canonicalConversionReportArbitrary, 1)[0];
    const state = createWebReviewStateOrThrow({
      report,
      role: 'approver',
      viewportWidth: 1440,
      policyKnown: true,
      explicitGrant: true,
      renderSafe: true,
    });

    const dashboard = buildWebReviewDashboardComponent(state);
    const browser = buildReportBrowserPanel(state);
    const triage = buildReviewTriagePanel(state);

    expect(dashboard.html).toContain('<section');
    expect(browser.text.length).toBeGreaterThan(0);
    expect(triage.sections.length).toBeGreaterThan(0);
  });
});

describe('confirmation and remediation', () => {
  test('confirmation is required before remediation', () => {
    const result = resolveConfirmation({
      actionId: 'rerun-1',
      actionLabel: 'rerun conversion',
      reasonCode: 'UPDATE_REQUIRED',
      summary: 'Rerun is requested',
      confirmed: false,
      targetRoute: '/review',
    });

    expect(result.ok).toBe(false);
  });

  test('remediation bridge accepts confirmed requests', () => {
    const bridge = createRemediationBridge();
    const outcome = bridge.confirm({
      actionId: 'rerun-2',
      actionLabel: 'rerun conversion',
      reasonCode: 'UPDATE_REQUIRED',
      summary: 'Rerun is requested',
      confirmed: true,
      targetRoute: '/review',
    });

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value.accepted).toBe(true);
    }
  });

  test('requestRemediation enforces action ids', () => {
    const result = requestRemediation({
      actionId: ' ',
      actionLabel: 'rerun conversion',
      reasonCode: 'UPDATE_REQUIRED',
      summary: 'Rerun is requested',
      confirmed: true,
      targetRoute: '/review',
    });

    expect(result.ok).toBe(false);
  });
});

describe('state builders', () => {
  test('report browser sections stay stable and safe', () => {
    const report = fc.sample(canonicalConversionReportArbitrary, 1)[0];
    const accessResult = buildAccessGateState({
      role: 'viewer',
      policyKnown: true,
      explicitGrant: true,
      renderSafe: true,
    });

    expect(accessResult.ok).toBe(true);
    if (accessResult.ok) {
      const first = buildReportBrowserSectionsWithSecurity(report, accessResult.value);
      const second = buildReportBrowserSectionsWithSecurity(report, accessResult.value);
      expect(first.map((section) => section.id)).toEqual(second.map((section) => section.id));
    }
  });

  test('triage view model uses stable ordering', () => {
    const report = fc.sample(canonicalConversionReportArbitrary, 1)[0];
    const accessResult = buildAccessGateState({
      role: 'reviewer',
      policyKnown: true,
      explicitGrant: true,
      renderSafe: true,
    });

    expect(accessResult.ok).toBe(true);
    if (accessResult.ok) {
      const first = buildReviewTriageViewModel(report, accessResult.value);
      const second = buildReviewTriageViewModel(report, accessResult.value);
      expect(first.reviewItems.map((section) => section.id)).toEqual(second.reviewItems.map((section) => section.id));
    }
  });

  test('dashboard view model includes safe summary cards', () => {
    const report = fc.sample(canonicalConversionReportArbitrary, 1)[0];
    const accessResult = buildAccessGateState({
      role: 'approver',
      policyKnown: true,
      explicitGrant: true,
      renderSafe: true,
    });
    expect(accessResult.ok).toBe(true);
    if (accessResult.ok) {
      const state = createWebReviewStateOrThrow({
        report,
        role: 'approver',
        viewportWidth: 1440,
        policyKnown: true,
        explicitGrant: true,
        renderSafe: true,
      });
      const dashboard = buildDashboardViewModel(report, state.qualitySummary, accessResult.value, state.navigation, state.layout);
      expect(dashboard.summaryCards.length).toBeGreaterThan(0);
    }
  });
});

describe('property-based invariants', () => {
  test('web review input builds stable state for equivalent inputs', () => {
    fc.assert(
      fc.property(webReviewInputArbitrary, (input) => {
        const first = buildWebReviewState(input);
        const second = buildWebReviewState({ ...input, query: { ...(input.query ?? {}) } });
        expect(first.ok).toBe(second.ok);
        if (first.ok && second.ok) {
          expect(first.value.navigation.route).toBe(second.value.navigation.route);
          expect(first.value.layout.mode).toBe(second.value.layout.mode);
          expect(first.value.dashboard.summaryCards.length).toBe(second.value.dashboard.summaryCards.length);
        }
      }),
    );
  });

  test('rendering stays escaped for arbitrary report content', () => {
    fc.assert(
      fc.property(canonicalConversionReportArbitrary, (report) => {
        const result = buildWebReviewState({
          report,
          role: 'viewer',
          viewportWidth: 1024,
          policyKnown: true,
          explicitGrant: true,
          renderSafe: true,
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.dashboard.title).not.toContain('<script>');
          expect(result.value.reportBrowser.sections.length).toBeGreaterThan(0);
        }
      }),
    );
  });

  test('confirmation flow remains deterministic', () => {
    fc.assert(
      fc.property(remediationRequestArbitrary, (request) => {
        const dialog = buildConfirmationDialog(request);
        expect(dialog.actionId).toBe(createSafeDisplayString(request.actionId));
        const confirmation = resolveConfirmation(request);
        expect(confirmation.ok).toBe(request.confirmed);
      }),
    );
  });
});
