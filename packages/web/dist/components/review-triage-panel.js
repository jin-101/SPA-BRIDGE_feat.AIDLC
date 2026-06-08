import { renderSectionsToHtml, renderSectionsToText } from '../rendering/safe-content-renderer.js';
import { createKeyValueRow, createSectionModel } from '../rendering/safe-content-renderer.js';
export const buildReviewTriagePanel = (state) => {
    const sections = [...state.triage.reviewItems, ...state.triage.reviewGroups];
    const visibleSections = sections.length > 0
        ? sections
        : [
            createSectionModel('review-empty', 'No Manual Review Items', [
                createKeyValueRow('Status', 'No manual review items were reported for this conversion.'),
            ]),
        ];
    return {
        name: 'review-triage-panel',
        title: 'Manual Review Triage',
        html: renderSectionsToHtml(visibleSections),
        text: renderSectionsToText(visibleSections),
        sections: visibleSections,
        access: state.triage.access,
        navigation: state.triage.navigation,
        layout: state.triage.layout,
    };
};
//# sourceMappingURL=review-triage-panel.js.map