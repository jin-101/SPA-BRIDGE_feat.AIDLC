# NFR Design Plan - UOW-05 Security, Masking, and Provider Policy

## Unit Context

- **Unit**: UOW-05 Security, Masking, and Provider Policy
- **Primary Package(s)**: `packages/core-security`, policy area in `packages/core-application`
- **NFR Requirements Status**: Complete
- **Primary Stories**: US-009, US-010
- **Supporting Stories**: US-001, US-003, US-006, US-007, US-011, US-013, US-014
- **Key NFR Drivers**: Fail-closed provider policy, in-memory token lifecycle, audit privacy, rule-pack integrity, deterministic config validation, blocking PBT.

## Purpose

Design the NFR patterns and logical components that implement UOW-05's security requirements without leaking sensitive values, weakening generic rules, or allowing provider calls to bypass policy.

## Checklist

- [x] Load UOW-05 NFR requirements artifacts.
- [x] Identify NFR design pattern areas.
- [x] Create NFR design plan with questions.
- [x] Wait for user answers to all `[Answer]:` tags.
- [x] Validate answers for completeness, contradictions, and ambiguity.
- [x] Resolve follow-up questions if needed.
- [x] Generate `nfr-design-patterns.md`.
- [x] Generate `logical-components.md`.
- [x] Validate Security Baseline compliance.
- [x] Validate PBT compliance.
- [x] Present NFR Design completion message for review.

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved NFR Design Choices

- **Provider Policy Gate**: Pure deterministic decision component returning allow, block, or manual-review with reason codes.
- **Token Vault**: Scoped in-memory vault with TTL, run/correlation namespace, explicit dispose, and no serialization API.
- **Audit Events**: `SafeAuditEventBuilder` accepts only safe refs, counts, reason codes, and render-safe messages.
- **Detection/Masking Pipeline**: Staged pipeline for normalize, detect, merge findings, choose masking mode, and validate safe output.
- **Rule Pack Validation**: `SecurityRulePackRegistry` with schema validation, precedence checks, deterministic ordering, and downgrade prevention.
- **Security Config**: Schema-first resolver with safe defaults, explicit external-provider opt-in, and deterministic merge order.
- **Access-Control Hooks**: Deterministic deny-by-default evaluator with safe display metadata.
- **Failure Handling**: Typed `Result` errors and blocking diagnostics for invalid config, detector failure, masking failure, token expiry, and unknown provider.
- **PBT Support**: Domain generators for payloads, findings, policies, tokens, audit events, plus token vault stateful command model.
- **Logical Boundaries**: Config, detector, masking, token vault, policy gate, audit builder, access hook, rule-pack registry, and PBT support modules.

## Draft NFR Design Focus

- Fail-closed policy gate and provider readiness decision pattern.
- Schema-first security configuration and deterministic merge.
- Safe audit event builder with excerpt prohibition.
- In-memory token vault with TTL and scoped lifecycle.
- Detector pipeline with generic and target-aware rule-pack validation.
- Domain-specific PBT generator and stateful token lifecycle model.
- Access-control hook evaluator that is deny-by-default and render-safe.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
Provider policy gate design은 어떤 패턴이 적합할까요?

A) `ProviderPolicyGate` as a pure deterministic decision component returning allow/block/manual-review with reason codes
B) Provider adapters perform their own policy checks internally
C) Policy checks are handled by CLI/Web UI before provider adapter calls
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
Token vault design은 어떻게 구성할까요?

A) Scoped in-memory `TokenVault` with TTL, run/correlation namespace, explicit dispose, and no serialization API
B) File-backed encrypted vault with resume support
C) Stateless token helper with caller-managed storage
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
Audit event construction은 어떤 패턴으로 둘까요?

A) `SafeAuditEventBuilder` that accepts only safe refs, counts, reason codes, and render-safe messages
B) General logger wrapper that accepts arbitrary structured metadata
C) Raw event object construction by each caller
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
Detection and masking pipeline은 어떻게 설계할까요?

A) Staged pipeline: normalize input, detect, merge findings, choose masking mode, validate safe output
B) One-pass regex replacement over payload strings
C) Defer masking to provider adapters
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
Target-aware rule pack validation은 어떤 패턴이 적합할까요?

A) `SecurityRulePackRegistry` plus schema validation, precedence checks, deterministic ordering, and downgrade prevention
B) Simple array of functions without validation
C) Hard-coded target rules only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
Security configuration design은 어떻게 잡을까요?

A) Schema-first config resolver with safe defaults, explicit external-provider opt-in, and deterministic merge order
B) Plain object config with runtime warnings
C) Provider adapters own their own config parsing
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
Access-control hook design은 어떻게 구성할까요?

A) `AccessControlHookEvaluator` returning deterministic deny-by-default decisions with safe display metadata
B) Boolean helper only
C) Defer all access-control hook design to Web UI
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
Failure handling pattern은 어떻게 둘까요?

A) Typed `Result` errors and blocking diagnostics for invalid config, detector failure, masking failure, token expiry, and unknown provider
B) Throw exceptions and let callers decide
C) Log warning and continue with best effort
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
PBT test support design은 어떻게 구성할까요?

A) Domain generators for payloads/findings/policies/tokens/audit events plus stateful token vault command model
B) Only arbitrary strings and booleans for generated tests
C) PBT support deferred to UOW-08 entirely
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
Logical component boundaries는 어떻게 나누는 것이 좋을까요?

A) Config, detector, masking, token vault, policy gate, audit builder, access hook, rule-pack registry, PBT support modules
B) One `SecurityService` module containing all logic
C) Split only by provider type
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated artifacts will use Markdown tables and textual relationships.
