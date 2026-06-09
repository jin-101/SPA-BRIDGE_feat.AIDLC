import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { PathGuard } from '../path/path-guard.js';
const sortStrings = (values) => [...new Set(values)].sort((left, right) => left.localeCompare(right));
const toPosixPath = (value) => value.replace(/\\/g, '/');
const aliasId = (prefix, value) => `${prefix}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'root'}`;
const normalizeAliasTarget = (target) => target.replace(/\*+$/g, '').replace(/\/+$/g, '');
const statusPriority = {
    supported: 0,
    unresolved: 1,
    external: 2,
    unsafe: 3,
};
export class AliasAnalyzer {
    pathGuard;
    constructor(pathGuard = new PathGuard()) {
        this.pathGuard = pathGuard;
    }
    async analyze(projectRoot, sourceRoot) {
        const root = this.pathGuard.canonicalize(projectRoot);
        const source = this.pathGuard.canonicalize(sourceRoot);
        const diagnostics = [];
        const configs = await this.readTsConfigChain(root, diagnostics);
        const angularJson = await this.readAngularJson(path.join(root, 'angular.json'), diagnostics);
        const mergedBaseUrl = this.resolveBaseUrl(root, configs);
        const paths = this.buildPathAliases(root, mergedBaseUrl ?? root, configs, diagnostics);
        const workspaceProjects = this.buildWorkspaceProjects(root, angularJson, diagnostics);
        const assetRoots = this.buildAssetRoots(root, source, angularJson);
        const allDiagnostics = [...diagnostics, ...paths.flatMap((mapping) => this.diagnosticsForMapping(mapping))];
        const sortedPaths = [...paths].sort((left, right) => statusPriority[left.status] - statusPriority[right.status] ||
            left.aliasPattern.localeCompare(right.aliasPattern) ||
            left.sourceConfigPath.localeCompare(right.sourceConfigPath));
        const sortedProjects = [...workspaceProjects].sort((left, right) => left.projectName.localeCompare(right.projectName));
        return {
            schemaVersion: 1,
            baseUrl: mergedBaseUrl,
            configFiles: sortStrings(configs.map((config) => config.filePath)),
            paths: sortedPaths,
            workspaceProjects: sortedProjects,
            assetRoots: sortStrings(assetRoots),
            diagnostics: allDiagnostics.sort((left, right) => left.code.localeCompare(right.code) || (left.aliasPattern ?? '').localeCompare(right.aliasPattern ?? '')),
            summary: {
                totalAliases: sortedPaths.length + sortedProjects.length,
                supportedAliases: sortedPaths.filter((mapping) => mapping.status === 'supported').length + sortedProjects.filter((mapping) => mapping.status === 'supported').length,
                unresolvedAliases: sortedPaths.filter((mapping) => mapping.status === 'unresolved').length + sortedProjects.filter((mapping) => mapping.status === 'unresolved').length,
                unsafeAliases: sortedPaths.filter((mapping) => mapping.status === 'unsafe').length + sortedProjects.filter((mapping) => mapping.status === 'unsafe').length,
                externalAliases: sortedPaths.filter((mapping) => mapping.status === 'external').length + sortedProjects.filter((mapping) => mapping.status === 'external').length,
            },
        };
    }
    async readTsConfigChain(projectRoot, diagnostics) {
        const candidates = ['tsconfig.base.json', 'tsconfig.json', 'tsconfig.app.json'].map((name) => path.join(projectRoot, name));
        const records = new Map();
        for (const candidate of candidates) {
            await this.readTsConfigRecursive(projectRoot, candidate, records, diagnostics);
        }
        return [...records.values()].sort((left, right) => left.filePath.localeCompare(right.filePath));
    }
    async readTsConfigRecursive(projectRoot, filePath, records, diagnostics) {
        const contained = this.pathGuard.contains(projectRoot, filePath);
        if (!contained.ok) {
            diagnostics.push(this.toAliasDiagnostic('SPA-ALIAS-UNSAFE-EXTENDS', 'security-blocker', contained.error.message, filePath));
            return;
        }
        const absolutePath = contained.value.absolutePath;
        if (records.has(absolutePath)) {
            return;
        }
        let text;
        try {
            text = await fs.readFile(absolutePath, 'utf8');
        }
        catch {
            return;
        }
        const parsed = ts.parseConfigFileTextToJson(absolutePath, text);
        if (parsed.error || typeof parsed.config !== 'object') {
            diagnostics.push(this.toAliasDiagnostic('SPA-ALIAS-CONFIG-PARSE', 'warning', `Unable to parse tsconfig at ${path.basename(absolutePath)}.`, absolutePath));
            return;
        }
        const config = parsed.config;
        records.set(absolutePath, { filePath: absolutePath, config });
        if (config.extends && !config.extends.startsWith('@')) {
            const extendedPath = config.extends.endsWith('.json') ? config.extends : `${config.extends}.json`;
            await this.readTsConfigRecursive(projectRoot, path.resolve(path.dirname(absolutePath), extendedPath), records, diagnostics);
        }
    }
    resolveBaseUrl(projectRoot, configs) {
        for (const record of [...configs].reverse()) {
            const baseUrl = record.config.compilerOptions?.baseUrl;
            if (typeof baseUrl === 'string' && baseUrl.trim().length > 0) {
                const resolved = path.resolve(path.dirname(record.filePath), baseUrl);
                const contained = this.pathGuard.contains(projectRoot, resolved);
                return contained.ok ? contained.value.absolutePath : undefined;
            }
        }
        return undefined;
    }
    buildPathAliases(projectRoot, baseUrl, configs, diagnostics) {
        const mappings = new Map();
        for (const record of configs) {
            const paths = record.config.compilerOptions?.paths ?? {};
            for (const [aliasPattern, targets] of Object.entries(paths)) {
                if (!Array.isArray(targets)) {
                    diagnostics.push(this.toAliasDiagnostic('SPA-ALIAS-INVALID-TARGET', 'warning', `Alias ${aliasPattern} has an invalid target list.`, record.filePath, aliasPattern));
                    continue;
                }
                const resolvedTargets = [];
                let status = 'supported';
                for (const target of targets) {
                    const normalizedTarget = normalizeAliasTarget(target);
                    if (/^(https?:|data:|node:)/i.test(normalizedTarget)) {
                        status = 'external';
                        continue;
                    }
                    const resolved = path.resolve(baseUrl, normalizedTarget);
                    const contained = this.pathGuard.contains(projectRoot, resolved);
                    if (!contained.ok) {
                        status = 'unsafe';
                        continue;
                    }
                    resolvedTargets.push(contained.value.absolutePath);
                }
                if (resolvedTargets.length === 0 && status === 'supported') {
                    status = 'unresolved';
                }
                mappings.set(aliasPattern, {
                    id: aliasId('alias', aliasPattern),
                    aliasPattern,
                    targetPatterns: sortStrings(targets),
                    resolvedTargets: sortStrings(resolvedTargets),
                    sourceConfigPath: record.filePath,
                    status,
                });
            }
        }
        return [...mappings.values()];
    }
    async readAngularJson(filePath, diagnostics) {
        try {
            const text = await fs.readFile(filePath, 'utf8');
            return JSON.parse(text);
        }
        catch {
            diagnostics.push(this.toAliasDiagnostic('SPA-ALIAS-ANGULAR-JSON', 'warning', 'Unable to read Angular workspace project aliases.', filePath));
            return undefined;
        }
    }
    buildWorkspaceProjects(projectRoot, angularJson, diagnostics) {
        const entries = Object.entries(angularJson?.projects ?? {});
        return entries.map(([projectName, project]) => {
            const projectRootPath = path.resolve(projectRoot, project.root ?? '.');
            const sourceRootPath = project.sourceRoot ? path.resolve(projectRoot, project.sourceRoot) : undefined;
            const projectContained = this.pathGuard.contains(projectRoot, projectRootPath);
            const sourceContained = sourceRootPath ? this.pathGuard.contains(projectRoot, sourceRootPath) : undefined;
            const status = !projectContained.ok || (sourceContained && !sourceContained.ok) ? 'unsafe' : 'supported';
            if (status === 'unsafe') {
                diagnostics.push(this.toAliasDiagnostic('SPA-ALIAS-UNSAFE-PROJECT', 'security-blocker', `Angular project ${projectName} points outside the workspace root.`, projectRootPath, projectName));
            }
            return {
                id: aliasId('project', projectName),
                projectName,
                projectRoot: projectContained.ok ? projectContained.value.absolutePath : projectRootPath,
                sourceRoot: sourceContained?.ok ? sourceContained.value.absolutePath : undefined,
                projectType: project.projectType,
                status,
            };
        });
    }
    buildAssetRoots(projectRoot, sourceRoot, angularJson) {
        const roots = [path.join(sourceRoot, 'assets')];
        for (const project of Object.values(angularJson?.projects ?? {})) {
            const assets = project.architect?.build?.options?.assets ?? [];
            for (const asset of assets) {
                const input = typeof asset === 'string' ? asset : asset.input;
                if (input) {
                    const resolved = path.resolve(projectRoot, input);
                    if (this.pathGuard.contains(projectRoot, resolved).ok) {
                        roots.push(resolved);
                    }
                }
            }
        }
        return roots;
    }
    diagnosticsForMapping(mapping) {
        if (mapping.status === 'supported') {
            return [];
        }
        const code = mapping.status === 'unsafe' ? 'SPA-ALIAS-UNSAFE-PATH' : mapping.status === 'external' ? 'SPA-ALIAS-EXTERNAL-PATH' : 'SPA-ALIAS-UNRESOLVED';
        const severity = mapping.status === 'unsafe' ? 'security-blocker' : 'manual-review';
        return [this.toAliasDiagnostic(code, severity, `Alias ${mapping.aliasPattern} requires manual review before target alias materialization.`, mapping.sourceConfigPath, mapping.aliasPattern)];
    }
    toAliasDiagnostic(code, severity, message, sourcePath, aliasPattern) {
        return {
            code,
            severity,
            message,
            sourcePath,
            aliasPattern,
        };
    }
}
//# sourceMappingURL=alias-analyzer.js.map