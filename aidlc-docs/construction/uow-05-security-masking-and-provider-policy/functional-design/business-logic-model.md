# UOW-05 Business Logic Model

## Purpose

UOW-05 defines the security business logic that protects SPA-Bridge conversion flows before source evidence, transformation drafts, generated artifacts, reports, logs, or provider prompts can expose sensitive information.

The unit stays generic by default, while allowing target-aware rule packs to add known project or library patterns without weakening the shared security core.

## Primary Business Capabilities

| Capability | Responsibility | Output |
|---|---|---|
| Sensitive Data Detection | Inspect source inputs, provider prompts, generated artifacts, logs, and reports for configured sensitive patterns | `SensitiveFinding` records with safe locations |
| Masking and Redaction | Convert sensitive values into safe representations using irreversible redaction or controlled reversible tokens | `MaskedPayload`, `MaskTokenRef`, `RedactionSummary` |
| Provider Policy Gate | Decide whether a provider request may proceed before every local/internal or external provider call | `ProviderPolicyDecision` |
| Restoration Boundary | Restore reversible tokens only inside controlled in-memory flows with audit evidence | `RestorationDecision`, `RestoredPayload` |
| Audit Safety | Emit structured audit events without raw source, secrets, proprietary identifiers, or sensitive snippets | `SecurityAuditEvent` |
| Access-Control Hooks | Provide review-mode and policy-evaluation hooks for CLI/Web UI enforcement in later units | `AccessControlDecision` |
| Target-Aware Security Rules | Add project/library-specific sensitive pattern rules on top of the generic detector | `SecurityRulePackResult` |

## End-to-End Security Flow

1. The caller submits a security evaluation request with a payload category, safe refs, correlation ID, run ID, and provider intent when relevant.
2. `SecurityEvaluationService` normalizes the request and rejects malformed or untrusted input.
3. `SensitiveDataDetector` evaluates generic detectors and enabled target-aware rule packs.
4. `MaskingPipeline` applies irreversible redaction for exported or persisted artifacts.
5. `MaskingPipeline` may create reversible in-memory token refs only for controlled provider or generation flows.
6. `ProviderPolicyGate` evaluates provider type, masking state, outbound policy, target-app rules, and enterprise opt-out settings.
7. If policy is unclear, incomplete, or contradictory, the result is `blocked` with manual-review diagnostics.
8. `SecurityAuditBuilder` emits a safe structured event with counts, categories, refs, and decision rationale.
9. Downstream units receive safe payloads, policy decisions, and diagnostics without raw sensitive values.

## Data Flow Boundaries

| Boundary | Input | Allowed Output | Forbidden Output |
|---|---|---|---|
| Source Analyzer to Security | Source refs, inventory refs, detected text categories | Safe refs and finding categories | Raw source snippets in diagnostics |
| Transformation to Security | Provider-neutral mapping requests and draft refs | Masked provider context and policy decision | Full unmasked prompt content in logs |
| Security to AI Provider | Masked prompt, minimal context, provider policy decision | Provider-ready safe request | Unmasked external-provider request |
| Security to Reporting | Redaction summary, safe audit event, diagnostic refs | Report-safe security evidence | Secrets, PII, proprietary identifiers |
| Security to CLI/Web | Review-mode hook results and safe diagnostics | Human-review instructions | Raw sensitive values |

## Provider Policy Model

Provider policy is enforced before every provider call.

| Provider Type | Default Policy | Required Checks |
|---|---|---|
| Local/Internal | Allowed only after policy evaluation | Validate masking configuration, safe logging, and payload category |
| External | Blocked unless explicitly enabled | Validate masking, enterprise opt-out, outbound policy, and provider allowlist |
| Mock/Test | Allowed in tests with synthetic data | Validate test mode and prevent production credentials |
| Unknown | Blocked | Require explicit provider registration and policy configuration |

## Masking Modes

| Mode | Use Case | Persistence | Restoration |
|---|---|---|---|
| Irreversible Redaction | Logs, reports, exported artifacts, persistent diagnostics | Allowed | Not possible |
| Reversible Tokenization | Controlled in-memory provider and generation flows | Not persisted with raw value | Controlled in-memory only |
| Category-Only Finding | Cases where even token metadata would reveal too much | Allowed | Not applicable |

## Fail-Closed Decisions

The security service returns `blocked` when:

- Sensitive content is detected and the applicable policy is missing.
- Provider type is unknown.
- External provider use is requested without explicit enablement.
- Masking fails for any required category.
- Restoration is requested outside a controlled in-memory flow.
- Audit event construction would require raw sensitive content.
- Target-aware rule packs produce a blocking finding.

## Target-Aware Rule Packs

The generic detector owns shared categories such as secrets, tokens, URLs, IP addresses, proprietary identifiers, credentials, personal identifiers, and business-sensitive names.

Target-aware rule packs may add known patterns from the first target application's ecosystem, including library-driven map, analytics, capture, translation, cookie, local-storage, barcode, QR, animation, route, and service-worker flows. These rule packs produce explicit review paths and never override generic fail-closed policy.

## Testable Properties

| Component | Property Category | Property |
|---|---|---|
| `MaskingPipeline` | Round-trip | Reversible tokenization followed by controlled restoration yields the original payload for allowed in-memory flows |
| `MaskingPipeline` | Invariant | Irreversible redaction never contains the original sensitive value |
| `ProviderPolicyGate` | Invariant | Unknown provider type, unclear policy, or failed masking always produces a blocked decision |
| `ProviderPolicyGate` | Idempotence | Evaluating the same normalized request twice produces the same decision |
| `SecurityAuditBuilder` | Invariant | Audit events never contain raw sensitive values |
| `AccessControlHookEvaluator` | Invariant | Review-mode restricted actions are denied unless the hook explicitly allows them |
| `TargetAwareRulePack` | Idempotence | Applying the same rule pack twice does not duplicate findings or review items |

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Structured logging and audit events are modeled without sensitive data. |
| SECURITY-05 | Compliant | Security evaluation inputs must be normalized and validated before processing. |
| SECURITY-08 | Compliant | Access-control hooks are defined for later CLI/Web UI enforcement; full auth is deferred. |
| SECURITY-10 | Compliant | Dependency and supply-chain enforcement remains in build/test and later code generation. |
| SECURITY-11 | Compliant | Security-critical logic is isolated in `core-security` with defense-in-depth controls. |
| SECURITY-13 | Compliant | Provider inputs and rule-pack outputs are validated and auditable. |
| SECURITY-15 | Compliant | Ambiguous sensitive content or policy state fails closed. |
| SECURITY-01, SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-09, SECURITY-12, SECURITY-14 | N/A | This functional design does not create infrastructure, network endpoints, deployed web handlers, IAM policies, authentication, or monitoring resources. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Testable properties are identified for masking, policy, audit, access hooks, and rule packs. |
| PBT-02 | Compliant | Masking restoration has a round-trip property for reversible in-memory flows. |
| PBT-03 | Compliant | Redaction, fail-closed behavior, and audit safety invariants are identified. |
| PBT-04 | Compliant | Policy evaluation and target-aware rule-pack application include idempotence properties. |
| PBT-06 | Compliant | Restoration and access-control hook flows are stateful candidates for later model-based PBT. |
| PBT-07, PBT-08, PBT-09, PBT-10 | Deferred | Generator quality, reproducibility, framework selection, and complementary tests are enforced in NFR/code stages. |
| PBT-05 | N/A | No oracle/reference algorithm is identified in this functional design. |
