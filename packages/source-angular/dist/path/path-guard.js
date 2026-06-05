import path from 'node:path';
import { err, ok } from '@spa-bridge/core-model';
export class PathGuard {
    canonicalize(input) {
        return path.resolve(input);
    }
    contains(basePath, candidatePath) {
        const base = this.canonicalize(basePath);
        const candidate = this.canonicalize(candidatePath);
        const relative = path.relative(base, candidate);
        const isContained = relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
        if (!isContained) {
            return err({
                code: 'PATH_INVALID',
                message: `Path '${candidatePath}' escapes base '${basePath}'.`,
            });
        }
        return ok({
            absolutePath: candidate,
            relativePath: relative || '.',
        });
    }
    validateRunId(runId) {
        if (!/^[A-Za-z0-9._-]+$/.test(runId)) {
            return err({
                code: 'PATH_INVALID',
                message: `Run id '${runId}' contains unsafe characters.`,
            });
        }
        return ok(runId);
    }
}
//# sourceMappingURL=path-guard.js.map