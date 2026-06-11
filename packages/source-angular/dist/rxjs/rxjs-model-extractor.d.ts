import type { AngularRxModel, TemplateParseSummary, TypeScriptParseSummary } from '../types.js';
export declare class RxjsModelExtractor {
    private readonly ids;
    extract(typeScriptSummaries: TypeScriptParseSummary[], templateSummaries: TemplateParseSummary[]): AngularRxModel;
    private extractOperatorChain;
    private extractAsyncPipeBindings;
    private extractSubjectInitialValue;
    private findMethodRefs;
    private inferAssignmentTarget;
    private cleanupEvidence;
    private sideEffectLevel;
}
//# sourceMappingURL=rxjs-model-extractor.d.ts.map