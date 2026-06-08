# NFR Requirements - UOW-10 CLI Interface

## Purpose

UOW-10 must provide a deterministic, safe, automation-friendly CLI layer that can reliably drive conversion, validation, and reporting workflows from the terminal.

The CLI should stay thin and predictable: it parses commands, validates options and paths, invokes shared application services, and renders safe progress or summary output. It does not own conversion logic, reporting schema, quality gates, or provider policy.

## Scope

| Area | Requirement |
|---|---|
| Package | `packages/cli` |
| Primary outputs | Command-line execution, help text, progress output, report/export commands |
| Primary consumers | Direct terminal users, shell automation, CI, local developer workflows |
| Primary dependencies | `core-application`, `core-reporting`, `core-quality`, `core-security`, and related workspace packages |

## Performance Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-CLI-PERF-001 | Command parsing and validation must complete quickly enough for interactive use. | Sub-second parse/validate path on typical developer machines |
| NFR-CLI-PERF-002 | Long-running operations must provide deterministic progress updates. | Progress should appear at stable checkpoints |
| NFR-CLI-PERF-003 | Help and usage output must be fast and not require a workspace scan. | Immediate or near-immediate response |
| NFR-CLI-PERF-004 | Report/export command startup must stay lightweight and reuse shared reporting APIs. | No unnecessary CLI-local recomputation |

## Responsiveness and Scalability Requirements

| ID | Requirement | Rationale |
|---|---|---|
| NFR-CLI-SCALE-001 | The CLI must handle large workspace paths without scanning unrelated directories by default. | Keeps command startup predictable |
| NFR-CLI-SCALE-002 | Progress output must remain bounded and not flood the terminal with raw internal logs. | Improves readability and automation safety |
| NFR-CLI-SCALE-003 | Non-interactive mode must remain the default for CI and scripted execution. | Supports scale-out automation |
| NFR-CLI-SCALE-004 | Report export commands must delegate to canonical reporting rather than rebuilding content in the CLI layer. | Prevents duplicate work |

## Determinism and Reproducibility Requirements

| ID | Requirement | Enforcement |
|---|---|---|
| NFR-CLI-DET-001 | Equivalent argv and configuration inputs must resolve to the same command handler. | Deterministic command dispatch |
| NFR-CLI-DET-002 | Option precedence must always be `flags > config file > environment > defaults`. | Stable merge policy |
| NFR-CLI-DET-003 | Equivalent outcomes must map to the same exit code category. | Stable exit code mapping |
| NFR-CLI-DET-004 | Progress summaries and final summaries must be stable for equivalent results and verbosity modes. | Deterministic render models |
| NFR-CLI-DET-005 | Help output and command usage strings must remain stable across equivalent inputs. | Snapshot and PBT checks |

## Safety and Privacy Requirements

| ID | Requirement | Enforcement |
|---|---|---|
| NFR-CLI-SEC-001 | The CLI must reject workspace traversal and out-of-root paths before executing commands. | Path containment validation |
| NFR-CLI-SEC-002 | The CLI must not print raw secrets, raw provider payloads, or raw source snippets. | Safe summary rendering |
| NFR-CLI-SEC-003 | The CLI must not invent or expose unsafe absolute paths in user-facing summaries. | Safe path refs only |
| NFR-CLI-SEC-004 | Interactive confirmations must be limited to destructive or ambiguous actions. | Non-interactive default |
| NFR-CLI-SEC-005 | CLI diagnostics must not bypass the shared sanitization and reporting rules. | Safe diagnostics only |

## Reliability Requirements

| ID | Requirement | Behavior |
|---|---|---|
| NFR-CLI-REL-001 | Usage errors, validation failures, runtime failures, and partial-success-with-review outcomes must be distinguishable. | Stable exit categories |
| NFR-CLI-REL-002 | Failures must produce safe diagnostics without leaking internal command or source content. | Fail closed for unsafe data |
| NFR-CLI-REL-003 | Report/export commands must always hand off to the canonical reporting package when reporting is requested. | Reuse shared reporting |
| NFR-CLI-REL-004 | The CLI must remain usable even when optional features are absent or disabled. | Graceful feature gating |

## Maintainability Requirements

| ID | Requirement | Rationale |
|---|---|---|
| NFR-CLI-MAINT-001 | Command parsing, execution, formatting, and application-service bridges must remain separate logical components. | Prevents monolithic CLI code |
| NFR-CLI-MAINT-002 | The CLI package should be reusable by automation and tests without shell-specific hacks. | Improves testability |
| NFR-CLI-MAINT-003 | Shared output formatters should be used for terminal summaries rather than duplicating reporting logic. | Keeps CLI/UI consistency |
| NFR-CLI-MAINT-004 | Command additions should be additive and preserve existing command behavior. | Maintains script compatibility |

## Dependency Requirements

| ID | Requirement | Decision |
|---|---|---|
| NFR-CLI-TECH-001 | Prefer minimal runtime dependencies for the CLI package. | Required baseline |
| NFR-CLI-TECH-002 | Add exact-pinned dependencies only when they are necessary for typed parsing or terminal ergonomics. | Exception path |
| NFR-CLI-TECH-003 | Reuse existing workspace packages for application, reporting, quality, and security behavior. | Required |
| NFR-CLI-TECH-004 | Avoid browser-based or remote command execution dependencies. | Required |

## PBT Requirements

| ID | Property | Required |
|---|---|---|
| NFR-CLI-PBT-001 | Argument parsing and command dispatch must be deterministic. | Yes |
| NFR-CLI-PBT-002 | Workspace containment and traversal rejection must hold for generated path cases. | Yes |
| NFR-CLI-PBT-003 | Exit code mapping must remain stable for equivalent outcomes. | Yes |
| NFR-CLI-PBT-004 | Output rendering must remain stable for equivalent inputs and verbosity modes. | Yes |
| NFR-CLI-PBT-005 | Safe summaries must not include forbidden fields. | Yes |

## Example-Based Test Requirements

- Parse valid and invalid commands with expected handler resolution.
- Verify precedence across flags, config, environment, and defaults.
- Reject traversal and out-of-root paths.
- Verify quiet, normal, and verbose terminal output rendering.
- Verify report/export commands forward to the canonical reporting package.
- Verify usage, validation, runtime, and partial-review exit categories.

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | Compliant | CLI commands are validated and contained before execution. |
| SECURITY-03 | Compliant | Output is safe-summary oriented rather than raw-log oriented. |
| SECURITY-05 | Compliant | Input and path validation happens before invoking shared services. |
| SECURITY-10 | Compliant | Runtime dependencies remain minimal and explicit. |
| SECURITY-13 | Compliant | Safe refs and deterministic summaries preserve traceability without unsafe data leakage. |
| SECURITY-14 | Compliant | The CLI surfaces quality/report outcomes instead of hiding them. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Deterministic dispatch, precedence, and output behavior are modeled. |
| PBT-03 | Compliant | Workspace containment, exit codes, and dispatch stability are invariant targets. |
| PBT-04 | Compliant | Output mode resolution and summary rendering are idempotence/determinism targets. |
| PBT-07 | Compliant | Generator families can cover argv, config, path, and verbosity permutations. |
| PBT-08 | Compliant | Failures can be replayed from recorded argv and configuration cases. |
| PBT-09 | Compliant | The TypeScript test stack is appropriate for CLI property testing. |
| PBT-10 | Compliant | Example-based smoke tests remain necessary alongside PBT. |
