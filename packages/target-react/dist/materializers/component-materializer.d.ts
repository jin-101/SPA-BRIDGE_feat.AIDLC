import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactComponentDraft } from '@spa-bridge/transform-angular-react';
import type { GeneratedFileSpec } from '../types.js';
export declare class ComponentMaterializer {
    materialize(component: ReactComponentDraft, sourceRefs?: SourceRef[]): GeneratedFileSpec[];
    materializeMany(components: ReactComponentDraft[], sourceRef: SourceRef): GeneratedFileSpec[];
}
//# sourceMappingURL=component-materializer.d.ts.map