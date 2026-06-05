export class TargetConflictDetector {
    detect(files) {
        const seen = new Map();
        const conflicts = [];
        for (const file of files) {
            const previous = seen.get(file.path);
            if (!previous) {
                seen.set(file.path, file);
                continue;
            }
            conflicts.push({
                path: file.path,
                reason: previous.content === file.content ? 'duplicate-generated-path' : 'overwrite-conflict',
                existingKind: previous.kind,
                incomingKind: file.kind,
            });
        }
        return conflicts;
    }
}
//# sourceMappingURL=target-conflict-detector.js.map