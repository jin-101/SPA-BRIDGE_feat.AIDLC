import { createDiagnostic, type Diagnostic } from '@spa-bridge/core-model';

import type { QualityGateRun } from '../types.js';

export class QualityDiagnosticFactory {
  createFromGateRun(gateRun: QualityGateRun, severity: 'info' | 'warning' | 'manual-review' | 'blocking'): Diagnostic {
    const mappedSeverity =
      severity === 'blocking'
        ? 'security-blocker'
        : severity;

    return createDiagnostic({
      code: `QUALITY-${gateRun.gateId.toUpperCase()}-${severity.toUpperCase()}`,
      severity: mappedSeverity,
      message: `${gateRun.gateId} gate ${gateRun.status}: ${gateRun.safeSummary}`,
      sourceRefs: [],
      generatedRefs: [],
      tags: [gateRun.gateId, `status:${gateRun.status}`],
      remediationHint: severity === 'manual-review'
        ? 'Review the safe summary and trace references.'
        : undefined,
    });
  }
}
