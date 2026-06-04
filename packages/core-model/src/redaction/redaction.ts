import { z } from 'zod';

declare const redactedStringBrand: unique symbol;
declare const safeDisplayStringBrand: unique symbol;

export type RedactedString = string & {
  readonly [redactedStringBrand]: true;
};

export type SafeDisplayString = string & {
  readonly [safeDisplayStringBrand]: true;
};

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
