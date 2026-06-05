import { createSafeDisplayString, err } from '@spa-bridge/core-model';
import { ProviderErrorSchema } from '../types.js';
const createProviderError = (code, message, providerId) => ProviderErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    providerId,
    retryable: code === 'TIMEOUT',
});
export const defaultRetryStrategy = {
    maxAttempts: 1,
    allowDeterministicRetry: false,
};
export const invokeWithTimeout = async (adapter, request, retryStrategy = defaultRetryStrategy) => {
    const attempts = Math.max(1, retryStrategy.maxAttempts);
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const timeoutPromise = new Promise((resolve) => {
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
//# sourceMappingURL=provider-timeout-guard.js.map