import type { TargetGenerationError, TargetGenerationErrorCode } from './types.js';

export const createTargetGenerationError = (
  code: TargetGenerationErrorCode,
  message: string,
  details: string[] = [],
): TargetGenerationError => ({
  code,
  message,
  details: details.length > 0 ? details : undefined,
});

export const isTargetGenerationError = (value: unknown): value is TargetGenerationError =>
  typeof value === 'object' &&
  value !== null &&
  'code' in value &&
  'message' in value;
