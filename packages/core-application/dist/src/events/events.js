import { createSafeDisplayString, err, ok } from '@spa-bridge/core-model';
export class StructuredEventPublisher {
    logger;
    audit;
    constructor(logger, audit) {
        this.logger = logger;
        this.audit = audit;
    }
    publish(event) {
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
//# sourceMappingURL=events.js.map