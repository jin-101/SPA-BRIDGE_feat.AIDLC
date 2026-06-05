# UOW-03 Domain Entities

## Entity Overview

| Entity | Purpose | Key Relationships |
|---|---|---|
| `AnalyzeAngularSourceRequest` | Source analysis request from orchestration. | Produces `AngularAnalysisResult`. |
| `AngularWorkspaceProfile` | Identified Angular application project and entry metadata. | Owns project roots and entry file refs. |
| `AngularSourceInventory` | Ordered collection of discovered source files. | Contains `AngularFileRecord[]`. |
| `AngularFileRecord` | Classified file with source role and evidence. | References symbols, templates, styles, and graph nodes. |
| `AngularTypeScriptSymbol` | Parsed TypeScript class, function, import, export, or Angular symbol. | Feeds decorator, provider, route, and graph models. |
| `AngularDecoratorModel` | Extracted Angular decorator metadata. | Belongs to a TypeScript symbol. |
| `AngularComponentModel` | Component source model with class, template, style, metadata, inputs, outputs, and lifecycle evidence. | References templates, styles, services, and graph nodes. |
| `AngularTemplateModel` | Parsed template model with bindings, events, directives, refs, and pipes. | Belongs to component model. |
| `AngularStyleRef` | Inline or external style association. | Belongs to component model. |
| `AngularServiceModel` | Injectable or service source model with providers and dependency evidence. | References DI graph edges. |
| `AngularRouteModel` | Route declaration model with paths, components, guards, params, and lazy-loading evidence. | Feeds routing graph edges. |
| `AngularStateArtifact` | NgRx or service-based state source evidence. | Supports later state conversion units. |
| `AngularDependencyGraph` | Graph of source files and Angular domain relationships. | Contains graph nodes and edges. |
| `AngularAnalysisDiagnostic` | UOW-03-specific diagnostic mapped to UOW-01 `Diagnostic`. | References source refs and graph evidence. |
| `AngularAnalysisResult` | Analysis summary and artifact refs returned to UOW-02. | References inventory, model, graph, diagnostics, and boundary artifacts. |

## Core Entities

### AnalyzeAngularSourceRequest

| Field | Description |
|---|---|
| `projectRoot` | Validated Angular project root. |
| `workspaceRoot` | Workspace root used for path containment checks. |
| `configRefs` | Optional refs to Angular/project config artifacts. |
| `runId` | Conversion run identifier from UOW-02. |
| `correlationId` | Correlation ID for diagnostics and audit events. |
| `scanOptions` | Include/exclude and depth options approved by configuration. |

Business rules:
- Must validate path containment before reading files.
- Must not execute source code or project scripts.
- Must return blocking diagnostics for fatal workspace/config failures.

### AngularWorkspaceProfile

| Field | Description |
|---|---|
| `projectKind` | `application`, with library/workspace variants reserved for future extension. |
| `projectName` | Safe display project name where available. |
| `projectRoot` | Source project root. |
| `sourceRoot` | Main Angular source root. |
| `entryFiles` | Entry TypeScript and configuration files. |
| `configFiles` | Angular and TypeScript config refs. |
| `packageRefs` | Package metadata refs. |

Business rules:
- Missing application project metadata is a fatal workspace diagnostic.
- Project names and paths used in diagnostics must be safe display values.

### AngularSourceInventory

| Field | Description |
|---|---|
| `schemaVersion` | Inventory schema version. |
| `workspaceProfileRef` | Reference to workspace profile. |
| `files` | Ordered source file records. |
| `excludedPaths` | Paths excluded by scope rules. |
| `diagnostics` | Inventory diagnostics. |

Business rules:
- File order must be deterministic.
- Every included file must have classification evidence.
- Excluded paths are summarized safely and not scanned further.

### AngularFileRecord

| Field | Description |
|---|---|
| `sourceRef` | UOW-01 source reference. |
| `role` | `component`, `module`, `directive`, `pipe`, `service`, `route`, `state`, `template`, `style`, `config`, `unknown`. |
| `language` | `typescript`, `html`, `css`, `scss`, `json`, or `unknown`. |
| `evidence` | Safe classification rationale. |
| `relatedRefs` | Related template/style/config/source refs. |
| `parseStatus` | `not-parsed`, `parsed`, `partial`, or `failed`. |
| `diagnostics` | File-specific diagnostics. |

