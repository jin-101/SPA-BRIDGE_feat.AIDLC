export class CorrectionCandidateFactory {
    createFromGateRun(gateRun) {
        return [{
                id: `candidate-${gateRun.gateId}-${gateRun.attempts}`,
                summary: gateRun.safeSummary,
                evidenceRefs: [...gateRun.traceRefs, ...gateRun.diagnosticRefs],
            }];
    }
}
//# sourceMappingURL=correction-candidate-factory.js.map