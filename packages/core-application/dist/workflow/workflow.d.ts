import { type Diagnostic, type GeneratedArtifactRef, type ManualReviewItem, type Result } from '@spa-bridge/core-model';
import type { ApplicationError, ResolvedConversionConfig } from '../types.js';
import type { PolicyGate } from '../policy/policy.js';
import type { StructuredEventPublisher } from '../events/events.js';
import type { ManifestStateMachine, RunWorkspaceManifest } from '../run/run.js';
export type WorkflowStepResult = {
    diagnostics?: Diagnostic[];
    artifactRefs?: GeneratedArtifactRef[];
    manualReviewItems?: ManualReviewItem[];
    nextStatus?: 'running' | 'completed';
    notes?: string;
    requiresExternalProvider?: boolean;
    maskingReady?: boolean;
};
export type WorkflowStepContext = {
    runId: string;
    stepId: string;
    manifest: RunWorkspaceManifest;
    config: ResolvedConversionConfig;
};
export type WorkflowStepDefinition = {
    id: string;
    execute: (context: WorkflowStepContext) => Promise<Result<WorkflowStepResult, {
        code: string;
        message: string;
        cause?: unknown;
    }>>;
};
export type WorkflowExecutionResult = {
    manifest: RunWorkspaceManifest;
    completedStepIds: string[];
    failedStepId?: string;
};
export declare class WorkflowCoordinator {
    private readonly manifestMachine;
    private readonly policyGate;
    private readonly eventPublisher;
    constructor(manifestMachine: ManifestStateMachine, policyGate: PolicyGate, eventPublisher: StructuredEventPublisher);
    execute(manifest: RunWorkspaceManifest, config: ResolvedConversionConfig, steps: WorkflowStepDefinition[], runId: string): Promise<Result<WorkflowExecutionResult, ApplicationError>>;
}
//# sourceMappingURL=workflow.d.ts.map