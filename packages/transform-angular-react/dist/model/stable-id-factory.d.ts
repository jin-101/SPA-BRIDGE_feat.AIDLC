import type { GeneratedArtifactRef, SourceRef } from '@spa-bridge/core-model';
export declare class StableIdFactory {
    private readonly counters;
    next(prefix: string, parts: Array<string | number | undefined>): string;
    componentId(name: string, ordinal?: number): string;
    templateId(ownerName: string, ordinal?: number): string;
    serviceId(name: string, ordinal?: number): string;
    routeId(path: string, ordinal?: number): string;
    stateId(name: string, ordinal?: number): string;
    hookId(name: string, kind: string, ordinal?: number): string;
    draftId(kind: string, name: string, ordinal?: number): string;
    traceId(sourcePath: string, generatedPath: string, ruleId: string, ordinal?: number): string;
    mappingRequestId(category: string, sourcePath: string, ordinal?: number): string;
    artifactRef(path: string, segment?: string): GeneratedArtifactRef;
    sourceKey(sourceRef?: SourceRef): string;
}
//# sourceMappingURL=stable-id-factory.d.ts.map