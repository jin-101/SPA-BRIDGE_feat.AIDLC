import { createTargetGenerationError } from '../shared-errors.js';
export class TraceCoverageValidator {
    validate(files, traces) {
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
//# sourceMappingURL=trace-coverage-validator.js.map