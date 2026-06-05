# NFR Design Plan - UOW-04 Angular-to-React Transformation

## Unit Context

- **Unit**: UOW-04 Angular-to-React Transformation
- **Primary Package**: `packages/transform-angular-react`
- **NFR Requirements Status**: Complete
- **Primary Stories**: US-005, US-006
- **Supporting Stories**: US-002, US-007, US-011, US-012, US-014

## Purpose

Translate UOW-04 NFR requirements into concrete design patterns and logical components for deterministic, provider-neutral, scalable, and review-safe Angular-to-React transformation.

## Checklist

- [x] Load UOW-04 NFR requirements artifacts.
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

- **Rule Registry**: In-package deterministic registry and execution planner.
- **Invalid Registry Handling**: Validation phase blocks duplicate rules, dangling dependencies, cycles, and conflicts.
- **Pipeline Structure**: Validate, normalize context, plan rules, execute phases, validate drafts, finalize.
- **Memory/Scalability**: Entity-scoped execution with compact draft/trace builders and no raw source text retention.
- **Draft Validation**: Schema-first validator, trace coverage validator, and deterministic ordering validator at finalize.
- **Manual Review**: `SafeReviewDiagnosticBuilder` creates review items and diagnostics from safe refs and rule metadata.
- **AI Handoff**: `ProviderNeutralMappingRequestBuilder` emits safe metadata only.
- **Observability**: `PassSummaryCollector` emits safe structured counts and coverage summaries.
- **PBT Design**: Dedicated test support layer for registry/context/draft/diagnostic generators and invalid-registry model tests.
- **Logical Boundaries**: Split registry, planner, pipeline, context, converters, builders, validators, diagnostics, handoff, summary, and test support.

## Draft Design Focus

- Deterministic rule registry and execution planner pattern.
- Phase-based conversion pipeline with fail-fast registry validation.
- Bounded draft/trace builder pattern.
- Schema-first draft validation and trace coverage gate.
- Safe manual-review diagnostic builder.
- Provider-neutral difficult mapping handoff metadata.
- PBT model/generator design for rule ordering, idempotence, draft ordering, trace coverage, and unsupported mapping preservation.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
Rule registry design pattern은 어떻게 잡을까요?

A) In-package deterministic registry + execution planner로 phase/dependency/priority/ruleId ordering을 직접 구현
B) 외부 rule-engine library를 도입해 registry와 ordering을 위임
C) 단순 array 등록 순서 기반으로 rule을 실행
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
Rule conflict와 invalid registry 처리는 어떤 패턴이 적절할까요?

A) Registry validation phase에서 duplicate, dangling dependency, cycle, conflict를 fail-fast로 차단
B) Conflict를 warning으로 남기고 가능한 rule만 실행
C) Conflict 처리를 구현하지 않고 rule 작성자 책임으로 둠
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
Conversion pipeline 구조는 어떻게 설계할까요?

A) Validate -> Normalize Context -> Plan Rules -> Execute Phases -> Validate Drafts -> Finalize 순서의 staged pipeline
B) Source entity별로 즉시 변환하고 마지막에만 정렬
C) 하나의 converter function이 모든 변환 단계를 처리
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
Bounded memory와 scalability 패턴은 어떻게 적용할까요?

A) Entity-scoped rule execution과 compact draft/trace builders를 사용하고 raw source text를 보관하지 않음
B) 모든 intermediate entity와 generated code text를 메모리에 보관해 디버깅 편의 우선
C) 성능/메모리 패턴은 Code Generation에서 결정
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
Draft validation pattern은 어떻게 설계할까요?

A) Schema-first draft validator + trace coverage validator + deterministic ordering validator를 finalize gate로 둠
B) Schema validator만 두고 trace/order 검증은 reporting 단계에서 처리
C) UOW-07 target generation에서만 validation 수행
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
Manual-review diagnostic pattern은 어떻게 설계할까요?

A) SafeReviewDiagnosticBuilder가 ruleId/sourceRef/generatedRef/category 중심으로 review item과 diagnostic을 생성
B) 각 rule이 자유 형식 diagnostic message를 직접 생성
C) manual-review item 없이 warning diagnostic만 생성
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
AI-assisted difficult mapping handoff component는 어떻게 둘까요?

A) ProviderNeutralMappingRequestBuilder가 safe metadata만 만들고 provider invocation은 외부 port/policy로 넘김
B) Transformation pipeline 안에서 local provider adapter를 직접 호출
C) Transformation pipeline 안에서 external provider adapter까지 직접 호출
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
Observability component는 어떤 형태가 적절할까요?

A) PassSummaryCollector가 rule counts, diagnostic counts, review counts, trace coverage를 safe structured summary로 수집
B) console log 중심으로 상세 execution log를 남김
C) observability는 reporting unit에 전부 위임
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
PBT design pattern은 어떻게 구성할까요?

A) Registry/context/draft/diagnostic generators와 model-based invalid-registry tests를 전용 test support layer로 분리
B) rule ordering generator만 만들고 나머지는 example-based로 처리
C) UOW-04에서는 PBT generator를 만들지 않음
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
Logical component boundary는 어떻게 나누는 것이 좋을까요?

A) RuleRegistry, ExecutionPlanner, TransformationPipeline, ContextNormalizer, converter modules, DraftBuilder, TraceBuilder, DraftValidator, ReviewDiagnosticBuilder, MappingRequestBuilder, SummaryCollector로 분리
B) Registry, Pipeline, Converter 세 컴포넌트만 둠
C) 단일 TransformationService만 두고 내부 private 함수로 처리
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated artifacts will use Markdown tables and textual relationships.
