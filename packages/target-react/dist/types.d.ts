import type { Diagnostic, GeneratedArtifactRef, ManualReviewItem, SourceRef, TraceLink } from '@spa-bridge/core-model';
import type { ReactComponentDraft, ReactRouteDraft, ReactServiceDraft, ReactStateDraft, ReactTargetDraftSet, ReactTemplateDraft } from '@spa-bridge/transform-angular-react';
export type TargetFramework = 'react';
export type TargetProjectStrategyId = 'vite-react-typescript' | 'react-default';
export type TargetOverwritePolicy = 'preserve' | 'overwrite' | 'fail';
export type TargetStateStrategy = 'service' | 'signals' | 'store' | 'local' | 'unknown';
export type TargetFileKind = 'scaffold' | 'component' | 'template' | 'service' | 'route' | 'state' | 'review' | 'dependency' | 'metadata' | 'trace';
export type TargetGenerationRequest = {
    runId: string;
    correlationId: string;
    targetRoot: string;
    draftSet: ReactTargetDraftSet;
    strategyId?: TargetProjectStrategyId;
    overwritePolicy: TargetOverwritePolicy;
    projectName?: string;
    selectedStateStrategy?: TargetStateStrategy;
    sourceModelRef?: SourceRef;
    sourceDependencies?: Record<string, string>;
    sourceDevDependencies?: Record<string, string>;
    existingPaths?: string[];
};
export type TargetStrategyMetadata = {
    id: TargetProjectStrategyId;
    displayName: string;
    description: string;
    defaultStrategy: boolean;
    supportedStateStrategies: TargetStateStrategy[];
    capabilities: string[];
    exactDependencies: Record<string, string>;
};
export type TargetStrategyDescriptor = TargetStrategyMetadata & {
    createScaffoldFiles: (input: {
        request: TargetGenerationRequest;
        normalizedDrafts: NormalizedTargetDraftBundle;
        dependencyManifest: TargetDependencyManifest;
    }) => GeneratedFileSpec[];
};
export type NormalizedTargetDraftBundle = {
    schemaVersion: 1;
    targetFramework: TargetFramework;
    projectStrategy: TargetProjectStrategyId;
    aliasModel: ReactTargetDraftSet['aliasModel'];
    targetRoot: string;
    projectName: string;
    stateStrategy: TargetStateStrategy;
    components: ReactComponentDraft[];
    templates: ReactTemplateDraft[];
    services: ReactServiceDraft[];
    routes: ReactRouteDraft[];
    state: ReactStateDraft[];
    manualReviewItems: ManualReviewItem[];
    diagnostics: Diagnostic[];
    traces: TraceLink[];
};
export type GeneratedFileSpec = {
    path: string;
    kind: TargetFileKind;
    content: string;
    sourceRefs: SourceRef[];
    generatedRefs: GeneratedArtifactRef[];
    traceRefs: string[];
    overwrite: boolean;
    status: 'generated' | 'review' | 'dependency' | 'metadata' | 'trace';
    hash?: string;
    fileRef?: string;
};
export type TargetConflict = {
    path: string;
    reason: 'duplicate-generated-path' | 'path-outside-target-root' | 'overwrite-conflict';
    existingKind?: TargetFileKind;
    incomingKind?: TargetFileKind;
};
export type DependencyCompatibilityAction = 'carry' | 'replace' | 'remove' | 'review';
export type DependencyCompatibilityRiskLevel = 'low' | 'medium' | 'high' | 'unknown';
export type DependencySourceCategory = 'angular-core' | 'angular-wrapper' | 'ngrx' | 'build-tool' | 'framework-neutral' | 'custom' | 'unknown';
export type DependencyReplacementRule = {
    sourcePackage: string;
    targetPackage: string;
    versionPolicy: 'preserve' | 'fixed' | 'latest-compatible';
    fixedVersion?: string;
    rationale: string;
    usageSiteReviewPolicy: 'always' | 'when-unverified' | 'none';
    knownImportRewriteRules?: Array<{
        sourceImport: string;
        targetImport: string;
    }>;
};
export type UsageSiteCompatibilityFinding = {
    sourcePackage: string;
    targetPackage?: string;
    sourceRef?: SourceRef;
    usageKind: 'import' | 'template-selector' | 'style' | 'module-provider' | 'dependency';
    message: string;
    suggestedCodeChange?: string;
    manualReviewRequired: boolean;
};
export type DependencyCompatibilityDecision = {
    packageName: string;
    sourceVersion: string;
    decision: DependencyCompatibilityAction;
    targetPackageName?: string;
    targetVersion?: string;
    riskLevel: DependencyCompatibilityRiskLevel;
    sourceCategory: DependencySourceCategory;
    rationale: string;
    usageSiteReviewRequired: boolean;
    diagnostics: string[];
};
export type DependencyCompatibilityReport = {
    schemaVersion: 1;
    decisions: DependencyCompatibilityDecision[];
    usageFindings: UsageSiteCompatibilityFinding[];
    summary: {
        carried: number;
        replaced: number;
        removed: number;
        review: number;
        total: number;
    };
};
export type TargetDependencyManifest = {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    rationale: Record<string, string>;
    compatibilityReport?: DependencyCompatibilityReport;
};
export type TargetWritePlan = {
    runId: string;
    correlationId: string;
    targetRoot: string;
    projectName: string;
    strategyId: TargetProjectStrategyId;
    files: GeneratedFileSpec[];
    conflicts: TargetConflict[];
    dependencyManifest: TargetDependencyManifest;
};
export type TargetGenerationSummary = {
    projectName: string;
    strategyId: TargetProjectStrategyId;
    totalFiles: number;
    totalComponents: number;
    totalTemplates: number;
    totalServices: number;
    totalRoutes: number;
    totalState: number;
    totalReviewItems: number;
    totalDiagnostics: number;
    totalTraces: number;
    totalAliases: number;
    totalGeneratedAliases: number;
    unresolvedAliases: number;
};
export type TargetGenerationResult = {
    status: 'success' | 'partial' | 'blocked';
    request: TargetGenerationRequest;
    normalizedDrafts: NormalizedTargetDraftBundle;
    writePlan: TargetWritePlan;
    summary: TargetGenerationSummary;
    diagnostics: Diagnostic[];
    manualReviewItems: ManualReviewItem[];
    traces: TraceLink[];
    dependencyManifest: TargetDependencyManifest;
    dependencyCompatibilityReport: DependencyCompatibilityReport;
    scaffoldFiles: GeneratedFileSpec[];
};
export type TargetGenerationErrorCode = 'INVALID_REQUEST' | 'INVALID_STRATEGY' | 'INVALID_DRAFT_SET' | 'PATH_VIOLATION' | 'CONFLICT_DETECTED' | 'VALIDATION_FAILED' | 'UNSUPPORTED_CONFIGURATION';
export type TargetGenerationError = {
    code: TargetGenerationErrorCode;
    message: string;
    details?: string[];
};
export type TargetDiagnosticSeverity = Diagnostic['severity'];
//# sourceMappingURL=types.d.ts.map