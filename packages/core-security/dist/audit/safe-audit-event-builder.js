import { createSafeDisplayString, err, ok } from '@spa-bridge/core-model';
import { createSecurityError, SecurityAuditEventCountsSchema, } from '../types.js';
export class AuditPrivacyGuard {
    sanitize(input) {
        const forbiddenKeys = new Set(['excerpt', 'rawSnippet', 'rawValue', 'rawText', 'secret']);
        const stack = [input];
        while (stack.length > 0) {
            const current = stack.pop();
            if (!current || typeof current !== 'object') {
                continue;
            }
            for (const [key, value] of Object.entries(current)) {
                if (forbiddenKeys.has(key)) {
                    return err(createSecurityError('AUDIT_REJECTED', `Unsafe audit field '${key}' was detected.`));
                }
                if (typeof value === 'object') {
                    stack.push(value);
                }
            }
        }
        return ok(input);
    }
}
export class SafeAuditEventBuilder {
    privacyGuard = new AuditPrivacyGuard();
    build(input) {
        const message = createSafeDisplayString(input.message);
        const counts = SecurityAuditEventCountsSchema.parse({
            findings: input.counts?.findings ?? 0,
            redactions: input.counts?.redactions ?? 0,
            tokenizations: input.counts?.tokenizations ?? 0,
            blockedDecisions: input.counts?.blockedDecisions ?? 0,
        });
        const event = {
            eventType: input.eventType,
            severity: input.severity,
            runId: input.runId,
            correlationId: input.correlationId,
            safeMessage: message,
            safeRefs: input.safeRefs ?? [],
            counts,
            reasonCodes: input.reasonCodes ?? [],
            metadata: input.metadata ?? {},
        };
        const validation = this.privacyGuard.sanitize(event);
        if (!validation.ok) {
            return validation;
        }
        return ok(event);
    }
}
//# sourceMappingURL=safe-audit-event-builder.js.map