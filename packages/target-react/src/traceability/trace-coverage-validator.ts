import type { GeneratedFileSpec, TargetGenerationError } from '../types.js';
import { createTargetGenerationError } from '../shared-errors.js';
import type { TraceLink } from '@spa-bridge/core-model';

export class TraceCoverageValidator {
  validate(files: GeneratedFileSpec[], traces: TraceLink[]): { ok: true; value: void } | { ok: false; error: TargetGenerationError } {
    const tracedPaths = new Set(traces.map((trace) => (trace.target.kind === 'generated' ? trace.target.path : trace.target.id)));

    for (const file of files) {
      if (!tracedPaths.has(file.path)) {
        return {
          ok: false,
          error: createTargetGenerationError('VALIDATION_FAILED', `Generated file '${file.path}' is missing trace coverage.`),
        };
      }
    }

    return { ok: true, value: undefined };
  }
}
