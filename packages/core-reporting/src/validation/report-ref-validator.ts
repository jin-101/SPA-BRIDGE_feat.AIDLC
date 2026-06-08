import type { GeneratedArtifactRef, SourceRef, TraceLink } from '@spa-bridge/core-model';
import { GeneratedArtifactRefSchema, SourceRefSchema, TraceLinkSchema } from '@spa-bridge/core-model';

import { createReportError, validationIssueFromPath, type ReportError } from '../shared-errors.js';

const ABSOLUTE_PATH_PATTERN = /^(?:[A-Za-z]:[\\/]|\/)/;
const TRAVERSAL_PATTERN = /(^|[\\/])\.\.([\\/]|$)/;

const isSafeRelativePath = (value: string): boolean =>
  value.trim().length > 0 && !ABSOLUTE_PATH_PATTERN.test(value) && !TRAVERSAL_PATTERN.test(value) && !value.includes('\0');

export const validateSourceRef = (ref: SourceRef, fieldPath: string): SourceRef | ReportError => {
  const parsed = SourceRefSchema.safeParse(ref);
  if (!parsed.success) {
    return createReportError('VALIDATION_FAILED', `Invalid source ref at ${fieldPath}.`, parsed.error.issues.map((issue) => ({
      path: [...issue.path],
      code: issue.code,
      message: issue.message,
    })));
  }

  if (!isSafeRelativePath(parsed.data.path)) {
    return createReportError('VALIDATION_FAILED', `Unsafe source path at ${fieldPath}.`, [
      validationIssueFromPath([fieldPath, 'path'], 'Source paths must be safe relative paths.'),
    ]);
  }

  return parsed.data;
};

export const validateGeneratedArtifactRef = (
  ref: GeneratedArtifactRef,
  fieldPath: string,
): GeneratedArtifactRef | ReportError => {
  const parsed = GeneratedArtifactRefSchema.safeParse(ref);
  if (!parsed.success) {
    return createReportError('VALIDATION_FAILED', `Invalid generated artifact ref at ${fieldPath}.`, parsed.error.issues.map((issue) => ({
      path: [...issue.path],
      code: issue.code,
      message: issue.message,
    })));
  }

  if (!isSafeRelativePath(parsed.data.path)) {
    return createReportError('VALIDATION_FAILED', `Unsafe generated artifact path at ${fieldPath}.`, [
      validationIssueFromPath([fieldPath, 'path'], 'Generated artifact paths must be safe relative paths.'),
    ]);
  }

  return parsed.data;
};

export const validateTraceLink = (link: TraceLink, fieldPath: string): TraceLink | ReportError => {
  const parsed = TraceLinkSchema.safeParse(link);
  if (!parsed.success) {
    return createReportError('VALIDATION_FAILED', `Invalid trace link at ${fieldPath}.`, parsed.error.issues.map((issue) => ({
      path: [...issue.path],
      code: issue.code,
      message: issue.message,
    })));
  }

  const sourceCheck = validateSourceRef(parsed.data.source, `${fieldPath}.source`);
  if ('code' in sourceCheck) {
    return sourceCheck;
  }

  if (parsed.data.target.kind === 'generated') {
    const targetCheck = validateGeneratedArtifactRef(parsed.data.target, `${fieldPath}.target`);
    if ('code' in targetCheck) {
      return targetCheck;
    }
  }

  return parsed.data;
};

export const ensureUniqueKeys = <T>(
  items: T[],
  keySelector: (item: T) => string,
  fieldName: string,
): ReportError | undefined => {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const item of items) {
    const key = keySelector(item);
    if (seen.has(key)) {
      duplicates.push(key);
    } else {
      seen.add(key);
    }
  }

  if (duplicates.length > 0) {
    return createReportError('VALIDATION_FAILED', `Duplicate ${fieldName} values were detected.`, duplicates.map((value, index) => ({
      path: [fieldName, index],
      code: 'duplicate',
      message: `Duplicate value: ${value}`,
    })));
  }

  return undefined;
};
