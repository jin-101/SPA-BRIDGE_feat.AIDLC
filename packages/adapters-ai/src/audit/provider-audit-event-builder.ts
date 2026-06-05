import { createSafeDisplayString, err, ok, type Result } from '@spa-bridge/core-model';

import {
  ProviderAuditEventSchema,
  type ProviderAdapterKind,
  type ProviderAuditEvent,
  type ProviderInvocationRequest,
} from '../types.js';
import { stableHash } from '../internal.js';

export const buildProviderAuditEvent = (
  input: {
    eventType: string;
    severity: ProviderAuditEvent['severity'];
    runId: string;
    correlationId: string;
    mappingRequestId: string;
    providerId?: string;
    adapterKind?: ProviderAdapterKind;
    reasonCodes?: string[];
    safeMessage: string;
    safeRefs?: ProviderAuditEvent['safeRefs'];
    counts?: Partial<ProviderAuditEvent['counts']>;
  },
): Result<ProviderAuditEvent, Error> => {
  const event = ProviderAuditEventSchema.safeParse({
    eventId: `evt-${stableHash([input.eventType, input.runId, input.correlationId, input.mappingRequestId, input.providerId ?? 'none'].join('|'))}`,
    eventType: input.eventType,
    severity: input.severity,
    runId: input.runId,
    correlationId: input.correlationId,
    mappingRequestId: input.mappingRequestId,
    providerId: input.providerId,
    adapterKind: input.adapterKind,
    reasonCodes: input.reasonCodes ?? [],
    safeMessage: createSafeDisplayString(input.safeMessage),
    safeRefs: input.safeRefs ?? [],
    counts: {
      suggestions: input.counts?.suggestions ?? 0,
      blockedDecisions: input.counts?.blockedDecisions ?? 0,
      manualReviewItems: input.counts?.manualReviewItems ?? 0,
    },
  });

  if (!event.success) {
    return err(new Error('Unsafe provider audit event'));
  }

  return ok(event.data);
};

export const buildInvocationAuditEvent = (
  request: ProviderInvocationRequest,
  eventType: string,
  severity: ProviderAuditEvent['severity'],
  reasonCodes: string[],
  safeMessage: string,
  counts: Partial<ProviderAuditEvent['counts']> = {},
): Result<ProviderAuditEvent, Error> =>
  buildProviderAuditEvent({
    eventType,
    severity,
    runId: request.requestMetadata.runId ?? request.context.mappingRequestId,
    correlationId: request.requestMetadata.correlationId ?? request.context.policyEvidenceRef,
    mappingRequestId: request.context.mappingRequestId,
    providerId: request.providerId,
    adapterKind: request.adapterKind,
    reasonCodes,
    safeMessage,
    safeRefs: request.context.safeRefs,
    counts,
  });
