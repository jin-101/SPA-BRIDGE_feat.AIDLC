import fs from 'node:fs/promises';
import path from 'node:path';
import { err, ok } from '@spa-bridge/core-model';
import { PathGuard } from '../path/path-guard.js';
import { createStableIdFactory } from '../model/stable-id-factory.js';
const EXCLUDED_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git', '.spa-bridge']);
const classifyFile = (filePath) => {
    const normalized = filePath.replaceAll(path.sep, '/');
    const base = path.basename(normalized);
    if (base.endsWith('.spec.ts')) {
        return { role: 'unknown', kind: 'typescript', evidence: ['spec file excluded from analysis'] };
    }
    if (base.endsWith('.component.ts')) {
        return { role: 'component', kind: 'typescript', evidence: ['component naming pattern'] };
    }
    if (base.endsWith('.module.ts')) {
        return { role: 'module', kind: 'typescript', evidence: ['module naming pattern'] };
    }
    if (base.endsWith('.directive.ts')) {
        return { role: 'directive', kind: 'typescript', evidence: ['directive naming pattern'] };
    }
    if (base.endsWith('.pipe.ts')) {
        return { role: 'pipe', kind: 'typescript', evidence: ['pipe naming pattern'] };
    }
    if (base.endsWith('.service.ts')) {
        return { role: 'service', kind: 'typescript', evidence: ['service naming pattern'] };
    }
    if (base.endsWith('.routes.ts') || base.endsWith('.routing.ts')) {
        return { role: 'route', kind: 'typescript', evidence: ['route naming pattern'] };
    }
    if (base.endsWith('.state.ts') || base.endsWith('.store.ts') || base.endsWith('.ngrx.ts')) {
        return { role: 'state', kind: 'typescript', evidence: ['state naming pattern'] };
    }
    if (base.endsWith('.html')) {
        return { role: 'template', kind: 'template', evidence: ['html template extension'] };
    }
    if (base.endsWith('.scss') || base.endsWith('.sass') || base.endsWith('.less') || base.endsWith('.css')) {
        return { role: 'style', kind: 'style', evidence: ['style extension'] };
    }
    if (base.endsWith('.json')) {
        return { role: 'config', kind: 'json', evidence: ['json configuration file'] };
    }
    return { role: 'unknown', kind: 'text', evidence: ['no Angular-specific classification evidence'] };
};
const walk = async (root, current, collected) => {
    const entries = await fs.readdir(current, { withFileTypes: true });
    const sortedEntries = [...entries].sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of sortedEntries) {
        if (entry.isDirectory()) {
            if (EXCLUDED_DIRS.has(entry.name)) {
                continue;
            }
            await walk(root, path.join(current, entry.name), collected);
            continue;
        }
        const absolutePath = path.join(current, entry.name);
        const relativePath = path.relative(root, absolutePath);
        if (relativePath.startsWith('..')) {
            continue;
        }
        collected.push(absolutePath);
    }
};
export class SourceInventoryBuilder {
    pathGuard = new PathGuard();
    ids = createStableIdFactory();
    async build(profile) {
        const files = [];
        try {
            await walk(profile.sourceRoot, profile.sourceRoot, files);
        }
        catch (error) {
            return err({
                code: 'NOT_FOUND',
                message: `Unable to read source tree '${profile.sourceRoot}'.`,
                cause: error,
            });
        }
        const inventory = [];
        const excludedPaths = [];
        for (const filePath of files.sort((left, right) => left.localeCompare(right))) {
            const relativePath = path.relative(profile.sourceRoot, filePath).replaceAll(path.sep, '/');
            const classification = classifyFile(filePath);
            if (relativePath.includes('node_modules/') || relativePath.startsWith('dist/') || relativePath.startsWith('.spa-bridge/')) {
                excludedPaths.push(relativePath);
                continue;
            }
            inventory.push({
                id: this.ids.fileId(relativePath, classification.role),
                path: filePath,
                relativePath,
                role: classification.role,
                kind: classification.kind,
                evidence: classification.evidence,
                relatedPaths: [],
                parseStatus: classification.role === 'unknown' && classification.kind === 'text' ? 'pending' : 'parsed',
            });
        }
        return ok({
            schemaVersion: 1,
            workspaceProfileId: `${profile.projectRoot}:${profile.projectName}`,
            files: inventory.sort((left, right) => left.relativePath.localeCompare(right.relativePath) || left.role.localeCompare(right.role)),
            excludedPaths: excludedPaths.sort((left, right) => left.localeCompare(right)),
        });
    }
}
export { classifyFile };
//# sourceMappingURL=source-inventory-builder.js.map