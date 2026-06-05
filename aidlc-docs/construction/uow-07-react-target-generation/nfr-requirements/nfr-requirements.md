# UOW-07 NFR Requirements

## Scope

These NFRs apply to the React target generation package planned for UOW-07. The package materializes UOW-04 React-oriented target drafts into deterministic Vite + React 18 + TypeScript project output while preserving traceability, path safety, dependency allowlisting, and manual-review evidence.

UOW-07 must generate a deterministic write plan before writing files, enforce target root containment, keep dependencies allowlisted and exact-pinned, support strategy extension, and remain safe for large target projects.

## Security Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW07-NFR-SEC-001 | Generated file paths must be contained within the configured target root. | Blocking | Path containment tests and PBT reject traversal and absolute path escape. |
| UOW07-NFR-SEC-002 | Path traversal segments, absolute paths from draft data, and unsafe normalized paths must produce blocking diagnostics. | Blocking | Example tests cover unsafe path variants. |
| UOW07-NFR-SEC-003 | Existing target files must be preserved by default unless an explicit overwrite policy is supplied. | Blocking | Conflict policy tests verify preserve-by-default behavior. |
| UOW07-NFR-SEC-004 | Target dependencies must be selected from an allowlist and must not copy Angular runtime dependencies into target package metadata. | Blocking | Dependency selection tests reject non-allowlisted dependencies. |
| UOW07-NFR-SEC-005 | Diagnostics, write plans, and traces must use safe refs, target-relative paths, reason codes, and counts rather than raw source snippets. | Blocking | Diagnostic privacy tests inspect serialized artifacts. |
| UOW07-NFR-SEC-006 | Invalid schemas, corrupted write plans, unsafe paths, duplicate file refs, and duplicate target paths must fail closed. | Blocking | Schema and conflict validation tests. |
| UOW07-NFR-SEC-007 | Route guard, access-control, and lazy-loading uncertainty must not be silently weakened during target generation. | Blocking | Route generation tests require manual-review diagnostics for unresolved guard/lazy semantics. |

## Privacy Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW07-NFR-PRI-001 | Target generation artifacts must not include raw source snippets by default. | Blocking | Artifact serialization tests. |
| UOW07-NFR-PRI-002 | Manual-review stubs must contain safe summaries and refs only. | Blocking | Review stub tests. |
| UOW07-NFR-PRI-003 | Ecosystem metadata may include category tags but must not encode customer-specific page names, route strings, identifiers, or proprietary text. | Blocking | Metadata validation tests. |
| UOW07-NFR-PRI-004 | Dependency rationale must describe strategy categories rather than raw source package inventory. | High | Package metadata tests and report handoff review. |

## Performance and Scalability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW07-NFR-PERF-001 | Deterministic write-plan generation for 100+ component projects should complete within seconds under local reference conditions. | High | Benchmark fixture instructions and targeted performance tests. |
| UOW07-NFR-PERF-002 | 500+ component projects are included in benchmark scope for write-plan size, generated file count, and dependency selection behavior. | High | Benchmark fixture coverage. |
| UOW07-NFR-PERF-003 | Generation must be bounded by draft metadata and file specs and avoid unnecessary duplicate full-content retention for large projects. | High | Code review and memory-oriented tests. |
| UOW07-NFR-PERF-004 | Dependency selection must be bounded by strategy metadata and target draft summaries. | High | Dependency selection PBT. |
| UOW07-NFR-PERF-005 | Write-plan sorting and hashing must scale predictably with generated file count. | High | Generated file set benchmarks. |

## Determinism Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW07-NFR-DET-001 | Target strategy selection must be stable for equivalent requests and registry state. | Blocking | Strategy selection PBT. |
| UOW07-NFR-DET-002 | Generated file ordering, file refs, target-relative paths, content hashes, dependency ordering, diagnostics, and traces must be stable. | Blocking | Snapshot and PBT determinism tests. |
| UOW07-NFR-DET-003 | Re-running target generation with equivalent inputs must produce equivalent write plans. | Blocking | Idempotence PBT. |
| UOW07-NFR-DET-004 | Manual-review diagnostics must use stable IDs, reason codes, severity, and ordering. | High | Diagnostic stability tests. |

## Reliability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW07-NFR-REL-001 | Unsupported drafts must preserve partial output where safe and produce manual-review diagnostics. | Blocking | Unsupported draft fixtures. |
| UOW07-NFR-REL-002 | Invalid schemas, unsafe paths, and corrupted write plans must block write execution. | Blocking | Validation tests. |
| UOW07-NFR-REL-003 | Write-plan construction must finish before file writing is attempted. | Blocking | API and orchestration tests. |
| UOW07-NFR-REL-004 | Existing file conflicts must be represented as conflict records with safe diagnostics. | Blocking | Conflict matrix tests. |
| UOW07-NFR-REL-005 | Generated files must have source draft refs or explicit synthetic origins. | Blocking | Trace coverage PBT. |

