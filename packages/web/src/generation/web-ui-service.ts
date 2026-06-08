import { ok, err, type Result } from '@spa-bridge/core-model';

import type { WebComponentRenderModel, WebReviewInput, WebReviewState, WebRenderDocument } from '../types.js';
import { createWebUiError, type WebUiError } from '../shared-errors.js';
import { buildWebReviewState } from '../state/web-state-adapter.js';
import { buildWebReviewDashboardComponent } from '../components/web-review-dashboard.js';
import { buildReportBrowserPanel } from '../components/report-browser-panel.js';
import { buildReviewTriagePanel } from '../components/review-triage-panel.js';

export type WebUiGenerationResult = {
  state: WebReviewState;
  renderDocument: WebRenderDocument;
  panels: WebComponentRenderModel[];
};

const renderDocumentFromPanels = (panels: WebComponentRenderModel[], state: WebReviewState): WebRenderDocument => ({
  title: state.dashboard.title,
  description: state.dashboard.subtitle,
  html: panels.map((panel) => panel.html).join(''),
  text: panels.map((panel) => panel.text).join('\n\n'),
  sections: panels.flatMap((panel) => panel.sections),
  access: state.access,
  navigation: state.navigation,
  layout: state.layout,
});

export const generateWebUiReviewWorkflow = (
  input: WebReviewInput,
): Result<WebUiGenerationResult, WebUiError> => {
  const stateResult = buildWebReviewState(input);
  if (!stateResult.ok) {
    return stateResult;
  }

  const state = stateResult.value;
  const panels = [
    buildWebReviewDashboardComponent(state),
    buildReportBrowserPanel(state),
    buildReviewTriagePanel(state),
  ];

  return ok({
    state,
    panels,
    renderDocument: renderDocumentFromPanels(panels, state),
  });
};

export const createRenderDocument = (state: WebReviewState, panels: WebComponentRenderModel[]): WebRenderDocument =>
  renderDocumentFromPanels(panels, state);

export const createWebReviewFailure = (message: string, detail?: string): WebUiError =>
  createWebUiError('INVALID_INPUT', message, detail);
