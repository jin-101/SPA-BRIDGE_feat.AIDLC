import { createHash } from 'node:crypto';
const severityOrder = {
    blocking: 0,
    critical: 1,
    warning: 2,
    info: 3,
    'manual-review': 4,
};
const refKey = (ref) => ref ? `${ref.path}::${ref.segment ?? ''}::${ref.symbol ?? ''}::${ref.location ?? ''}` : '';
const stableHash = (value) => createHash('sha256').update(value).digest('hex').slice(0, 12);
const stableGroupId = (prefix, key) => `${prefix}-${stableHash(key)}`;
export const compareDiagnostics = (left, right) => {
    const leftParts = [
        severityOrder[left.severity] ?? 99,
        refKey(left.sourceRef),
        refKey(left.generatedRef),
        left.storyArea ?? '',
        left.reviewCategory ?? '',
        left.reasonCode,
        left.safeMessage,
        left.id,
    ];
    const rightParts = [
        severityOrder[right.severity] ?? 99,
        refKey(right.sourceRef),
        refKey(right.generatedRef),
        right.storyArea ?? '',
        right.reviewCategory ?? '',
        right.reasonCode,
        right.safeMessage,
        right.id,
    ];
    return leftParts.join('|').localeCompare(rightParts.join('|'));
};
export const compareManualReviewItems = (left, right) => {
    const leftParts = [
        severityOrder[left.severity] ?? 99,
        left.category,
        refKey(left.sourceRef),
        refKey(left.generatedRef),
        left.storyArea ?? '',
        left.reasonCode,
        left.id,
    ];
    const rightParts = [
        severityOrder[right.severity] ?? 99,
        right.category,
        refKey(right.sourceRef),
        refKey(right.generatedRef),
        right.storyArea ?? '',
        right.reasonCode,
        right.id,
    ];
    return leftParts.join('|').localeCompare(rightParts.join('|'));
};
export const buildManualReviewGroups = (items) => {
    const groupMap = new Map();
    const sortedItems = [...items].sort(compareManualReviewItems);
    for (const item of sortedItems) {
        const key = [
            item.severity,
            item.category,
            refKey(item.sourceRef),
            refKey(item.generatedRef),
            item.storyArea ?? '',
        ].join('|');
        const existing = groupMap.get(key);
        if (existing) {
            existing.itemIds.push(item.id);
            continue;
        }
        groupMap.set(key, {
            id: stableGroupId('group', key),
            severity: item.severity,
            sourceRef: item.sourceRef,
            generatedRef: item.generatedRef,
            storyArea: item.storyArea,
            reviewCategory: item.category,
            itemIds: [item.id],
        });
    }
    return [...groupMap.values()].sort((left, right) => [
        severityOrder[left.severity] ?? 99,
        left.reviewCategory ?? '',
        refKey(left.sourceRef),
        refKey(left.generatedRef),
        left.storyArea ?? '',
        left.id,
    ].join('|').localeCompare([
        severityOrder[right.severity] ?? 99,
        right.reviewCategory ?? '',
        refKey(right.sourceRef),
        refKey(right.generatedRef),
        right.storyArea ?? '',
        right.id,
    ].join('|')));
};
export const sortDiagnostics = (diagnostics) => [...diagnostics].sort(compareDiagnostics);
//# sourceMappingURL=report-grouping-service.js.map