# SPA-Bridge Component Methods

## Method Signature Conventions

- TypeScript-like signatures are used for design clarity.
- Types are high-level placeholders; exact schemas are defined during Functional Design and Code Generation.
- Methods describe component contracts, not detailed business rules.

## Interface Layer

### CLI Interface

| Method | Purpose |
|---|---|
| `parseArgs(argv: string[]): CliCommand` | Parse and validate CLI command shape. |
| `run(command: CliCommand): Promise<CliResult>` | Execute a CLI command through the shared application service. |
| `renderResult(result: CliResult): void` | Render progress, summary, and report paths. |

### Web UI Interface

| Method | Purpose |
|---|---|
| `loadRunView(runId: RunId): Promise<RunViewModel>` | Load run status and review data. |
| `startConversion(request: WebConversionRequest): Promise<RunSummary>` | Start conversion through the shared application service. |
| `loadReport(runId: RunId): Promise<ReportViewModel>` | Load report data for review and remediation. |

## Application Orchestration

### Conversion Application Service

| Method | Purpose |
|---|---|
| `startConversion(request: ConversionRequest): Promise<ConversionRun>` | Create run workspace and execute conversion workflow. |
| `resumeConversion(runId: RunId): Promise<ConversionRun>` | Resume or rerun a conversion from persisted manifest state. |
| `getRunStatus(runId: RunId): Promise<RunStatus>` | Return current run status and artifact references. |
| `exportReport(runId: RunId, format: ReportFormat): Promise<ReportArtifact>` | Export canonical report to requested view format. |

### Configuration Service

| Method | Purpose |
|---|---|
| `loadConfig(input: ConfigInput): Promise<ConversionConfig>` | Load configuration from CLI/Web UI input and files. |
| `normalizeConfig(config: ConversionConfig): NormalizedConfig` | Apply defaults such as Vite + React + TypeScript. |
| `validateConfig(config: NormalizedConfig): ValidationResult` | Validate target, provider, path, and policy settings. |

### Run Workspace Manager

| Method | Purpose |
|---|---|
| `createRun(config: NormalizedConfig): Promise<RunWorkspace>` | Create file-based workspace and manifest. |
| `writeArtifact(runId: RunId, artifact: Artifact): Promise<ArtifactRef>` | Persist generated artifacts. |
| `readManifest(runId: RunId): Promise<RunManifest>` | Read run state. |
| `updateManifest(runId: RunId, patch: ManifestPatch): Promise<RunManifest>` | Persist run state updates. |

## Source Analysis

### Project Scanner

| Method | Purpose |
|---|---|
| `scanProject(root: ProjectPath, options: ScanOptions): Promise<ProjectInventory>` | Discover Angular project files and classify them. |
| `classifyFile(path: SourcePath): SourceFileKind` | Identify modules, components, templates, styles, routes, services, and state files. |

### Angular Parser

| Method | Purpose |
|---|---|
| `parseTypescript(files: SourceFile[]): Promise<AngularTsModel>` | Parse TypeScript files and Angular decorators. |
| `parseTemplate(file: SourceFile): Promise<AngularTemplateModel>` | Parse Angular template syntax. |
| `parseStyles(files: SourceFile[]): Promise<StyleModel[]>` | Capture style references and metadata. |

### Dependency Graph Builder

| Method | Purpose |
|---|---|
| `buildGraph(inventory: ProjectInventory, parsed: AngularSourceModel): DependencyGraph` | Build dependency graph across parsed artifacts. |
| `findRelatedFiles(component: AngularComponentModel): RelatedFileSet` | Link component class, template, style, tests, and module files. |

## Model and Normalization

### IR Normalizer

| Method | Purpose |
|---|---|
| `toIntermediateRepresentation(source: AngularSourceModel, graph: DependencyGraph): IntermediateRepresentation` | Convert Angular-specific model to framework-neutral IR. |
| `attachTraceability(ir: IntermediateRepresentation, source: AngularSourceModel): IntermediateRepresentation` | Preserve source location and mapping references. |
| `validateIr(ir: IntermediateRepresentation): ValidationResult` | Validate internal consistency before transformation. |

## Transformation

### Rule Pack Registry

| Method | Purpose |
|---|---|
| `register(pack: RulePack): void` | Register internal plugin-friendly rule pack. |
| `resolve(context: ConversionContext): RulePack[]` | Resolve applicable rule packs for conversion context. |

