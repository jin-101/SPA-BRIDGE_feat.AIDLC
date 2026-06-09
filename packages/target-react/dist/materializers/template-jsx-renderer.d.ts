import type { TemplateIr } from '@spa-bridge/source-angular';
export type TemplateLogicContext = {
    stateNames: Set<string>;
    propertyNames: Set<string>;
    methodNames: Set<string>;
    propNames: Set<string>;
    transformExpression: (expression: string) => string;
    transformTemplateExpression: (expression: string) => string;
    toStateSetter: (name: string) => string;
    toIdentifier: (name: string, fallback: string) => string;
};
export type ComponentRegistryEntry = {
    name: string;
    path: string;
};
export type TemplateJsxRenderResult = {
    lines: string[];
    usedSelectors: string[];
    helpers: string[];
    diagnostics: string[];
};
export declare class TemplateJsxRenderer {
    render(templateText: string | undefined, templateIr: TemplateIr | undefined, context: TemplateLogicContext, selectorRegistry: Map<string, ComponentRegistryEntry>): TemplateJsxRenderResult;
}
//# sourceMappingURL=template-jsx-renderer.d.ts.map