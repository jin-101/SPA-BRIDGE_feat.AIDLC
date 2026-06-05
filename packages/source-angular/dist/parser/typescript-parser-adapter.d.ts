import { type Result } from '@spa-bridge/core-model';
import type { AnalysisError, TypeScriptParseSummary } from '../types.js';
export declare class TypeScriptParserAdapter {
    private readonly ids;
    parse(sourcePath: string, sourceText: string): Result<TypeScriptParseSummary, AnalysisError>;
}
//# sourceMappingURL=typescript-parser-adapter.d.ts.map