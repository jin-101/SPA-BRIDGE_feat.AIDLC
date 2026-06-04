import { err, ok } from '@spa-bridge/core-model';
export class InMemoryFileSystem {
    files = new Map();
    async readText(path) {
        if (!this.files.has(path)) {
            return err({ code: 'NOT_FOUND', message: `Missing file: ${path}` });
        }
        return ok(this.files.get(path) ?? '');
    }
    async writeText(path, content) {
        this.files.set(path, content);
        return ok(undefined);
    }
    async exists(path) {
        return ok(this.files.has(path));
    }
    async list(path) {
        const prefix = path.endsWith('/') ? path : `${path}/`;
        return ok([...this.files.keys()].filter((entry) => entry.startsWith(prefix)));
    }
}
export class InMemoryReportExporter {
    exports = [];
    async exportReport(report, format) {
        this.exports.push({ format, report });
        return ok(`${format}:${this.exports.length}`);
    }
}
export class InMemoryLogger {
    messages = [];
    debug(message, metadata) {
        this.messages.push({ level: 'debug', message, metadata });
        return ok(undefined);
    }
    info(message, metadata) {
        this.messages.push({ level: 'info', message, metadata });
        return ok(undefined);
    }
    warn(message, metadata) {
        this.messages.push({ level: 'warn', message, metadata });
        return ok(undefined);
    }
    error(message, metadata) {
        this.messages.push({ level: 'error', message, metadata });
        return ok(undefined);
    }
}
export class InMemoryAudit {
    entries = [];
    record(entry) {
        this.entries.push(entry);
        return ok(undefined);
    }
}
export class FixedClock {
    nowValue;
    constructor(nowValue = new Date('2026-06-04T00:00:00.000Z')) {
        this.nowValue = nowValue;
    }
    now() {
        return ok(new Date(this.nowValue));
    }
}
export class FixedRandomness {
    next() {
        return ok(0.123456);
    }
    nextBytes(length) {
        return ok(new Uint8Array(Array.from({ length }, (_, index) => index + 1)));
    }
}
//# sourceMappingURL=test-support.js.map