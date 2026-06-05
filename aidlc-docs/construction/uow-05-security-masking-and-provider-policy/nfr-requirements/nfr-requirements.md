# UOW-05 NFR Requirements

## Scope

These NFRs apply to `packages/core-security` and the policy coordination points in `packages/core-application`.

UOW-05 protects source inputs, provider prompts, generated artifacts, logs, reports, and review outputs from leaking sensitive information. The default operating posture is fail-closed, zero-outbound compatible, deterministic, and report-safe.

## Security Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW05-NFR-SEC-001 | Every provider request must pass through `ProviderPolicyGate` before execution. | Blocking | Unit tests and integration smoke tests deny provider calls without a decision. |
| UOW05-NFR-SEC-002 | Missing, unknown, contradictory, or invalid policy state must produce a blocked decision. | Blocking | Example tests and PBT validate fail-closed behavior. |
| UOW05-NFR-SEC-003 | External provider use must require explicit enablement, enterprise opt-out config, satisfied masking, and audit event creation. | Blocking | Policy matrix tests cover all missing-condition combinations. |
| UOW05-NFR-SEC-004 | Local/internal providers must still require policy evaluation. | Blocking | Local provider policy tests verify policy is not bypassed. |
| UOW05-NFR-SEC-005 | Audit/log/report evidence must contain only safe refs, counts, stable reason codes, and render-safe messages. | Blocking | Audit privacy PBT verifies raw sensitive values are absent. |
| UOW05-NFR-SEC-006 | Masked excerpts are forbidden by default in audit/log/report evidence. | Blocking | Tests reject audit event payloads containing excerpt fields. |
| UOW05-NFR-SEC-007 | Reversible token values must be held in memory only, scoped by run/correlation, and protected by explicit TTL. | Blocking | Token lifecycle tests verify no persistence and scoped lookup behavior. |
| UOW05-NFR-SEC-008 | Target-aware rule packs must never downgrade or suppress generic security findings. | Blocking | Rule-pack validation and idempotence tests cover downgrade attempts. |
| UOW05-NFR-SEC-009 | Access-control hook outputs must be deterministic, deny-by-default, and safe to render in CLI/Web UI. | Blocking | Hook tests cover default deny and output shape. |
| UOW05-NFR-SEC-010 | Security configuration must use safe defaults and require explicit external-provider opt-in. | Blocking | Config validation tests cover default and opt-in states. |

## Privacy Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW05-NFR-PRI-001 | Persistent artifacts must never include raw secrets, tokens, credentials, PII, proprietary identifiers, or source-sensitive snippets. | Blocking | Redaction invariant PBT and example tests. |
| UOW05-NFR-PRI-002 | Diagnostics must reference safe source/artifact refs instead of raw snippets. | Blocking | Diagnostic schema validation. |
| UOW05-NFR-PRI-003 | Category-only findings must be supported when token metadata could reveal sensitive meaning. | High | Example tests for category-only mode. |
| UOW05-NFR-PRI-004 | Restoration must be impossible from exported artifacts, logs, reports, or diagnostics. | Blocking | Serialization tests verify token vault contents are absent. |

## Performance and Scalability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW05-NFR-PERF-001 | Security evaluation for 100+ component projects should typically complete within 10 seconds under local benchmark conditions. | High | Benchmark fixture and performance instructions. |
| UOW05-NFR-PERF-002 | 500+ component projects must have benchmark coverage and bounded memory guidance. | High | Benchmark generator and documented thresholds. |
| UOW05-NFR-PERF-003 | Token vault lookups should be O(1) by token ID within a run/correlation scope. | High | Unit tests for scoped lookup behavior. |
| UOW05-NFR-PERF-004 | Detector execution must avoid retaining full raw source text beyond the active evaluation scope. | Blocking | Code review and memory-oriented tests in code generation. |

