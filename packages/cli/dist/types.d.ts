import type { Result } from '@spa-bridge/core-model';
import type { CliError } from './shared-errors.js';
export type CliCommandName = 'convert' | 'validate' | 'report' | 'help';
export type CliVerbosity = 'quiet' | 'normal' | 'verbose';
export type CliExecutionMode = 'interactive' | 'non-interactive';
export type CliReportFormat = 'json' | 'markdown' | 'html';
export type CliOutcomeCategory = 'success' | 'review' | 'usage' | 'validation' | 'runtime';
export type CliExitCode = {
    code: number;
    category: CliOutcomeCategory;
    description: string;
};
export type CliCommandOptions = {
    workspacePath?: string;
    inputPath?: string;
    outputPath?: string;
    configPath?: string;
    reportFormat?: CliReportFormat;
    verbosity?: CliVerbosity;
    interactive?: boolean;
    dryRun?: boolean;
    runId?: string;
    confirm?: boolean;
};
export type CliCommandRequest = {
    commandName: CliCommandName;
    subcommand?: string;
    rawArgv: string[];
    args: string[];
    options: CliCommandOptions;
};
export type CliResolvedOptions = {
    commandName: CliCommandName;
    workspacePath: string;
    inputPath: string;
    outputPath: string;
    configPath: string;
    reportFormat: CliReportFormat;
    verbosity: CliVerbosity;
    executionMode: CliExecutionMode;
    dryRun: boolean;
    runId: string;
    confirm: boolean;
};
export type ValidatedWorkspacePaths = {
    workspaceRoot: string;
    inputPath: string;
    outputPath: string;
    configPath?: string;
    reportPath: string;
    isContained: boolean;
};
export type CliProgressEvent = {
    phase: 'parse' | 'resolve' | 'validate' | 'dispatch' | 'report' | 'complete';
    message: string;
    step?: string;
};
export type CliRenderSection = {
    title: string;
    lines: string[];
};
export type CliRenderModel = {
    headline: string;
    sections: CliRenderSection[];
    progress: CliProgressEvent[];
    warnings: string[];
    reviewItems: string[];
    reportPath?: string;
};
export type CliReportPayload = {
    title: string;
    summary: string;
    warnings: string[];
    reviewItems: string[];
    sections: CliRenderSection[];
};
export type CliApplicationRequest = {
    commandName: CliCommandName;
    resolvedOptions: CliResolvedOptions;
    validatedPaths: ValidatedWorkspacePaths;
    generatedAt: string;
};
export type CliApplicationResponse = {
    runId: string;
    summary: string;
    warnings: string[];
    reviewItems: string[];
    reportPayload?: CliReportPayload;
};
export type CliValidationRequest = {
    commandName: CliCommandName;
    resolvedOptions: CliResolvedOptions;
    validatedPaths: ValidatedWorkspacePaths;
    generatedAt: string;
};
export type CliValidationResponse = {
    runId: string;
    summary: string;
    warnings: string[];
    reviewItems: string[];
};
export type CliReportRequest = {
    commandName: CliCommandName;
    reportFormat: CliReportFormat;
    outputPath: string;
    generatedAt: string;
    payload: CliReportPayload;
};
export type CliReportArtifact = {
    format: CliReportFormat;
    content: string;
    outputPath: string;
    contentHash: string;
    generatedAt: string;
};
export type CliReportResponse = {
    artifact: CliReportArtifact;
};
export type CliExecutionResult = {
    commandName: CliCommandName;
    status: CliOutcomeCategory;
    exitCode: CliExitCode;
    summary: string;
    progress: CliProgressEvent[];
    warnings: string[];
    reviewItems: string[];
    reportPath?: string;
    renderModel: CliRenderModel;
};
export type CliHelpContent = {
    usage: string;
    commands: Array<{
        name: CliCommandName;
        summary: string;
    }>;
    flags: Array<{
        flag: string;
        description: string;
    }>;
    examples: string[];
};
export type CliFileSystem = {
    readText(path: string): Promise<Result<string, CliError>>;
    writeText(path: string, content: string): Promise<Result<void, CliError>>;
    exists(path: string): Promise<boolean>;
    ensureDir(path: string): Promise<Result<void, CliError>>;
};
export type CliApplicationBridge = {
    startConversion(request: CliApplicationRequest): Promise<Result<CliApplicationResponse, CliError>>;
    validateWorkspace(request: CliValidationRequest): Promise<Result<CliValidationResponse, CliError>>;
    prepareReport(request: CliApplicationRequest): Promise<Result<CliReportPayload, CliError>>;
};
export type CliReportBridge = {
    exportReport(request: CliReportRequest): Promise<Result<CliReportArtifact, CliError>>;
};
export type CliRuntimeDependencies = {
    fileSystem: CliFileSystem;
    applicationBridge: CliApplicationBridge;
    reportBridge: CliReportBridge;
    cwd: string;
    env: NodeJS.ProcessEnv;
    now: () => string;
    confirm?: (message: string) => Promise<boolean>;
};
export type CliRunResult = Result<CliExecutionResult, CliError>;
//# sourceMappingURL=types.d.ts.map