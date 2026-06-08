import { renderSectionsToHtml, renderSectionsToText } from '../rendering/safe-content-renderer.js';
import type { WebComponentRenderModel, WebReviewState } from '../types.js';

export const buildWebReviewDashboardComponent = (state: WebReviewState): WebComponentRenderModel => ({
  name: 'web-review-dashboard',
  title: state.dashboard.title,
  html: renderSectionsToHtml([...state.dashboard.summaryCards, ...state.dashboard.sections]),
  text: renderSectionsToText([...state.dashboard.summaryCards, ...state.dashboard.sections]),
  sections: [...state.dashboard.summaryCards, ...state.dashboard.sections],
  access: state.access,
  navigation: state.navigation,
  layout: state.layout,
});
