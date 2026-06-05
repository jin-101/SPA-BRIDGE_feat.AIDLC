# UOW-03 Logical Components

## Component Overview

| Component | Purpose | Primary Outputs |
|---|---|---|
| `AngularSourceAnalysisService` | Public package-facing service that coordinates the staged pipeline. | `AngularAnalysisResult`. |
| `PathGuard` | Validates source root, workspace root, traversal, and explicit external refs. | Safe path refs and path diagnostics. |
| `WorkspaceProfiler` | Reads Angular config and identifies the application project profile. | `AngularWorkspaceProfile`. |
| `SourceInventoryBuilder` | Discovers and classifies scoped source files. | `AngularSourceInventory`. |
| `TypeScriptParserAdapter` | Parses TypeScript AST and Angular decorator evidence. | TypeScript parser summaries. |
| `AngularTemplateParserAdapter` | Parses Angular templates into supported template evidence. | Template parser summaries. |
| `StyleAssociationAnalyzer` | Associates inline/external styles with owning components. | `AngularStyleRef[]`. |
| `RouteAnalyzer` | Extracts route evidence, guards, params, lazy-loading, and route diagnostics. | `AngularRouteModel[]`. |
| `StateArtifactAnalyzer` | Detects NgRx and service-state source evidence. | `AngularStateArtifact[]`. |
| `GraphBuilder` | Collects, normalizes, validates, sorts, and finalizes graph nodes/edges. | `AngularDependencyGraph`. |
| `SafeDiagnosticBuilder` | Creates safe UOW-01-compatible diagnostics. | `DiagnosticsCollection`. |
| `StableIdFactory` | Produces deterministic IDs for source entities, graph elements, and diagnostics. | Stable IDs. |
| `AnalysisArtifactMapper` | Maps analysis output to source model boundary and artifact refs. | Handoff artifact refs. |
| `AnalysisPbtGenerators` | Provides test generators for UOW-03 properties. | PBT arbitraries/generators. |
| `BenchmarkFixtureFactory` | Produces synthetic 100+ and 500+ component fixtures. | Benchmark fixture source trees. |

## Component Responsibilities

### AngularSourceAnalysisService

Responsibilities:
- Accept `AnalyzeAngularSourceRequest`.
- Run the staged analysis pipeline.
- Short-circuit on fatal workspace/config diagnostics.
- Return `failed`, `partial`, or `succeeded` analysis result.
- Keep UOW-03 independent from React generation, AI providers, masking, and report rendering.

Collaborators:
- `PathGuard`
- `WorkspaceProfiler`
- `SourceInventoryBuilder`
- Parser adapters
- `GraphBuilder`
- `SafeDiagnosticBuilder`
- `AnalysisArtifactMapper`

### PathGuard

Responsibilities:
- Canonicalize workspace root and source root.
- Reject traversal and unsupported external paths.
- Allow explicit external refs discovered from config, routing, template, or style metadata.
- Return typed safe path refs.

NFR mapping:
- SECURITY-05 path validation.
- Deterministic normalized relative path inputs for stable IDs.

### WorkspaceProfiler

Responsibilities:
- Read Angular project configuration as untrusted data.
- Identify initial application workspace profile.
- Extract source root, entry files, and config refs.
- Emit fatal diagnostics when no valid application project can be identified.

NFR mapping:
- Fail-fast on fatal workspace/config corruption.
- No project script execution.

### SourceInventoryBuilder

Responsibilities:
- Traverse only approved source scope.
- Exclude dependencies, build outputs, cache directories, and hidden run workspaces.
- Classify files as component, module, directive, pipe, service, route, state, template, style, config, or unknown.
- Sort inventory deterministically.

NFR mapping:
- Inventory determinism.
- Bounded source discovery.
- Classification idempotence.

### TypeScriptParserAdapter

Responsibilities:
- Use TypeScript Compiler API for syntactic parsing.
- Extract imports, exports, classes, decorators, members, constructor parameters, lifecycle hooks, providers, inputs, outputs, and basic references.
- Return compact summaries and diagnostics.
- Drop raw AST/source references after summary extraction.

NFR mapping:
- Structured parsing without full semantic type checking.
- File-at-a-time parsing.
- Source treated as untrusted input.

### AngularTemplateParserAdapter

Responsibilities:
- Use Angular compiler parser for template AST extraction.
- Extract bindings, events, structural directives, pipes, template refs, and external refs.
- Return compact summaries and diagnostics.
- Avoid runtime expression evaluation.

NFR mapping:
- Template parser dependency isolation.
- Safe malformed template handling.

### StyleAssociationAnalyzer

Responsibilities:
- Associate inline and external style refs with owning component records.
- Emit diagnostics for missing or disallowed external style refs.
- Preserve safe style source refs for downstream target generation.

NFR mapping:
- Explicit external ref handling.
- Partial component model preservation.

### RouteAnalyzer

Responsibilities:
- Extract statically visible route paths, component refs, lazy targets, guards, resolvers, redirects, params, and children.
- Emit manual-review diagnostics for dynamic route expressions.
- Submit route graph candidates to `GraphBuilder`.

NFR mapping:
- Guard relationships must not be silently dropped.
- Dynamic source becomes diagnostics, not guessed semantics.

### StateArtifactAnalyzer

