import { createHash } from 'node:crypto';

export const stableHash = (input: string): string =>
  createHash('sha1').update(input).digest('hex').slice(0, 16);

export const compareStrings = (left: string, right: string): number => left.localeCompare(right);

export const hasForbiddenContextField = (key: string): boolean => {
  const normalized = key.toLowerCase();

  return (
    normalized.includes('raw') ||
    normalized.includes('prompt') ||
    normalized.includes('secret') ||
    normalized.includes('credential') ||
    normalized.includes('token') ||
    normalized.includes('cookie') ||
    normalized.includes('password') ||
    normalized.includes('private') ||
    normalized.includes('source')
  );
};

export const normalizeKeyList = (keys: string[]): string[] => [...new Set(keys)].sort(compareStrings);
