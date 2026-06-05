import type { Diagnostic, GeneratedArtifactRef, ManualReviewItem, SourceRef, TraceLink } from '@spa-bridge/core-model';
export type QualityGateKind = 'build' | 'lint' | 'format' | 'unit' | 'integration' | 'property';
export type QualityGateStatus = 'passed' | 'failed' | 'skipped' | 'blocked';
export type QualityRunStatus = 'passed' | 'partial' | 'blocked' | 'manual-review';
export type QualityGateSeverity = 'info' | 'warning' | 'manual-review' | 'blocking';
export type QualityToolKind = QualityGateKind;
export type QualityRequest = {
    runId: string;
    correlationId: string;
    workspaceRoot: string;
    selectedGateIds?: string[];
    artifactRefs?: GeneratedArtifactRef[];
    seed?: number;
    policyContext?: Record<string, string>;
};
export type QualityGateDefinition = {
    gateId: string;
    displayName: string;
    order: number;
    kind: QualityGateKind;
    blocking: boolean;
    toolRef: string;
    summaryTemplate: string;
    tags: string[];
};
export type QualityGateRun = {
    gateId: string;
    status: QualityGateStatus;
    startedAt: string;
    finishedAt: string;
    durationMs: number;
    safeSummary: string;
    diagnosticRefs: string[];
    traceRefs: string[];
    attempts: number;
};
export type QualityRunSummary = {
    runId: string;
    overallStatus: QualityRunStatus;
    totalGates: number;
    passedGates: number;
    failedGates: number;
    blockedGates: number;
    manualReviewCount: number;
    seed?: number;
    retryCount: number;
    durationMs: number;
    gateOrder: string[];
};
export type QualityCorrectionCandidate = {
    id: string;
    summary: string;
    evidenceRefs: string[];
};
export type SelfCorrectionPlan = {
    planId: string;
    targetGateId: string;
    retryBudget: number;
    correctionCandidates: QualityCorrectionCandidate[];
    stopReason?: string;
    traceRefs: string[];
};
export type PropertyTestPlan = {
    planId: string;
    subject: string;
    generatorFamily: string;
    propertyName: string;
    seed?: number;
    shrinkStrategy: string;
    exampleRegressions: string[];
};
export type PropertyTestRun = {
    planId: string;
    status: QualityGateStatus;
    seed?: number;
    counterexample?: string;
    shrunk: boolean;
    diagnosticRefs: string[];
    traceRefs: string[];
};
export type QualityEvidenceBundle = {
    evidenceId: string;
    runRef: string;
    gateRefs: string[];
    summaryRef: string;
    traceRefs: string[];
    diagnosticRefs: string[];
};
export type QualityDiagnostic = Diagnostic;
export type QualityManualReviewItem = ManualReviewItem;
export type QualityTraceLink = TraceLink;
export type QualitySourceRef = SourceRef;
export type QualityGeneratedArtifactRef = GeneratedArtifactRef;
export type RunnerRequest = {
    toolKind: QualityToolKind;
    commandRef: string;
    args: string[];
    workspaceRoot: string;
    seed?: number;
};
export type RunnerResult = {
    exitCode: number;
    status: QualityGateStatus;
    durationMs: number;
    safeSummary: string;
    diagnosticRefs: string[];
    traceRefs: string[];
};
export type RunnerPlanEntry = {
    gateId: string;
    request: RunnerRequest;
    blocking: boolean;
};
export type QualityOrchestrationResult = {
    request: QualityRequest;
    gateDefinitions: QualityGateDefinition[];
    gateRuns: QualityGateRun[];
    propertyTestRuns: PropertyTestRun[];
    summary: QualityRunSummary;
    evidenceBundle: QualityEvidenceBundle;
    diagnostics: QualityDiagnostic[];
    manualReviewItems: QualityManualReviewItem[];
    traces: QualityTraceLink[];
    runnerPlan: RunnerPlanEntry[];
    correctionPlans: SelfCorrectionPlan[];
};
export type QualityRunner = {
    kind: QualityToolKind;
    run: (request: RunnerRequest) => RunnerResult | Promise<RunnerResult>;
};
export type QualityRunnerMap = Map<QualityToolKind, QualityRunner>;
//# sourceMappingURL=types.d.ts.map