## Maintainability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW07-NFR-MAINT-001 | Target generation must live in a dedicated reusable `packages/target-react` package. | Blocking | Package boundary review. |
| UOW07-NFR-MAINT-002 | The first implementation must expose a strategy registry and shared generator interfaces. | Blocking | API review and tests. |
| UOW07-NFR-MAINT-003 | Vite React TypeScript must be implemented as the first strategy rather than hardcoded throughout unrelated services. | High | Module boundary review. |
| UOW07-NFR-MAINT-004 | State and routing output must be adapter-like and strategy-specific. | High | Strategy adapter tests. |
| UOW07-NFR-MAINT-005 | Future target generator metadata must be additive and must not weaken path safety, dependency allowlist, or traceability requirements. | Blocking | Strategy metadata validation tests. |

## Compatibility Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW07-NFR-COMP-001 | Default target output must be compatible with React 18 and React DOM 18. | Blocking | Package metadata and generated source tests. |
| UOW07-NFR-COMP-002 | Default scaffold must be compatible with Vite and TypeScript. | Blocking | Generated config tests. |
| UOW07-NFR-COMP-003 | Routing output must target React Router-compatible modules when route drafts exist. | High | Routing output fixtures. |
| UOW07-NFR-COMP-004 | State output must support React Context API, Redux Toolkit, and Zustand strategy adapters. | High | State adapter fixtures. |
| UOW07-NFR-COMP-005 | Forms, i18n, animation/media/map assets, QR/barcode, and service-worker cases may be represented through generic review metadata when final materialization is unsafe. | High | Ecosystem metadata tests. |

## Property-Based Testing Requirements

| ID | Property | Category | Blocking |
|---|---|---|---|
| UOW07-PBT-001 | Equivalent generation requests and draft bundles produce equivalent sorted write plans. | Determinism | Yes |
| UOW07-PBT-002 | Generated target paths never escape the configured target root. | Security invariant | Yes |
| UOW07-PBT-003 | Re-running generation with the same inputs produces equivalent file refs, hashes, diagnostics, dependencies, and traces. | Idempotence | Yes |
| UOW07-PBT-004 | Equivalent strategy and draft summaries produce equivalent dependency manifests. | Invariant | Yes |
| UOW07-PBT-005 | Diagnostics for equivalent invalid drafts remain stable in ID, code, severity, and ordering. | Determinism | Yes |
| UOW07-PBT-006 | Every generated file has a source draft ref or explicit synthetic origin. | Trace invariant | Yes |
| UOW07-PBT-007 | Unsafe paths, duplicate refs, duplicate target paths, and invalid schemas always produce blocking diagnostics. | Fail-closed invariant | Yes |

## First Target Compatibility Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW07-NFR-TGT-001 | Generator metadata must support Angular 15 migration categories without hardcoding customer-specific data. | High | Metadata fixture tests. |
| UOW07-NFR-TGT-002 | NgRx-derived state must map to React state strategy metadata and may generate Redux Toolkit output when selected. | High | State strategy tests. |
| UOW07-NFR-TGT-003 | Routing, forms, i18n, animation, media, map, QR/barcode, and service-worker categories must produce target output or manual-review metadata. | High | Ecosystem review fixture tests. |
| UOW07-NFR-TGT-004 | First target application compatibility metadata must remain generic and must not encode page names, proprietary identifiers, raw routes, or raw source snippets. | Blocking | Privacy validation tests. |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Generated diagnostics, write plans, and traces use safe refs and reason codes. |
| SECURITY-05 | Compliant | Generation requests, draft refs, output roots, dependency manifests, and write plans require schema validation. |
| SECURITY-10 | Compliant | Target dependencies are allowlisted and exact-pinned. |
| SECURITY-13 | Compliant | Strategy registry and generator boundaries are explicit and reusable. |
| SECURITY-15 | Compliant | Unsafe paths, invalid schemas, corrupted write plans, and protected file conflicts fail closed. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12, SECURITY-14 | N/A | This stage defines local library target-generation NFRs and does not create deployed endpoints, IAM, auth flows, storage resources, external provider calls, infrastructure, or monitoring resources. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Write-plan, path containment, idempotence, dependency, diagnostic, and trace properties are defined. |
| PBT-03 | Compliant | Path containment, dependency stability, and trace coverage invariants are blocking. |
| PBT-04 | Compliant | Idempotent target generation is a blocking property. |
| PBT-07 | Compliant | Domain-specific generators are required for target requests, draft bundles, file specs, paths, conflicts, dependencies, and traces. |
| PBT-08 | Compliant | Deterministic replay with generated seeds is required in code stage. |
| PBT-09 | Compliant | fast-check remains the selected TypeScript PBT framework. |
| PBT-10 | Compliant | Example-based target fixtures must complement PBT. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not require round-trip codecs, independent oracle algorithms, or complex mutable state-machine behavior. |

## Blocking Findings

- **Security Findings**: None.
- **PBT Findings**: None.
