# NFR Requirements Plan - UOW-05 Security, Masking, and Provider Policy

## Unit Context

- **Unit**: UOW-05 Security, Masking, and Provider Policy
- **Primary Package(s)**: `packages/core-security`, policy area in `packages/core-application`
- **Functional Design Status**: Complete
- **Primary Stories**: US-009, US-010
- **Supporting Stories**: US-001, US-003, US-006, US-007, US-011, US-013, US-014
- **Key Responsibilities**: Sensitive data detection, masking, reversible in-memory tokenization, provider policy enforcement, safe audit evidence, access-control hooks, target-aware security rule packs.

## Purpose

Define non-functional requirements and technology decisions for fail-closed security policy, safe masking, audit-safe evidence, bounded token handling, deterministic detection, and property-based testability.

## Checklist

- [x] Load UOW-05 functional design artifacts.
- [x] Identify NFR requirement areas.
- [x] Create NFR requirements plan with questions.
- [x] Wait for user answers to all `[Answer]:` tags.
- [x] Validate answers for completeness, contradictions, and ambiguity.
- [x] Resolve follow-up questions if needed.
- [x] Generate `nfr-requirements.md`.
- [x] Generate `tech-stack-decisions.md`.
- [x] Validate Security Baseline compliance.
- [x] Validate PBT compliance.
- [x] Present NFR Requirements completion message for review.

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved NFR Requirements Choices

- **Runtime Dependencies**: Prefer UOW-01 validation stack and Node built-ins; any additional runtime dependency requires security review and exact version pinning.
- **Detection Performance**: 100+ component security evaluation should typically complete in 10 seconds or less; 500+ component projects require benchmark coverage.
- **Token Vault Lifecycle**: In-memory only, run/correlation scoped, explicit TTL, no persistence, no raw value logging.
- **Policy Reliability**: Missing, unknown, or contradictory policy state is a blocking fail-closed condition.
- **Audit Privacy**: Audit/log/report evidence permits safe refs, counts, and reason codes only; masked excerpts are forbidden by default.
- **Rule Pack Integrity**: Target-aware rule packs require ID, version, precedence, schema validation, and cannot downgrade generic security rules.
- **External Provider Gate**: External provider use requires explicit enablement, enterprise opt-out config, masking satisfied, and audit event creation.
- **PBT Scope**: Masking round-trip, redaction invariant, policy fail-closed, audit privacy, token lifecycle stateful model, and rule-pack idempotence are blocking PBT requirements.
- **Config Validation**: Schema-first config validation with safe defaults, explicit external-provider opt-in, and deterministic config merge.
- **Access-Control Hooks**: Deterministic, deny-by-default, render-safe, reusable by CLI/Web UI.

## Draft NFR Focus

- Runtime dependency policy for detection, hashing, and validation.
- Detection and masking performance targets for large Angular projects.
- Token vault scope, lifecycle, memory bounds, and persistence prohibition.
- Fail-closed provider policy reliability.
- Audit redaction and structured evidence requirements.
- Target-aware rule pack integrity and precedence.
- PBT requirements for round-trip, invariants, idempotence, and stateful flows.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
Runtime dependency policy는 어떻게 둘까요?

A) UOW-01 validation stack과 Node built-ins를 우선 사용하고, 추가 runtime dependency는 보안 검토 후 정확 버전으로만 허용
B) detection/hash/token 관련 경량 dependency를 폭넓게 허용
C) 외부 DLP/security SDK를 초기 구현의 필수 dependency로 도입
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
Sensitive detection 성능 목표는 어떻게 둘까요?

A) 100+ component 프로젝트의 security evaluation은 일반적으로 10초 이하, 500+ component는 benchmark 대상으로 정의
B) 100+ component 프로젝트의 security evaluation은 일반적으로 30초 이하
C) 성능 목표 없이 탐지 정확성만 우선
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
Token vault lifecycle은 어떻게 제한할까요?

A) In-memory only, run/correlation scope, explicit TTL, no persistence, no raw value logging
B) File-based encrypted token vault로 resume 후에도 복원 가능하게 유지
C) Token lifecycle은 caller가 관리
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
Policy evaluation reliability는 어느 수준이 필요할까요?

A) Missing/unknown/contradictory policy state는 모두 fail-closed blocking requirement
B) External provider만 fail-closed, local provider는 warning으로 진행
C) Policy uncertainty는 manual-review warning만 남기고 진행
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
Audit/log privacy 요구사항은 어떻게 둘까요?

A) Audit/log/report evidence에는 safe refs, counts, reason codes만 허용하고 masked excerpt도 기본 금지
B) Masked excerpt는 audit evidence에 허용
C) Debug mode에서는 raw excerpt를 허용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
Target-aware rule pack integrity는 어떻게 보장할까요?

A) Rule pack ID/version/precedence/schema validation과 generic rule downgrade 금지를 blocking requirement로 지정
B) Rule pack ID만 있으면 허용
C) Target-aware rule pack은 코드 내부 상수로만 두고 검증하지 않음
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
External provider readiness gate는 어떻게 정의할까요?

A) External provider는 explicit enablement, enterprise opt-out config, masking satisfied, audit event created 조건이 모두 충족되어야 허용
B) Masking만 성공하면 external provider 허용
C) Provider adapter가 자체 판단
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
PBT coverage는 어디까지 blocking requirement로 둘까요?

A) masking round-trip, redaction invariant, policy fail-closed, audit privacy, token lifecycle stateful model, rule-pack idempotence를 blocking PBT로 지정
B) masking round-trip만 blocking PBT로 지정
C) UOW-05는 example-based tests만 blocking으로 지정
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
Security configuration validation은 어느 수준으로 둘까요?

A) Schema-first config validation with safe defaults, explicit external-provider opt-in, and deterministic config merge
B) Minimal config validation with runtime warnings
C) Caller-supplied config를 신뢰
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
Access-control hook NFR은 어떻게 정의할까요?

A) Hook outputs must be deterministic, deny-by-default, render-safe, and reusable by CLI/Web UI
B) Hook outputs only need a boolean allow/deny
C) Access-control hooks are deferred entirely to Web UI
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated artifacts will use Markdown tables and textual relationships.
