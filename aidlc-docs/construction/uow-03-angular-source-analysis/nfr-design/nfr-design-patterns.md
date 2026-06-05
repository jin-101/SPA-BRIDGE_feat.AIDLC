# UOW-03 NFR Design Patterns

## Unit Context

- **Unit**: UOW-03 Angular Source Analysis
- **Primary Package**: `packages/source-angular`
- **NFR Requirements Status**: Complete
- **NFR Design Status**: Complete

## Design Summary

UOW-03 uses a staged source analysis pipeline. Each stage has a narrow responsibility, uses explicit result and diagnostic contracts, and emits deterministic artifacts. The design treats source files as untrusted input, avoids source execution, preserves partial analysis where safe, and supports property-based testing for deterministic source analysis behavior.

## Staged Analysis Pipeline Pattern

| Stage | Pattern | Output |
|---|---|---|
| Path Guard | Validate and canonicalize workspace, source root, and explicit external refs. | Safe path refs or blocking diagnostics. |
| Workspace Profile | Read Angular project configuration and identify the application project. | `AngularWorkspaceProfile`. |
| Source Inventory | Discover and classify scoped source files. | `AngularSourceInventory`. |
| Parser Adapters | Parse TypeScript and Angular templates through isolated adapters. | Parser summaries, parsed entities, diagnostics. |
| Route Analysis | Extract route declarations and dynamic-route diagnostics from parser summaries. | `AngularRouteModel[]`. |
| Graph Builder | Collect normalized graph nodes/edges and finalize deterministic graph. | `AngularDependencyGraph`. |
| Diagnostics | Normalize safe diagnostics and severity-based blocking state. | `DiagnosticsCollection`. |
| Artifact Mapper | Persist source model, inventory, graph, and diagnostics artifact refs. | `AngularAnalysisResult`. |

Design rules:
- Stages communicate through typed summaries and `Result` values.
- Expected source malformation returns diagnostics, not unhandled exceptions.
- Fatal workspace/config errors stop before parser execution.
- Per-file parse errors preserve partial records when analysis can safely continue.

## Parser Adapter Isolation Pattern

| Adapter | Responsibility | Boundary |
|---|---|---|
| `TypeScriptParserAdapter` | Use TypeScript Compiler API for syntactic AST parsing, imports/exports, decorators, class members, constructor parameters, and basic symbol references. | Does not perform full semantic type checking by default. |
| `AngularTemplateParserAdapter` | Use Angular compiler parser for template AST extraction and supported binding/directive/event/ref evidence. | Does not evaluate runtime template expressions. |

Shared adapter contract:
- Accept safe source refs and source text for a single file/template.
- Return compact parser summaries and safe diagnostics.
- Avoid raw parser errors in report-facing messages.
- Keep raw source and AST objects scoped to adapter execution.

## Bounded Memory Pattern

| Concern | Design |
|---|---|
| File reading | File-at-a-time reads through approved file access boundaries. |
| Raw source | Retained only for active parser call. |
| AST objects | Retained only while extracting compact summaries. |
| Persisted artifacts | Store source refs, parser summaries, graph evidence, and diagnostics, not duplicated raw source. |
| Large project handling | 500+ component projects use bounded source summaries and generated benchmark fixtures. |

## Stable ID and Ordering Pattern

Stable IDs are derived from normalized deterministic evidence:

| Entity | ID Inputs |
|---|---|
| File record | Normalized relative path and role. |
| TypeScript symbol | Normalized relative path, symbol kind, symbol name, and deterministic ordinal. |
| Template model | Owner component ID, template source kind, and deterministic ordinal. |
| Graph node | Node kind plus stable entity/source ID. |
| Graph edge | Edge kind, from node ID, to node ID, evidence source ref, and deterministic ordinal. |
| Diagnostic | Diagnostic code, severity, primary source ref, and deterministic ordinal. |

Ordering rules:
- Sort inventories by normalized relative path and role.
- Sort graph nodes by node kind and node ID.
- Sort graph edges by edge kind, from node ID, to node ID, and edge ID.
- Sort diagnostics by severity rank, source ref, code, and ID.

