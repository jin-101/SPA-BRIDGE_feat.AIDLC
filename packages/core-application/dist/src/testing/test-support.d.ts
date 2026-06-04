import { type AuditPort, type ClockPort, type FileSystemPort, type LoggerPort, type PortError, type RandomnessPort, type ReportExporterPort, type Result } from '@spa-bridge/core-model';
export declare class InMemoryFileSystem implements FileSystemPort {
    readonly files: Map<string, string>;
    readText(path: string): Promise<Result<string, PortError>>;
    writeText(path: string, content: string): Promise<Result<void, PortError>>;
    exists(path: string): Promise<Result<boolean, PortError>>;
    list(path: string): Promise<Result<string[], PortError>>;
}
export declare class InMemoryReportExporter implements ReportExporterPort {
    readonly exports: Array<{
        format: string;
        report: unknown;
    }>;
    exportReport(report: unknown, format: 'json' | 'markdown' | 'html'): Promise<Result<string, PortError>>;
}
export declare class InMemoryLogger implements LoggerPort {
    readonly messages: Array<{
        level: string;
        message: string;
        metadata?: Record<string, unknown>;
    }>;
    debug(message: string, metadata?: Record<string, unknown>): Result<void, PortError>;
    info(message: string, metadata?: Record<string, unknown>): Result<void, PortError>;
    warn(message: string, metadata?: Record<string, unknown>): Result<void, PortError>;
    error(message: string, metadata?: Record<string, unknown>): Result<void, PortError>;
}
export declare class InMemoryAudit implements AuditPort {
    readonly entries: Array<{
        eventType: string;
        actor?: string;
        correlationId?: string;
        payload: Record<string, unknown>;
    }>;
    record(entry: {
        eventType: string;
        actor?: string;
        correlationId?: string;
        payload: Record<string, unknown>;
    }): Result<void, PortError>;
}
export declare class FixedClock implements ClockPort {
    private readonly nowValue;
    constructor(nowValue?: Date);
    now(): Result<Date, PortError>;
}
export declare class FixedRandomness implements RandomnessPort {
    next(): Result<number, PortError>;
    nextBytes(length: number): Result<Uint8Array, PortError>;
}
//# sourceMappingURL=test-support.d.ts.map