Business rules:
- Unknown files may remain in inventory if explicitly included by scope.
- Failed files keep source refs and diagnostics.

## Parsed Source Entities

### AngularTypeScriptSymbol

| Field | Description |
|---|---|
| `symbolId` | Stable symbol identifier. |
| `sourceRef` | Source file and optional symbol reference. |
| `symbolKind` | `class`, `function`, `const`, `interface`, `type`, `import`, `export`, or `unknown`. |
| `name` | Safe display symbol name. |
| `members` | Class members, methods, properties, constructor parameters. |
| `imports` | Import references. |
| `exports` | Export references. |
| `decorators` | Extracted Angular decorator models. |
| `references` | Basic symbol reference evidence. |

Business rules:
- Dynamic or unresolved references are represented with diagnostics instead of guessed semantics.
- Symbol IDs must be deterministic for the same path and symbol name.

### AngularDecoratorModel

| Field | Description |
|---|---|
| `decoratorKind` | `Component`, `Directive`, `Pipe`, `NgModule`, `Injectable`, `Input`, `Output`, or `Unknown`. |
| `sourceRef` | Decorator location. |
| `metadata` | Supported extracted metadata fields. |
| `unsupportedFields` | Fields requiring manual review. |
| `diagnostics` | Decorator diagnostics. |

Business rules:
- Unknown decorator shapes produce manual-review diagnostics.
- Decorator metadata must preserve source refs for downstream traceability.

### AngularComponentModel

| Field | Description |
|---|---|
| `componentId` | Stable component identifier. |
| `classSymbolRef` | Owning TypeScript class symbol. |
| `selector` | Component selector where statically available. |
| `templateRef` | Inline or external template model ref. |
| `styleRefs` | Inline or external style refs. |
| `inputs` | Input bindings from decorators or metadata. |
| `outputs` | Output bindings from decorators or metadata. |
| `providers` | Component-level providers. |
| `lifecycleHooks` | Detected lifecycle method names. |
| `diagnostics` | Component-specific diagnostics. |

Business rules:
- Missing template/style refs produce diagnostics and partial model state.
- Component models do not contain React conversion choices.

### AngularTemplateModel

| Field | Description |
|---|---|
| `templateId` | Stable template identifier. |
| `ownerComponentId` | Owning component. |
| `sourceRef` | Inline or external template source ref. |
| `bindings` | Property, attribute, interpolation, and two-way binding evidence. |
| `events` | Event binding evidence. |
| `structuralDirectives` | `ngIf`, `ngFor`, `ngSwitch`, and unknown structural directives. |
| `templateRefs` | Template reference variables. |
| `pipes` | Pipe references. |
| `diagnostics` | Template parse and support diagnostics. |

Business rules:
- Template expressions are parsed as source evidence, not executed.
- Unsupported expressions remain attached to source refs and diagnostics.

### AngularServiceModel

| Field | Description |
|---|---|
| `serviceId` | Stable service identifier. |
| `classSymbolRef` | Owning TypeScript class symbol. |
| `providedIn` | Injectable provider scope where available. |
| `constructorDependencies` | Constructor dependency evidence. |
| `methodRefs` | Service method references. |
| `stateEvidence` | Optional state-related evidence. |
| `diagnostics` | Service-specific diagnostics. |

Business rules:
- Constructor dependencies are evidence for DI graph edges.
- Runtime behavior is not evaluated.

### AngularRouteModel

| Field | Description |
|---|---|
| `routeId` | Stable route identifier. |
| `sourceRef` | Route declaration source. |
| `path` | Static route path where available. |
| `componentRef` | Referenced component where statically resolvable. |
| `lazyTargetRef` | Lazy-loaded module or route target evidence. |
| `guardRefs` | Guard and resolver references. |
| `parameters` | Route parameter evidence. |
| `children` | Nested route refs. |
| `diagnostics` | Route diagnostics. |

Business rules:
- Dynamic route expressions are preserved as unresolved evidence with manual-review diagnostics.
- Guard relationships must not be silently dropped.

### AngularStateArtifact

