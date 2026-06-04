import { createSafeDisplayString, err, ok, type AuditPort, type LoggerPort, type Result } from '@spa-bridge/core-model';

import type { ApplicationError } from '../types.js';

export type StructuredRunEvent = {
  eventType: string;
  correlationId: string;
  runId: string;
  stepId?: string;
  status: string;
  message: string;
  metadata?: Record<string, unknown>;
};

export class StructuredEventPublisher {
  constructor(
    private readonly logger: LoggerPort,
    private readonly audit: AuditPort,
  ) {}

  publish(event: StructuredRunEvent): Result<void, ApplicationError> {
    const safeMessage = createSafeDisplayString(event.message);
    const metadata = {
      ...event.metadata,
      correlationId: event.correlationId,
      runId: event.runId,
      stepId: event.stepId,
      status: event.status,
    };

    const logResult = this.logger.info(safeMessage, metadata);
    if (!logResult.ok) {
      return err({
        code: 'PORT_ERROR',
        message: logResult.error.message,
        cause: logResult.error,
      });
    }

    const auditResult = this.audit.record({
      eventType: event.eventType,
      correlationId: event.correlationId,
      payload: {
        runId: event.runId,
        stepId: event.stepId,
        status: event.status,
        message: safeMessage,
        ...event.metadata,
      },
    });

    if (!auditResult.ok) {
      return err({
        code: 'PORT_ERROR',
        message: auditResult.error.message,
        cause: auditResult.error,
      });
    }

    return ok(undefined);
  }
}
