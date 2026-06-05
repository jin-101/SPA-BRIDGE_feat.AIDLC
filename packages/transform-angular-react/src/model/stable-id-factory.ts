import type { GeneratedArtifactRef, SourceRef } from '@spa-bridge/core-model';

const normalize = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export class StableIdFactory {
  private readonly counters = new Map<string, number>();

  next(prefix: string, parts: Array<string | number | undefined>): string {
    const key = [prefix, ...parts.filter((part): part is string | number => part !== undefined)].join('|');
    const ordinal = (this.counters.get(key) ?? 0) + 1;
    this.counters.set(key, ordinal);
    const normalized = [prefix, ...parts.map((part) => (part === undefined ? '' : normalize(String(part))))].filter(Boolean).join('-');
    return `${normalized}-${ordinal}`;
  }

  componentId(name: string, ordinal = 1): string {
    return `${normalize('component')}-${normalize(name)}-${ordinal}`;
  }

  templateId(ownerName: string, ordinal = 1): string {
    return `${normalize('template')}-${normalize(ownerName)}-${ordinal}`;
  }

  serviceId(name: string, ordinal = 1): string {
    return `${normalize('service')}-${normalize(name)}-${ordinal}`;
  }

  routeId(path: string, ordinal = 1): string {
    return `${normalize('route')}-${normalize(path || 'dynamic')}-${ordinal}`;
  }

  stateId(name: string, ordinal = 1): string {
    return `${normalize('state')}-${normalize(name)}-${ordinal}`;
  }

  hookId(name: string, kind: string, ordinal = 1): string {
    return `${normalize('hook')}-${normalize(name)}-${normalize(kind)}-${ordinal}`;
  }

  draftId(kind: string, name: string, ordinal = 1): string {
    return `${normalize(kind)}-${normalize(name)}-${ordinal}`;
  }

  traceId(sourcePath: string, generatedPath: string, ruleId: string, ordinal = 1): string {
    return `${normalize('trace')}-${normalize(sourcePath)}-${normalize(generatedPath)}-${normalize(ruleId)}-${ordinal}`;
  }

  mappingRequestId(category: string, sourcePath: string, ordinal = 1): string {
    return `${normalize('mapping')}-${normalize(category)}-${normalize(sourcePath)}-${ordinal}`;
  }

  artifactRef(path: string, segment?: string): GeneratedArtifactRef {
    return {
      kind: 'generated',
      path,
      segment,
    };
  }

  sourceKey(sourceRef?: SourceRef): string {
    if (!sourceRef) {
      return 'unknown';
    }
    return [normalize(sourceRef.path), sourceRef.symbol ? normalize(sourceRef.symbol) : undefined, sourceRef.location ? normalize(sourceRef.location) : undefined]
      .filter(Boolean)
      .join('-');
  }
}
