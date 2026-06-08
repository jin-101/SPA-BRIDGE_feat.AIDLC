import { createReportError, validationIssueFromPath } from '../shared-errors.js';
const refKey = (ref) => `${ref.kind}:${ref.path}:${ref.segment ?? ''}`;
export const buildTraceCoverageSummary = (traceability, generatedRefs) => {
    const coveredKeys = new Set();
    for (const link of traceability.links) {
        if (link.target.kind === 'generated') {
            coveredKeys.add(refKey(link.target));
        }
    }
    for (const origin of traceability.syntheticOrigins) {
        coveredKeys.add(refKey(origin));
    }
    let covered = 0;
    let uncovered = 0;
    for (const ref of generatedRefs) {
        if (coveredKeys.has(refKey(ref))) {
            covered += 1;
        }
        else {
            uncovered += 1;
        }
    }
    return { covered, uncovered };
};
export const validateTraceCoverage = (traceability, generatedRefs) => {
    const summary = buildTraceCoverageSummary(traceability, generatedRefs);
    if (summary.uncovered > 0) {
        const missing = generatedRefs.filter((ref) => {
            const key = refKey(ref);
            return !traceability.links.some((link) => link.target.kind === 'generated' && refKey(link.target) === key) &&
                !traceability.syntheticOrigins.some((origin) => refKey(origin) === key);
        });
        return {
            ok: false,
            error: createReportError('TRACE_COVERAGE_FAILED', 'Generated artifacts are missing trace coverage.', missing.map((ref, index) => validationIssueFromPath(['traceability', 'generatedRefs', index], `Missing trace coverage for ${ref.path}`))),
        };
    }
    return { ok: true, value: summary };
};
//# sourceMappingURL=trace-coverage-validator.js.map