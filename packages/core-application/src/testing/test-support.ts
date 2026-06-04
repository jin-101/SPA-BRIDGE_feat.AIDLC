import { err, ok, type AuditPort, type ClockPort, type FileSystemPort, type LoggerPort, type PortError, type RandomnessPort, type ReportExporterPort, type Result } from '@spa-bridge/core-model';

export class InMemoryFileSystem implements FileSystemPort {
  readonly files = new Map<string, string>();

  async readText(path: string): Promise<Result<string, PortError>> {
    if (!this.files.has(path)) {
      return err({ code: 'NOT_FOUND', message: `Missing file: ${path}` as never });
    }

    return ok(this.files.get(path) ?? '');
  }

  async writeText(path: string, content: string): Promise<Result<void, PortError>> {
    this.files.set(path, content);
    return ok(undefined);
  }

  async exists(path: string): Promise<Result<boolean, PortError>> {
    return ok(this.files.has(path));
  }

  async list(path: string): Promise<Result<string[], PortError>> {
    const prefix = path.endsWith('/') ? path : `${path}/`;
    return ok([...this.files.keys()].filter((entry) => entry.startsWith(prefix)));
  }
}

export class InMemoryReportExporter implements ReportExporterPort {
  readonly exports: Array<{ format: string; report: unknown }> = [];

  async exportReport(report: unknown, format: 'json' | 'markdown' | 'html'): Promise<Result<string, PortError>> {
    this.exports.push({ format, report });
    return ok(`${format}:${this.exports.length}`);
  }
}

export class InMemoryLogger implements LoggerPort {
  readonly messages: Array<{ level: string; message: string; metadata?: Record<string, unknown> }> = [];

  debug(message: string, metadata?: Record<string, unknown>): Result<void, PortError> {
    this.messages.push({ level: 'debug', message, metadata });
    return ok(undefined);
  }

  info(message: string, metadata?: Record<string, unknown>): Result<void, PortError> {
    this.messages.push({ level: 'info', message, metadata });
    return ok(undefined);
  }

  warn(message: string, metadata?: Record<string, unknown>): Result<void, PortError> {
    this.messages.push({ level: 'warn', message, metadata });
    return ok(undefined);
  }

  error(message: string, metadata?: Record<string, unknown>): Result<void, PortError> {
    this.messages.push({ level: 'error', message, metadata });
    return ok(undefined);
  }
}

export class InMemoryAudit implements AuditPort {
  readonly entries: Array<{ eventType: string; actor?: string; correlationId?: string; payload: Record<string, unknown> }> = [];

  record(entry: { eventType: string; actor?: string; correlationId?: string; payload: Record<string, unknown> }): Result<void, PortError> {
    this.entries.push(entry);
    return ok(undefined);
  }
}

export class FixedClock implements ClockPort {
  constructor(private readonly nowValue: Date = new Date('2026-06-04T00:00:00.000Z')) {}

  now(): Result<Date, PortError> {
    return ok(new Date(this.nowValue));
  }
}

export class FixedRandomness implements RandomnessPort {
  next(): Result<number, PortError> {
    return ok(0.123456);
  }

  nextBytes(length: number): Result<Uint8Array, PortError> {
    return ok(new Uint8Array(Array.from({ length }, (_, index) => index + 1)));
  }
}
