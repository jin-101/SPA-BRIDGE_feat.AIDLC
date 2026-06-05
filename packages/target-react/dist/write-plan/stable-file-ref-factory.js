export class StableFileRefFactory {
    create(pathValue, hash) {
        return {
            kind: 'generated',
            path: `generated:${pathValue}:${hash.slice(0, 16)}`,
        };
    }
}
//# sourceMappingURL=stable-file-ref-factory.js.map