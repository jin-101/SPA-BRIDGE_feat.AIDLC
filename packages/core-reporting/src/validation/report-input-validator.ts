import type { Result } from '@spa-bridge/core-model';
import { validateSchema } from '@spa-bridge/core-model';

import { createReportError, type ReportError } from '../shared-errors.js';
import type { ReportGenerationRequest, ReportInputBundle } from '../types.js';
import { ReportGenerationRequestSchema, ReportInputBundleSchema } from '../types.js';
import { scanForUnsafeContent } from './report-safe-content-guard.js';
import { ensureUniqueKeys, validateGeneratedArtifactRef, validateSourceRef, validateTraceLink } from './report-ref-validator.js';

const validateUniqueIdentifierCollections = (bundle: ReportInputBundle): ReportError | undefined => {
  const checks = [
    ensureUniqueKeys(bundle.diagnostics, (item) => item.id, 'diagnostics'),
    ensureUniqueKeys(bundle.aiDecisions, (item) => item.id, 'aiDecisions'),
    ensureUniqueKeys(bundle.manualReview, (item) => item.id, 'manualReview'),
    ensureUniqueKeys(bundle.quality.gateRuns, (item) => item.gateId, 'quality.gateRuns'),
    ensureUniqueKeys(bundle.quality.pbtRuns, (item) => item.planId, 'quality.pbtRuns'),
    ensureUniqueKeys(bundle.traceability.links, (item) => item.id, 'traceability.links'),
    ensureUniqueKeys(bundle.traceability.syntheticOrigins, (item) => `${item.kind}:${item.path}`, 'traceability.syntheticOrigins'),
    ensureUniqueKeys(bundle.conversionOutput.generatedRefs, (item) => `${item.kind}:${item.path}:${item.segment ?? ''}`, 'conversionOutput.generatedRefs'),
  ].filter((value): value is ReportError => Boolean(value));

  return checks[0];
};

const validateRefs = (bundle: ReportInputBundle): ReportError | undefined => {
  for (const [index, ref] of bundle.sourceInventory.sourceRefs.entries()) {
    const result = validateSourceRef(ref, `inputBundle.sourceInventory.sourceRefs[${index}]`);
    if ('code' in result) {
      return result;
    }
  }

  for (const [index, ref] of bundle.conversionOutput.generatedRefs.entries()) {
    const result = validateGeneratedArtifactRef(ref, `inputBundle.conversionOutput.generatedRefs[${index}]`);
    if ('code' in result) {
      return result;
    }
  }

  for (const [index, link] of bundle.traceability.links.entries()) {
    const result = validateTraceLink(link, `inputBundle.traceability.links[${index}]`);
    if ('code' in result) {
      return result;
    }
  }

  return undefined;
};

export const validateReportInputBundle = (input: unknown): Result<ReportInputBundle, ReportError> => {
  const parsed = validateSchema(ReportInputBundleSchema, input);
  if (!parsed.ok) {
    return {
      ok: false,
      error: createReportError('VALIDATION_FAILED', 'Report input bundle failed schema validation.', parsed.error.issues),
    };
  }

  const bundle = parsed.value as ReportInputBundle;

  const unsafeResult = scanForUnsafeContent(bundle);
  if (!unsafeResult.ok) {
    return unsafeResult;
  }

  const refError = validateRefs(bundle);
  if (refError) {
    return { ok: false, error: refError };
  }

  const duplicateError = validateUniqueIdentifierCollections(bundle);
  if (duplicateError) {
    return { ok: false, error: duplicateError };
  }

  return { ok: true, value: bundle };
};

export const validateReportGenerationRequest = (
  input: unknown,
): Result<ReportGenerationRequest, ReportError> => {
  const parsed = validateSchema(ReportGenerationRequestSchema, input);
  if (!parsed.ok) {
    return {
      ok: false,
      error: createReportError('VALIDATION_FAILED', 'Report generation request failed schema validation.', parsed.error.issues),
    };
  }

  const request = parsed.value as ReportGenerationRequest;
  const bundleResult = validateReportInputBundle(request.inputBundle);
  if (!bundleResult.ok) {
    return bundleResult;
  }

  return { ok: true, value: { ...request, inputBundle: bundleResult.value } };
};
