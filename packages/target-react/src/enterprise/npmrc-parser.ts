import type { ParsedNpmrcEntry, SourceNpmrcFileInput } from '../types.js';

const SECRET_KEY_PATTERN = /(?:^|:|\/\/)(?:_authToken|_auth|username|password)$|(?:token|password|secret|auth)/i;

const bySourceAndLine = (left: ParsedNpmrcEntry, right: ParsedNpmrcEntry): number =>
  `${left.sourcePath}:${left.lineNumber.toString().padStart(8, '0')}`.localeCompare(
    `${right.sourcePath}:${right.lineNumber.toString().padStart(8, '0')}`,
  );

const classifyKey = (key: string): ParsedNpmrcEntry['kind'] => {
  if (SECRET_KEY_PATTERN.test(key)) {
    return 'secret';
  }
  if (key === 'registry') {
    return 'registry';
  }
  if (/^@[^:]+:registry$/.test(key)) {
    return 'scope-registry';
  }
  return 'safe-config';
};

const placeholderFor = (key: string): string => {
  const envName = key
    .replace(/^\/\//, '')
    .replace(/[:/.-]+/g, '_')
    .replace(/[^A-Za-z0-9_]/g, '')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
  return `${key}=\${${envName || 'NPM_REGISTRY_SECRET'}}`;
};

export class NpmrcParser {
  parse(files: SourceNpmrcFileInput[] = []): ParsedNpmrcEntry[] {
    return files
      .flatMap((file) =>
        file.lines.map((line, index): ParsedNpmrcEntry => {
          const lineNumber = index + 1;
          const trimmed = line.trim();
          if (!trimmed) {
            return { sourcePath: file.sourcePath, lineNumber, kind: 'blank', redacted: false };
          }
          if (trimmed.startsWith('#') || trimmed.startsWith(';')) {
            return { sourcePath: file.sourcePath, lineNumber, kind: 'comment', redacted: false, safeLine: trimmed };
          }

          const separatorIndex = trimmed.indexOf('=');
          if (separatorIndex <= 0) {
            return { sourcePath: file.sourcePath, lineNumber, kind: 'unsupported', redacted: true };
          }

          const key = trimmed.slice(0, separatorIndex).trim();
          const value = trimmed.slice(separatorIndex + 1).trim();
          const kind = classifyKey(key);
          if (kind === 'secret') {
            return {
              sourcePath: file.sourcePath,
              lineNumber,
              key,
              kind,
              redacted: true,
              placeholderLine: placeholderFor(key),
            };
          }

          return {
            sourcePath: file.sourcePath,
            lineNumber,
            key,
            value,
            kind,
            redacted: false,
            safeLine: `${key}=${value}`,
            placeholderLine: `${key}=${value}`,
          };
        }),
      )
      .sort(bySourceAndLine);
  }
}
