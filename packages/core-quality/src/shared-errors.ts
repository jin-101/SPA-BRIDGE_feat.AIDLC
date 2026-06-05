import { createHash } from 'node:crypto';

import { err, ok, type Result } from '@spa-bridge/core-model';

export type QualityErrorCode =
  | 'INVALID_REQUEST'
  | 'INVALID_GATE'
  | 'INVALID_RUNNER'
  | 'VALIDATION_FAILED'
  | 'BLOCKED'
  | 'MANUAL_REVIEW_REQUIRED'
  | 'PBT_REPLAY_FAILED';

export class QualityError extends Error {
  constructor(
    public readonly code: QualityErrorCode,
    message: string,
    public readonly details: string[] = [],
  ) {
    super(message);
    this.name = 'QualityError';
  }
}

export const createQualityError = (code: QualityErrorCode, message: string, details: string[] = []): QualityError =>
  new QualityError(code, message, details);

export const createQualityErrorResult = <T>(code: QualityErrorCode, message: string, details: string[] = []): Result<T, QualityError> =>
  err(createQualityError(code, message, details));

export const createQualityOk = ok;

const normalizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item));
  }

  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((accumulator, key) => {
        accumulator[key] = normalizeValue((value as Record<string, unknown>)[key]);
        return accumulator;
      }, {});
  }

  return value;
};

export const stableStringify = (value: unknown): string => JSON.stringify(normalizeValue(value));

export const createStableHash = (value: unknown): string => {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
};
