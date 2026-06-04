import type { Result } from '../result/result.js';
import type { SafeDisplayString } from '../redaction/redaction.js';
export type PortErrorCode = 'NOT_FOUND' | 'UNAVAILABLE' | 'UNAUTHORIZED' | 'VALIDATION_FAILED' | 'IO_ERROR' | 'UNKNOWN';
export type PortError = {
    code: PortErrorCode;
    message: SafeDisplayString;
    cause?: unknown;
};
export type FileSystemPort = {
    readText: (path: string) => Promise<Result<string, PortError>>;
    writeText: (path: string, content: string) => Promise<Result<void, PortError>>;
    exists: (path: string) => Promise<Result<boolean, PortError>>;
    list: (path: string) => Promise<Result<string[], PortError>>;
};
export type ArtifactStoragePort = {
    saveArtifact: (artifactType: string, artifactId: string, payload: unknown) => Promise<Result<void, PortError>>;
    loadArtifact: (artifactType: string, artifactId: string) => Promise<Result<unknown, PortError>>;
    listArtifacts: (artifactType: string) => Promise<Result<string[], PortError>>;
};
export type ToolRunRequest = {
    command: string;
    args: string[];
    cwd?: string;
    env?: Record<string, string>;
};
export type ToolRunResult = {
    exitCode: number;
    stdout: string;
    stderr: string;
};
export type ToolRunnerPort = {
    run: (request: ToolRunRequest) => Promise<Result<ToolRunResult, PortError>>;
};
export type LlmPrompt = {
    provider: string;
    prompt: string;
    model?: string;
    temperature?: number;
};
export type LlmResponse = {
    text: string;
    tokensUsed?: number;
};
export type LlmProviderPort = {
    generate: (request: LlmPrompt) => Promise<Result<LlmResponse, PortError>>;
};
export type ReportFormat = 'json' | 'markdown' | 'html';
export type ReportExporterPort = {
    exportReport: (report: unknown, format: ReportFormat) => Promise<Result<string, PortError>>;
};
export type LoggerPort = {
    debug: (message: string, metadata?: Record<string, unknown>) => Result<void, PortError>;
    info: (message: string, metadata?: Record<string, unknown>) => Result<void, PortError>;
    warn: (message: string, metadata?: Record<string, unknown>) => Result<void, PortError>;
    error: (message: string, metadata?: Record<string, unknown>) => Result<void, PortError>;
};
export type AuditRecord = {
    eventType: string;
    actor?: string;
    correlationId?: string;
    payload: Record<string, unknown>;
};
export type AuditPort = {
    record: (entry: AuditRecord) => Result<void, PortError>;
};
export type ClockPort = {
    now: () => Result<Date, PortError>;
};
export type RandomnessPort = {
    next: () => Result<number, PortError>;
    nextBytes: (length: number) => Result<Uint8Array, PortError>;
};
//# sourceMappingURL=ports.d.ts.map