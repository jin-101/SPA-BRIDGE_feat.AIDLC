import { renderSectionsToHtml, renderSectionsToText } from '../rendering/safe-content-renderer.js';
import type { WebComponentRenderModel, WebReviewState } from '../types.js';

export const buildReviewTriagePanel = (state: WebReviewState): WebComponentRenderModel => ({
  name: 'review-triage-panel',
  title: 'Manual Review Triage',
  html: renderSectionsToHtml([...state.triage.reviewItems, ...state.triage.reviewGroups]),
  text: renderSectionsToText([...state.triage.reviewItems, ...state.triage.reviewGroups]),
  sections: [...state.triage.reviewItems, ...state.triage.reviewGroups],
  access: state.triage.access,
  navigation: state.triage.navigation,
  layout: state.triage.layout,
});
