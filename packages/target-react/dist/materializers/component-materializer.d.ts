import type { SourceRef } from '@spa-bridge/core-model';
import type { ReactComponentDraft } from '@spa-bridge/transform-angular-react';
import type { GeneratedFileSpec } from '../types.js';
import { TemplateJsxRenderer, type ComponentRegistryEntry } from './template-jsx-renderer.js';
type ComponentMaterializerContext = {
    selectorRegistry: Map<string, ComponentRegistryEntry>;
};
export declare class ComponentMaterializer {
    private readonly templateRenderer;
    constructor(templateRenderer?: TemplateJsxRenderer);
    materialize(component: ReactComponentDraft, sourceRefs?: SourceRef[], context?: ComponentMaterializerContext): GeneratedFileSpec[];
    materializeMany(components: ReactComponentDraft[], sourceRef: SourceRef): GeneratedFileSpec[];
    private renderTemplateHelpers;
}
export {};
//# sourceMappingURL=component-materializer.d.ts.map