# UOW-03 Business Logic Model

## Unit Purpose

UOW-03 discovers, parses, and models Angular input projects. It produces Angular source analysis artifacts that downstream transformation, reporting, security, and quality units can consume without reading raw source files directly.

The unit is intentionally source-focused. It does not generate React code, select target state strategy, call AI providers, or perform masking. It emits safe diagnostics, source references, dependency graph evidence, and source model boundaries that align with UOW-01 contracts.

## Approved Scope

| Decision Area | Approved Choice | Design Effect |
|---|---|---|
| Project scope | Application workspaces first | Libraries and multi-project workspace variants remain extension points. |
| File scope | Main Angular source tree plus explicit config/routing/template/style dependencies | Avoids uncontrolled workspace-wide indexing. |
| TypeScript parsing | AST, decorators, imports/exports, class members, and basic symbol references | Uses structured parsing without full semantic type checking in this unit. |
| Template/style parsing | Enough to map bindings and external references | Preserves conversion-relevant evidence without runtime evaluation. |
| Graph scope | Domain relationships plus file-level dependencies | Supports conversion planning and traceability. |
| Diagnostics | Structured, safe diagnostics with continuation where possible | Enables useful partial analysis and reporting. |
| Partial models | Preserve partial entities with diagnostics | Prevents silent loss of uncertain source elements. |
| Handoff | Source model and graph artifacts for downstream units | Keeps React generation out of source analysis. |
| Recovery | Fail-soft per file; fail-fast on fatal workspace/config corruption | Balances progress with correctness. |
| PBT focus | Round-trips, graph invariants, diagnostics stability | Carries property candidates into implementation. |

## Core Business Capabilities

| Capability | Description | Primary Outputs |
|---|---|---|
| Angular Workspace Discovery | Locate and classify the Angular project entry configuration. | `AngularWorkspaceProfile`, project diagnostics |
| Source Inventory | Discover conversion-relevant TypeScript, HTML, CSS/SCSS, route, module, service, and state files. | `AngularSourceInventory`, `SourceRef[]` |
| File Classification | Classify files into Angular source roles such as component, module, route, directive, pipe, service, state, template, style, or unknown. | `AngularFileRecord[]` |
| TypeScript Analysis | Parse TypeScript AST and extract decorators, imports/exports, class members, lifecycle hooks, providers, inputs, outputs, and basic references. | `AngularTypeScriptSymbol[]`, diagnostics |
| Template Analysis | Parse Angular template syntax enough to record bindings, events, structural directives, template refs, and external dependencies. | `AngularTemplateModel[]`, diagnostics |
| Style Association | Associate style files and inline style metadata with owning component records. | `AngularStyleRef[]` |
| Route Analysis | Detect route configuration files and route declarations, including nested routes, parameters, lazy loading evidence, and guard references. | `AngularRouteModel[]`, diagnostics |
| Dependency Graph Assembly | Combine import edges, metadata edges, template/style edges, route edges, and provider edges. | `AngularDependencyGraph` |
| Source Diagnostics | Emit structured diagnostics for unsupported, ambiguous, malformed, or unresolved source. | `DiagnosticsCollection` |
| Source Model Handoff | Produce a persisted source model boundary and artifact refs for downstream units. | `AngularSourceModelBoundary`, graph artifact refs |

## Primary Workflow

### Analyze Angular Project

1. Receive an `AnalyzeAngularSourceRequest` from UOW-02 orchestration.
2. Validate input path and project configuration refs before reading source files.
3. Discover the Angular project profile from `angular.json`, package metadata, and source entry hints.
4. Build a scoped source inventory from the main project source tree and explicit dependency refs.
5. Classify discovered files by source role.
6. Parse TypeScript files using structured AST parsing.
7. Extract Angular decorator metadata and basic symbol references.
8. Parse related templates and styles enough to capture conversion-relevant references.
9. Extract route declarations and route-related relationships.
10. Assemble the Angular dependency graph.
11. Emit diagnostics for malformed, unsupported, unresolved, or ambiguous elements.
12. Persist source model, graph, inventory, and diagnostics artifacts through UOW-01 ports.
13. Return analysis summary and artifact refs to UOW-02.

### Discovery and Inventory Flow

| Step | Behavior |
|---|---|
| Locate Project | Identify application project roots from Angular project configuration and source entry hints. |
| Apply Scope | Include project source files and explicit external refs; exclude build outputs, dependencies, cache directories, and unrelated files. |
| Classify Files | Assign source roles using config references, imports, Angular metadata, and file naming hints. |
| Preserve Evidence | Store source refs and classification rationale for traceability/reporting. |

### Parser Flow

