import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactComponentDraft } from '@spa-bridge/transform-angular-react';
import type { GeneratedFileSpec } from '../types.js';
type ComponentRegistryEntry = {
    name: string;
    path: string;
};
type ComponentMaterializerContext = {
    selectorRegistry: Map<string, ComponentRegistryEntry>;
};
export declare class ComponentMaterializer {
    materialize(component: ReactComponentDraft, sourceRefs?: SourceRef[], context?: ComponentMaterializerContext): GeneratedFileSpec[];
    materializeMany(components: ReactComponentDraft[], sourceRef: SourceRef): GeneratedFileSpec[];
}
export {};
//# sourceMappingURL=component-materializer.d.ts.map