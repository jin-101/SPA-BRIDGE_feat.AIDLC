import { createSafeDisplayString } from '@spa-bridge/core-model';
import { createKeyValueRow, createSectionModel } from '../rendering/safe-content-renderer.js';
const severityOrder = {
    critical: 0,
    blocking: 1,
    warning: 2,
    info: 3,
};
const compareReviewItems = (left, right) => (severityOrder[left.severity] ?? 99) - (severityOrder[right.severity] ?? 99) ||
    (left.category ?? '').localeCompare(right.category ?? '') ||
    left.id.localeCompare(right.id);
const sectionFromItems = (id, title, rows) => createSectionModel(id, title, rows.map(([label, value]) => createKeyValueRow(label, value)));
export const buildReviewTriageViewModel = (report, access) => {
    const sortedItems = [...report.manualReview.items].sort(compareReviewItems);
    const sortedGroups = [...report.manualReview.groups].sort((left, right) => left.severity.localeCompare(right.severity) || left.id.localeCompare(right.id));
    const reviewItems = sortedItems.map((item) => createSectionModel(`review-item-${item.id}`, item.id, [
        createKeyValueRow('Severity', item.severity),
        createKeyValueRow('Category', item.category),
        createKeyValueRow('Reason', item.reasonCode),
        createKeyValueRow('Summary', item.safeSummary),
        createKeyValueRow('Remediation Hint', item.remediationHint ?? 'n/a'),
        createKeyValueRow('Source Ref', item.sourceRef ? `${item.sourceRef.kind}:${item.sourceRef.path}` : 'n/a'),
        createKeyValueRow('Generated Ref', item.generatedRef ? `${item.generatedRef.kind}:${item.generatedRef.path}` : 'n/a'),
    ]));
    const reviewGroups = sortedGroups.map((group) => sectionFromItems(`review-group-${group.id}`, group.id, [
        ['Severity', group.severity],
        ['Category', group.reviewCategory ?? 'manual-review'],
        ['Item Count', String(group.itemIds.length)],
        ['Items', group.itemIds.join(', ') || 'none'],
        ['Source Ref', group.sourceRef ? `${group.sourceRef.kind}:${group.sourceRef.path}` : 'n/a'],
        ['Generated Ref', group.generatedRef ? `${group.generatedRef.kind}:${group.generatedRef.path}` : 'n/a'],
        ['Story Area', group.storyArea ?? 'n/a'],
    ]));
    return {
        blockedCount: report.manualReview.blockingCount,
        reviewItems,
        reviewGroups,
        access,
        navigation: {
            route: '/review/triage',
            activeTab: 'triage',
            breadcrumb: ['review', createSafeDisplayString('triage')],
            query: {},
        },
        layout: {
            mode: 'standard',
            columns: 2,
            showSidebar: true,
            showDetailPane: true,
        },
    };
};
//# sourceMappingURL=review-triage-view-model-builder.js.map