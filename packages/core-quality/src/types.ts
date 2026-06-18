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

export type RuntimeParityGeneratedFile = {
  path: string;
  content: string;
};

export type RuntimeParityQualityInput = {
  targetStrategy: string;
  files: RuntimeParityGeneratedFile[];
  expectedFramework: 'nextjs' | 'vite' | 'unknown';
  selfCorrection?: GeneratedTargetSelfCorrectionResult;
};

export type RuntimeParityQualityScore = {
  score: number;
  status: 'passed' | 'warning' | 'failed';
  requiredFilesPresent: boolean;
  packageInstallReady: boolean;
  enterpriseParityArtifactsPresent: boolean;
  enterpriseScriptReady: boolean;
  enterpriseEnvironmentReady: boolean;
  emptyComponentCount: number;
  manualReviewCount: number;
  todoCount: number;
  angularSyntaxResidueCount: number;
  animationTriggerCount: number;
  convertedAnimationTriggerCount: number;
  unresolvedAnimationTriggerCount: number;
  missingAnimationAssetCount: number;
  animationManualReviewCount: number;
  animationClientBoundaryCount: number;
  selfCorrectionStatus?: GeneratedTargetSelfCorrectionStatus;
  selfCorrectionAttemptCount: number;
  selfCorrectionAppliedFixCount: number;
  selfCorrectionAiRepairCount: number;
  selfCorrectionRemainingBlockerCount: number;
  missingRequiredFiles: string[];
  findings: string[];
};

export type GeneratedTargetSelfCorrectionStatus = 'passed' | 'degraded' | 'blocked' | 'skipped';
export type GeneratedTargetValidationCommandKind = 'install' | 'typecheck' | 'build' | 'lint' | 'test' | 'smoke-start';
export type GeneratedTargetValidationCommandStatus = 'planned' | 'passed' | 'failed' | 'skipped' | 'blocked' | 'timed-out';
export type GeneratedTargetValidationDiagnosticCategory =
  | 'dependency-install-failure'
  | 'next-client-boundary-missing'
  | 'typescript-import-resolution'
  | 'typescript-helper-missing'
  | 'typescript-alias-resolution'
  | 'next-build-config'
  | 'style-or-asset-reference'
  | 'lint-or-format'
  | 'unsafe-command'
  | 'timeout'
  | 'manual-review-required';

export type GeneratedTargetValidationCommand = {
  id: string;
  kind: GeneratedTargetValidationCommandKind;
  command: string;
  args: string[];
  workingDirectory: string;
  timeoutMs: number;
  allowlisted: boolean;
  nonInteractive: boolean;
  safeEnvironmentKeys: string[];
  blocking: boolean;
};

export type GeneratedTargetCommandPlan = {
  planId: string;
  targetRoot: string;
  packageManager: 'npm' | 'pnpm' | 'yarn';
  commands: GeneratedTargetValidationCommand[];
  rejectedScripts: string[];
};

export type GeneratedTargetValidationDiagnostic = {
  id: string;
  category: GeneratedTargetValidationDiagnosticCategory;
  severity: QualityGateSeverity;
  commandId: string;
  safeRef?: string;
  safeMessage: string;
  fixerCandidateIds: string[];
};

export type GeneratedTargetValidationResult = {
  commandId: string;
  kind: GeneratedTargetValidationCommandKind;
  status: GeneratedTargetValidationCommandStatus;
  exitCode?: number;
  durationMs: number;
  safeOutputSummary: string;
  diagnostics: GeneratedTargetValidationDiagnostic[];
};

export type GeneratedTargetFilePatch = {
  path: string;
  description: string;
  operation: 'insert' | 'replace' | 'delete' | 'create';
  idempotenceKey: string;
};

export type GeneratedTargetDeterministicFix = {
  fixerId: string;
  category:
    | 'next-client-boundary'
    | 'missing-helper-import'
    | 'package-manifest'
    | 'dependency-replacement'
    | 'alias'
    | 'typescript-config'
    | 'import-path'
    | 'style-or-module-reference'
    | 'filename-or-path';
  summary: string;
  diagnosticIds: string[];
  patches: GeneratedTargetFilePatch[];
  idempotenceKey: string;
};

export type GeneratedTargetAiRepairRequest = {
  requestId: string;
  providerMode: 'local-ollama' | 'external-disabled' | 'external-policy-approved';
  modelHint: string;
  diagnosticIds: string[];
  safeContextRefs: string[];
  policyStatus: 'allowed' | 'blocked' | 'disabled' | 'review-required';
};

export type GeneratedTargetCorrectionAttempt = {
  attemptNumber: number;
  validationResults: GeneratedTargetValidationResult[];
  appliedFixes: GeneratedTargetDeterministicFix[];
  aiRepairRequests: GeneratedTargetAiRepairRequest[];
  remainingBlockerIds: string[];
};

export type GeneratedTargetSelfCorrectionResult = {
  schemaVersion: 1;
  status: GeneratedTargetSelfCorrectionStatus;
  targetRoot: string;
  commandPlan: GeneratedTargetCommandPlan;
  attempts: GeneratedTargetCorrectionAttempt[];
  artifactRefs: string[];
  summary: {
    totalCommands: number;
    passedCommands: number;
    failedCommands: number;
    skippedCommands: number;
    appliedFixes: number;
    aiRepairRequests: number;
    remainingBlockers: number;
  };
};
