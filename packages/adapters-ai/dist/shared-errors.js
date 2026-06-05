import { createSafeDisplayString } from '@spa-bridge/core-model';
import { ProviderErrorSchema } from './types.js';
export const createProviderError = (code, message, providerId, retryable = false) => ProviderErrorSchema.parse({
    code,
    message: createSafeDisplayString(message),
    providerId,
    retryable,
});
//# sourceMappingURL=shared-errors.js.map