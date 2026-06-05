# UOW-05 Business Rules

## Provider Policy Rules

| Rule ID | Rule | Outcome |
|---|---|---|
| UOW05-BR-001 | Every provider call must pass through `ProviderPolicyGate` before execution. | Calls without a policy decision are blocked. |
| UOW05-BR-002 | External providers are disabled unless explicitly allowed by configuration and enterprise opt-out policy. | External calls are blocked by default. |
| UOW05-BR-003 | Local/internal providers still require policy evaluation and safe payload classification. | Zero-outbound mode stays enforceable and auditable. |
| UOW05-BR-004 | Unknown provider types are always denied. | The caller receives a blocking diagnostic. |
| UOW05-BR-005 | Provider requests must include run ID, correlation ID, payload category, source refs, and requested provider type. | Invalid requests are rejected before masking. |

## Masking and Redaction Rules

| Rule ID | Rule | Outcome |
|---|---|---|
| UOW05-BR-010 | Exported artifacts, logs, reports, and persistent diagnostics must use irreversible redaction. | Raw sensitive values cannot be recovered from persistent outputs. |
| UOW05-BR-011 | Reversible tokens are allowed only in controlled in-memory flows. | Restoration remains possible only where required and safe. |
| UOW05-BR-012 | Reversible tokens must not expose raw value length, value prefix, value suffix, or semantic content. | Token refs remain safe for diagnostics and reports. |
| UOW05-BR-013 | If required masking fails for any sensitive category, the payload is not eligible for provider submission. | Provider policy returns `blocked`. |
| UOW05-BR-014 | Restoration requires a matching token map, allowed scope, correlation ID, and audit event. | Unauthorized restoration is blocked. |
| UOW05-BR-015 | Masking is category-preserving but value-obscuring. | Reports can explain what was masked without leaking content. |

## Detection Rules

| Rule ID | Rule | Outcome |
|---|---|---|
| UOW05-BR-020 | Generic detectors must cover secrets, API keys, tokens, URLs, IP addresses, credentials, proprietary identifiers, and configurable customer-specific patterns. | Common sensitive content is caught before provider or report use. |
| UOW05-BR-021 | Target-aware rule packs may add library-specific sensitive patterns but cannot weaken generic rules. | First-target coverage improves while the core stays reusable. |
| UOW05-BR-022 | Detections must reference safe source or artifact locations, not raw snippets. | Diagnostics stay report-safe. |
| UOW05-BR-023 | Duplicate detections must be merged by category, safe ref, and detector ID. | Repeated scans do not inflate review counts. |

## Audit and Logging Rules

| Rule ID | Rule | Outcome |
|---|---|---|
| UOW05-BR-030 | Audit events must include timestamp, run ID, correlation ID, decision, rule IDs, detector counts, and safe refs. | Review evidence is structured and traceable. |
| UOW05-BR-031 | Audit events must not include raw source, raw prompt text, raw generated code snippets, secrets, tokens, PII, or proprietary identifiers. | Security logging remains compliant. |
| UOW05-BR-032 | Blocking decisions must include a safe remediation hint. | Users can resolve policy issues without seeing leaked content. |
| UOW05-BR-033 | Security audit output is append-oriented from the caller perspective. | Later reporting can preserve evidence integrity. |

## Access-Control Hook Rules

| Rule ID | Rule | Outcome |
|---|---|---|
| UOW05-BR-040 | UOW-05 provides policy-evaluation hooks for CLI/Web UI but does not implement full authentication. | Later interface units can enforce decisions consistently. |
| UOW05-BR-041 | Review-mode restricted actions must be denied unless explicitly allowed by hook evaluation. | Manual review cannot accidentally bypass policy. |
| UOW05-BR-042 | Hook outputs must be safe to render in CLI/Web UI. | No sensitive data leaks through review prompts. |

## Error Handling Rules

| Rule ID | Rule | Outcome |
|---|---|---|
| UOW05-BR-050 | Missing, unclear, or contradictory policy produces a fail-closed decision. | Ambiguity does not become implicit approval. |
| UOW05-BR-051 | Security errors are reported as typed diagnostics with stable codes. | Downstream quality/reporting units can process them deterministically. |
| UOW05-BR-052 | A security service failure must not cause unmasked payload submission. | Provider execution remains blocked on internal errors. |
| UOW05-BR-053 | Unsupported target-aware patterns produce manual-review diagnostics, not silent pass-through. | First-target-specific risks remain visible. |

## Validation Rules

| Rule ID | Rule | Outcome |
|---|---|---|
| UOW05-BR-060 | All public service inputs must be schema-validated before detection, masking, policy, audit, or restoration logic runs. | Malformed input is rejected consistently. |
| UOW05-BR-061 | Payload category must be one of source, provider-prompt, generated-artifact, log, report, or review. | Policy can apply category-specific rules. |
| UOW05-BR-062 | Provider decisions must be deterministic for the same normalized request and policy configuration. | Results are reproducible and testable. |
| UOW05-BR-063 | Rule packs must declare ID, version, categories, and precedence. | Rule execution is auditable and stable. |

## Manual Review Rules

| Rule ID | Rule | Outcome |
|---|---|---|
| UOW05-BR-070 | Manual review items must include safe refs, category, detector/rule IDs, severity, and remediation hint. | Reviewers can act without sensitive content exposure. |
| UOW05-BR-071 | Manual review can unblock a policy only through explicit configuration or approved override hooks. | Human review remains auditable. |
| UOW05-BR-072 | Overrides are never inferred from prior approvals in unrelated runs. | Decisions remain scoped and deliberate. |

## Security/PBT Blocking Findings

- **Security Findings**: None.
- **PBT Findings**: None.
