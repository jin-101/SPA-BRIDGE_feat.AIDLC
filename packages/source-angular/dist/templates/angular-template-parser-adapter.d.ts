import { type Result } from '@spa-bridge/core-model';
import type { AnalysisError, TemplateParseSummary } from '../types.js';
import { TemplateIrBuilder } from './template-ir-builder.js';
export declare class AngularTemplateParserAdapter {
    private readonly irBuilder;
    constructor(irBuilder?: TemplateIrBuilder);
    parse(sourcePath: string, templateText: string, ownerPath?: string): Promise<Result<TemplateParseSummary, AnalysisError>>;
}
//# sourceMappingURL=angular-template-parser-adapter.d.ts.map