import type { CliExecutionResult, CliHelpContent, CliRenderModel, CliVerbosity } from '../types.js';
export declare const buildRenderModel: (result: CliExecutionResult, verbosity: CliVerbosity, helpContent?: CliHelpContent) => CliRenderModel;
export declare const renderTerminalOutput: (model: CliRenderModel, verbosity: CliVerbosity) => string;
//# sourceMappingURL=cli-output-formatter.d.ts.map