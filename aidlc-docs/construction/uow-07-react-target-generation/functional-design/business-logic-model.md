# UOW-07 Business Logic Model

## Purpose

UOW-07 materializes React-oriented target drafts into a deterministic React target project. It converts UOW-04 draft artifacts into a Vite + React 18 + TypeScript project by default, while preserving strategy extension points for future target generators.

The unit owns target strategy selection, project file planning, generated source materialization, dependency selection, conflict handling, and traceability from draft refs to target file refs. It does not re-run Angular analysis, transformation rules, AI provider refinement, quality gates, CLI commands, Web UI flows, or report rendering.

## Approved Scope

| Decision Area | Approved Choice | Design Effect |
|---|---|---|
| Default target | Vite + React 18 + TypeScript | Aligns with FR-012 and keeps the MVP lightweight. |
| Target selection | Strategy registry with Vite React TypeScript default | Keeps target generation plugin-friendly. |
| Input model | Consume UOW-04 React-oriented drafts and conversion traces | Preserves construction boundaries and avoids duplicate transformation. |
| File writes | Deterministic write plan before writing | Enables review, conflict detection, traceability, and idempotence. |
| Conflicts | Preserve existing files by default; explicit overwrite required | Avoids destructive target writes. |
| State output | Strategy adapters for React Context API, Redux Toolkit, and Zustand | Supports automatic state strategy selection and rationale reporting. |
| Routing output | React Router-compatible route modules | Produces usable route output while preserving uncertain guards/lazy loads. |
| Uncertain mappings | Partial output plus manual-review diagnostics | Keeps progress without hiding risk. |
| Dependencies | Minimal allowlisted React/Vite/strategy dependency set | Prevents Angular dependency leakage into target output. |
| PBT focus | Determinism, containment, idempotence, dependency stability, trace coverage | Protects the highest-risk generator behavior. |

## Core Business Capabilities

| Capability | Responsibility | Primary Output |
|---|---|---|
| Target Generation Request Handling | Validate requested target strategy, output root, overwrite policy, and draft refs | `TargetGenerationRequest` |
| Target Strategy Registry | Resolve Vite React TypeScript or future strategy implementation | `TargetStrategySelection` |
| Draft Materialization | Convert component, service, route, state, style, and config drafts into file specs | `GeneratedFileSpec[]` |
| Write Plan Builder | Build deterministic file refs, paths, content hashes, source traces, and conflict diagnostics | `TargetWritePlan` |
| Project Scaffold Generator | Generate `package.json`, TypeScript config, Vite config, entry files, and source layout | `ProjectScaffoldDraft` |
| State Strategy Adapter | Generate Context, Redux Toolkit, or Zustand files from state drafts | `StateOutputPlan` |
| Routing Adapter | Generate React Router-compatible route modules from route drafts | `RoutingOutputPlan` |
| Conflict Policy Evaluation | Detect path containment failures, existing file conflicts, and overwrite policy violations | `TargetConflictDiagnostic[]` |
| Traceability Handoff | Link generated files and sections to UOW-04 draft refs and conversion traces | `TargetGenerationTrace[]` |

## End-to-End Target Generation Flow

1. Receive a `TargetGenerationRequest` from orchestration with target strategy, output root, overwrite policy, draft artifact refs, and correlation metadata.
2. Validate target strategy, output root containment, schema version, and required draft artifact refs.
3. Resolve the target strategy from the strategy registry, defaulting to Vite React TypeScript when no explicit choice is provided.
4. Normalize UOW-04 component, template, service, route, state, style, and conversion trace drafts into a target generation context.
5. Generate project scaffold file specs for package metadata, TypeScript config, Vite config, entry files, and baseline source layout.
6. Materialize React component files from component/template/lifecycle/binding drafts.
7. Materialize service and dependency adapter files from service/DI drafts.
8. Materialize route modules from route drafts and emit manual-review diagnostics for guard or lazy-loading uncertainties.
9. Materialize state output using the selected React Context API, Redux Toolkit, or Zustand adapter.
10. Select minimal allowlisted dependencies for React, React DOM, Vite, TypeScript, React Router, and selected state libraries.
11. Build a deterministic write plan sorted by file path and stable file refs.
12. Evaluate path containment, existing file conflicts, overwrite policy, duplicate file refs, and dependency consistency.
13. Return a `TargetGenerationResult` with write plan, generated file specs, diagnostics, manual-review items, and traceability records.

