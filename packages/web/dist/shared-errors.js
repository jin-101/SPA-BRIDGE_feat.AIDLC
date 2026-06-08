import { createSafeDisplayString } from '@spa-bridge/core-model';
export const createWebUiError = (code, message, detail, context) => ({
    code,
    message: createSafeDisplayString(message),
    detail: detail ? createSafeDisplayString(detail) : undefined,
    context,
});
//# sourceMappingURL=shared-errors.js.map