# UOW-03 Business Rules

## Workspace and Scope Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW03-SCOPE-01 | Initial support targets Angular application workspaces. | Matches approved MVP scope while leaving library variants as extensions. |
| UOW03-SCOPE-02 | The scanner includes files under the application source tree plus explicit config, routing, template, or style dependencies. | Prevents uncontrolled workspace-wide scanning. |
| UOW03-SCOPE-03 | Build outputs, dependency directories, hidden run workspaces, and cache directories are excluded by default. | Avoids stale artifacts and unnecessary processing. |
| UOW03-SCOPE-04 | Files outside the main source tree must have an explicit relationship before being read. | Maintains predictable data access and traceability. |
| UOW03-SCOPE-05 | The scanner must not execute project scripts, Angular builders, or arbitrary code while discovering files. | Treats source projects as untrusted input. |

## TypeScript and Decorator Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW03-TS-01 | TypeScript source is parsed through structured AST parsing. | Avoids fragile string matching for source facts. |
| UOW03-TS-02 | The analyzer extracts imports, exports, class declarations, class members, constructor parameters, and basic symbol references. | Provides enough evidence for downstream transformation. |
| UOW03-TS-03 | Angular decorators are extracted for components, directives, pipes, modules, injectables, inputs, outputs, providers, and host metadata where present. | Captures framework-specific source intent. |
| UOW03-TS-04 | Full semantic type checking is not required in this unit. | Keeps UOW-03 focused and avoids over-coupling to compiler project setup. |
| UOW03-TS-05 | Unknown or dynamic decorator shapes produce diagnostics instead of guessed semantics. | Prevents silent behavior drift. |

## Template, Style, and Route Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW03-TEMPLATE-01 | Component templates are parsed enough to identify bindings, events, structural directives, pipes, template refs, and external references. | Supports Angular-to-React conversion evidence. |
| UOW03-TEMPLATE-02 | Template parsing does not evaluate runtime expressions. | Avoids executing untrusted source and keeps analysis deterministic. |
| UOW03-STYLE-01 | External and inline style refs are associated with owning components. | Allows target generation to preserve styling evidence. |
| UOW03-ROUTE-01 | Route analysis captures route paths, component refs, lazy-loading evidence, guards, resolvers, redirects, and route parameters when statically visible. | Supports routing conversion and manual review. |
| UOW03-ROUTE-02 | Dynamic route expressions produce manual-review diagnostics. | Avoids unsafe or incorrect route inference. |

## Dependency Graph Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW03-GRAPH-01 | The graph includes component, module, service, routing, and file-level relationships. | Matches approved graph scope. |
| UOW03-GRAPH-02 | Every non-external graph edge endpoint must reference a known graph node. | Preserves graph integrity. |
| UOW03-GRAPH-03 | External dependencies must be explicitly marked as external nodes. | Keeps unresolved package imports visible without pretending they are source files. |
| UOW03-GRAPH-04 | Graph node and edge ordering must be deterministic. | Enables stable tests, reports, and downstream artifacts. |
| UOW03-GRAPH-05 | Ambiguous graph relationships must carry confidence/evidence or a diagnostic. | Supports review and prevents silent guesses. |

## Diagnostic and Partial Model Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW03-DIAG-01 | Diagnostics must use UOW-01 severity values: `info`, `warning`, `error`, `manual-review`, or `security-blocker`. | Preserves shared diagnostic semantics. |
| UOW03-DIAG-02 | Diagnostics must include stable code, severity, safe message, source refs where available, and tags. | Supports filtering, reporting, and remediation. |
| UOW03-DIAG-03 | Per-file failures are fail-soft when workspace/config state is valid. | Maximizes useful analysis output. |
| UOW03-DIAG-04 | Fatal workspace/config corruption is fail-fast. | Prevents misleading analysis from invalid roots. |
| UOW03-DIAG-05 | Partially resolved components, routes, and services retain source identity and diagnostics. | Enables downstream units and users to make informed decisions. |
| UOW03-DIAG-06 | Raw sensitive source snippets must not appear in diagnostics or report-facing messages. | Reduces leakage risk. |

