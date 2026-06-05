import { createSafeDisplayString } from '@spa-bridge/core-model';

import { ProviderErrorSchema, type ProviderError } from './types.js';

export const createProviderError = (
  code: ProviderError['code'],
  message: string,
  providerId?: string,
  retryable = false,
): ProviderError =>
  ProviderErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    providerId,
    retryable,
  });
