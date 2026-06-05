import path from 'node:path';

import type { TargetGenerationError } from '../types.js';
import { createTargetGenerationError } from '../shared-errors.js';

export class TargetPathGuard {
  ensureContained(targetRoot: string, candidatePath: string): { ok: true; value: string } | { ok: false; error: TargetGenerationError } {
    const normalizedRoot = path.resolve(targetRoot);
    const normalizedCandidate = path.resolve(normalizedRoot, candidatePath);
    const relative = path.relative(normalizedRoot, normalizedCandidate);

    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      return {
        ok: false,
        error: createTargetGenerationError('PATH_VIOLATION', `Path '${candidatePath}' is outside target root '${targetRoot}'.`),
      };
    }

    return { ok: true, value: normalizedCandidate };
  }
}
