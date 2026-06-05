import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactServiceDraft } from '@spa-bridge/transform-angular-react';
import type { GeneratedFileSpec } from '../types.js';
export declare class ServiceMaterializer {
    materialize(service: ReactServiceDraft, sourceRefs?: SourceRef[]): GeneratedFileSpec[];
    materializeMany(services: ReactServiceDraft[], sourceRef: SourceRef): GeneratedFileSpec[];
}
//# sourceMappingURL=service-materializer.d.ts.map