## Handoff Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW03-HANDOFF-01 | UOW-03 returns source model refs, inventory refs, graph refs, diagnostics refs, and summary counts. | Gives UOW-02 stable orchestration artifacts. |
| UOW03-HANDOFF-02 | UOW-03 must not emit React-shaped target drafts. | Keeps transformation and generation responsibilities in later units. |
| UOW03-HANDOFF-03 | Source artifacts must reference UOW-01 `AngularSourceModelBoundary` and `SourceRef` concepts. | Aligns with existing core contracts. |
| UOW03-HANDOFF-04 | Analysis artifacts must be serializable and schema-versioned in later code generation. | Supports persisted runs and report reconstruction. |

## Validation Rules

| Rule ID | Rule | Validation |
|---|---|---|
| UOW03-VALIDATION-01 | Input project root must be present and readable before scanning. | Emit blocking diagnostic if missing or unreadable. |
| UOW03-VALIDATION-02 | Derived source paths must remain inside approved scan scope or explicit refs. | Reject traversal and unrelated paths. |
| UOW03-VALIDATION-03 | Classified file records must have source path, role, and evidence. | Reject empty or untraceable file records. |
| UOW03-VALIDATION-04 | Graph edges must reference existing nodes unless marked external. | Reject invalid graph artifacts. |
| UOW03-VALIDATION-05 | Diagnostics must contain safe display strings. | Prevent raw sensitive values in user-facing output. |

## PBT Property Requirements

| Property ID | Property | Category |
|---|---|---|
| UOW03-PBT-01 | Inventory ordering is deterministic for equivalent valid source sets. | Invariant |
| UOW03-PBT-02 | File classification is idempotent. | Idempotence |
| UOW03-PBT-03 | Graph assembly produces no dangling non-external endpoints. | Invariant |
| UOW03-PBT-04 | Graph assembly is deterministic for equivalent parsed entities. | Invariant |
| UOW03-PBT-05 | Diagnostic normalization is idempotent and preserves severity. | Idempotence / invariant |
| UOW03-PBT-06 | Partial resolution keeps original source refs. | Invariant |
| UOW03-PBT-07 | Fatal workspace errors prevent parser execution. | Stateful / invariant |
| UOW03-PBT-08 | Supported fixture serialization preserves modeled parser fields. | Round-trip |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | UOW-03 functional design defines analysis logic and artifacts, not deployed storage resources. |
| SECURITY-03 | Compliant | Diagnostics and report-facing evidence are structured and safe; concrete logging remains in UOW-02/UOW-11. |
| SECURITY-05 | Compliant | Input paths, source scope, classified records, graph edges, and diagnostics require validation. |
| SECURITY-10 | N/A | Dependency pinning and vulnerability scanning are handled during NFR Requirements, Code Generation, and Build/Test. |
| SECURITY-11 | Compliant | Source analysis avoids code execution, isolates source parsing, and documents misuse cases around unsafe paths and dynamic source. |
| SECURITY-13 | Compliant | Source files are treated as untrusted data and parsed/validated rather than executed or unsafely deserialized. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Testable properties are identified for inventory, classification, graph assembly, diagnostics, partial resolution, and fatal-state behavior. |
| PBT-02 | Compliant | Supported parser fixture serialization is identified as a round-trip candidate; lossy parsing will require documented scope during code generation. |
| PBT-03 | Compliant | Graph integrity, deterministic ordering, severity preservation, and source identity invariants are documented. |
| PBT-04 | Compliant | File classification and diagnostic normalization idempotence are identified. |
| PBT-05 | N/A | No reference implementation is defined in functional design; oracle use may be reconsidered in Code Generation if parser adapters expose one. |
| PBT-06 | Compliant | Fatal workspace/config behavior and parser execution gating are identified as stateful candidates. |
| PBT-07 | N/A | Generator implementation belongs to Code Generation. |
| PBT-08 | N/A | Seed/reproducibility belongs to Code Generation and Build/Test. |
| PBT-09 | N/A | Framework selection is handled in NFR Requirements; UOW-01 already selected fast-check/Vitest. |
| PBT-10 | Compliant | Critical scanner/parser scenarios require both example-based tests and property-based tests in later implementation. |

## Blocking Findings

- **Security**: None.
- **PBT**: None.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
