# UOW-07 Tech Stack Decisions

## Decision Summary

| Area | Decision | Rationale |
|---|---|---|
| Package Scope | Create a dedicated `packages/target-react` package | Keeps target generation reusable and separate from transformation, quality, CLI, and Web UI concerns. |
| Default Target | Vite + React 18 + TypeScript | Matches MVP requirements and provides a lightweight buildable React output. |
| Target Strategy | Strategy registry with shared generator interfaces | Supports future target strategies without hardcoding behavior throughout the system. |
| Runtime Dependencies | Use existing workspace packages and exact-pinned validation/helper dependencies only when necessary | Minimizes supply-chain risk in code that writes generated projects. |
| Target Dependencies | Generate exact-pinned allowlisted dependencies for React, React DOM, Vite, TypeScript, React Router, and selected state libraries | Prevents Angular dependency leakage and keeps output predictable. |
| File Planning | Deterministic write plan with stable file refs, target-relative paths, content hashes, conflicts, and traces | Enables review, idempotence, conflict detection, and safe writes. |
| Path Safety | Target root containment, traversal rejection, preserve-by-default conflicts, explicit overwrite policy | Prevents destructive or unsafe file output. |
| Diagnostics | Safe refs, reason codes, target-relative paths, counts, and no raw source snippets | Keeps reporting and review privacy-safe. |
| PBT Framework | `fast-check` with Vitest | Matches the existing TypeScript workspace test stack. |

## Target Dependency Allowlist

Initial generated React projects may include only exact-pinned dependencies from the selected strategy allowlist.

| Dependency | Use | Included When |
|---|---|---|
| `react` | React runtime | Always for default target |
| `react-dom` | React DOM runtime | Always for default target |
| `@vitejs/plugin-react` | Vite React plugin | Always for default target |
| `vite` | Build tooling | Always for default target |
| `typescript` | TypeScript compiler | Always for default target |
| `react-router-dom` | React Router-compatible routing | Route drafts require routing output |
| `@reduxjs/toolkit` | Redux Toolkit state strategy | Redux Toolkit strategy selected |
| `zustand` | Zustand state strategy | Zustand strategy selected |

Angular runtime dependencies are not copied into the generated target package metadata.

## Package Dependency Decisions

UOW-07 package implementation should start dependency-light.

Approved baseline package dependencies:

| Dependency | Use | Runtime |
|---|---|---|
| `@spa-bridge/core-model` | Shared refs, diagnostics, result contracts, stable model types | Yes |
| `@spa-bridge/transform-angular-react` | React-oriented draft contracts if exported by UOW-04 | Yes, if package boundary requires direct type import |
| `zod` through existing validation pattern | Schema-first validation for generator inputs and write plans | Yes |
| Node built-ins | Path normalization, hashing, and safe file-system planning | Yes |
| `vitest` | Example-based tests | No |
| `fast-check` | Property-based tests | No |

## Strategy Decisions

| Strategy Area | Decision |
|---|---|
| Default Strategy ID | `vite-react-typescript` |
| Future Strategy Support | Additive strategy descriptors and generator interfaces |
| Strategy Selection Ordering | Explicit requested strategy, default strategy flag, priority, strategy ID |
| Unknown Strategy | Blocking diagnostic |
| Strategy Metadata | Generic capability/category metadata only |

## Write Plan Decisions

| Write Plan Area | Decision |
|---|---|
| File Ref Stability | Stable IDs derived from normalized category/path/source refs |
| File Ordering | Sort by normalized target-relative path and file ref |
| Content Hashing | Stable hash for generated file content and aggregate write plan |
| Conflict Handling | Preserve existing files by default |
| Overwrite | Explicit overwrite policy required |
| Unsafe Paths | Blocking diagnostic |
| Duplicate Paths | Blocking diagnostic unless a strategy declares a deterministic merge rule |
| Duplicate File Refs | Blocking diagnostic |

## Generated Project Decisions

