import type { QualityGateRun, QualityRequest } from '../types.js';

export class TraceCoverageValidator {
  validate(request: QualityRequest, gateRuns: QualityGateRun[], traceRefs: string[]): boolean {
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

