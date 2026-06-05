import { createDiagnostic } from '@spa-bridge/core-model';
export class QualityDiagnosticFactory {
    createFromGateRun(gateRun, severity) {
        const mappedSeverity = severity === 'blocking'
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
//# sourceMappingURL=quality-diagnostic-factory.js.map