import type { AngularAnimationModel, TemplateParseSummary, TypeScriptParseSummary } from '../types.js';
export declare class AnimationModelExtractor {
    private readonly ids;
    extract(typeScriptSummaries: TypeScriptParseSummary[], templateSummaries: TemplateParseSummary[]): AngularAnimationModel;
    private extractTriggers;
    private createTrigger;
    private extractTemplateBindings;
    private parseStyleProperties;
    private extractAssetRefs;
    private toDiagnostic;
}
//# sourceMappingURL=animation-model-extractor.d.ts.map