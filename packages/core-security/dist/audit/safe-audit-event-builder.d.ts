import { type Result } from '@spa-bridge/core-model';
import { createSecurityError, type SecurityAuditEvent } from '../types.js';
export declare class AuditPrivacyGuard {
    sanitize(input: unknown): Result<unknown, ReturnType<typeof createSecurityError>>;
}
export declare class SafeAuditEventBuilder {
    private readonly privacyGuard;
    build(input: {
        eventType: string;
        severity: SecurityAuditEvent['severity'];
        message: string;
        runId?: string;
        correlationId?: string;
        safeRefs?: SecurityAuditEvent['safeRefs'];
        counts?: Partial<SecurityAuditEvent['counts']>;
        reasonCodes?: string[];
        metadata?: Record<string, string>;
    }): Result<SecurityAuditEvent, ReturnType<typeof createSecurityError>>;
}
//# sourceMappingURL=safe-audit-event-builder.d.ts.map