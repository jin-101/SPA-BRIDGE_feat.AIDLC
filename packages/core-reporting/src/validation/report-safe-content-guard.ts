import type { Result } from '@spa-bridge/core-model';
import { createSafeDisplayString, validateSchema } from '@spa-bridge/core-model';

import { createReportError, validationIssueFromPath, type ReportError } from '../shared-errors.js';
import { SafeRelativePathSchema, SafeReportTextSchema } from '../types.js';

const UNSAFE_TEXT_PATTERN = /<\s*script|<\/\s*script|javascript:|on\w+\s*=|<\s*iframe|<\s*object|<\s*embed/i;

export const containsUnsafeText = (value: string): boolean => UNSAFE_TEXT_PATTERN.test(value);

export const guardSafeReportText = (value: string, fieldPath: string): Result<string, ReportError> => {
  if (containsUnsafeText(value)) {
    return {
      ok: false,
      error: createReportError('UNSAFE_CONTENT', `Unsafe content detected at ${fieldPath}.`, [
        validationIssueFromPath([fieldPath], 'Unsafe content is not allowed.'),
      ]),
    };
  }

  const parsed = validateSchema(SafeReportTextSchema, value);
  if (!parsed.ok) {
    return {
      ok: false,
      error: createReportError('VALIDATION_FAILED', `Invalid report text at ${fieldPath}.`, parsed.error.issues),
    };
  }

  return { ok: true, value: createSafeDisplayString(parsed.value) };
};

export const guardSafeRelativePath = (value: string, fieldPath: string): Result<string, ReportError> => {
  const parsed = validateSchema(SafeRelativePathSchema, value);
  if (!parsed.ok) {
    return {
      ok: false,
      error: createReportError('VALIDATION_FAILED', `Invalid report path at ${fieldPath}.`, parsed.error.issues),
    };
  }

  return { ok: true, value: parsed.value };
};

export const scanForUnsafeContent = (value: unknown, path: Array<string | number> = []): Result<void, ReportError> => {
  const issues: ReturnType<typeof validationIssueFromPath>[] = [];

  const walk = (current: unknown, currentPath: Array<string | number>): void => {
    if (typeof current === 'string') {
      if (containsUnsafeText(current)) {
        issues.push(validationIssueFromPath(currentPath, 'Unsafe content is not allowed.'));
      }
      return;
    }

    if (Array.isArray(current)) {
      current.forEach((item, index) => walk(item, [...currentPath, index]));
      return;
    }

    if (current && typeof current === 'object') {
      for (const [key, item] of Object.entries(current)) {
        walk(item, [...currentPath, key]);
      }
    }
  };

  walk(value, path);

  if (issues.length > 0) {
    return {
      ok: false,
      error: createReportError('UNSAFE_CONTENT', 'Unsafe report content was detected.', issues),
    };
  }

  return { ok: true, value: undefined };
};
