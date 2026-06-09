import type { AngularFormModel, TemplateParseSummary, TypeScriptParseSummary } from '../types.js';
export declare class FormModelExtractor {
    private readonly ids;
    extract(typeScriptSummaries: TypeScriptParseSummary[], templateSummaries: TemplateParseSummary[]): AngularFormModel[];
    private extractPropertyForm;
    private parseGroupExpression;
    private parseControlExpression;
    private parseArrayExpression;
    private group;
    private control;
    private extractFirstObjectArgument;
    private extractCallArguments;
    private normalizeValidators;
    private validatorKind;
    private extractTemplateBindings;
    private extractSubmitIntents;
    private diagnostic;
}
//# sourceMappingURL=form-model-extractor.d.ts.map