## Graph Builder Finalization Pattern

`GraphBuilder` uses normalized collectors instead of allowing parsers to mutate final graph state directly.

| Step | Behavior |
|---|---|
| Collect | Parser and route stages submit candidate nodes, edges, and evidence refs. |
| Normalize | Normalize node IDs, edge IDs, labels, metadata, and external markers. |
| Validate | Reject dangling non-external endpoints and malformed edge evidence. |
| Sort | Apply stable node and edge ordering. |
| Finalize | Emit immutable graph artifact plus diagnostics. |

This pattern prevents malformed parser output from leaking into downstream units.

## Safe Diagnostic Builder Pattern

`SafeDiagnosticBuilder` is the only component that creates report-facing diagnostics for UOW-03.

Allowed fields:
- Stable diagnostic code.
- UOW-01 diagnostic severity.
- Safe message.
- Source refs.
- Tags.
- Safe remediation hint.

Blocked by default:
- Raw source snippets.
- Raw parser exception messages.
- Secrets, tokens, URLs, credentials, or proprietary source content.
- Absolute paths when a safe relative ref can be used.

## Analysis Result State Pattern

`AnalysisResult` uses explicit statuses:

| Status | Meaning |
|---|---|
| `failed` | Fatal workspace/config/path validation error prevents reliable analysis. |
| `partial` | Workspace is valid, but one or more files or relationships could not be fully parsed/resolved. |
| `succeeded` | Analysis completed without blocking diagnostics. Warnings/manual-review diagnostics may still exist. |

Blocking diagnostics:
- `error` diagnostics block downstream conversion when they affect required workspace or graph integrity.
- `security-blocker` diagnostics always block unsafe downstream behavior.
- `manual-review` diagnostics usually allow partial handoff but must be visible to reporting/review units.

## Benchmark Fixture Pattern

| Fixture Type | Purpose |
|---|---|
| 100+ component synthetic fixture | Validate 30-second typical scan target under documented conditions. |
| 500+ component synthetic fixture | Establish scalability baseline and watch memory/runtime trends. |
| Malformed source fixture | Exercise fail-soft parser behavior. |
| Dynamic route/provider fixture | Exercise manual-review diagnostics. |

Benchmark instructions are recorded during Build/Test and should report environment assumptions, component counts, file counts, runtime, and memory observations where available.

## PBT Design Pattern

Dedicated PBT generators and model helpers should live with test support for UOW-03.

| Generator | Properties |
|---|---|
| File inventory generator | Deterministic ordering and scope invariants. |
| Classified file record generator | Classification idempotence. |
| Graph node/edge generator | No dangling non-external endpoints and deterministic finalization. |
| Diagnostic generator | Diagnostic normalization idempotence and severity preservation. |
| Parser summary generator | Partial resolution preserves source identity. |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Safe diagnostic construction avoids raw sensitive content in report-facing messages. |
| SECURITY-05 | Compliant | Path guard and scan scope validation enforce input/path boundaries. |
| SECURITY-10 | Compliant | Design keeps dependency additions limited to exact-pinned parser dependencies. |
| SECURITY-11 | Compliant | Source execution is explicitly forbidden and security-sensitive behavior is isolated. |
| SECURITY-13 | Compliant | Source files are parsed and validated as untrusted data. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | NFR design maps identified properties to concrete generators and components. |
| PBT-02 | Compliant | Parser summary serialization remains a round-trip candidate for supported modeled fields. |
| PBT-03 | Compliant | Graph and diagnostic invariants are central design patterns. |
| PBT-04 | Compliant | Classification and diagnostic idempotence are explicitly designed. |
| PBT-06 | Compliant | Analysis result states and fatal/partial behavior support stateful/model-based testing. |
| PBT-07 | N/A | Concrete generator code belongs to Code Generation. |
| PBT-08 | N/A | Seed logging and replay are finalized in Code Generation and Build/Test. |
| PBT-10 | Compliant | PBT complements parser fixtures and benchmark examples. |

## Blocking Findings

- **Security**: None.
- **PBT**: None.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
