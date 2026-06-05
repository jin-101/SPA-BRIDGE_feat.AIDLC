# UOW-07 NFR Design Patterns

## Design Intent

UOW-07 implements React target generation as a deterministic, path-safe, dependency-allowlisted library pipeline. It turns UOW-04 React-oriented drafts into write-ready Vite + React + TypeScript project output without re-running transformation or relying on CLI/Web UI layers for safety.

The design favors reviewable write plans before writes, preserve-by-default conflict behavior, stable traceability, and bounded generation behavior for large projects.

## Pattern Summary

| Pattern | Components | NFRs Addressed |
|---|---|---|
| Fail-Closed Target Generation Pipeline | `TargetGenerationService`, `TargetGenerationRequestValidator`, `TargetWritePlanSafetyGate` | Reliability, path safety, schema safety |
| Deterministic Strategy Registry | `TargetStrategyRegistry`, `TargetStrategySelectionPolicy`, `TargetStrategyDescriptorSchema` | Extensibility, determinism |
| Path Guard and Overwrite Policy | `TargetPathGuard`, `OverwriteConflictPolicy`, `TargetConflictDetector` | Security, file safety |
| Deterministic Write Plan Builder | `WritePlanBuilder`, `StableFileRefFactory`, `ContentHashService` | Idempotence, traceability, reproducibility |
| Dependency Allowlist Manifest | `DependencyManifestBuilder`, `TargetDependencyAllowlist`, `DependencyRationaleBuilder` | Supply-chain safety, compatibility |
| File-Spec-First Generation | `GeneratedFileSpecFactory`, lazy content materialization boundary | Scalability, memory control |
| Manual Review Preservation | `TargetManualReviewFactory`, `ReviewStubGenerator`, `TargetDiagnosticFactory` | Partial output, safe remediation |
| Trace Coverage Gate | `TraceCoverageValidator`, `TargetTraceBuilder` | Reporting handoff, quality evidence |
| Generic Ecosystem Metadata | `TargetEcosystemMetadataCatalog`, `EcosystemMetadataPrivacyGuard` | First target compatibility without customer data |
| PBT Support Layer | Target generation arbitraries and property suites | Determinism, containment, idempotence |

## Fail-Closed Target Generation Pipeline

`TargetGenerationService` coordinates target generation as an ordered pipeline.

| Stage | Purpose | Failure Behavior |
|---|---|---|
| Validate Request | Validate run ID, output root, strategy ID, overwrite policy, and draft artifact refs | Invalid request returns blocking diagnostics |
| Select Strategy | Resolve target strategy deterministically | Unknown or ambiguous strategy blocks generation |
| Normalize Drafts | Normalize component, route, state, service, style, and trace drafts | Invalid schema blocks or produces manual-review diagnostics |
| Materialize File Specs | Convert drafts into generated file specs and scaffold specs | Unsupported drafts preserve safe partial output |
| Build Dependency Manifest | Select allowlisted exact-version dependencies | Non-allowlisted dependency blocks manifest approval |
| Build Write Plan | Sort file specs, assign stable refs, hash content, detect duplicates | Duplicate paths/refs block write readiness |
| Validate Safety | Enforce path containment, overwrite policy, trace coverage, and diagnostic privacy | Unsafe output blocks write readiness |
| Package Result | Return write plan, diagnostics, manual-review items, traces, and artifact refs | Partial result remains reviewable |

UOW-07 never treats unsafe paths, invalid schemas, duplicate target paths, or corrupted write plans as recoverable write-ready states.

## Deterministic Strategy Registry

`TargetStrategyRegistry` stores target strategy descriptors for the current process/run.

### Selection Ordering

| Step | Sort Key |
|---|---|
| 1 | Explicit requested strategy ID |
| 2 | Default marker |
| 3 | Priority |
| 4 | Strategy ID |

The first implementation registers `vite-react-typescript`. Future strategies must use the same request, write-plan, diagnostics, dependency, and trace contracts.

## Path Guard and Overwrite Policy

`TargetPathGuard` normalizes candidate target paths and verifies target root containment before write-plan approval.

### Blocking Path Conditions

- Absolute paths from draft data.
- `..` traversal segments after normalization.
- Empty or reserved target-relative paths.
- Paths outside configured target root.
- Duplicate normalized target paths without strategy-approved merge behavior.

`OverwriteConflictPolicy` preserves existing files by default and requires explicit overwrite permission before replacement is write-ready.

## Deterministic Write Plan Builder

`WritePlanBuilder` produces the canonical representation of target generation output.

### Write Plan Responsibilities

| Responsibility | Design |
|---|---|
| File ordering | Sort by normalized target-relative path and file ref |
| File refs | Generate stable refs from category, path, source draft refs, and synthetic origin |
| Content hashing | Compute stable per-file hashes and aggregate plan hash |
| Duplicate rejection | Reject duplicate file refs and duplicate paths |
| Conflict records | Attach conflict records before write readiness |
| Trace links | Attach source draft refs or synthetic origin to every file |

