const SECRET_KEY_PATTERN = /(?:^|:|\/\/)(?:_authToken|_auth|username|password)$|(?:token|password|secret|auth)/i;
const bySourceAndLine = (left, right) => `${left.sourcePath}:${left.lineNumber.toString().padStart(8, '0')}`.localeCompare(`${right.sourcePath}:${right.lineNumber.toString().padStart(8, '0')}`);
const classifyKey = (key) => {
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
const placeholderFor = (key) => {
    const envName = key
        .replace(/^\/\//, '')
        .replace(/[:/.-]+/g, '_')
        .replace(/[^A-Za-z0-9_]/g, '')
        .replace(/^_+|_+$/g, '')
        .toUpperCase();
    return `${key}=\${${envName || 'NPM_REGISTRY_SECRET'}}`;
};
export class NpmrcParser {
    parse(files = []) {
        return files
            .flatMap((file) => file.lines.map((line, index) => {
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
        }))
            .sort(bySourceAndLine);
    }
}
//# sourceMappingURL=npmrc-parser.js.map