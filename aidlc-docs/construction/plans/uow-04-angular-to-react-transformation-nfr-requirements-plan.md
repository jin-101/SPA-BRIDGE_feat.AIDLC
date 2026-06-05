# NFR Requirements Plan - UOW-04 Angular-to-React Transformation

## Unit Context

- **Unit**: UOW-04 Angular-to-React Transformation
- **Primary Package**: `packages/transform-angular-react`
- **Functional Design Status**: Complete
- **Primary Stories**: US-005, US-006
- **Supporting Stories**: US-002, US-007, US-011, US-012, US-014
- **Key Responsibilities**: Rule registry, ordered conversion pipeline, React target drafts, manual-review diagnostics, traceability, component/template/service/DI/routing/state converters.

## Purpose

Define non-functional requirements and technology decisions for deterministic Angular-to-React transformation, with emphasis on rule registry reliability, conversion scalability, safe diagnostics, traceability, draft validation, and property-based testability.

## Checklist

- [x] Load UOW-04 functional design artifacts.
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

- **Runtime Dependencies**: Minimize runtime dependencies beyond UOW-01/core contracts and validation/test stack.
- **Rule Determinism**: Phase, dependency, priority, and ruleId stable ordering with fail-fast conflict handling are blocking requirements.
- **Performance**: 100+ component conversion should typically complete in 30 seconds or less; 500+ component conversion requires benchmark coverage.
- **Memory/Scalability**: Use bounded draft/trace models and do not retain raw source text.
- **Draft Validation**: All target drafts must pass schema validation, trace coverage, and deterministic ordering checks.
- **Diagnostics Privacy**: Diagnostics use safe refs, rule IDs, stable codes, and must not contain raw snippets.
- **Error Tolerance**: Invalid request/registry fails fast; per-entity uncertain mappings produce partial drafts with manual-review diagnostics.
- **PBT Scope**: Rule ordering, conversion idempotence, draft ordering, trace coverage, and unsupported mapping preservation are blocking PBT requirements.
- **AI Handoff**: UOW-04 creates provider-neutral request metadata only; actual provider calls remain behind UOW-06/UOW-05 policy.
- **Observability**: Pass summaries, rule execution counts, diagnostic counts, review-item counts, and trace coverage summaries are safe structured outputs.

## Draft NFR Focus

- Minimal runtime dependency policy for the transformation package.
- Deterministic rule ordering, conflict detection, and draft ordering.
- Performance targets for 100+ and 500+ component transformations.
- Bounded memory behavior for draft and trace generation.
- Safe diagnostics and no source/runtime code execution.
- Draft schema validation and trace coverage requirements.
- PBT and example-based test obligations for conversion-sensitive behavior.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
Runtime dependency policy는 어떻게 둘까요?

A) UOW-01/core contracts와 validation/test stack 외에는 runtime dependency를 최소화
B) AST, graph, rule-engine utility 등 경량 dependency를 폭넓게 허용
C) 구현 편의를 위해 변환 엔진 전용 framework/library를 도입
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
Rule registry determinism 요구사항은 어느 수준까지 필요할까요?

A) Phase, dependency, priority, ruleId 기준 stable ordering과 conflict fail-fast를 blocking requirement로 지정
B) Priority 기준 정렬만 보장하고 conflict는 warning으로 처리
C) Rule 등록 순서를 그대로 사용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
Transformation performance 목표는 어떻게 둘까요?

A) 100+ component conversion은 일반적으로 30초 이하, 500+ component는 benchmark 대상으로 정의
B) 100+ component conversion은 일반적으로 60초 이하
C) 성능 목표 없이 정확성만 우선
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
Memory/scalability 요구사항은 어느 수준으로 둘까요?

A) 500+ component에서도 bounded draft/trace model과 source text 비보관 원칙 적용
B) 모든 intermediate draft와 원본 소스 text를 메모리에 유지
C) 초기 릴리즈에서는 100 components 초과 시 unsupported 처리
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
Draft validation quality gate는 어떻게 정의할까요?

A) 모든 target draft는 schema validation, trace coverage, deterministic ordering을 통과해야 함
B) schema validation만 수행하고 trace coverage는 report 단계에서 확인
C) validation은 UOW-07 React generation에서만 수행
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
Manual-review diagnostics privacy 요구사항은 어떻게 둘까요?

A) safe source refs, generated refs, rule IDs, stable diagnostic codes 중심으로 기록하고 raw snippets 금지
B) 짧은 Angular/React code snippet은 diagnostics에 포함 허용
C) privacy는 UOW-05 masking에서만 처리하고 UOW-04는 원문 기록 허용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
Error tolerance와 partial result 정책은 어떻게 둘까요?

A) Invalid request/registry는 fail-fast, per-entity uncertain mapping은 partial draft + manual-review diagnostic
B) 모든 unsupported mapping은 전체 변환 실패로 처리
C) 모든 unsupported mapping은 warning으로만 처리하고 draft는 무조건 생성
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
PBT coverage는 어디까지 blocking requirement로 둘까요?

A) rule ordering, conversion idempotence, draft ordering, trace coverage, unsupported mapping preservation을 blocking PBT로 지정
B) rule ordering만 blocking PBT로 지정
C) UOW-04는 example-based tests만 blocking으로 지정
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
AI-assisted difficult mapping handoff는 NFR 관점에서 어떻게 제한할까요?

A) UOW-04는 provider-neutral request metadata만 생성하고 provider call은 UOW-06/UOW-05 policy 뒤로 제한
B) UOW-04에서 직접 local provider를 호출할 수 있게 허용
C) UOW-04에서 외부 provider까지 직접 호출 허용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
Observability/audit evidence는 어느 수준으로 필요할까요?

A) Pass summary, rule execution counts, diagnostic counts, review-item counts, trace coverage summary를 safe structured output으로 제공
B) 성공/실패 status만 제공
C) 상세 rule execution log에 원본 source evidence를 포함
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated artifacts will use Markdown tables and textual relationships.
