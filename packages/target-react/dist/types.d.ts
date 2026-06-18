import type { Diagnostic, GeneratedArtifactRef, ManualReviewItem, SourceRef, TraceLink } from '@spa-bridge/core-model';
import type { GeneratedTargetSelfCorrectionResult } from '@spa-bridge/core-quality';
import type { ReactComponentDraft, ReactReduxToolkitDraft, ReactRouteDraft, ReactAnimationDraft, ReactServiceDraft, ReactStateDraft, ReactTargetDraftSet, ReactTemplateDraft } from '@spa-bridge/transform-angular-react';
export type TargetFramework = 'react';
export type TargetProjectStrategyId = 'nextjs-typescript' | 'vite-react-typescript' | 'react-default';
export type TargetOverwritePolicy = 'preserve' | 'overwrite' | 'fail';
export type TargetStateStrategy = 'service' | 'signals' | 'store' | 'local' | 'unknown';
export type TargetFileKind = 'scaffold' | 'component' | 'template' | 'service' | 'route' | 'state' | 'review' | 'dependency' | 'environment' | 'registry' | 'metadata' | 'trace';
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
    sourceNpmrcFiles?: SourceNpmrcFileInput[];
    sourceScripts?: Record<string, string>;
    sourceEnvironmentVariables?: SourceEnvironmentVariableInput[];
    sourcePackageManager?: SourcePackageManagerInput;
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
    reduxToolkit: ReactReduxToolkitDraft[];
    animations: ReactAnimationDraft[];
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
    scripts?: Record<string, string>;
    packageManager?: string;
    rationale: Record<string, string>;
    compatibilityReport?: DependencyCompatibilityReport;
};
export type PackageManagerName = 'npm' | 'pnpm' | 'yarn';
export type SourcePackageManagerInput = {
    name: PackageManagerName;
    version?: string;
    packageManagerField?: string;
    detectedFrom: string[];
    lockfile?: 'package-lock.json' | 'pnpm-lock.yaml' | 'yarn.lock';
    configFiles?: string[];
    confidence: 'high' | 'medium' | 'low';
    manualReviewRequired?: boolean;
};
export type PackageManagerParityReport = {
    schemaVersion: 1;
    selected: SourcePackageManagerInput;
    targetPackageManagerField: string;
    installCommand: string;
    devCommand: string;
    buildCommand: string;
    manualReviewRequired: boolean;
};
export type SourceNpmrcFileInput = {
    sourcePath: string;
    lines: string[];
};
export type NpmrcEntryKind = 'registry' | 'scope-registry' | 'secret' | 'safe-config' | 'comment' | 'blank' | 'unsupported';
export type ParsedNpmrcEntry = {
    sourcePath: string;
    lineNumber: number;
    key?: string;
    value?: string;
    kind: NpmrcEntryKind;
    safeLine?: string;
    placeholderLine?: string;
    redacted: boolean;
};
export type RegistryMigrationPlan = {
    schemaVersion: 1;
    safeTargetNpmrcLines: string[];
    exampleNpmrcLines: string[];
    entries: ParsedNpmrcEntry[];
    secretEntryCount: number;
    safeEntryCount: number;
    manualReviewItems: Array<{
        id: string;
        reasonCode: string;
        safeSummary: string;
    }>;
};
export type SourceScriptIntent = 'dev' | 'build' | 'start' | 'lint' | 'test' | 'typecheck' | 'analyze' | 'deploy' | 'angular-only' | 'unsafe' | 'unknown';
export type ScriptMigrationDecision = {
    sourceName: string;
    sourceCommand: string;
    intent: SourceScriptIntent;
    targetName?: string;
    targetCommand?: string;
    status: 'generated' | 'defaulted' | 'review' | 'removed';
    reasonCode: string;
    manualReviewRequired: boolean;
};
export type ScriptMigrationPlan = {
    schemaVersion: 1;
    targetScripts: Record<string, string>;
    decisions: ScriptMigrationDecision[];
    manualReviewCount: number;
};
export type SourceEnvironmentVariableInput = {
    name: string;
    sourcePath?: string;
    sourceKind: 'env-file' | 'package-script' | 'angular-environment' | 'source-reference';
    valuePresent?: boolean;
};
export type EnvironmentVariableClassification = 'server-only' | 'client-exposed' | 'secret' | 'placeholder' | 'unknown';
export type EnvironmentVariableInventoryItem = {
    name: string;
    targetName: string;
    sourceKinds: SourceEnvironmentVariableInput['sourceKind'][];
    classification: EnvironmentVariableClassification;
    copyPolicy: 'placeholder-only' | 'copy-name-only' | 'client-placeholder' | 'review';
    manualReviewRequired: boolean;
};
export type EnvironmentContractReport = {
    schemaVersion: 1;
    variables: EnvironmentVariableInventoryItem[];
    exampleEnvLines: string[];
    secretCount: number;
    clientExposedCount: number;
    manualReviewCount: number;
};
export type EnterpriseParitySummary = {
    registrySafeEntries: number;
    registrySecretPlaceholders: number;
    generatedScripts: number;
    reviewedScripts: number;
    environmentVariables: number;
    secretEnvironmentVariables: number;
    packageManager: string;
    packageManagerVersion?: string;
    manualReviewItems: number;
};
export type EnterpriseParityArtifacts = {
    registryMigrationPlan: RegistryMigrationPlan;
    scriptMigrationPlan: ScriptMigrationPlan;
    environmentContractReport: EnvironmentContractReport;
    packageManagerParityReport: PackageManagerParityReport;
    summary: EnterpriseParitySummary;
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
    enterpriseParity?: EnterpriseParitySummary;
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
    enterpriseParity?: EnterpriseParityArtifacts;
    scaffoldFiles: GeneratedFileSpec[];
    selfCorrectionResult?: GeneratedTargetSelfCorrectionResult;
};
export type TargetGenerationErrorCode = 'INVALID_REQUEST' | 'INVALID_STRATEGY' | 'INVALID_DRAFT_SET' | 'PATH_VIOLATION' | 'CONFLICT_DETECTED' | 'VALIDATION_FAILED' | 'UNSUPPORTED_CONFIGURATION';
export type TargetGenerationError = {
    code: TargetGenerationErrorCode;
    message: string;
    details?: string[];
};
export type TargetDiagnosticSeverity = Diagnostic['severity'];
//# sourceMappingURL=types.d.ts.map