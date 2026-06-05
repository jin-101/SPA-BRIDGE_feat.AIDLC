import { createSafeDisplayString, err, ok, type Result } from '@spa-bridge/core-model';

import {
  ProviderErrorSchema,
  ProviderResponseSchema,
  RefinementSuggestionSchema,
  type ProviderError,
  type ProviderInvocationRequest,
  type ProviderResponse,
} from '../types.js';

const createProviderError = (code: ProviderError['code'], message: string, providerId?: string): ProviderError =>
  ProviderErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    providerId,
    retryable: false,
  });

export const validateProviderResponse = (
  input: unknown,
  request: ProviderInvocationRequest,
): Result<ProviderResponse, ProviderError> => {
  const parsed = ProviderResponseSchema.safeParse(input);

  if (!parsed.success) {
    return err(createProviderError('INVALID_RESPONSE', 'Provider response failed schema validation', request.providerId));
  }

  if (parsed.data.mappingRequestId !== request.context.mappingRequestId) {
    return err(createProviderError('INVALID_RESPONSE', 'Provider response mappingRequestId mismatch', request.providerId));
  }

  for (const suggestion of parsed.data.suggestions) {
    const suggestionCheck = RefinementSuggestionSchema.safeParse(suggestion);
    if (!suggestionCheck.success) {
      return err(createProviderError('INVALID_RESPONSE', 'Provider suggestion failed schema validation', request.providerId));
    }

    if (suggestionCheck.data.mappingRequestId !== request.context.mappingRequestId) {
      return err(createProviderError('INVALID_RESPONSE', 'Provider suggestion mappingRequestId mismatch', request.providerId));
    }
  }

  return ok(parsed.data);
};
