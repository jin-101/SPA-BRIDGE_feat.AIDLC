import { createSafeDisplayString, err, ok, type Result } from '@spa-bridge/core-model';

import {
  createSecurityError,
  type SecurityAuditEvent,
  SecurityAuditEventCountsSchema,
} from '../types.js';

export class AuditPrivacyGuard {
  sanitize(input: unknown): Result<unknown, ReturnType<typeof createSecurityError>> {
    const forbiddenKeys = new Set(['excerpt', 'rawSnippet', 'rawValue', 'rawText', 'secret']);
    const stack: unknown[] = [input];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current || typeof current !== 'object') {
        continue;
      }
      for (const [key, value] of Object.entries(current as Record<string, unknown>)) {
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
  private readonly privacyGuard = new AuditPrivacyGuard();

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
  }): Result<SecurityAuditEvent, ReturnType<typeof createSecurityError>> {
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
    } satisfies SecurityAuditEvent;

    const validation = this.privacyGuard.sanitize(event);
    if (!validation.ok) {
      return validation;
    }

    return ok(event);
  }
}
