import { z } from 'zod';
export const REDACTED_VALUE = '[REDACTED]';
export const RedactedStringSchema = z
    .string()
    .min(1)
    .refine((value) => value === REDACTED_VALUE || value.startsWith(`${REDACTED_VALUE}:`), {
    message: 'Redacted strings must use the canonical redaction marker.',
})
    .transform((value) => value);
export const SafeDisplayStringSchema = z
    .string()
    .transform((value) => value.replace(/\s+/g, ' ').trim())
    .transform((value) => value);
export const createRedactedString = (reason) => (reason ? `${REDACTED_VALUE}:${reason}` : REDACTED_VALUE);
export const createSafeDisplayString = (value) => value.replace(/\s+/g, ' ').trim();
export const isRedactedString = (value) => value === REDACTED_VALUE || value.startsWith(`${REDACTED_VALUE}:`);
//# sourceMappingURL=redaction.js.map