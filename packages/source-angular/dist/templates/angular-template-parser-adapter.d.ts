import { type Result } from '@spa-bridge/core-model';
import type { AnalysisError, TemplateParseSummary } from '../types.js';
export declare class AngularTemplateParserAdapter {
    parse(sourcePath: string, templateText: string, ownerPath?: string): Promise<Result<TemplateParseSummary, AnalysisError>>;
}
//# sourceMappingURL=angular-template-parser-adapter.d.ts.map