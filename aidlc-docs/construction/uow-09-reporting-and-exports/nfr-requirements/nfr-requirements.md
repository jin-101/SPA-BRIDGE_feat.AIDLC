# NFR Requirements - UOW-09 Reporting and Exports

## Purpose

UOW-09 must generate deterministic, secure, reusable conversion reports for CLI, Web UI, and export workflows. The package must provide canonical JSON as the source of truth, then derive Markdown and sanitized HTML exports without leaking sensitive source, prompt, provider, or path data.

## Scope

| Area | Requirement |
|---|---|
| Package | `packages/core-reporting` |
| Primary outputs | Canonical JSON report, Markdown export, sanitized HTML export, view models |
| Primary consumers | UOW-10 CLI, UOW-11 Web UI, UOW-02 application export use cases |
| Primary inputs | Typed report input bundles from application, source analysis, transformation, provider, target generation, quality, security, and traceability units |

## Performance Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-RPT-PERF-001 | Report generation for 100+ component projects must complete in seconds on a typical developer machine. | Seconds, not minutes |
| NFR-RPT-PERF-002 | 500+ component projects must be included in benchmark scope. | Benchmark fixture coverage |
| NFR-RPT-PERF-003 | Diagnostic grouping and section normalization must use bounded sorting and linear or near-linear aggregation where practical. | No avoidable quadratic hot paths |
| NFR-RPT-PERF-004 | Markdown and HTML rendering must be derived from the canonical report without re-reading arbitrary workspace files. | Single input model pass plus rendering |

## Scalability and Memory Requirements

| ID | Requirement | Rationale |
|---|---|---|
| NFR-RPT-SCALE-001 | Reports must store bounded evidence summaries, counts, safe refs, and content hashes rather than unbounded logs. | Keeps large conversion runs manageable |
| NFR-RPT-SCALE-002 | Report input bundles must not embed raw source files, raw provider prompts, raw provider responses, or full build logs. | Reduces memory and privacy risk |
| NFR-RPT-SCALE-003 | Export strings may be materialized lazily by the public API where practical. | Supports CLI/Web UI reuse |
| NFR-RPT-SCALE-004 | Report builders must tolerate empty optional sections while preserving required section shape. | Supports partial conversion evidence |

## Determinism and Reproducibility Requirements

| ID | Requirement | Enforcement |
|---|---|---|
| NFR-RPT-DET-001 | Section order must be stable across equivalent inputs. | Shared canonical section ordering |
| NFR-RPT-DET-002 | Diagnostic, manual-review, AI-decision, quality, and traceability item order must be stable. | Deterministic sort keys |
| NFR-RPT-DET-003 | Report IDs, item IDs, export refs, and content hashes must be stable for equivalent inputs. | Stable hashing |
| NFR-RPT-DET-004 | Generated timestamps must be caller-controlled or deterministic in tests. | No hidden `Date.now()` in core logic |
| NFR-RPT-DET-005 | JSON, Markdown, and HTML exports must be byte-stable for equivalent canonical reports and render options. | Snapshot and PBT stability checks |

## Security and Privacy Requirements

| ID | Requirement | Enforcement |
|---|---|---|
| NFR-RPT-SEC-001 | Reports must reject or sanitize raw prompts, raw provider responses, raw source snippets, secrets, tokens, passwords, masked originals, unsafe HTML, and absolute paths. | Forbidden-field validation |
| NFR-RPT-SEC-002 | The report builder must never perform unmasking or sensitive value restoration. | Redacted values only |
| NFR-RPT-SEC-003 | HTML rendering must escape all text and avoid raw HTML injection. | Escaped HTML renderer |
| NFR-RPT-SEC-004 | Markdown rendering must escape table delimiters and unsafe inline content. | Sanitized Markdown renderer |
| NFR-RPT-SEC-005 | Report paths must be represented as safe source-relative, target-relative, or artifact refs. | Ref validation |
| NFR-RPT-SEC-006 | Export failures must return safe diagnostics without embedding unsafe report content. | Safe error model |

## Reliability Requirements

| ID | Requirement | Behavior |
|---|---|---|
| NFR-RPT-REL-001 | Schema errors, duplicate IDs, unsafe fields, and missing required trace coverage must fail closed. | No unsafe export |
| NFR-RPT-REL-002 | Non-fatal safe-section issues may produce partial reports with diagnostics. | Preserve safe evidence |
| NFR-RPT-REL-003 | Required report sections must always exist, even if empty. | Stable consumer contract |
| NFR-RPT-REL-004 | Export metadata must include format, renderer version, generated timestamp, and content hash. | Auditable exports |

