import { createHash } from 'node:crypto';
export const stableHash = (input) => createHash('sha1').update(input).digest('hex').slice(0, 16);
export const compareStrings = (left, right) => left.localeCompare(right);
export const hasForbiddenContextField = (key) => {
    const normalized = key.toLowerCase();
    return (normalized.includes('raw') ||
        normalized.includes('prompt') ||
        normalized.includes('secret') ||
        normalized.includes('credential') ||
        normalized.includes('token') ||
        normalized.includes('cookie') ||
        normalized.includes('password') ||
        normalized.includes('private') ||
        normalized.includes('source'));
};
export const normalizeKeyList = (keys) => [...new Set(keys)].sort(compareStrings);
//# sourceMappingURL=internal.js.map