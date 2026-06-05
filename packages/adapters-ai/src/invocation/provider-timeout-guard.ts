import { createSafeDisplayString, err, ok, type Result } from '@spa-bridge/core-model';

import { ProviderErrorSchema, type ProviderError, type ProviderInvocationRequest, type ProviderResponse } from '../types.js';
import { type ProviderAdapter } from '../adapters/provider-adapters.js';

const createProviderError = (code: ProviderError['code'], message: string, providerId?: string): ProviderError =>
  ProviderErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    providerId,
    retryable: code === 'TIMEOUT',
  });

export type RetryStrategy = {
  maxAttempts: number;
  allowDeterministicRetry: boolean;
};

export const defaultRetryStrategy: RetryStrategy = {
  maxAttempts: 1,
  allowDeterministicRetry: false,
};

export const invokeWithTimeout = async (
  adapter: ProviderAdapter,
  request: ProviderInvocationRequest,
  retryStrategy: RetryStrategy = defaultRetryStrategy,
): Promise<Result<ProviderResponse, ProviderError>> => {
  const attempts = Math.max(1, retryStrategy.maxAttempts);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const timeoutPromise = new Promise<Result<ProviderResponse, ProviderError>>((resolve) => {
      const timeoutHandle = setTimeout(() => {
        clearTimeout(timeoutHandle);
        resolve(err(createProviderError('TIMEOUT', `Provider ${adapter.descriptor.providerId} timed out`, adapter.descriptor.providerId)));
      }, request.timeoutMs);
    });

    const invokePromise = adapter.invoke(request);
    const result = await Promise.race([invokePromise, timeoutPromise]);

    if (result.ok) {
      return result;
    }

    if (result.error.code !== 'TIMEOUT' || !retryStrategy.allowDeterministicRetry || attempt === attempts) {
      return result;
    }
  }

  return err(createProviderError('TIMEOUT', `Provider ${adapter.descriptor.providerId} timed out`, adapter.descriptor.providerId));
};