## Generation Boundaries

| Consumer or Producer | UOW-07 Receives | UOW-07 Provides |
|---|---|---|
| UOW-04 Transformation | React-oriented drafts, draft refs, conversion traces, manual-review markers | Final target file refs and target traces |
| UOW-02 Orchestration | Run ID, output root, target strategy, overwrite policy | Generation status, write plan refs, diagnostics |
| UOW-05 Security | Safe path and policy expectations | Safe diagnostics and no raw sensitive log fields |
| UOW-08 Quality | Generated project path, package scripts, file refs, unresolved items | Build/test-ready target project structure |
| UOW-09 Reporting | File refs, traces, dependency rationale, manual-review items | Reportable target generation evidence |
| UOW-10 CLI / UOW-11 Web | Configuration and review surfaces later | No direct UI or command behavior in this unit |

## Target Project Layout

The default Vite React TypeScript target generates a stable layout:

```text
package.json
tsconfig.json
tsconfig.node.json
vite.config.ts
index.html
src/main.tsx
src/App.tsx
src/routes/
src/components/
src/services/
src/state/
src/styles/
src/review/
```

Manual-review stubs are generated under `src/review/` only when unresolved draft materialization requires visible developer follow-up.

## State Strategy Output

| Strategy | Generated Shape | Notes |
|---|---|---|
| React Context API | Context provider, hook, reducer or state helper where needed | Preferred for low-to-medium state complexity. |
| Redux Toolkit | Store setup, slices, selectors, effects review items | Used when source NgRx-like structure requires action/reducer semantics. |
| Zustand | Store factory and hooks | Used for simpler global state with low boilerplate needs. |

The selected strategy and rationale remain part of the generation result for UOW-09 reporting.

## Routing Output

React Router-compatible output includes route modules, route element references, nested route structure, and parameter mapping. Route guards, dynamic lazy loading, and access-control semantics that cannot be safely materialized remain in manual-review diagnostics and review stubs.

## Testable Properties

| Property | Category | Candidate Scope |
|---|---|---|
| Write plan is deterministic | Determinism | Equivalent drafts and strategy produce the same sorted file refs and hashes. |
| Output paths are contained | Security invariant | Generated paths never escape the configured output root. |
| Generation is idempotent | Idempotence | Re-running generation with the same inputs produces equivalent write plans. |
| Dependency selection is stable | Invariant | Equivalent state/routing strategy inputs produce equivalent dependency sets. |
| Trace coverage is complete | Invariant | Every generated file has a source draft ref or explicit synthetic origin. |
| Conflict policy is fail-closed | Safety invariant | Unsafe paths or protected existing files produce blocking diagnostics. |

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-05 | Compliant | Target generation requests, output roots, overwrite policy, and draft refs are validated before use. |
| SECURITY-13 | Compliant | Target strategy and writer boundaries are explicit and extension-friendly. |
| SECURITY-15 | Compliant | Unsafe paths and write conflicts fail closed with diagnostics. |
| SECURITY-03 | Compliant | Diagnostics and traces use safe refs rather than raw sensitive snippets. |
| SECURITY-10 | Compliant | Dependencies are selected from a minimal allowlist rather than copied from source projects. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12, SECURITY-14 | N/A | This functional design does not create deployed endpoints, auth, IAM, infrastructure, monitoring, or provider invocation. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | High-value generator properties are identified for write plans, paths, dependencies, and traces. |
| PBT-03 | Compliant | Path containment and dependency invariants are explicit. |
| PBT-04 | Compliant | Idempotent generation is a blocking property. |
| PBT-07, PBT-08, PBT-09, PBT-10 | Deferred | Generator implementation details, seeds, and example/PBT mix are enforced in NFR and code stages. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not define round-trip codecs, oracle-backed calculations, or mutable state-machine behavior. |

## Content Validation

- No Mermaid diagrams are included.
- ASCII content is limited to a simple directory tree in a fenced text block.
- Markdown tables and code identifiers were checked for parsing compatibility.
