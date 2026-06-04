import path from 'node:path';
import { err, ok } from '@spa-bridge/core-model';
export class PathGuard {
    normalize(input) {
        return path.resolve(input);
    }
    ensureContained(basePath, candidatePath) {
        const normalizedBase = this.normalize(basePath);
        const normalizedCandidate = this.normalize(candidatePath);
        const relative = path.relative(normalizedBase, normalizedCandidate);
        if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
            return ok(normalizedCandidate);
        }
        return err({
            code: 'PATH_INVALID',
            message: `Path '${candidatePath}' escapes base '${basePath}'.`,
        });
    }
    deriveRunWorkspace(projectRoot, runId) {
        if (!/^[A-Za-z0-9._-]+$/.test(runId)) {
            return err({
                code: 'PATH_INVALID',
                message: `Run id '${runId}' contains unsafe characters.`,
            });
        }
        const normalizedProjectRoot = this.normalize(projectRoot);
        const runRoot = path.join(normalizedProjectRoot, '.spa-bridge', 'runs', runId);
        const guard = this.ensureContained(normalizedProjectRoot, runRoot);
        if (!guard.ok) {
            return guard;
        }
        return ok({
            projectRoot: normalizedProjectRoot,
            runId,
            runRoot: guard.value,
            manifestPath: path.join(guard.value, 'manifest.json'),
            resolvedConfigPath: path.join(guard.value, 'config.resolved.json'),
            diagnosticsPath: path.join(guard.value, 'diagnostics.json'),
            artifactsDir: path.join(guard.value, 'artifacts'),
            reportsDir: path.join(guard.value, 'reports'),
            checkpointsDir: path.join(guard.value, 'checkpoints'),
            locksDir: path.join(guard.value, 'locks'),
        });
    }
}
export class RunWorkspaceManager {
    pathGuard;
    constructor(pathGuard = new PathGuard()) {
        this.pathGuard = pathGuard;
    }
    derive(projectRoot, runId, initializedAt) {
        const derived = this.pathGuard.deriveRunWorkspace(projectRoot, runId);
        if (!derived.ok) {
            return derived;
        }
        return ok({
            ...derived.value,
            initializedAt,
        });
    }
    ensureWorkspaceFitsRoot(workspace) {
        return this.pathGuard.ensureContained(workspace.projectRoot, workspace.runRoot).ok
            ? ok(workspace)
            : err({
                code: 'PATH_INVALID',
                message: `Workspace '${workspace.runRoot}' is not contained by '${workspace.projectRoot}'.`,
            });
    }
}
export const isPortError = (error) => typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
//# sourceMappingURL=workspace.js.map