## Maintainability Requirements

| ID | Requirement | Rationale |
|---|---|---|
| NFR-RPT-MAINT-001 | Reporting logic must live in a reusable `core-reporting` package. | Prevent CLI/Web UI duplication |
| NFR-RPT-MAINT-002 | Report builder, validators, sanitized renderers, view-model adapters, fixtures, and generators must be separate logical components. | Keeps the package testable |
| NFR-RPT-MAINT-003 | CLI and Web UI must consume report APIs rather than recreating grouping or rendering logic. | Preserves consistency |
| NFR-RPT-MAINT-004 | Schema evolution must be versioned and additive by default. | Enables future dashboard/report consumers |

## Schema Evolution Requirements

| ID | Requirement |
|---|---|
| NFR-RPT-SCHEMA-001 | Canonical report schema must include `schemaVersion`. |
| NFR-RPT-SCHEMA-002 | Rendered exports must include renderer version metadata. |
| NFR-RPT-SCHEMA-003 | Additive schema changes are preferred; breaking changes require explicit version changes. |
| NFR-RPT-SCHEMA-004 | Compatibility validation must reject unknown required schema shapes. |

## Technology Requirements

| ID | Requirement | Decision |
|---|---|---|
| NFR-RPT-TECH-001 | Use TypeScript-native builders and renderers. | Required |
| NFR-RPT-TECH-002 | Prefer no new runtime dependencies beyond existing workspace packages. | Required baseline |
| NFR-RPT-TECH-003 | Add exact-pinned runtime dependencies only if a structured sanitizer or serializer becomes necessary. | Exception path |
| NFR-RPT-TECH-004 | Do not use browser DOM rendering or remote/SaaS report generation in this unit. | Required |
| NFR-RPT-TECH-005 | Use existing Vitest and fast-check test stack. | Required |

## PBT Requirements

| ID | Property | Required |
|---|---|---|
| NFR-RPT-PBT-001 | Canonical JSON serialization/deserialization round-trip preserves report structure. | Yes |
| NFR-RPT-PBT-002 | Report normalization is idempotent. | Yes |
| NFR-RPT-PBT-003 | Diagnostic and manual-review grouping preserves item counts. | Yes |
| NFR-RPT-PBT-004 | Equivalent inputs produce deterministic ordering and stable exports. | Yes |
| NFR-RPT-PBT-005 | Sanitization is idempotent for already-safe values. | Yes |
| NFR-RPT-PBT-006 | Export renderers produce byte-stable Markdown and HTML for equivalent reports. | Yes |
| NFR-RPT-PBT-007 | Every generated artifact ref has trace coverage or a synthetic origin. | Yes |

## Example-Based Test Requirements

- Build a successful report with no manual review items.
- Build a partial report with blocking review items.
- Render Markdown and HTML with unsafe characters and verify escaping.
- Reject report input containing raw prompts, raw source snippets, or absolute paths.
- Evaluate the 85 percent quality target for pass and fail cases.
- Verify export metadata includes hashes and renderer version.

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Structured diagnostics and export metadata avoid raw sensitive logs. |
| SECURITY-05 | Compliant | Typed report inputs are validated before rendering. |
| SECURITY-10 | Compliant | Dependency policy requires lockfile/exact-pinned additions and prefers no new runtime dependencies. |
| SECURITY-11 | Compliant | Sanitization, validation, and fail-closed behavior are layered. |
| SECURITY-13 | Compliant | Schema validation and content hashes support report artifact integrity. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | NFRs carry forward reporting properties from Functional Design. |
| PBT-02 | Compliant | Report JSON round-trip is blocking. |
| PBT-03 | Compliant | Grouping and trace coverage invariants are blocking. |
| PBT-04 | Compliant | Normalization and sanitization idempotence are blocking. |
| PBT-07 | Compliant | Domain report generators are required for code generation. |
| PBT-08 | Compliant | Existing fast-check seed/shrinking behavior must be preserved. |
| PBT-09 | Compliant | TypeScript uses the established fast-check stack. |
| PBT-10 | Compliant | Example-based tests are required alongside PBT. |
