import type { Diagnostic, GeneratedArtifactRef, AngularSourceModelBoundary, SourceRef, Result } from '@spa-bridge/core-model';
export type AngularProjectKind = 'application' | 'library' | 'workspace';
export type AnalysisStatus = 'failed' | 'partial' | 'succeeded';
export type FileRole = 'component' | 'module' | 'directive' | 'pipe' | 'service' | 'route' | 'state' | 'template' | 'style' | 'config' | 'unknown';
export type FileKind = 'typescript' | 'template' | 'style' | 'json' | 'text';
export type SourceAngularAnalysisRequest = {
    projectRoot: string;
    sourceRoot?: string;
    entryFile?: string;
    includeExternalRefs?: boolean;
    outputDir?: string;
};
export type AngularWorkspaceProfile = {
    schemaVersion: 1;
    projectKind: AngularProjectKind;
    projectName: string;
    projectRoot: string;
    sourceRoot: string;
    entryFiles: string[];
    configFiles: string[];
    packageRefs: string[];
};
export type AliasResolutionStatus = 'supported' | 'unresolved' | 'external' | 'unsafe';
export type PathAliasMapping = {
    id: string;
    aliasPattern: string;
    targetPatterns: string[];
    resolvedTargets: string[];
    sourceConfigPath: string;
    status: AliasResolutionStatus;
};
export type AngularWorkspaceProjectAlias = {
    id: string;
    projectName: string;
    projectRoot: string;
    sourceRoot?: string;
    projectType?: string;
    status: AliasResolutionStatus;
};
export type AliasDiagnostic = {
    code: string;
    severity: Diagnostic['severity'];
    message: string;
    sourcePath?: string;
    aliasPattern?: string;
};
export type SourceAliasModel = {
    schemaVersion: 1;
    baseUrl?: string;
    configFiles: string[];
    paths: PathAliasMapping[];
    workspaceProjects: AngularWorkspaceProjectAlias[];
    assetRoots: string[];
    diagnostics: AliasDiagnostic[];
    summary: {
        totalAliases: number;
        supportedAliases: number;
        unresolvedAliases: number;
        unsafeAliases: number;
        externalAliases: number;
    };
};
export type FileInventoryRecord = {
    id: string;
    path: string;
    relativePath: string;
    role: FileRole;
    kind: FileKind;
    evidence: string[];
    relatedPaths: string[];
    parseStatus: 'pending' | 'parsed' | 'partial' | 'failed';
};
export type SourceInventory = {
    schemaVersion: 1;
    workspaceProfileId: string;
    files: FileInventoryRecord[];
    excludedPaths: string[];
};
export type DecoratorSummary = {
    kind: string;
    metadata: Record<string, string | boolean | string[]>;
    rawMetadataKeys: string[];
};
export type TypeScriptSymbolSummary = {
    id: string;
    path: string;
    name: string;
    symbolKind: 'class' | 'function' | 'interface' | 'type' | 'const' | 'import' | 'export' | 'unknown';
    decorators: DecoratorSummary[];
    members: string[];
    imports: string[];
    exports: string[];
    constructorDependencies: string[];
    lifecycleHooks: string[];
    references: string[];
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
};
export type TypeScriptParseSummary = {
    sourcePath: string;
    symbols: TypeScriptSymbolSummary[];
    diagnostics: Diagnostic[];
    hasParseErrors: boolean;
};
export type TemplateBindingSummary = {
    propertyBindings: string[];
    eventBindings: string[];
    structuralDirectives: string[];
    templateRefs: string[];
    pipes: string[];
    externalReferences: string[];
};
export type TemplateParseSummary = {
    sourcePath: string;
    ownerPath?: string;
    bindings: TemplateBindingSummary;
    rawText?: string;
    diagnostics: Diagnostic[];
    parserMode: 'angular-compiler' | 'heuristic';
};
export type RouteSummary = {
    id: string;
    sourcePath: string;
    path: string;
    component?: string;
    lazyLoadTarget?: string;
    guardRefs: string[];
    resolverRefs: string[];
    childPaths: string[];
    parameterNames: string[];
    isDynamic: boolean;
};
export type GraphNodeKind = 'project' | 'file' | 'symbol' | 'template' | 'style' | 'route' | 'state' | 'external';
export type GraphEdgeKind = 'imports' | 'declares' | 'provides' | 'uses-template' | 'uses-style' | 'routes-to' | 'guards' | 'references' | 'contains';
export type GraphNode = {
    id: string;
    kind: GraphNodeKind;
    label: string;
    sourceRef?: SourceRef;
    metadata?: Record<string, string | number | boolean>;
};
export type GraphEdge = {
    id: string;
    kind: GraphEdgeKind;
    from: string;
    to: string;
    evidenceRefs: SourceRef[];
    confidence: number;
};
export type AngularDependencyGraph = {
    schemaVersion: 1;
    nodes: GraphNode[];
    edges: GraphEdge[];
};
export type AnalysisArtifactRefs = {
    sourceModelRef: GeneratedArtifactRef;
    inventoryRef: GeneratedArtifactRef;
    graphRef: GeneratedArtifactRef;
    diagnosticsRef: GeneratedArtifactRef;
};
export type AngularAnalysisResult = {
    status: AnalysisStatus;
    workspaceProfile: AngularWorkspaceProfile;
    aliasModel: SourceAliasModel;
    inventory: SourceInventory;
    typeScriptSummaries: TypeScriptParseSummary[];
    templateSummaries: TemplateParseSummary[];
    routeSummaries: RouteSummary[];
    graph: AngularDependencyGraph;
    diagnostics: Diagnostic[];
    sourceModelBoundary: AngularSourceModelBoundary;
    artifacts: AnalysisArtifactRefs;
    summary: {
        totalFiles: number;
        totalSymbols: number;
        totalRoutes: number;
        totalDiagnostics: number;
        totalAliases: number;
        unresolvedAliases: number;
    };
};
export type AnalysisError = {
    code: 'PATH_INVALID' | 'NOT_FOUND' | 'VALIDATION_FAILED' | 'ANALYSIS_FAILED' | 'PARSER_UNAVAILABLE';
    message: string;
    cause?: unknown;
};
export type AnalysisResult<T> = Result<T, AnalysisError>;
//# sourceMappingURL=types.d.ts.map