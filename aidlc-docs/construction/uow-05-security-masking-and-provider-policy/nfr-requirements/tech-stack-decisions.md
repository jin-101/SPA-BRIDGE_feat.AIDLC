# UOW-05 Tech Stack Decisions

## Decision Summary

| Area | Decision | Rationale |
|---|---|---|
| Package Scope | Create `packages/core-security`; coordinate policy from `packages/core-application` | Keeps security-critical logic isolated and reusable. |
| Runtime Dependencies | Prefer UOW-01 validation stack and Node built-ins; add dependencies only after security review and exact pinning | Minimizes supply-chain risk in security-sensitive code. |
| Validation | Reuse schema-first validation patterns from UOW-01 | Keeps service inputs deterministic and safe by default. |
| Hashing/Token IDs | Use Node built-in cryptographic primitives where needed | Avoids unnecessary runtime dependencies. |
| Token Vault | In-memory only, run/correlation scoped, TTL-based, non-persistent | Supports controlled restoration without persistent raw values. |
| Rule Packs | Schema-validated rule packs with ID, version, precedence, category declarations, and downgrade protection | Allows target-aware coverage without weakening generic security controls. |
| Policy Defaults | Deny-by-default, external providers disabled unless explicitly opted in | Supports zero-outbound operation and fail-closed provider use. |
| Audit Evidence | Safe refs, counts, reason codes, and render-safe messages only | Prevents sensitive data from leaking through logs and reports. |
| PBT Framework | `fast-check` with Vitest | Matches the existing TypeScript workspace test stack. |

## Dependency Policy

UOW-05 should not introduce a runtime dependency unless all of the following are true:

- The capability cannot be reasonably implemented with UOW-01 contracts and Node built-ins.
- The dependency is security-reviewed.
- The dependency is exact-pinned.
- The dependency appears in the lockfile.
- The build/test instructions include vulnerability scanning.

Approved baseline dependencies:

| Dependency | Use | Runtime |
|---|---|---|
| `@spa-bridge/core-model` | Shared diagnostics, result, refs, masking token contracts | Yes |
| `zod` through UOW-01 patterns | Runtime/schema validation | Yes |
| Node built-ins | Hashing, stable IDs, in-memory timing support where needed | Yes |
| `vitest` | Example-based tests | No |
| `fast-check` | Property-based tests | No |

No external DLP/security SDK is selected for the initial implementation.

## Configuration Decisions

| Config Area | Decision |
|---|---|
| External Provider Enablement | Explicit opt-in only |
| Enterprise Data Opt-Out | Required before external provider use |
| Local/Internal Provider | Requires policy evaluation even when outbound is zero |
| Token TTL | Required and scoped by run/correlation |
| Audit Privacy | Safe refs/counts/reason codes only |
| Target-Aware Rules | Optional rule packs layered on generic core |
| Rule-Pack Downgrade | Forbidden |

## Performance Decisions

| Scenario | Target |
|---|---|
| 100+ component security evaluation | Typically under 10 seconds |
| 500+ component security evaluation | Benchmark coverage required |
| Token lookup | O(1) by token ID within scope |
| Audit event creation | Deterministic and bounded by finding count |

## Test Stack Decisions

| Test Type | Tooling | Required Focus |
|---|---|---|
| Example-based tests | Vitest | Policy matrix, config validation, explicit provider gates |
| Property-based tests | fast-check | Masking round-trip, redaction invariant, fail-closed, audit privacy |
| Stateful PBT | fast-check model/command style | Token vault create/lookup/expire/restore lifecycle |
| Security review tests | Vitest + schema validation | No raw values in audit/log/report entities |

## Integration Decisions

| Integration | Decision |
|---|---|
| UOW-02 Core Application | Calls policy and masking services before provider coordination |
| UOW-04 Transformation | Produces provider-neutral mapping requests consumed by security policy before provider use |
| UOW-06 AI Adapters | Must consume `ProviderPolicyDecision` and cannot bypass UOW-05 |
| UOW-09 Reporting | Consumes only safe audit events, redaction summaries, and safe diagnostics |
| UOW-10/UOW-11 Interfaces | Consume access-control hooks and render-safe diagnostics |

## Security Compliance Notes

- SECURITY-03 is addressed through safe structured audit/log evidence.
- SECURITY-05 is addressed through schema-first validation.
- SECURITY-08 is addressed through deny-by-default access-control hook requirements.
- SECURITY-10 is addressed through dependency minimization and exact-pinning requirements.
- SECURITY-11 is addressed through isolated security-critical package boundaries.
- SECURITY-13 is addressed through validated rule packs and auditability.
- SECURITY-15 is addressed through fail-closed policy and token lifecycle behavior.

## Deferred Decisions

| Decision | Deferred To | Reason |
|---|---|---|
| Full authentication/authorization implementation | UOW-11 Web UI and future infrastructure work | UOW-05 only provides hooks. |
| Centralized deployed log storage | Operations/future infrastructure | No deployment resources in this unit. |
| SBOM generation command | Build and Test / release packaging | Package implementation and release workflow are not finalized yet. |
| External provider adapter implementation | UOW-06 | UOW-05 only gates provider use. |
