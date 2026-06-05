export const resolveOverwriteConflict = (policy, existingContent, nextContent) => {
    if (existingContent === undefined) {
        return { action: 'write', reason: 'new-file' };
    }
    if (existingContent === nextContent) {
        return { action: 'preserve', reason: 'identical-content' };
    }
    if (policy === 'overwrite') {
        return { action: 'write', reason: 'overwrite' };
    }
    if (policy === 'preserve') {
        return { action: 'preserve', reason: 'preserve-by-default' };
    }
    return { action: 'fail', reason: 'conflict' };
};
//# sourceMappingURL=overwrite-conflict-policy.js.map