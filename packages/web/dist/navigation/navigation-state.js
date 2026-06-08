import { createSafeDisplayString } from '@spa-bridge/core-model';
const routeByTab = {
    dashboard: '/review',
    reports: '/review/reports',
    triage: '/review/triage',
    quality: '/review/quality',
    security: '/review/security',
};
const tabByRoute = (route) => {
    if (!route) {
        return undefined;
    }
    if (route.includes('/security'))
        return 'security';
    if (route.includes('/quality'))
        return 'quality';
    if (route.includes('/triage'))
        return 'triage';
    if (route.includes('/reports'))
        return 'reports';
    if (route.includes('/review'))
        return 'dashboard';
    return undefined;
};
export const resolveNavigationState = (input) => {
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
export const routeFromTab = (tab) => routeByTab[tab];
//# sourceMappingURL=navigation-state.js.map