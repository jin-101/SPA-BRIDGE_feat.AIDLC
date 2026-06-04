import { err, ok } from '@spa-bridge/core-model';
export class WorkflowCoordinator {
    manifestMachine;
    policyGate;
    eventPublisher;
    constructor(manifestMachine, policyGate, eventPublisher) {
        this.manifestMachine = manifestMachine;
        this.policyGate = policyGate;
        this.eventPublisher = eventPublisher;
    }
    async execute(manifest, config, steps, runId) {
        let current = manifest;
        const completedStepIds = [];
        for (const step of steps) {
            const policyDecisionResult = this.policyGate.evaluate({
                providerMode: config.providerMode,
                externalProviderRequested: step.execute.length > 0,
                maskingReady: true,
                policyKnown: true,
                sensitiveDataPresent: false,
            });
            const policyDecision = policyDecisionResult.ok
                ? policyDecisionResult.value
                : {
                    decision: 'block',
                    reason: 'Policy evaluation failed.',
                };
            if (policyDecision.decision === 'block') {
                current = this.manifestMachine.finalizeFailed(current, policyDecision.reason);
                return err({
                    code: 'POLICY_BLOCKED',
                    message: policyDecision.reason,
                });
            }
            const publishResult = this.eventPublisher.publish({
                eventType: 'workflow.step.start',
                correlationId: `${runId}:${step.id}`,
                runId,
                stepId: step.id,
                status: 'running',
                message: `Starting step ${step.id}.`,
            });
            if (!publishResult.ok) {
                return publishResult;
            }
            const stepResult = await step.execute({ runId, stepId: step.id, manifest: current, config });
            if (!stepResult.ok) {
                current = this.manifestMachine.finalizeFailed(current, stepResult.error.message);
                return err({
                    code: 'WORKFLOW_FAILED',
                    message: stepResult.error.message,
                    cause: stepResult.error,
                });
            }
            const nextCheckpoint = this.manifestMachine.recordCheckpoint(current, {
                id: `${step.id}-${current.checkpoints.length + 1}`,
                stepId: step.id,
                artifactRefs: stepResult.value.artifactRefs ?? [],
            });
            if (!nextCheckpoint.ok) {
                return nextCheckpoint;
            }
            current = nextCheckpoint.value;
            if (stepResult.value.diagnostics) {
                current = {
                    ...current,
                    updatedAt: new Date().toISOString(),
                    manualReviewItems: [
                        ...current.manualReviewItems,
                        ...(stepResult.value.manualReviewItems ?? []),
                    ],
                };
            }
            completedStepIds.push(step.id);
            if (stepResult.value.nextStatus === 'completed') {
                current = this.manifestMachine.finalizeCompleted(current);
            }
            const endPublish = this.eventPublisher.publish({
                eventType: 'workflow.step.complete',
                correlationId: `${runId}:${step.id}`,
                runId,
                stepId: step.id,
                status: current.status,
                message: `Completed step ${step.id}.`,
            });
            if (!endPublish.ok) {
                return endPublish;
            }
        }
        return ok({
            manifest: current,
            completedStepIds,
        });
    }
}
//# sourceMappingURL=workflow.js.map