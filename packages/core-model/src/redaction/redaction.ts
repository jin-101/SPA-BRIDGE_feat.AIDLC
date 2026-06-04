import { z } from 'zod';
export type RedactedString = string;
export type SafeDisplayString = string;

export const REDACTED_VALUE = '[REDACTED]';

export const RedactedStringSchema = z
  .string()
  .min(1)
  .refine((value) => value === REDACTED_VALUE || value.startsWith(`${REDACTED_VALUE}:`), {
    message: 'Redacted strings must use the canonical redaction marker.',
  })
  .transform((value) => value as RedactedString);

export const SafeDisplayStringSchema = z
  .string()
  .transform((value) => value.replace(/\s+/g, ' ').trim())
  .transform((value) => value as SafeDisplayString);

export const createRedactedString = (reason?: string): RedactedString =>
  (reason ? `${REDACTED_VALUE}:${reason}` : REDACTED_VALUE) as RedactedString;

export const createSafeDisplayString = (value: string): SafeDisplayString =>
  value.replace(/\s+/g, ' ').trim() as SafeDisplayString;

export const isRedactedString = (value: string): value is RedactedString =>
  value === REDACTED_VALUE || value.startsWith(`${REDACTED_VALUE}:`);