The write plan is the single handoff to orchestration, quality, reporting, CLI, and Web UI units.

## Dependency Allowlist Manifest

`DependencyManifestBuilder` selects exact-version dependencies from strategy allowlists.

### Allowlist Sources

| Source | Examples |
|---|---|
| Base target strategy | `react`, `react-dom`, `vite`, `typescript`, `@vitejs/plugin-react` |
| Routing strategy | `react-router-dom` |
| State strategy | `@reduxjs/toolkit`, `zustand` |

The builder rejects unknown dependencies and never copies Angular runtime dependencies into generated package metadata.

## File-Spec-First Generation

UOW-07 uses file specs as the primary internal representation. File specs can carry metadata, stable refs, target paths, hashes, and either materialized content or a lazy content factory.

### Large Project Design

- Normalize draft metadata once per request.
- Avoid duplicate retention of full generated content where possible.
- Sort and hash file specs deterministically.
- Keep benchmark scope for 100+ and 500+ component projects.
- Keep dependency and trace validation bounded by generated file count and draft summary size.

## Manual Review Preservation

Unsupported or uncertain drafts produce safe partial output when possible.

| Case | Result |
|---|---|
| Unsupported component detail | Partial component file or review stub plus diagnostic |
| Uncertain route guard | Route output plus guard manual-review diagnostic |
| Dynamic lazy route | Review stub and lazy-load manual-review item |
| Unsupported state effect | State output plus effect review marker |
| Unsafe path | Blocking diagnostic; not write-ready |
| Invalid schema | Blocking diagnostic; not write-ready |

`ReviewStubGenerator` creates deterministic review stubs only when review output is useful and safe.

## Trace Coverage Gate

`TraceCoverageValidator` verifies every generated file has:

- At least one source draft ref, or
- An explicit synthetic origin for scaffold/config files.

Trace records include generated file refs, draft refs, strategy ID, diagnostic refs, and confidence/certainty where available. Missing trace coverage blocks write readiness.

## Generic Ecosystem Metadata

`TargetEcosystemMetadataCatalog` represents first-target ecosystem concerns as generic additive categories.

| Category | Examples |
|---|---|
| Angular 15 | Component, directive, service, lifecycle, module |
| NgRx | Store, effects, entity, router-store |
| Routing | Route config, guard, resolver, lazy route |
| Forms | Template-driven, reactive, validator |
| i18n | Translation key, interpolation, locale-sensitive text |
| Animation and Media | Angular animation, Lottie, GSAP, image capture |
| Map and Geo | Mapbox, turf, GeoJSON |
| QR and Barcode | QR, barcode, image/PDF output |
| Service Worker | Cache, offline, update flow |

Metadata must not contain concrete customer page names, route strings, identifiers, or raw snippets.

## PBT Design

| Property | Design Support |
|---|---|
| Write-plan determinism | Generators for target requests, strategies, draft bundles, and file specs |
| Path containment | Generators for safe and unsafe path candidates |
| Idempotent generation | Repeated generated requests compare file refs, hashes, dependencies, diagnostics, and traces |
| Dependency stability | Generators vary state/routing strategies and verify allowlisted exact outputs |
| Diagnostic stability | Generators build invalid drafts and unsafe paths with stable diagnostics |
| Trace coverage | Generators build scaffold and draft-derived files and verify trace or synthetic origin |
| Fail-closed write safety | Generators create duplicate refs, duplicate paths, invalid schemas, and unsafe paths |

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Diagnostics, traces, review stubs, and write plans use safe refs and reason codes. |
| SECURITY-05 | Compliant | Request, strategy, draft, path, dependency, write-plan, and trace boundaries are schema validated. |
| SECURITY-10 | Compliant | Dependency generation uses exact-version allowlists and rejects source dependency copying. |
| SECURITY-13 | Compliant | Strategy registry, path guard, dependency builder, and write-plan boundaries are explicit. |
| SECURITY-15 | Compliant | Unsafe paths, invalid schemas, duplicate refs, duplicate paths, and corrupted write plans fail closed. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12, SECURITY-14 | N/A | This library-level NFR design does not introduce infrastructure, deployed endpoints, IAM, authentication, provider invocation, or monitoring resources. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Target generation properties are mapped to concrete design support. |
| PBT-03 | Compliant | Path containment, dependency allowlist, trace coverage, and write safety invariants are designed. |
| PBT-04 | Compliant | Write-plan generation is explicitly idempotent for equivalent inputs. |
| PBT-07 | Compliant | Domain generator families are part of the NFR design. |
| PBT-08 | Compliant | Deterministic replay and seed capture remain required for code/build stages. |
| PBT-09 | Compliant | fast-check remains selected for TypeScript. |
| PBT-10 | Compliant | Example-based target fixtures complement PBT. |
| PBT-02, PBT-05, PBT-06 | N/A | No round-trip codec, independent oracle, or complex mutable state-machine model is required. |

## Blocking Findings

- **Security Findings**: None.
- **PBT Findings**: None.
