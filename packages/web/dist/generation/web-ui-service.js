import { ok } from '@spa-bridge/core-model';
import { createWebUiError } from '../shared-errors.js';
import { buildWebReviewState } from '../state/web-state-adapter.js';
import { buildWebReviewDashboardComponent } from '../components/web-review-dashboard.js';
import { buildReportBrowserPanel } from '../components/report-browser-panel.js';
import { buildReviewTriagePanel } from '../components/review-triage-panel.js';
const renderDocumentFromPanels = (panels, state) => ({
    title: state.dashboard.title,
    description: state.dashboard.subtitle,
    html: panels.map((panel) => panel.html).join(''),
    text: panels.map((panel) => panel.text).join('\n\n'),
    sections: panels.flatMap((panel) => panel.sections),
    access: state.access,
    navigation: state.navigation,
    layout: state.layout,
});
export const generateWebUiReviewWorkflow = (input) => {
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
export const createRenderDocument = (state, panels) => renderDocumentFromPanels(panels, state);
export const createWebReviewFailure = (message, detail) => createWebUiError('INVALID_INPUT', message, detail);
//# sourceMappingURL=web-ui-service.js.map