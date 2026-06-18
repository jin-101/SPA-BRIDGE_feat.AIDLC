export class DeterministicFixerRegistry {
    planFixes(diagnostics) {
        const fixes = diagnostics
            .flatMap((diagnostic) => diagnostic.fixerCandidateIds.map((fixerId) => this.createFix(fixerId, diagnostic)))
            .filter((fix) => Boolean(fix));
        return [...new Map(fixes.map((fix) => [fix.idempotenceKey, fix])).values()].sort((left, right) => left.fixerId.localeCompare(right.fixerId));
    }
    createFix(fixerId, diagnostic) {
        const base = {
            fixerId,
            diagnosticIds: [diagnostic.id],
            idempotenceKey: `${fixerId}:${diagnostic.safeRef ?? diagnostic.commandId}`,
        };
        switch (fixerId) {
            case 'fix-next-client-boundary':
                return {
                    ...base,
                    category: 'next-client-boundary',
                    summary: 'Add a Next.js client boundary to generated components that use hooks, browser APIs, or event handlers.',
                    patches: [{ path: diagnostic.safeRef ?? 'src/app', description: 'Insert "use client" at the top of the affected component.', operation: 'insert', idempotenceKey: base.idempotenceKey }],
                };
            case 'fix-import-paths':
                return {
                    ...base,
                    category: 'import-path',
                    summary: 'Normalize generated relative import paths and extensions.',
                    patches: [{ path: diagnostic.safeRef ?? 'src', description: 'Rewrite unresolved generated import path.', operation: 'replace', idempotenceKey: base.idempotenceKey }],
                };
            case 'fix-helper-imports':
                return {
                    ...base,
                    category: 'missing-helper-import',
                    summary: 'Add missing imports for generated runtime helpers.',
                    patches: [{ path: diagnostic.safeRef ?? 'src', description: 'Insert missing generated helper import.', operation: 'insert', idempotenceKey: base.idempotenceKey }],
                };
            case 'fix-typescript-aliases':
                return {
                    ...base,
                    category: 'alias',
                    summary: 'Align TypeScript path aliases and generated import refs.',
                    patches: [{ path: 'tsconfig.json', description: 'Update generated TypeScript path aliases.', operation: 'replace', idempotenceKey: base.idempotenceKey }],
                };
            case 'fix-package-manifest':
                return {
                    ...base,
                    category: 'package-manifest',
                    summary: 'Repair generated package manifest dependency/script readiness.',
                    patches: [{ path: 'package.json', description: 'Update generated package manifest.', operation: 'replace', idempotenceKey: base.idempotenceKey }],
                };
            case 'fix-style-asset-refs':
                return {
                    ...base,
                    category: 'style-or-module-reference',
                    summary: 'Rewrite generated style or asset refs to copied target locations.',
                    patches: [{ path: diagnostic.safeRef ?? 'src', description: 'Rewrite generated style or asset reference.', operation: 'replace', idempotenceKey: base.idempotenceKey }],
                };
            default:
                return undefined;
        }
    }
}
//# sourceMappingURL=deterministic-fixer-registry.js.map