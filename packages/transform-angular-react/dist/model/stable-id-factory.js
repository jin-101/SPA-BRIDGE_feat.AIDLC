const normalize = (value) => value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
export class StableIdFactory {
    counters = new Map();
    next(prefix, parts) {
        const key = [prefix, ...parts.filter((part) => part !== undefined)].join('|');
        const ordinal = (this.counters.get(key) ?? 0) + 1;
        this.counters.set(key, ordinal);
        const normalized = [prefix, ...parts.map((part) => (part === undefined ? '' : normalize(String(part))))].filter(Boolean).join('-');
        return `${normalized}-${ordinal}`;
    }
    componentId(name, ordinal = 1) {
        return `${normalize('component')}-${normalize(name)}-${ordinal}`;
    }
    templateId(ownerName, ordinal = 1) {
        return `${normalize('template')}-${normalize(ownerName)}-${ordinal}`;
    }
    serviceId(name, ordinal = 1) {
        return `${normalize('service')}-${normalize(name)}-${ordinal}`;
    }
    routeId(path, ordinal = 1) {
        return `${normalize('route')}-${normalize(path || 'dynamic')}-${ordinal}`;
    }
    stateId(name, ordinal = 1) {
        return `${normalize('state')}-${normalize(name)}-${ordinal}`;
    }
    hookId(name, kind, ordinal = 1) {
        return `${normalize('hook')}-${normalize(name)}-${normalize(kind)}-${ordinal}`;
    }
    draftId(kind, name, ordinal = 1) {
        return `${normalize(kind)}-${normalize(name)}-${ordinal}`;
    }
    traceId(sourcePath, generatedPath, ruleId, ordinal = 1) {
        return `${normalize('trace')}-${normalize(sourcePath)}-${normalize(generatedPath)}-${normalize(ruleId)}-${ordinal}`;
    }
    mappingRequestId(category, sourcePath, ordinal = 1) {
        return `${normalize('mapping')}-${normalize(category)}-${normalize(sourcePath)}-${ordinal}`;
    }
    artifactRef(path, segment) {
        return {
            kind: 'generated',
            path,
            segment,
        };
    }
    sourceKey(sourceRef) {
        if (!sourceRef) {
            return 'unknown';
        }
        return [normalize(sourceRef.path), sourceRef.symbol ? normalize(sourceRef.symbol) : undefined, sourceRef.location ? normalize(sourceRef.location) : undefined]
            .filter(Boolean)
            .join('-');
    }
}
//# sourceMappingURL=stable-id-factory.js.map