import type { WebNavigationState, WebReviewTab, WebRoutePath } from '../types.js';
export declare const resolveNavigationState: (input: {
    activeTab?: WebReviewTab;
    requestedRoute?: string;
    query?: Record<string, string>;
    reportId?: string;
    reviewItemId?: string;
}) => WebNavigationState;
export declare const routeFromTab: (tab: WebReviewTab) => WebRoutePath;
//# sourceMappingURL=navigation-state.d.ts.map