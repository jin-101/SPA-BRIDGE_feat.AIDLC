import path from 'node:path';
const normalizePart = (value) => value
    .replaceAll(path.sep, '/')
    .replace(/[^A-Za-z0-9._/-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .toLowerCase();
export class StableIdFactory {
    fileId(relativePath, role) {
        return `file:${normalizePart(relativePath)}:${normalizePart(role)}`;
    }
    symbolId(relativePath, kind, name, ordinal) {
        return `symbol:${normalizePart(relativePath)}:${normalizePart(kind)}:${normalizePart(name)}:${ordinal}`;
    }
    templateId(relativePath, owner, ordinal) {
        return `template:${normalizePart(relativePath)}:${normalizePart(owner)}:${ordinal}`;
    }
    routeId(relativePath, pathValue, ordinal) {
        return `route:${normalizePart(relativePath)}:${normalizePart(pathValue || 'root')}:${ordinal}`;
    }
    nodeId(kind, sourceId) {
        return `node:${normalizePart(kind)}:${normalizePart(sourceId)}`;
    }
    edgeId(kind, from, to, ordinal) {
        return `edge:${normalizePart(kind)}:${normalizePart(from)}:${normalizePart(to)}:${ordinal}`;
    }
    diagnosticId(code, primaryRef, ordinal) {
        return `diag:${normalizePart(code)}:${normalizePart(primaryRef)}:${ordinal}`;
    }
}
export const createStableIdFactory = () => new StableIdFactory();
//# sourceMappingURL=stable-id-factory.js.map