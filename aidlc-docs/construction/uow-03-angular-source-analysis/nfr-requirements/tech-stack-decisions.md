# UOW-03 Tech Stack Decisions

## Decision Summary

| Area | Decision | Status |
|---|---|---|
| Package | `packages/source-angular` | Approved |
| Primary Language | TypeScript | Approved |
| TypeScript Parser | TypeScript Compiler API | Approved |
| Angular Template Parser | Angular compiler parser | Approved |
| Runtime Dependencies | TypeScript and Angular compiler parser dependencies only, exact-pinned | Approved |
| Validation | Reuse UOW-01 schema-first validation patterns | Approved |
| Testing | Vitest plus fast-check | Approved |
| Benchmarking | Vitest-compatible or script-based benchmark fixtures | Approved |

## TypeScript Parser Decision

| Decision | Rationale |
|---|---|
| Use TypeScript Compiler API as the primary parser. | It provides structured AST access for imports, exports, class declarations, decorators, members, constructor parameters, and symbol-like source references without regex-based parsing. |

Implementation implications:
- Use parser APIs for syntactic analysis first.
- Avoid full semantic type checking in the initial UOW-03 scope.
- Keep parser outputs mapped to UOW-03 domain entities before handoff to UOW-01-compatible refs.
- Represent dynamic or unresolved source evidence with diagnostics rather than guessed semantics.

## Angular Template Parser Decision

| Decision | Rationale |
|---|---|
| Use Angular compiler parser to extract template ASTs. | It is better aligned with Angular template syntax than generic HTML parsing and avoids hand-rolled binding heuristics for core template constructs. |

Implementation implications:
- Parse Angular templates for bindings, events, structural directives, pipes, template refs, and external references.
- Do not evaluate runtime template expressions.
- Preserve unsupported template constructs as diagnostics with source refs.

## Dependency Policy

| Dependency Type | Policy |
|---|---|
| Existing internal packages | `@spa-bridge/core-model` may be used. |
| TypeScript parser dependency | Allowed, exact-pinned. |
| Angular compiler parser dependency | Allowed, exact-pinned. |
| Runtime graph/glob utility dependencies | Not allowed by default for UOW-03. |
| AI/provider dependencies | Not allowed in UOW-03. |
| Template execution or build tool dependencies | Not allowed in UOW-03. |

Notes:
- Exact versions are finalized during Code Generation so they can align with the workspace package manager and lockfile.
- Dependency additions must remain minimal and documented in the package manifest.
- If a later implementation requires a non-parser runtime dependency, it must be called out as a design change.

## Validation and Safety Decision

| Area | Decision |
|---|---|
| Path validation | Enforce workspace/source root containment and traversal blocking. |
| External refs | Allow only explicit external refs discovered from config, routing, template, or style metadata. |
| Diagnostics | Store safe path/ref/code/message data; raw source snippets are forbidden by default. |
| Source execution | Forbidden. Source files, scripts, builders, route expressions, and templates are parsed but never executed. |

## Determinism Decision

UOW-03 artifacts must be deterministic:

- Inventory records use stable ordering.
- Graph nodes and edges use stable IDs and ordering.
- Diagnostics use stable code, severity, source ref, and deterministic tie-break ordering.
- Artifact refs use stable naming for equivalent inputs and run context.

## Performance and Benchmark Decision

| Scenario | Requirement |
|---|---|
| 100+ component project | Typical scan target is 30 seconds or less under documented reference conditions. |
| 500+ component project | Benchmark fixture and recorded baseline are required. |
| Memory usage | Bounded source summaries and file-at-a-time parsing are preferred over retaining full raw source and ASTs. |

## Test Stack Decision

| Test Area | Decision |
|---|---|
| Example-based tests | Required for workspace discovery, parser fixtures, route fixtures, malformed source, and partial results. |
| Property-based tests | Required for inventory determinism, classification idempotence, graph invariants, and diagnostic stability. |
| PBT framework | fast-check with Vitest, aligned with UOW-01. |
| Performance fixtures | Generated or checked-in benchmark fixtures for 100+ and 500+ component scenarios. |

## Rejected Options

| Option | Reason |
|---|---|
| Babel as primary TypeScript parser | Less directly aligned with TypeScript-specific Angular source analysis needs in this project. |
| ts-morph as primary abstraction | Adds a wrapper dependency and broader abstraction surface than currently needed. |
| Generic HTML parser for Angular templates | Would require more hand-rolled Angular binding heuristics. |
| Broad runtime utility dependencies | Conflicts with the approved minimal dependency policy. |
| Raw source snippets in diagnostics | Conflicts with privacy and safe reporting requirements. |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-05 | Compliant | Path and source scope validation are required at the analysis boundary. |
| SECURITY-10 | Compliant | Parser dependencies must be exact-pinned and minimal. |
| SECURITY-11 | Compliant | Source execution and provider behavior are isolated away from UOW-03. |
| SECURITY-13 | Compliant | Source files are treated as untrusted parser input. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | NFRs carry forward identified properties from functional design. |
| PBT-03 | Compliant | Graph and diagnostic invariants are explicit requirements. |
| PBT-04 | Compliant | Classification and diagnostic idempotence are explicit requirements. |
| PBT-09 | Compliant | fast-check/Vitest remains selected. |
| PBT-10 | Compliant | Example-based parser fixtures complement PBT requirements. |

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
