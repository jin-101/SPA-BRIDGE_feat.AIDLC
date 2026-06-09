import type { Diagnostic, GeneratedArtifactRef, AngularSourceModelBoundary, SourceRef, Result } from '@spa-bridge/core-model';

export type AngularProjectKind = 'application' | 'library' | 'workspace';

export type AnalysisStatus = 'failed' | 'partial' | 'succeeded';

export type FileRole =
  | 'component'
  | 'module'
  | 'directive'
  | 'pipe'
  | 'service'
  | 'route'
  | 'state'
  | 'template'
  | 'style'
  | 'config'
  | 'unknown';

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

export type TemplateNodeKind = 'element' | 'text' | 'interpolation' | 'projection' | 'deferred-fragment';
export type TemplateDirectiveKind = 'if' | 'for' | 'container' | 'template' | 'projection' | 'class' | 'style' | 'form' | 'unknown';

export type TemplateDirective = {
  kind: TemplateDirectiveKind;
  name: string;
  expression?: string;
  localVariables: Record<string, string>;
};

export type TemplateBinding = {
  name: string;
  expression: string;
  bindingKind: 'property' | 'attribute' | 'class' | 'style' | 'two-way' | 'unknown';
};

export type TemplateEvent = {
  name: string;
  expression: string;
};

export type TemplatePipeUsage = {
  name: string;
  expression: string;
  arguments: string[];
};

export type TemplateConversionDiagnostic = {
  code: string;
  severity: Diagnostic['severity'];
  message: string;
  nodeId?: string;
};

export type TemplateIrNode = {
  id: string;
  kind: TemplateNodeKind;
  tagName?: string;
  text?: string;
  expression?: string;
  attributes: Record<string, string>;
  directives: TemplateDirective[];
  bindings: TemplateBinding[];
  events: TemplateEvent[];
  pipes: TemplatePipeUsage[];
  children: TemplateIrNode[];
};

export type TemplateIr = {
  schemaVersion: 1;
  sourcePath: string;
  rootNodes: TemplateIrNode[];
  diagnostics: TemplateConversionDiagnostic[];
};

export type TemplateParseSummary = {
  sourcePath: string;
  ownerPath?: string;
  bindings: TemplateBindingSummary;
  templateIr?: TemplateIr;
  rawText?: string;
  diagnostics: Diagnostic[];
  parserMode: 'angular-compiler' | 'heuristic';
};

export type AngularValidatorKind =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'email'
  | 'min'
  | 'max'
  | 'custom'
  | 'async'
  | 'unknown';

export type AngularValidatorModel = {
  id: string;
  kind: AngularValidatorKind;
  arguments: string[];
  sourceRef: SourceRef;
  reviewRequired: boolean;
};

export type AngularFormControlModel = {
  id: string;
  name: string;
  path: string;
  initialValue?: string;
  valueType: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'unknown';
  validators: AngularValidatorModel[];
  asyncValidators: AngularValidatorModel[];
  sourceExpression?: string;
};

export type AngularFormArrayModel = {
  id: string;
  name: string;
  path: string;
  itemKind: 'control' | 'group' | 'array' | 'unknown';
  initialItems: Array<AngularFormControlModel | AngularFormGroupModel | AngularFormArrayModel>;
  mutatorRefs: string[];
  complexity: 'simple' | 'review-required';
  validators: AngularValidatorModel[];
};

export type AngularFormGroupModel = {
  id: string;
  name: string;
  path: string;
  controls: AngularFormControlModel[];
  groups: AngularFormGroupModel[];
  arrays: AngularFormArrayModel[];
  validators: AngularValidatorModel[];
};

export type FormTemplateBindingIntent = {
  id: string;
  kind: 'formGroup' | 'formControlName' | 'formArrayName' | 'ngModel' | 'ngModelChange' | 'unknown';
  name?: string;
  expression?: string;
  sourcePath: string;
};

export type FormSubmitIntent = {
  id: string;
  expression: string;
  sourcePath: string;
};

export type AngularFormDiagnostic = {
  code: string;
  severity: Diagnostic['severity'];
  message: string;
  sourceRef: SourceRef;
};

export type AngularFormModel = {
  schemaVersion: 1;
  id: string;
  ownerComponentId: string;
  ownerComponentPath: string;
  sourceRef: SourceRef;
  declarationKind: 'form-group' | 'form-control' | 'form-array' | 'form-builder' | 'template-driven';
  rootControl: AngularFormGroupModel | AngularFormControlModel | AngularFormArrayModel;
  templateBindings: FormTemplateBindingIntent[];
  submitIntents: FormSubmitIntent[];
  diagnostics: AngularFormDiagnostic[];
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
export type GraphEdgeKind =
  | 'imports'
  | 'declares'
  | 'provides'
  | 'uses-template'
  | 'uses-style'
  | 'routes-to'
  | 'guards'
  | 'references'
  | 'contains';

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
  formModels: AngularFormModel[];
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
    totalForms: number;
    totalFormControls: number;
    totalFormDiagnostics: number;
  };
};

export type AnalysisError = {
  code:
    | 'PATH_INVALID'
    | 'NOT_FOUND'
    | 'VALIDATION_FAILED'
    | 'ANALYSIS_FAILED'
    | 'PARSER_UNAVAILABLE';
  message: string;
  cause?: unknown;
};

export type AnalysisResult<T> = Result<T, AnalysisError>;
