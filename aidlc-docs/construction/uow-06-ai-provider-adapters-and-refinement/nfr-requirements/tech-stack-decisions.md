# UOW-06 Tech Stack Decisions

## Decision Summary

| Area | Decision | Rationale |
|---|---|---|
| Package Scope | Create a dedicated provider/refinement package consumed by transformation and application orchestration units | Keeps AI-provider behavior reusable and outside deterministic transformation rules. |
| Runtime Dependencies | Keep provider core dependency-light; use existing workspace packages and exact-pinned dependencies only when validation or adapter safety requires them | Minimizes supply-chain risk in provider-sensitive code. |
| Validation | Use schema-first validation for provider descriptors, minimized contexts, invocation results, and refinement suggestions | Prevents malformed or unsafe provider data from entering downstream units. |
| Provider Defaults | Local/internal and mock providers are the default path; external providers are disabled by default | Supports offline operation, determinism, and safe enterprise defaults. |
| External Provider Boundary | Implement a generic disabled-by-default boundary without a hardcoded commercial default | Leaves room for future adapters without coupling the product to one provider. |
| Timeout and Retry | Configurable timeout per provider; retry disabled unless deterministic retry safety is explicitly declared | Preserves fail-closed behavior and reproducibility. |
| Context Minimization | Schema-first allowlist context with safe refs and policy evidence refs only | Prevents raw source, prompt, secrets, or unrestricted draft leakage. |
| Response Validation | Structured response validation with confidence bounds, safe rationale, provenance, and mapping request traceability | Keeps AI-assisted output reviewable and safe for downstream consumers. |
| Observability | Safe event fields, counts, reason codes, correlation IDs, and refs only | Avoids prompt/source/response leakage through logs and reports. |
| PBT Framework | `fast-check` with Vitest | Matches the existing TypeScript workspace test stack. |

## Dependency Policy

UOW-06 should not introduce runtime dependencies unless all of the following are true:

- The capability cannot be reasonably implemented with UOW-01 model contracts, UOW-05 policy outputs, existing validation patterns, and Node built-ins.
- The dependency is exact-pinned.
- The dependency is reviewed for supply-chain and provider-data exposure risk.
- The dependency appears in the lockfile.
- Build/test instructions include vulnerability scanning and dependency review.

Approved baseline dependencies:

| Dependency | Use | Runtime |
|---|---|---|
| `@spa-bridge/core-model` | Shared diagnostics, refs, result types, provider-neutral contracts | Yes |
| `@spa-bridge/core-security` | Provider policy decisions, masking evidence refs, safe audit contracts | Yes |
| `zod` through UOW-01 patterns | Runtime/schema validation | Yes |
| Node built-ins | Timing, stable IDs, and local-only support where needed | Yes |
| `vitest` | Example-based tests | No |
| `fast-check` | Property-based tests | No |

No concrete external AI SDK is selected for the initial implementation.

## Provider Configuration Decisions

| Config Area | Decision |
|---|---|
| Default Provider Mode | Local/internal first |
| Mock Provider | Deterministic scripted provider for tests and offline workflows |
| External Provider Enablement | Explicit opt-in only |
| External Provider Default | Disabled |
| Commercial Provider Default | None |
| Provider Selection Ordering | Mode, capability match, policy readiness, priority, provider ID, adapter kind |
| Unknown Provider | Rejected before invocation |
| Duplicate Provider ID | Rejected at registration |
| Retry Policy | Disabled by default |
| Timeout Policy | Required and configurable per provider |

## Validation Decisions

| Entity | Validation Requirement |
|---|---|
| ProviderDescriptor | Stable ID, adapter kind, enabled flag, priority, capabilities, policy requirements |
| ProviderCapability | Category, structured response support, safe rationale support, context limits |
| ProviderSelectionRequest | Run ID, correlation ID, mapping request ID, category, capability tags, policy decision |
| MinimizedProviderContext | Safe refs, safe scalar context, policy evidence ref, masked flag |
| ProviderInvocationResult | Status, provider ID, structured response or typed safe error |
| RefinementSuggestion | Suggestion ID, mapping request ID, category, confidence, safe summary, safe rationale, provenance |
| ProviderAuditEvent | Safe event type, reason code, provider ID, adapter kind, correlation ID, mapping request ID, counts, safe refs |

