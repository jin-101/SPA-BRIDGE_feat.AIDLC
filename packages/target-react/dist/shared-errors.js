export const createTargetGenerationError = (code, message, details = []) => ({
    code,
    message,
    details: details.length > 0 ? details : undefined,
});
export const isTargetGenerationError = (value) => typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value;
//# sourceMappingURL=shared-errors.js.map