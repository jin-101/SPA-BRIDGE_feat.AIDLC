export declare class StableIdFactory {
    fileId(relativePath: string, role: string): string;
    symbolId(relativePath: string, kind: string, name: string, ordinal: number): string;
    templateId(relativePath: string, owner: string, ordinal: number): string;
    routeId(relativePath: string, pathValue: string, ordinal: number): string;
    nodeId(kind: string, sourceId: string): string;
    edgeId(kind: string, from: string, to: string, ordinal: number): string;
    diagnosticId(code: string, primaryRef: string, ordinal: number): string;
}
export declare const createStableIdFactory: () => StableIdFactory;
//# sourceMappingURL=stable-id-factory.d.ts.map