| Field | Description |
|---|---|
| `stateId` | Stable state artifact identifier. |
| `stateKind` | `ngrx-store`, `ngrx-action`, `ngrx-reducer`, `ngrx-selector`, `ngrx-effect`, `service-state`, or `unknown`. |
| `sourceRef` | Source file and symbol reference. |
| `relatedSymbols` | Symbols connected to the state artifact. |
| `diagnostics` | State artifact diagnostics. |

Business rules:
- State artifacts provide evidence only; state strategy selection belongs to UOW-07/UOW-04.
- Unknown state patterns produce manual-review diagnostics.

## Graph Entities

### AngularDependencyGraph

| Field | Description |
|---|---|
| `schemaVersion` | Graph schema version. |
| `nodes` | Graph nodes for files, projects, symbols, templates, and external dependencies. |
| `edges` | Typed graph relationships. |
| `diagnostics` | Graph integrity and ambiguity diagnostics. |
| `summary` | Counts by node and edge category. |

Business rules:
- Non-external edge endpoints must reference known nodes.
- Node and edge ordering must be deterministic.
- Ambiguous relationships require diagnostics or explicit confidence.

### AngularGraphNode

| Field | Description |
|---|---|
| `nodeId` | Stable node identifier. |
| `nodeKind` | `project`, `file`, `symbol`, `template`, `style`, `route`, `state`, or `external`. |
| `sourceRef` | Optional source ref. |
| `label` | Safe display label. |
| `metadata` | Safe graph metadata. |

### AngularGraphEdge

| Field | Description |
|---|---|
| `edgeId` | Stable edge identifier. |
| `edgeKind` | `imports`, `declares`, `provides`, `uses-template`, `uses-style`, `routes-to`, `guards`, or `references`. |
| `fromNodeId` | Source node. |
| `toNodeId` | Target node. |
| `evidenceRefs` | Source refs that justify the edge. |
| `confidence` | Confidence score from 0 to 1. |

## Result and Handoff Entities

### AngularAnalysisDiagnostic

| Field | Description |
|---|---|
| `code` | Stable diagnostic code. |
| `severity` | UOW-01 diagnostic severity. |
| `message` | Safe display message. |
| `sourceRefs` | Source refs where available. |
| `tags` | Unit, story, parser area, and remediation tags. |
| `remediationHint` | Optional safe remediation guidance. |

Business rules:
- Must map to UOW-01 `Diagnostic`.
- Must not include raw secrets, tokens, or sensitive source snippets.

### AngularAnalysisResult

| Field | Description |
|---|---|
| `status` | `succeeded`, `partial`, or `failed`. |
| `sourceModelBoundary` | UOW-01 `AngularSourceModelBoundary` ref or payload. |
| `inventoryRef` | Persisted inventory artifact ref. |
| `graphRef` | Persisted dependency graph artifact ref. |
| `diagnosticsRef` | Persisted diagnostics artifact ref. |
| `summary` | Counts of projects, files, symbols, routes, diagnostics, and unresolved items. |
| `blockingDiagnostics` | Diagnostics that prevent downstream conversion. |

Business rules:
- Fatal workspace/config failures return `failed`.
- Per-file failures usually return `partial`.
- Successful analysis may still include warnings or manual-review diagnostics.

## Domain Relationships

| Relationship | Description |
|---|---|
| `AnalyzeAngularSourceRequest` | produces `AngularWorkspaceProfile` and `AngularSourceInventory`. |
| `AngularSourceInventory` | contains `AngularFileRecord` entries. |
| `AngularFileRecord` | may produce `AngularTypeScriptSymbol`, `AngularTemplateModel`, or `AngularStyleRef`. |
| `AngularTypeScriptSymbol` | may own `AngularDecoratorModel`. |
| `AngularDecoratorModel` | may produce `AngularComponentModel`, `AngularServiceModel`, `AngularRouteModel`, or `AngularStateArtifact`. |
| `AngularComponentModel` | references `AngularTemplateModel` and `AngularStyleRef`. |
| `AngularRouteModel` | references components, guards, lazy targets, and child routes. |
| Parsed entities | produce `AngularDependencyGraph` nodes and edges. |
| Parser failures | produce `AngularAnalysisDiagnostic` and partial entity records. |
| `AngularAnalysisResult` | references source model, inventory, graph, and diagnostics artifacts. |

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
