import { createHash } from 'node:crypto';
import { err, ok } from '@spa-bridge/core-model';
export class QualityError extends Error {
    code;
    details;
    constructor(code, message, details = []) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'QualityError';
    }
}
export const createQualityError = (code, message, details = []) => new QualityError(code, message, details);
export const createQualityErrorResult = (code, message, details = []) => err(createQualityError(code, message, details));
export const createQualityOk = ok;
const normalizeValue = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeValue(item));
    }
    if (value && typeof value === 'object') {
        return Object.keys(value)
            .sort()
            .reduce((accumulator, key) => {
            accumulator[key] = normalizeValue(value[key]);
            return accumulator;
        }, {});
    }
    return value;
};
export const stableStringify = (value) => JSON.stringify(normalizeValue(value));
export const createStableHash = (value) => {
    return createHash('sha256').update(stableStringify(value)).digest('hex');
};
//# sourceMappingURL=shared-errors.js.map