# Functional Design Plan - UOW-01 Core Model and Ports Foundation

## Unit Context

- **Unit**: UOW-01 Core Model and Ports Foundation
- **Primary Package**: `packages/core-model`
- **Primary Owner Role**: Architect
- **Reviewer Roles**: Migration Engineer, Application Developer, Security Reviewer
- **Primary Stories**: US-004, US-014
- **Supporting Stories**: US-003, US-009, US-012, US-013

## Purpose

Define detailed functional behavior for shared contracts: Angular source model boundaries, framework-neutral IR, diagnostics, traceability, report schema, quality result models, masking token types, and core ports.

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
- [x] Validate PBT property candidates for UOW-01.
- [x] Present Functional Design completion message for review.

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved Functional Design Choices

- **Core IR Scope**: Comprehensive IR with component, template, route, service, state, dependency, and traceability.
- **Source Model Relationship**: Angular Source Model remains separate; normalizer converts it to Core IR.
- **Traceability Granularity**: File, symbol, template binding, and generated artifact segment level.
- **Diagnostics**: `info`, `warning`, `error`, `manual-review`, `security-blocker`.
- **Report Schema**: Run summary, files, diagnostics, quality results, traceability, AI decisions, masking/security events, and manual review state.
- **Core Ports**: File/artifact, tool runner, LLM provider, report exporter, logger/audit, clock/randomness.
- **Serialization**: JSON plus schema validation for all persisted artifacts.
- **Masking Model**: Core Model defines token types/maps; masking logic remains in `core-security`.
- **PBT Scope**: Serialization round-trips, traceability/diagnostic invariants, idempotent normalization, schema validation properties.
- **Versioning**: Schema version fields in IR, report, manifest, and traceability artifacts.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
Core IR의 설계 범위는 어디까지로 둘까요?

A) Component, template, route, service, state, dependency, traceability를 포함하는 comprehensive IR
B) Component, template, route 중심의 MVP IR
C) Parser output에 가까운 lightweight IR
D) Strong framework-neutral IR with explicit source/target extension slots
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
Angular Source Model과 Core IR 사이의 관계는 어떻게 정의할까요?

A) Angular Source Model은 별도 모델이고, normalizer가 Core IR로 변환
B) Angular Source Model이 Core IR을 확장
C) Core IR 안에 Angular-specific metadata를 optional extension으로 저장
D) 초기에는 하나의 모델로 시작하고 later split
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
traceability granularity는 어느 수준이 필요할까요?

A) File-level only
B) File and symbol-level
C) File, symbol, template binding, generated artifact segment-level
D) Full AST node-level traceability
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 4
diagnostic severity model은 어떻게 구성할까요?

A) info, warning, error only
B) info, warning, error, manual-review
C) info, warning, error, manual-review, security-blocker
D) Numeric severity with tags
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 5
canonical report schema에 포함할 최소 데이터는 무엇인가요?

A) Run summary, converted files, diagnostics, quality results
B) A plus traceability map and AI-assisted decisions
C) B plus masking/security events and manual review workflow state
D) C plus performance timings and dependency graph summaries
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 6
core ports는 어느 수준까지 UOW-01에서 정의할까요?

A) File system and artifact storage ports only
B) A plus tool runner and LLM provider ports
C) B plus report exporter, logger/audit, and clock/randomness ports
D) Define only domain-facing interfaces; concrete ports later
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 7
serialization requirements는 어떻게 둘까요?

A) JSON serialization for IR and report only
B) JSON serialization for IR, report, diagnostics, run manifest, and traceability
C) JSON plus schema validation for all persisted artifacts
D) In-memory types first, serialization later
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 8
masking token model은 Core Model에 어떻게 포함할까요?

A) Core Model defines token types and maps; masking logic remains in core-security
B) Masking token model is entirely in core-security
C) Core Model stores only opaque references
D) Include full masking policy model in Core Model
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
PBT property candidates for UOW-01은 어느 범위까지 명시할까요?

A) IR/report serialization round-trip only
B) A plus traceability and diagnostic invariants
C) B plus idempotent normalization and schema validation properties
D) Defer all PBT property identification to Code Generation
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 10
versioning strategy for core schemas는 어떻게 둘까요?

A) Include schema version fields in IR, report, manifest, and traceability artifacts
B) Version only report and manifest
C) Use package version only
D) Defer versioning until post-MVP
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated artifacts will use Markdown tables and textual relationships.