## Performance Decisions

| Scenario | Target |
|---|---|
| Provider selection | Deterministic and bounded by provider count and requested capability tags |
| Context minimization | Bounded to provider allowlist fields and configured context limits |
| Provider timeout | Configurable per provider |
| Retry behavior | Single attempt by default |
| 100+ component workflows | Local/mock refinement orchestration remains suitable for interactive local execution |
| 500+ component workflows | Benchmark coverage and bounded minimized context generation required |

## Test Stack Decisions

| Test Type | Tooling | Required Focus |
|---|---|---|
| Example-based tests | Vitest | Registry validation, provider matrix, policy-gated invocation, timeout behavior |
| Property-based tests | fast-check | Selection determinism, context minimization, fail-closed behavior, response validation |
| Mock reproducibility tests | Vitest + fast-check | Same script/request/seed produces the same result |
| Security review tests | Vitest + schema validation | No raw prompt/source/response in contexts, diagnostics, audit events, or artifacts |
| Integration tests | Vitest | UOW-04 mapping request to UOW-05 policy to UOW-06 refinement result flow |

## Integration Decisions

| Integration | Decision |
|---|---|
| UOW-01 Core Model | Reuse shared refs, diagnostics, result envelopes, stable IDs, and validation patterns |
| UOW-02 Core Application | Invokes refinement service through explicit orchestration boundaries |
| UOW-04 Transformation | Emits provider-neutral mapping requests; does not call providers directly |
| UOW-05 Security | Supplies policy decisions, masking evidence refs, and safe audit constraints before provider invocation |
| UOW-07 Quality Validation | Consumes validated suggestions, diagnostics, and provenance, not raw provider responses |
| UOW-09 Reporting | Consumes safe audit events and manual-review reason codes |
| UOW-10/UOW-11 Interfaces | Display safe diagnostics, suggestion summaries, provenance, and review states only |

## First Target Compatibility Decisions

| Area | Decision |
|---|---|
| Angular Version Metadata | Support Angular 15 capability metadata without hardcoding customer-specific data |
| NgRx Metadata | Support state/effects/entity/router-store capability tags |
| Forms and Routing | Support form and route refinement categories with manual-review fallback |
| i18n | Support translation/i18n category metadata for provider selection |
| Animation and Media | Support animation, Lottie, image, QR/barcode, map, and media-heavy capability tags |
| Target Privacy | Store category/capability metadata only, not raw page names, routes, proprietary identifiers, or source snippets |

## Security Compliance Notes

- SECURITY-03 is addressed through safe structured provider audit evidence.
- SECURITY-05 is addressed through schema-first validation of provider inputs and outputs.
- SECURITY-10 is addressed through dependency minimization and exact pinning.
- SECURITY-11 is addressed through fail-closed provider orchestration behind UOW-05 policy.
- SECURITY-13 is addressed through explicit adapter boundaries and validated provider metadata.
- SECURITY-15 is addressed through timeout, policy block, malformed response, and unsafe content handling.

## Deferred Decisions

| Decision | Deferred To | Reason |
|---|---|---|
| Concrete external AI SDK selection | Future adapter-specific work | Initial UOW-06 keeps external integration generic and disabled by default. |
| Credential storage and rotation | Future operations/security expansion | UOW-06 does not persist provider credentials. |
| Provider-specific rate-limit contracts | Future adapter-specific work | No concrete external provider is selected yet. |
| UI provider configuration screens | UOW-11 Web UI | This unit defines provider package behavior, not UI. |
| Production monitoring backend | Operations/future infrastructure | Current workflow has no deployed operations stage. |
