import type { Diagnostic, GeneratedArtifactRef, ManualReviewItem, SourceRef, TraceLink } from '@spa-bridge/core-model';
import type { AngularAnalysisResult } from '@spa-bridge/source-angular';
export type TransformationTargetFramework = 'react';
export type TargetProjectStrategy = 'vite-react-typescript' | 'react-default';
export type StateStrategyKind = 'service' | 'signals' | 'store' | 'local' | 'unknown';
export type TransformationAnalysis = AngularAnalysisResult;
export type TransformationPhase = 'component' | 'template' | 'behavior' | 'service' | 'route' | 'state' | 'finalize';
export type SourceEntityKind = 'component' | 'template' | 'service' | 'route' | 'state';
export type TransformationErrorCode = 'INVALID_REQUEST' | 'INVALID_REGISTRY' | 'INVALID_CONTEXT' | 'TRANSFORMATION_FAILED' | 'NOT_SUPPORTED';
export type TransformationError = {
    code: TransformationErrorCode;
    message: string;
    details?: string[];
};
export type TransformationRequest = {
    runId: string;
    correlationId: string;
    analysis: AngularAnalysisResult;
    targetFramework: TransformationTargetFramework;
    targetProjectStrategy: TargetProjectStrategy;
    stateStrategy: StateStrategyKind;
    enabledRulePacks: string[];
    outputNamespace?: string;
};
export type NormalizedComponent = {
    id: string;
    name: string;
    sourceRef?: SourceRef;
    selector?: string;
    inputs: string[];
    outputs: string[];
    lifecycleHooks: string[];
    templateIds: string[];
    serviceRefs: string[];
    stateRefs: string[];
    routeRefs: string[];
    styleUrls: string[];
    propertyInitializers: Array<{
        name: string;
        initializer?: string;
        readonly: boolean;
    }>;
    methods: Array<{
        name: string;
        parameters: string[];
        bodyText: string;
        isAsync: boolean;
    }>;
    diagnostics: Diagnostic[];
};
export type NormalizedTemplate = {
    id: string;
    ownerComponentPath?: string;
    ownerComponentName?: string;
    sourceRef?: SourceRef;
    parserMode: 'angular-compiler' | 'heuristic';
    bindings: string[];
    events: string[];
    structuralDirectives: string[];
    templateRefs: string[];
    pipes: string[];
    externalReferences: string[];
    rawText?: string;
    diagnostics: Diagnostic[];
};
export type NormalizedService = {
    id: string;
    name: string;
    sourceRef?: SourceRef;
    providedIn?: string;
    dependencies: string[];
    diagnostics: Diagnostic[];
};
export type NormalizedRoute = {
    id: string;
    path: string;
    sourceRef?: SourceRef;
    component?: string;
    lazyTarget?: string;
    guardRefs: string[];
    resolverRefs: string[];
    childPaths: string[];
    parameterNames: string[];
    isDynamic: boolean;
    diagnostics: Diagnostic[];
};
export type NormalizedState = {
    id: string;
    name: string;
    sourceRef?: SourceRef;
    strategy: StateStrategyKind;
    dependencies: string[];
    diagnostics: Diagnostic[];
};
export type TransformationContext = {
    schemaVersion: 1;
    runId: string;
    correlationId: string;
    sourceModelRef: TransformationAnalysis['sourceModelBoundary']['sourceModelRef'];
    packageRefs: string[];
    targetFramework: TransformationTargetFramework;
    targetProjectStrategy: TargetProjectStrategy;
    stateStrategy: StateStrategyKind;
    enabledRulePacks: string[];
    projectName: string;
    diagnostics: Diagnostic[];
    components: NormalizedComponent[];
    templates: NormalizedTemplate[];
    services: NormalizedService[];
    routes: NormalizedRoute[];
    states: NormalizedState[];
    traceLinks: TraceLink[];
};
export type ReactHookDraft = {
    id: string;
    kind: 'state' | 'effect' | 'memo' | 'callback' | 'custom' | 'unknown';
    sourceRef?: SourceRef;
    dependencies: string[];
    intent: string;
    reviewItemIds: string[];
    generatedRefs: GeneratedArtifactRef[];
};
export type ReactComponentDraft = {
    id: string;
    name: string;
    sourceRef?: SourceRef;
    props: string[];
    state: string[];
    hooks: ReactHookDraft[];
    imports: string[];
    templateDraftId?: string;
    templateRawText?: string;
    templateExternalReferences: string[];
    serviceRefs: string[];
    styleUrls: string[];
    propertyInitializers: NormalizedComponent['propertyInitializers'];
    methods: NormalizedComponent['methods'];
    reviewItemIds: string[];
    generatedRefs: GeneratedArtifactRef[];
};
export type ReactTemplateDraft = {
    id: string;
    ownerComponentId: string;
    sourceRef?: SourceRef;
    jsxNodes: string[];
    bindings: string[];
    events: string[];
    forms: string[];
    rawText?: string;
    externalReferences: string[];
    reviewItemIds: string[];
    generatedRefs: GeneratedArtifactRef[];
};
export type ReactServiceDraft = {
    id: string;
    name: string;
    sourceRef?: SourceRef;
    kind: 'module' | 'hook' | 'context' | 'unknown';
    providerScope?: string;
    dependencies: string[];
    reviewItemIds: string[];
    generatedRefs: GeneratedArtifactRef[];
};
export type ReactRouteDraft = {
    id: string;
    path: string;
    sourceRef?: SourceRef;
    elementRef?: string;
    children: string[];
    guardRefs: string[];
    lazyTarget?: string;
    reviewItemIds: string[];
    generatedRefs: GeneratedArtifactRef[];
};
export type ReactStateDraft = {
    id: string;
    name: string;
    sourceRef?: SourceRef;
    strategy: StateStrategyKind;
    storeRefs: string[];
    actions: string[];
    selectors: string[];
    effects: string[];
    reviewItemIds: string[];
    generatedRefs: GeneratedArtifactRef[];
};
export type ReactTargetDraftSet = {
    schemaVersion: 1;
    targetFramework: TransformationTargetFramework;
    projectStrategy: TargetProjectStrategy;
    components: ReactComponentDraft[];
    templates: ReactTemplateDraft[];
    services: ReactServiceDraft[];
    routes: ReactRouteDraft[];
    state: ReactStateDraft[];
    manualReviewItems: ManualReviewItem[];
    diagnostics: Diagnostic[];
    traces: TraceLink[];
};
export type ProviderNeutralMappingRequest = {
    mappingRequestId: string;
    category: 'template' | 'lifecycle' | 'di' | 'route' | 'state' | 'form' | 'unknown';
    sourceRefs: SourceRef[];
    draftRefs: GeneratedArtifactRef[];
    ruleIds: string[];
    diagnosticRefs: string[];
    safeContext: Record<string, string | number | boolean | string[]>;
};
export type PassSummary = {
    totalRules: number;
    executedRules: number;
    skippedRules: number;
    diagnosticsBySeverity: Record<string, number>;
    reviewItemsByCategory: Record<string, number>;
    traceCoverage: {
        tracedDrafts: number;
        untracedDrafts: number;
    };
    phaseCounts: Record<string, number>;
};
export type TransformationSummary = {
    totalComponents: number;
    totalTemplates: number;
    totalServices: number;
    totalRoutes: number;
    totalStateArtifacts: number;
    totalDrafts: number;
    totalDiagnostics: number;
    totalReviewItems: number;
    totalTraces: number;
    packageRefCount: number;
};
export type TransformationArtifactRefs = {
    draftSetRef: GeneratedArtifactRef;
    tracesRef: GeneratedArtifactRef;
    diagnosticsRef: GeneratedArtifactRef;
    summaryRef: GeneratedArtifactRef;
    reviewItemsRef: GeneratedArtifactRef;
    mappingRequestsRef: GeneratedArtifactRef;
};
export type RuleContribution = {
    componentDrafts?: ReactComponentDraft[];
    templateDrafts?: ReactTemplateDraft[];
    serviceDrafts?: ReactServiceDraft[];
    routeDrafts?: ReactRouteDraft[];
    stateDrafts?: ReactStateDraft[];
    hooks?: ReactHookDraft[];
    diagnostics?: Diagnostic[];
    reviewItems?: ManualReviewItem[];
    traces?: TraceLink[];
    mappingRequests?: ProviderNeutralMappingRequest[];
};
export type TransformationRule = {
    ruleId: string;
    displayName: string;
    phase: TransformationPhase;
    priority: number;
    appliesTo: SourceEntityKind[];
    requires?: string[];
    conflictsWith?: string[];
    transform: (context: TransformationContext) => RuleContribution;
};
export type RuleRegistryPack = {
    packId: string;
    rules: TransformationRule[];
};
export type RuleExecutionPlan = {
    planId: string;
    orderedRules: TransformationRule[];
    skippedRules: Array<{
        ruleId: string;
        reason: string;
    }>;
    diagnostics: Diagnostic[];
};
export type TransformationPipelineOptions = {
    builtInRules?: TransformationRule[];
    rulePacks?: RuleRegistryPack[];
};
export type TransformationResult = {
    status: 'failed' | 'partial' | 'succeeded';
    context: TransformationContext;
    draftSet: ReactTargetDraftSet;
    mappingRequests: ProviderNeutralMappingRequest[];
    summary: TransformationSummary;
    passSummary: PassSummary;
    artifacts: TransformationArtifactRefs;
};
//# sourceMappingURL=types.d.ts.map