import { createHash } from 'node:crypto';
export const createStableId = (prefix, parts) => {
    const normalized = parts
        .map((part) => (part === undefined || part === null ? '' : String(part)))
        .join('|');
    const digest = createHash('sha256').update(`${prefix}|${normalized}`).digest('hex').slice(0, 16);
    return `${prefix}_${digest}`;
};
//# sourceMappingURL=stable-id.js.map