import type { GeneratedArtifactRef } from '@spa-bridge/core-model';
import type { TransformationContext } from '../types.js';
import { StableIdFactory } from './stable-id-factory.js';
export declare class ArtifactRefFactory {
    private readonly ids;
    constructor(ids?: StableIdFactory);
    build(outputNamespace: string, context: TransformationContext): {
        draftSetRef: GeneratedArtifactRef;
        tracesRef: GeneratedArtifactRef;
        diagnosticsRef: GeneratedArtifactRef;
        summaryRef: GeneratedArtifactRef;
        reviewItemsRef: GeneratedArtifactRef;
        mappingRequestsRef: GeneratedArtifactRef;
    };
}
//# sourceMappingURL=artifact-ref-factory.d.ts.map