Responsibilities:
- Detect NgRx and service-state source evidence.
- Classify state artifacts without selecting target state strategy.
- Emit state-related diagnostics for ambiguous patterns.

NFR mapping:
- Keeps source analysis separate from transformation and target generation.

### GraphBuilder

Responsibilities:
- Collect graph node and edge candidates from inventory and parser summaries.
- Normalize IDs and external node markers.
- Validate non-external edge endpoints.
- Sort nodes and edges deterministically.
- Emit graph diagnostics for invalid or ambiguous relationships.

NFR mapping:
- Graph invariant PBT.
- Stable ID/order requirements.
- Downstream artifact integrity.

### SafeDiagnosticBuilder

Responsibilities:
- Create UOW-01-compatible diagnostics.
- Enforce safe message construction.
- Block raw snippets and raw parser errors.
- Normalize severity, code, tags, source refs, and remediation hints.
- Sort diagnostics deterministically.

NFR mapping:
- Diagnostic privacy.
- Diagnostic stability PBT.
- SECURITY-03 and SECURITY-05 alignment.

### StableIdFactory

Responsibilities:
- Generate deterministic IDs from normalized relative paths, source roles, symbol/template/edge kinds, names, and deterministic ordinals.
- Avoid random IDs for persisted analysis artifacts.
- Provide ID helpers for file records, symbols, templates, graph nodes, graph edges, diagnostics, and artifact refs.

NFR mapping:
- Stable artifact and traceability references.
- Diff-friendly output.

### AnalysisArtifactMapper

Responsibilities:
- Map source analysis outputs into `AngularSourceModelBoundary`-compatible payloads and artifact refs.
- Persist or prepare references for inventory, graph, diagnostics, and source model artifacts.
- Return summary counts to UOW-02.

NFR mapping:
- Maintains UOW-01 contract compatibility.
- Prevents raw source duplication in persisted artifacts.

### AnalysisPbtGenerators

Responsibilities:
- Generate valid file inventories, classified records, graph nodes/edges, diagnostics, and parser summaries.
- Respect domain constraints such as path containment and graph endpoint validity.
- Support shrinking and reproducibility through fast-check/Vitest.

NFR mapping:
- PBT-07 implementation target for Code Generation.
- Required blocking PBT coverage.

### BenchmarkFixtureFactory

Responsibilities:
- Generate synthetic Angular-like source projects with 100+ and 500+ components.
- Include representative components, templates, styles, services, routes, and malformed/dynamic variants.
- Support benchmark instructions with reproducible fixture generation.

NFR mapping:
- 30-second 100+ component target.
- 500+ component benchmark baseline.

## Dependency Boundaries

| Component | May Depend On | Must Not Depend On |
|---|---|---|
| `AngularSourceAnalysisService` | UOW-03 components, UOW-01 contracts | React target generation, AI providers, Web UI |
| `PathGuard` | path utilities, UOW-01 result/diagnostic contracts | File parsing or graph logic |
| `WorkspaceProfiler` | `PathGuard`, file access port, safe diagnostics | Angular builder execution |
| `SourceInventoryBuilder` | `PathGuard`, file access port, stable IDs | Parser internals |
| Parser adapters | TypeScript Compiler API, Angular compiler parser, safe diagnostics | AI providers, runtime source execution |
| `GraphBuilder` | stable IDs, parser summaries, safe diagnostics | File system traversal |
| `AnalysisArtifactMapper` | UOW-01 source model/traceability/diagnostic concepts | Report rendering |

## Data Flow

1. `AngularSourceAnalysisService` receives request.
2. `PathGuard` validates and normalizes path refs.
3. `WorkspaceProfiler` identifies application project profile.
4. `SourceInventoryBuilder` discovers and classifies source files.
5. `TypeScriptParserAdapter` and `AngularTemplateParserAdapter` parse files one at a time.
6. `StyleAssociationAnalyzer`, `RouteAnalyzer`, and `StateArtifactAnalyzer` create domain summaries.
7. `GraphBuilder` collects, normalizes, validates, and sorts graph output.
8. `SafeDiagnosticBuilder` normalizes safe diagnostics.
9. `AnalysisArtifactMapper` emits source model, inventory, graph, diagnostics, and result refs.

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | `SafeDiagnosticBuilder` centralizes safe diagnostic messages. |
| SECURITY-05 | Compliant | `PathGuard` enforces path validation and scan scope. |
| SECURITY-10 | Compliant | Logical components require only approved parser dependencies. |
| SECURITY-11 | Compliant | Component boundaries isolate source analysis from AI/provider and target generation behavior. |
| SECURITY-13 | Compliant | Parser adapters treat source/config files as untrusted input and never execute them. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Logical components map to identified properties. |
| PBT-03 | Compliant | `GraphBuilder` and `SafeDiagnosticBuilder` expose invariant targets. |
| PBT-04 | Compliant | `SourceInventoryBuilder` and diagnostic normalization expose idempotence targets. |
| PBT-06 | Compliant | `AnalysisResult` state handling supports stateful/model-based tests. |
| PBT-07 | N/A | Concrete generator implementation occurs during Code Generation. |
| PBT-08 | N/A | Seed/replay behavior is finalized in Code Generation and Build/Test. |
| PBT-10 | Compliant | Component tests combine fixtures and property-based generators. |

## Blocking Findings

- **Security**: None.
- **PBT**: None.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
