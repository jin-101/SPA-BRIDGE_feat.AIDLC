import { type AuditPort, type LoggerPort, type Result } from '@spa-bridge/core-model';
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
export declare class StructuredEventPublisher {
    private readonly logger;
    private readonly audit;
    constructor(logger: LoggerPort, audit: AuditPort);
    publish(event: StructuredRunEvent): Result<void, ApplicationError>;
}
//# sourceMappingURL=events.d.ts.map