## Reliability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW05-NFR-REL-001 | Policy evaluation must be deterministic for the same normalized config and request. | Blocking | PBT idempotence and deterministic ordering tests. |
| UOW05-NFR-REL-002 | Rule-pack execution must be stable by rule ID, version, precedence, and declared category. | Blocking | Rule-pack validator tests. |
| UOW05-NFR-REL-003 | Detector failures must not result in unmasked provider submission. | Blocking | Failure injection tests return blocked decisions. |
| UOW05-NFR-REL-004 | Token expiry must make restoration fail closed. | Blocking | Stateful token lifecycle tests. |

## Maintainability Requirements

| ID | Requirement | Priority | Verification |
|---|---|---|---|
| UOW05-NFR-MAINT-001 | Security-critical logic must be isolated in `packages/core-security`. | Blocking | Package boundary review. |
| UOW05-NFR-MAINT-002 | Policy coordination in `core-application` must consume `core-security` services rather than duplicating security logic. | High | Code review and dependency checks. |
| UOW05-NFR-MAINT-003 | Rule packs must declare ID, version, precedence, schema, and supported categories. | Blocking | Rule-pack schema validation. |
| UOW05-NFR-MAINT-004 | Security diagnostics and audit reason codes must be stable and documented. | High | Snapshot or schema tests. |

## Property-Based Testing Requirements

| ID | Property | Category | Blocking |
|---|---|---|---|
| UOW05-PBT-001 | Reversible masking followed by controlled restoration yields the original payload for allowed in-memory flows. | Round-trip | Yes |
| UOW05-PBT-002 | Irreversible redaction output never contains original sensitive values. | Invariant | Yes |
| UOW05-PBT-003 | Unknown provider, unclear policy, failed masking, or expired token always blocks. | Invariant | Yes |
| UOW05-PBT-004 | Re-evaluating the same normalized policy request yields the same decision. | Idempotence | Yes |
| UOW05-PBT-005 | Audit events never contain generated sensitive values or raw payload values. | Invariant | Yes |
| UOW05-PBT-006 | Token vault state follows scoped create, lookup, expire, and restore command invariants. | Stateful | Yes |
| UOW05-PBT-007 | Applying the same target-aware rule pack twice does not duplicate findings or downgrade generic rules. | Idempotence | Yes |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Structured audit/log evidence is safe-ref based and forbids sensitive content. |
| SECURITY-05 | Compliant | Schema-first validation is required for all public security service inputs. |
| SECURITY-08 | Compliant | Deterministic deny-by-default access-control hooks are required for later CLI/Web UI use. |
| SECURITY-10 | Compliant | Runtime dependency policy requires exact versions and security review for additions. |
| SECURITY-11 | Compliant | Security-critical logic is isolated in `core-security` and designed fail-closed. |
| SECURITY-13 | Compliant | Rule packs and provider policy inputs require schema validation and auditability. |
| SECURITY-15 | Compliant | Missing/unclear policy, detector failure, and token expiry fail closed. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-09, SECURITY-12, SECURITY-14 | N/A | This stage defines library-level NFRs and does not introduce storage resources, network intermediaries, deployed HTML endpoints, IAM policies, runtime auth, or monitoring infrastructure. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Properties were identified during Functional Design and refined here. |
| PBT-02 | Compliant | Reversible masking/restoration is a required round-trip property. |
| PBT-03 | Compliant | Redaction, fail-closed, audit privacy, and token invariants are required. |
| PBT-04 | Compliant | Policy evaluation and rule-pack application idempotence are required. |
| PBT-06 | Compliant | Token lifecycle is explicitly selected as a stateful model. |
| PBT-07 | Compliant | Domain-specific generators are required for payloads, findings, policies, tokens, and audit events. |
| PBT-08 | Compliant | Reproducible seed/shrinking support remains required in code generation and build/test. |
| PBT-09 | Compliant | fast-check remains the selected TypeScript PBT framework. |
| PBT-10 | Compliant | Example-based policy matrix tests must complement PBT. |
| PBT-05 | N/A | No independent oracle/reference algorithm is required for this unit. |

## Blocking Findings

- **Security Findings**: None.
- **PBT Findings**: None.
