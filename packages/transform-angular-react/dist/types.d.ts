import type { Diagnostic, GeneratedArtifactRef, ManualReviewItem, SourceRef, TraceLink } from '@spa-bridge/core-model';
import type { AngularAnalysisResult, SourceAliasModel, TemplateIr } from '@spa-bridge/source-angular';
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
        decorators: string[];
        typeText?: string;
        isEventEmitter: boolean;
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
    templateIr?: TemplateIr;
    diagnostics: Diagnostic[];
};
export type NormalizedValidator = {
    id: string;
    kind: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'min' | 'max' | 'custom' | 'async' | 'unknown';
    arguments: string[];
    reviewRequired: boolean;
};
export type NormalizedFormControl = {
    id: string;
    name: string;
    path: string;
    initialValue?: string;
    valueType: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'unknown';
    validators: NormalizedValidator[];
    asyncValidators: NormalizedValidator[];
};
export type NormalizedFormArray = {
    id: string;
    name: string;
    path: string;
    itemKind: 'control' | 'group' | 'array' | 'unknown';
    initialItems: Array<NormalizedFormControl | NormalizedFormGroup | NormalizedFormArray>;
    complexity: 'simple' | 'review-required';
    validators: NormalizedValidator[];
};
export type NormalizedFormGroup = {
    id: string;
    name: string;
    path: string;
    controls: NormalizedFormControl[];
    groups: NormalizedFormGroup[];
    arrays: NormalizedFormArray[];
    validators: NormalizedValidator[];
};
export type NormalizedFormBindingIntent = {
    id: string;
    kind: 'formGroup' | 'formControlName' | 'formArrayName' | 'ngModel' | 'ngModelChange' | 'unknown';
    name?: string;
    expression?: string;
    sourcePath: string;
};
export type NormalizedFormSubmitIntent = {
    id: string;
    expression: string;
    sourcePath: string;
};
export type NormalizedFormModel = {
    id: string;
    ownerComponentId: string;
    ownerComponentPath: string;
    declarationKind: 'form-group' | 'form-control' | 'form-array' | 'form-builder' | 'template-driven';
    rootControl: NormalizedFormGroup | NormalizedFormControl | NormalizedFormArray;
    templateBindings: NormalizedFormBindingIntent[];
    submitIntents: NormalizedFormSubmitIntent[];
};
export type NormalizedRxOperator = {
    id: string;
    name: string;
    argumentText?: string;
    operatorKind: 'projection' | 'filter' | 'side-effect' | 'flattening' | 'error-handling' | 'timing' | 'sharing' | 'cleanup' | 'unknown';
    reviewRequired: boolean;
};
export type NormalizedRxOperatorChain = {
    id: string;
    sourceExpression: string;
    operators: NormalizedRxOperator[];
    hasFlattening: boolean;
    hasErrorHandling: boolean;
    hasCleanupOperator: boolean;
    conversionSafety: 'safe' | 'review-required' | 'unsupported';
};
export type NormalizedRxStreamModel = {
    id: string;
    ownerId: string;
    ownerKind: 'component' | 'service' | 'store-effect' | 'unknown';
    sourceRef?: SourceRef;
    memberName: string;
    valueName: string;
    typeText?: string;
    initializerText?: string;
    operatorChainIds: string[];
    asyncPipeBindingIds: string[];
    diagnostics: string[];
};
export type NormalizedRxSubjectModel = {
    id: string;
    subjectKind: 'Subject' | 'BehaviorSubject' | 'ReplaySubject' | 'AsyncSubject' | 'unknown';
    memberName: string;
    initialValueText?: string;
    cleanupRole: 'destroy-signal' | 'state-source' | 'event-source' | 'unknown';
    reviewRequired: boolean;
};
export type NormalizedRxSubscriptionModel = {
    id: string;
    ownerId: string;
    sourceExpression: string;
    nextCallbackText?: string;
    assignmentTarget?: string;
    cleanupEvidence: 'takeUntil' | 'subscription-add' | 'ngOnDestroy-unsubscribe' | 'none' | 'unknown';
    operatorChainId?: string;
    sideEffectLevel: 'none' | 'state-assignment' | 'method-call' | 'external-effect' | 'unknown';
};
export type NormalizedAsyncPipeBinding = {
    id: string;
    ownerComponentId: string;
    templateSourceRef?: SourceRef;
    expressionText: string;
    streamId?: string;
    bindingKind: 'interpolation' | 'property' | 'attribute' | 'structural' | 'unknown';
    fallbackValueText?: string;
    reviewRequired: boolean;
};
export type ReactRxHookDraft = {
    id: string;
    ownerComponentId: string;
    hookKind: 'useObservable' | 'useSubjectValue' | 'useSubscriptionEffect';
    sourceStreamId: string;
    valueName: string;
    initialValueText: string;
    dependencyExpressions: string[];
    cleanupRequired: boolean;
    reviewComments: string[];
};
export type NormalizedNgrxActionModel = {
    id: string;
    name: string;
    actionType: string;
    sourceRef?: SourceRef;
    payloadProperties: string[];
};
export type NormalizedNgrxReducerHandlerModel = {
    id: string;
    actionNames: string[];
    reducerExpression: string;
    reviewRequired: boolean;
};
export type NormalizedNgrxReducerModel = {
    id: string;
    name: string;
    featureName: string;
    initialStateRef?: string;
    sourceRef?: SourceRef;
    handlers: NormalizedNgrxReducerHandlerModel[];
};
export type NormalizedNgrxSelectorModel = {
    id: string;
    name: string;
    featureName?: string;
    dependencies: string[];
    projectorExpression?: string;
    sourceRef?: SourceRef;
    reviewRequired: boolean;
};
export type NormalizedNgrxEffectModel = {
    id: string;
    name: string;
    sourceRef?: SourceRef;
    ofTypeActions: string[];
    dispatch: boolean;
    operatorIntents: string[];
    serviceCallRefs: string[];
    safety: 'safe' | 'review-required' | 'unsupported';
};
export type NormalizedNgrxEntityAdapterModel = {
    id: string;
    name: string;
    entityType?: string;
    sourceRef?: SourceRef;
    selectIdExpression?: string;
    sortComparerExpression?: string;
    helperRefs: string[];
    reviewRequired: boolean;
};
export type NormalizedNgrxComponentUsageModel = {
    id: string;
    ownerComponentPath: string;
    ownerComponentName?: string;
    sourceRef?: SourceRef;
    storeDependencyName: string;
    selectedSelectors: string[];
    dispatchedActions: string[];
    usageKind: 'select' | 'dispatch' | 'mixed' | 'injected-only';
    reviewRequired: boolean;
};
export type ReactReduxToolkitDraft = {
    id: string;
    featureName: string;
    actions: NormalizedNgrxActionModel[];
    reducer?: NormalizedNgrxReducerModel;
    selectors: NormalizedNgrxSelectorModel[];
    effects: NormalizedNgrxEffectModel[];
    entityAdapters: NormalizedNgrxEntityAdapterModel[];
    componentUsages: NormalizedNgrxComponentUsageModel[];
    hasRouterStore: boolean;
    reviewComments: string[];
};
export type ReactReduxUsageDraft = {
    id: string;
    ownerComponentId: string;
    selectorRefs: string[];
    actionRefs: string[];
    reviewComments: string[];
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
    aliasModel: SourceAliasModel;
    targetFramework: TransformationTargetFramework;
    targetProjectStrategy: TargetProjectStrategy;
    stateStrategy: StateStrategyKind;
    enabledRulePacks: string[];
    projectName: string;
    diagnostics: Diagnostic[];
    components: NormalizedComponent[];
    templates: NormalizedTemplate[];
    forms: NormalizedFormModel[];
    rxStreams: NormalizedRxStreamModel[];
    rxSubjects: NormalizedRxSubjectModel[];
    rxSubscriptions: NormalizedRxSubscriptionModel[];
    rxOperatorChains: NormalizedRxOperatorChain[];
    asyncPipeBindings: NormalizedAsyncPipeBinding[];
    ngrxActions: NormalizedNgrxActionModel[];
    ngrxReducers: NormalizedNgrxReducerModel[];
    ngrxSelectors: NormalizedNgrxSelectorModel[];
    ngrxEffects: NormalizedNgrxEffectModel[];
    ngrxEntityAdapters: NormalizedNgrxEntityAdapterModel[];
    ngrxComponentUsages: NormalizedNgrxComponentUsageModel[];
    hasNgrxRouterStore: boolean;
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
    selector?: string;
    props: string[];
    state: string[];
    hooks: ReactHookDraft[];
    imports: string[];
    templateDraftId?: string;
    templateRawText?: string;
    templateIr?: TemplateIr;
    templateExternalReferences: string[];
    forms: NormalizedFormModel[];
    rxHooks: ReactRxHookDraft[];
    reduxUsage?: ReactReduxUsageDraft;
    serviceRefs: string[];
    styleUrls: string[];
    sourceRelativePath?: string;
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
    templateIr?: TemplateIr;
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
    reduxToolkit?: ReactReduxToolkitDraft;
    reviewItemIds: string[];
    generatedRefs: GeneratedArtifactRef[];
};
export type ReactTargetDraftSet = {
    schemaVersion: 1;
    targetFramework: TransformationTargetFramework;
    projectStrategy: TargetProjectStrategy;
    aliasModel: SourceAliasModel;
    components: ReactComponentDraft[];
    templates: ReactTemplateDraft[];
    services: ReactServiceDraft[];
    routes: ReactRouteDraft[];
    state: ReactStateDraft[];
    reduxToolkit: ReactReduxToolkitDraft[];
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
    reduxToolkitDrafts?: ReactReduxToolkitDraft[];
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