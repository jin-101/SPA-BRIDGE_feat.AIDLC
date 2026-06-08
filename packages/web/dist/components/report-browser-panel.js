import { renderSectionsToHtml, renderSectionsToText } from '../rendering/safe-content-renderer.js';
export const buildReportBrowserPanel = (state) => ({
    name: 'report-browser-panel',
    title: state.reportBrowser.reportViewModel.reportId,
    html: renderSectionsToHtml(state.reportBrowser.sections),
    text: renderSectionsToText(state.reportBrowser.sections),
    sections: state.reportBrowser.sections,
    access: state.reportBrowser.access,
    navigation: state.reportBrowser.navigation,
    layout: state.reportBrowser.layout,
});
//# sourceMappingURL=report-browser-panel.js.map