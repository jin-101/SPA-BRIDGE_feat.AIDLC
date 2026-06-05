import { type Result } from '@spa-bridge/core-model';
import { type ProviderAdapterKind, type ProviderAuditEvent, type ProviderInvocationRequest } from '../types.js';
export declare const buildProviderAuditEvent: (input: {
    eventType: string;
    severity: ProviderAuditEvent["severity"];
    runId: string;
    correlationId: string;
    mappingRequestId: string;
    providerId?: string;
    adapterKind?: ProviderAdapterKind;
    reasonCodes?: string[];
    safeMessage: string;
    safeRefs?: ProviderAuditEvent["safeRefs"];
    counts?: Partial<ProviderAuditEvent["counts"]>;
}) => Result<ProviderAuditEvent, Error>;
export declare const buildInvocationAuditEvent: (request: ProviderInvocationRequest, eventType: string, severity: ProviderAuditEvent["severity"], reasonCodes: string[], safeMessage: string, counts?: Partial<ProviderAuditEvent["counts"]>) => Result<ProviderAuditEvent, Error>;
//# sourceMappingURL=provider-audit-event-builder.d.ts.map