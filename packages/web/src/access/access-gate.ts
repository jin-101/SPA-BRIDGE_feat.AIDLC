import type { WebAccessState, WebReviewTab } from '../types.js';

export const isTabVisible = (access: WebAccessState, tab: WebReviewTab): boolean => access.allowedTabs.includes(tab);

export const isActionAllowed = (access: WebAccessState, actionId: string): boolean => access.allowedActions.includes(actionId);

export const hasReviewAccess = (access: WebAccessState): boolean => access.decision.decision === 'allow';
