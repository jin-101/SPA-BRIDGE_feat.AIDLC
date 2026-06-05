import type { TargetOverwritePolicy } from '../types.js';

export const resolveOverwriteConflict = (
  policy: TargetOverwritePolicy,
  existingContent: string | undefined,
  nextContent: string,
): { action: 'write' | 'preserve' | 'fail'; reason: string } => {
  if (existingContent === undefined) {
    return { action: 'write', reason: 'new-file' };
  }

  if (existingContent === nextContent) {
    return { action: 'preserve', reason: 'identical-content' };
  }

  if (policy === 'overwrite') {
    return { action: 'write', reason: 'overwrite' };
  }

  if (policy === 'preserve') {
    return { action: 'preserve', reason: 'preserve-by-default' };
  }

  return { action: 'fail', reason: 'conflict' };
};
