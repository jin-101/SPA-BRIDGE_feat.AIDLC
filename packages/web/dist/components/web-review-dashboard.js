import { renderSectionsToHtml, renderSectionsToText } from '../rendering/safe-content-renderer.js';
export const buildWebReviewDashboardComponent = (state) => ({
    name: 'web-review-dashboard',
    title: state.dashboard.title,
    html: renderSectionsToHtml([...state.dashboard.summaryCards, ...state.dashboard.sections]),
    text: renderSectionsToText([...state.dashboard.summaryCards, ...state.dashboard.sections]),
    sections: [...state.dashboard.summaryCards, ...state.dashboard.sections],
    access: state.access,
    navigation: state.navigation,
    layout: state.layout,
});
//# sourceMappingURL=web-review-dashboard.js.map