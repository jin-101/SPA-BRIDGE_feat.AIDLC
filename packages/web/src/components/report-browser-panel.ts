import { renderSectionsToHtml, renderSectionsToText } from '../rendering/safe-content-renderer.js';
import type { WebComponentRenderModel, WebReviewState } from '../types.js';

export const buildReportBrowserPanel = (state: WebReviewState): WebComponentRenderModel => ({
  name: 'report-browser-panel',
  title: state.reportBrowser.reportViewModel.reportId,
  html: renderSectionsToHtml(state.reportBrowser.sections),
  text: renderSectionsToText(state.reportBrowser.sections),
  sections: state.reportBrowser.sections,
  access: state.reportBrowser.access,
  navigation: state.reportBrowser.navigation,
  layout: state.reportBrowser.layout,
});
