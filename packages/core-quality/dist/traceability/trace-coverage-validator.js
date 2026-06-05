export class TraceCoverageValidator {
    validate(request, gateRuns, traceRefs) {
        if (traceRefs.length === 0) {
            return false;
        }
        if (!gateRuns.every((gateRun) => gateRun.traceRefs.length > 0)) {
            return false;
        }
        if ((request.artifactRefs?.length ?? 0) > 0 && traceRefs.length < (request.artifactRefs?.length ?? 0) + 1) {
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=trace-coverage-validator.js.map