| Area | Decision |
|---|---|
| Source Layout | Stable `src/` layout with components, routes, services, state, styles, and review folders |
| Entry Files | Generate `index.html`, `src/main.tsx`, and `src/App.tsx` |
| Config Files | Generate `package.json`, `tsconfig.json`, `tsconfig.node.json`, and `vite.config.ts` |
| Route Output | React Router-compatible route modules |
| State Output | React Context API, Redux Toolkit, or Zustand adapters |
| Review Output | Deterministic manual-review stubs only for unresolved target materialization |

## Performance Decisions

| Scenario | Target |
|---|---|
| 100+ component projects | Deterministic write-plan generation within seconds under local reference conditions |
| 500+ component projects | Benchmark scope for generated file count, write-plan size, and memory behavior |
| Memory Use | Avoid unnecessary duplicate full-content retention |
| Dependency Selection | Bounded by strategy metadata and draft summaries |
| Sorting and Hashing | Predictable growth with generated file count |

## Test Stack Decisions

| Test Type | Tooling | Required Focus |
|---|---|---|
| Example-based tests | Vitest | Vite scaffold, package metadata, route output, state adapters, conflict matrix |
| Property-based tests | fast-check | Write-plan determinism, path containment, idempotence, dependency stability, diagnostics, trace coverage |
| Security tests | Vitest + schema validation | Unsafe path rejection, preserve-by-default conflict behavior, no raw snippets |
| Compatibility fixtures | Vitest | React 18, Vite, React Router, Redux Toolkit, Zustand output shapes |
| Benchmark fixtures | Vitest or later benchmark harness | 100+ and 500+ component write-plan generation |

## Integration Decisions

| Integration | Decision |
|---|---|
| UOW-01 Core Model | Reuse shared refs, diagnostics, result envelopes, stable IDs, and validation conventions |
| UOW-02 Core Application | Receives generation status, write plan refs, diagnostics, and artifact refs |
| UOW-04 Transformation | Consumes React-oriented drafts and conversion traces; does not re-run transformation |
| UOW-05 Security | Aligns with safe path, safe diagnostic, and privacy expectations |
| UOW-06 AI Provider | Consumes only validated/refined drafts, not raw provider responses |
| UOW-08 Quality | Receives generated project structure for build/lint/test validation |
| UOW-09 Reporting | Receives file refs, dependency rationale, traces, diagnostics, and manual-review items |

## First Target Compatibility Decisions

| Area | Decision |
|---|---|
| Angular Version Metadata | Keep Angular 15 category metadata generic |
| NgRx State | Support Redux Toolkit strategy metadata and review fallback |
| Forms and Routing | Support forms/routing categories with route guard review preservation |
| i18n | Preserve i18n category metadata and manual-review routing into generated review stubs when needed |
| Animation, Media, Map | Represent animation/media/map-heavy cases through generic review categories when target materialization is unsafe |
| QR/Barcode | Represent QR/barcode cases as generated dependency review or manual-review metadata, not hardcoded application behavior |
| Service Worker | Preserve service-worker review category for later quality/reporting |
| Target Privacy | No customer-specific page names, route strings, proprietary identifiers, or raw source snippets in generic metadata |

## Security Compliance Notes

- SECURITY-03 is addressed through safe diagnostics and trace artifacts.
- SECURITY-05 is addressed through schema-first validation of generator inputs and write plans.
- SECURITY-10 is addressed through exact-pinned allowlisted target dependencies.
- SECURITY-13 is addressed through explicit target strategy and generator boundaries.
- SECURITY-15 is addressed through fail-closed unsafe path, conflict, schema, and corrupted write-plan behavior.

## Deferred Decisions

| Decision | Deferred To | Reason |
|---|---|---|
| Concrete formatter/linter execution | UOW-08 Quality Gates | UOW-07 generates files; UOW-08 runs quality tools. |
| CLI overwrite flag shape | UOW-10 CLI | UOW-07 defines overwrite policy semantics, not command UX. |
| Web review workflow for conflicts | UOW-11 Web UI | UOW-07 emits safe conflict records for later display. |
| Production deployment settings | Operations/future expansion | Current workflow does not deploy generated React projects. |
