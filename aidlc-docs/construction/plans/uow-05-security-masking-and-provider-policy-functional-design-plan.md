# Functional Design Plan - UOW-05 Security, Masking, and Provider Policy

## Unit Context

- **Unit**: UOW-05 Security, Masking, and Provider Policy
- **Primary Package(s)**: `packages/core-security`, policy area in `packages/core-application`
- **Primary Owner Role**: Security Reviewer
- **Reviewer Roles**: Architect, Migration Engineer
- **Primary Stories**: US-009, US-010
- **Supporting Stories**: US-001, US-003, US-006, US-007, US-011, US-013, US-014
- **Prerequisites**: UOW-01 core contracts, UOW-02 orchestration, and UOW-04 transformation artifacts are available.

## Purpose

Design the security, masking, provider-policy, and audit-safe business logic that protects sensitive values before any provider interaction and preserves recoverable evidence for compliant review workflows.

## Checklist

- [x] Load unit definition.
- [x] Load story map and dependencies.
- [x] Confirm Functional Design is required for this unit.
- [x] Create functional design plan with questions.
- [x] Wait for user answers to all `[Answer]:` tags.
- [x] Validate answers for completeness, contradictions, and ambiguity.
- [x] Resolve follow-up questions if needed.
- [x] Generate `business-logic-model.md`.
- [x] Generate `business-rules.md`.
- [x] Generate `domain-entities.md`.
- [x] Generate security-safe review model artifacts where needed.
- [x] Present Functional Design completion message for review.

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved Functional Design Focus

- **Detection Scope**: Source inputs, provider prompts, generated artifacts, logs, and reports.
- **Masking Model**: Hybrid model with irreversible redaction for exports and reversible tokens only in controlled in-memory flows.
- **Provider Policy**: Enforce policy before every provider call, including local/internal providers.
- **Audit Evidence**: Structured safe summaries with safe references, policy decisions, and redaction-safe identifiers.
- **Access-Control Hooks**: Review-mode and policy-evaluation hooks for later CLI/Web UI enforcement.
- **Restoration Boundary**: Restoration only in controlled in-memory flows with audit evidence.
- **Fail-Closed Behavior**: Unclear sensitive content or unclear policy blocks automatic processing.
- **Package Scope**: Dedicated `core-security` package with policy coordination in `core-application`.
- **PBT Focus**: Masking round-trip, policy fail-closed behavior, audit redaction, and restoration invariants.
- **First Target Coverage**: Target-app-aware rule pack layered on the generic security core.

## Draft Functional Design Focus

- Sensitive value detection and classification.
- Masking, tokenization, and reversible restoration boundaries.
- Provider-policy evaluation before any local or external provider call.
- Structured audit and review evidence with redaction-safe outputs.
- Access-control hooks for later review workflows.
- Safe handoff between security policy, application orchestration, and provider adapters.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
Sensitive data detection should cover which scope first?

A) Source inputs, provider prompts, generated artifacts, logs, and reports
B) Source inputs and provider prompts only
C) Logs and reports only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should masking behave for sensitive values?

A) Use a hybrid model with irreversible redaction for exported artifacts and reversible tokens only in secure in-memory flows
B) Use irreversible redaction only and never restore values
C) Use reversible tokenization everywhere for maximum recoverability
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
When should provider policy be enforced?

A) Before every provider call, regardless of provider type
B) Only before external provider calls
C) Only when sensitive data is detected in the current request
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
How detailed should security audit evidence be?

A) Structured summaries with safe references, policy decisions, and redaction-safe identifiers
B) Minimal status-only audit entries
C) Full detailed evidence including masked content excerpts
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
What access-control hooks should UOW-05 provide?

A) Review-mode and policy-evaluation hooks for later CLI/Web UI enforcement
B) No access-control hooks in this unit
C) Full authentication and authorization implementation in this unit
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should restoration of masked values be handled?

A) Allow restoration only in controlled in-memory flows with audit evidence
B) Never allow restoration after masking
C) Allow restoration anywhere the caller requests it
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
What should happen when sensitive content is encountered but policy is unclear?

A) Fail closed and require manual review or explicit policy clarification
B) Proceed with best-effort masking and continue automatically
C) Ignore the unclear condition and continue
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
What package scope is most appropriate for this unit?

A) A dedicated `core-security` package with policy coordination in `core-application`
B) Security utilities embedded only inside `core-application`
C) A separate adapter package with no shared core security library
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
What property-based test focus best fits this unit?

A) Masking round-trip, policy fail-closed behavior, audit redaction, and restoration invariants
B) Only example-based unit tests
C) UI interaction properties
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
How should first-target-app-specific sensitive patterns be handled?

A) Add a target-app-aware rule pack on top of the generic security core so known library-driven patterns get explicit review paths
B) Keep the unit generic and avoid target-app-aware rules
C) Handle only target-app-specific rules and skip the generic core patterns
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated artifacts will use Markdown tables and textual relationships.
