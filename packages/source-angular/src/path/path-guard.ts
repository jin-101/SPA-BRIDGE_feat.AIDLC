import path from 'node:path';

import { err, ok, type Result } from '@spa-bridge/core-model';

import type { AnalysisError } from '../types.js';

export type SafePathRef = {
  absolutePath: string;
  relativePath: string;
};

export class PathGuard {
  canonicalize(input: string): string {
    return path.resolve(input);
  }

  contains(basePath: string, candidatePath: string): Result<SafePathRef, AnalysisError> {
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

  validateRunId(runId: string): Result<string, AnalysisError> {
    if (!/^[A-Za-z0-9._-]+$/.test(runId)) {
      return err({
        code: 'PATH_INVALID',
        message: `Run id '${runId}' contains unsafe characters.`,
      });
    }

    return ok(runId);
  }
}