| Parser Area | Behavior | Failure Handling |
|---|---|---|
| TypeScript | Parse AST, imports/exports, classes, decorators, members, and basic symbol references. | Malformed file emits diagnostic and partial file record. |
| Decorators | Extract Angular metadata for components, directives, pipes, modules, injectables, inputs, outputs, and providers. | Unknown decorator shape emits manual-review diagnostic. |
| Templates | Parse bindings, events, structural directives, template refs, pipes, and external file links. | Invalid syntax emits diagnostic and keeps raw template ref. |
| Styles | Associate inline and external style refs with owning components. | Missing style file emits warning diagnostic. |
| Routes | Extract route arrays, nested routes, parameters, guards, redirects, and lazy-loading evidence. | Dynamic route expression emits manual-review diagnostic. |

## Dependency Graph Model

The graph represents both file-level dependencies and Angular concept relationships.

| Node Category | Examples |
|---|---|
| Project | Angular application project. |
| Source File | TypeScript, HTML, CSS, SCSS, JSON config. |
| Angular Symbol | Component, module, directive, pipe, service, route, guard, state artifact. |
| Template Element | Binding, event, structural directive, template ref. |
| External Dependency | Package import or unresolved external reference. |

| Edge Category | Meaning |
|---|---|
| `imports` | TypeScript import/export relationship. |
| `declares` | Module or project declares a component/directive/pipe. |
| `provides` | Module/component/service provider relationship. |
| `uses-template` | Component references inline or external template. |
| `uses-style` | Component references inline or external styles. |
| `routes-to` | Route config points to component/module/lazy target. |
| `guards` | Route references guard or resolver. |
| `references` | Template or TypeScript symbol references another source element. |

## Diagnostic Model

Diagnostics use UOW-01 `Diagnostic` contracts and safe display strings. Diagnostics must include a stable code, severity, source refs when available, tags, and remediation hints where useful.

| Diagnostic Category | Example Codes | Default Severity |
|---|---|---|
| Workspace/config failure | `ANGULAR_WORKSPACE_CONFIG_INVALID`, `ANGULAR_PROJECT_NOT_FOUND` | `error` |
| Parse failure | `ANGULAR_TS_PARSE_FAILED`, `ANGULAR_TEMPLATE_PARSE_FAILED` | `warning` or `error` |
| Missing related file | `ANGULAR_TEMPLATE_MISSING`, `ANGULAR_STYLE_MISSING` | `warning` |
| Unsupported dynamic source | `ANGULAR_DYNAMIC_ROUTE_UNSUPPORTED`, `ANGULAR_DYNAMIC_PROVIDER_UNSUPPORTED` | `manual-review` |
| Security-sensitive source evidence | `ANGULAR_SOURCE_SENSITIVE_PATTERN` | `security-blocker` only when enabled policy requires blocking |
| Ambiguous graph relationship | `ANGULAR_RELATIONSHIP_AMBIGUOUS` | `manual-review` |

## Handoff Boundaries

| Consumer | UOW-03 Provides | UOW-03 Does Not Provide |
|---|---|---|
| UOW-01 Core Model | Source model boundary refs, diagnostics, source refs, trace candidates. | Core schema migrations. |
| UOW-02 Orchestration | Analysis status, artifact refs, blocking diagnostics, partial artifact refs. | Workflow decisions beyond analysis success/failure. |
| UOW-04 Transformation | Angular source entities, graph, template and route evidence. | React conversion decisions. |
| UOW-05 Security | Source refs and safe diagnostics that can be reviewed for masking/policy. | Masking implementation. |
| UOW-08 Quality/PBT | Property candidates and deterministic source artifacts. | Quality gate execution. |
| UOW-09 Reporting | Inventory summary, diagnostics, graph summary, unresolved items. | Markdown/HTML report rendering. |

## Testable Properties

| Property | Category | Candidate Scope |
|---|---|---|
| Source inventory ordering is deterministic | Invariant | Same valid file set produces the same ordered inventory. |
| File classification is idempotent | Idempotence | Classifying already classified records does not change roles or evidence. |
| Graph node references are closed over discovered entities | Invariant | Every non-external graph edge endpoint references a known node. |
| Graph assembly is deterministic | Invariant | Same parsed source entities produce equivalent graph nodes and edges. |
| Diagnostic normalization is idempotent | Idempotence | Normalizing diagnostics twice yields the same diagnostics. |
| Parse/format fixtures round-trip where supported | Round-trip | Structured template or metadata fixtures preserve supported fields through serialization. |
| Partial resolution preserves source identity | Invariant | Unresolved component/route records retain original source refs and diagnostics. |
| Fatal workspace errors stop analysis before source parsing | Stateful / invariant | Random workflow states never parse files after fatal config rejection. |

## Security Considerations

- Treat source files and configuration as untrusted input.
- Never execute source code, package scripts, Angular builders, or route expressions during analysis.
- Validate and normalize paths before reading files.
- Keep diagnostics and report-facing messages safe; do not include raw secrets or sensitive source snippets.
- Keep source analysis independent from AI provider calls.
- Preserve evidence for security review without expanding source access beyond the approved scan scope.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
