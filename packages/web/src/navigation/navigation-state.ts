import { createSafeDisplayString } from '@spa-bridge/core-model';

import type { WebNavigationState, WebReviewTab, WebRoutePath } from '../types.js';

const routeByTab: Record<WebReviewTab, WebRoutePath> = {
  dashboard: '/review',
  reports: '/review/reports',
  triage: '/review/triage',
  quality: '/review/quality',
  security: '/review/security',
};

const tabByRoute = (route?: string): WebReviewTab | undefined => {
  if (!route) {
    return undefined;
  }

  if (route.includes('/security')) return 'security';
  if (route.includes('/quality')) return 'quality';
  if (route.includes('/triage')) return 'triage';
  if (route.includes('/reports')) return 'reports';
  if (route.includes('/review')) return 'dashboard';
  return undefined;
};

export const resolveNavigationState = (input: {
  activeTab?: WebReviewTab;
  requestedRoute?: string;
  query?: Record<string, string>;
  reportId?: string;
  reviewItemId?: string;
}): WebNavigationState => {
  const derivedTab = input.activeTab ?? tabByRoute(input.requestedRoute) ?? 'dashboard';
  return {
    route: routeByTab[derivedTab],
    activeTab: derivedTab,
    breadcrumb: ['review', derivedTab].map((segment) => createSafeDisplayString(segment)),
    query: {
      ...(input.query ?? {}),
      ...(input.reportId ? { reportId: input.reportId } : {}),
      ...(input.reviewItemId ? { reviewItemId: input.reviewItemId } : {}),
    },
  };
};

export const routeFromTab = (tab: WebReviewTab): WebRoutePath => routeByTab[tab];
