import path from 'node:path';

const normalizePart = (value: string): string =>
  value
    .replaceAll(path.sep, '/')
    .replace(/[^A-Za-z0-9._/-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .toLowerCase();

export class StableIdFactory {
  fileId(relativePath: string, role: string): string {
    return `file:${normalizePart(relativePath)}:${normalizePart(role)}`;
  }

  symbolId(relativePath: string, kind: string, name: string, ordinal: number): string {
    return `symbol:${normalizePart(relativePath)}:${normalizePart(kind)}:${normalizePart(name)}:${ordinal}`;
  }

  templateId(relativePath: string, owner: string, ordinal: number): string {
    return `template:${normalizePart(relativePath)}:${normalizePart(owner)}:${ordinal}`;
  }

  routeId(relativePath: string, pathValue: string, ordinal: number): string {
    return `route:${normalizePart(relativePath)}:${normalizePart(pathValue || 'root')}:${ordinal}`;
  }

  nodeId(kind: string, sourceId: string): string {
    return `node:${normalizePart(kind)}:${normalizePart(sourceId)}`;
  }

  edgeId(kind: string, from: string, to: string, ordinal: number): string {
    return `edge:${normalizePart(kind)}:${normalizePart(from)}:${normalizePart(to)}:${ordinal}`;
  }

  diagnosticId(code: string, primaryRef: string, ordinal: number): string {
    return `diag:${normalizePart(code)}:${normalizePart(primaryRef)}:${ordinal}`;
  }
}

export const createStableIdFactory = (): StableIdFactory => new StableIdFactory();
