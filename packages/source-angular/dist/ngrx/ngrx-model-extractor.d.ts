import type { AngularNgrxModel, TypeScriptParseSummary } from '../types.js';
export declare class NgrxModelExtractor {
    private readonly ids;
    extract(typeScriptSummaries: TypeScriptParseSummary[]): AngularNgrxModel;
    private extractActions;
    private extractReducers;
    private extractSelectors;
    private extractEffects;
    private extractEntityAdapters;
    private extractComponentUsages;
}
//# sourceMappingURL=ngrx-model-extractor.d.ts.map