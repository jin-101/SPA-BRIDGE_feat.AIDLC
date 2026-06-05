import type { GeneratedFileSpec, TargetConflict } from '../types.js';

export class TargetConflictDetector {
  detect(files: GeneratedFileSpec[]): TargetConflict[] {
    const seen = new Map<string, GeneratedFileSpec>();
    const conflicts: TargetConflict[] = [];

    for (const file of files) {
      const previous = seen.get(file.path);
      if (!previous) {
        seen.set(file.path, file);
        continue;
      }

      conflicts.push({
        path: file.path,
        reason: previous.content === file.content ? 'duplicate-generated-path' : 'overwrite-conflict',
        existingKind: previous.kind,
        incomingKind: file.kind,
      });
    }

    return conflicts;
  }
}