### Mapping Engine

| Method | Purpose |
|---|---|
| `transform(ir: IntermediateRepresentation, context: ConversionContext): Promise<TargetDraft>` | Execute ordered transformation pipeline. |
| `applyRule(rule: ConversionRule, input: RuleInput): Promise<RuleResult>` | Apply one deterministic or AI-assisted rule. |
| `collectDiagnostics(results: RuleResult[]): Diagnostic[]` | Collect uncertainty and manual review items. |

### Domain Converters

| Component | Method | Purpose |
|---|---|---|
| Component Converter | `convertComponent(component: IrComponent, context: ConversionContext): ComponentDraft` | Convert component structure and metadata. |
| Template Converter | `convertTemplate(template: IrTemplate, context: ConversionContext): TsxDraft` | Convert Angular template to JSX/TSX draft. |
| Binding Converter | `convertBindings(bindings: IrBinding[]): BindingDraft[]` | Convert property, event, and two-way bindings. |
| Lifecycle Converter | `convertLifecycle(lifecycle: IrLifecycle[]): HookDraft[]` | Convert lifecycle semantics to React hooks. |
| Routing Converter | `convertRoutes(routes: IrRoute[]): RouteDraft` | Convert Angular routes to React route draft. |
| Service and DI Converter | `convertServices(services: IrService[]): ServiceDraft[]` | Convert services and DI patterns. |
| State Converter | `convertState(state: IrStateModel, strategy: StateStrategy): StateDraft` | Convert NgRx/service state into selected target strategy. |

## AI and Security

### LLM Provider Registry

| Method | Purpose |
|---|---|
| `registerProvider(provider: LlmProvider): void` | Register provider adapter. |
| `resolveProvider(policy: ProviderPolicy): LlmProvider` | Select local/internal or allowed external provider. |

### LLM Policy Service

| Method | Purpose |
|---|---|
| `authorizeRequest(request: LlmRequest, policy: ProviderPolicy): PolicyDecision` | Enforce provider, outbound, and masking rules. |
| `prepareContext(context: AiContext): Promise<PreparedAiContext>` | Apply context minimization and masking requirements. |

### Masking Service

| Method | Purpose |
|---|---|
| `mask(input: SensitivePayload, policy: MaskingPolicy): MaskedPayload` | Replace sensitive values with stable placeholders. |
| `restore(output: MaskedPayload, tokenMap: MaskTokenMap): RestoredPayload` | Restore masked values where safe. |
| `detect(input: string, policy: MaskingPolicy): SensitiveFinding[]` | Detect secrets, URLs, IPs, proprietary terms, and configured patterns. |

## Generation, Quality, and Reporting

### React Project Generator

| Method | Purpose |
|---|---|
| `generateProject(draft: TargetDraft, config: TargetConfig): Promise<GeneratedProject>` | Generate React source, config, package, and entry files. |
| `writeProject(project: GeneratedProject, workspace: RunWorkspace): Promise<ArtifactRef[]>` | Persist generated target project artifacts. |

### Quality Gate Service

| Method | Purpose |
|---|---|
| `runGates(project: GeneratedProject, config: QualityConfig): Promise<QualityResult>` | Run compile, lint, format, build, and tests. |
| `summarize(result: QualityResult): QualitySummary` | Produce quality gate summary for report and remediation. |

### Self-Correction Service

| Method | Purpose |
|---|---|
| `correct(draft: TargetDraft, quality: QualityResult, context: CorrectionContext): Promise<CorrectionResult>` | Coordinate bounded correction loop. |
| `shouldContinue(history: CorrectionAttempt[]): boolean` | Enforce iteration limits and fail-safe stop conditions. |

### Report Builder and Exporter

| Method | Purpose |
|---|---|
| `buildReport(run: ConversionRun, artifacts: ArtifactRef[], diagnostics: Diagnostic[], quality: QualityResult): ConversionReport` | Build canonical JSON report. |
| `export(report: ConversionReport, format: ReportFormat): ReportArtifact` | Generate Markdown or HTML view/export from JSON. |

## Compliance Notes

- Security-critical methods are grouped in LLM Policy Service, Masking Service, and Audit/Logging responsibilities.
- PBT candidates include `normalizeConfig`, `mask`/`restore`, `toIntermediateRepresentation`, report export serialization, graph construction, and deterministic mapping rules.

