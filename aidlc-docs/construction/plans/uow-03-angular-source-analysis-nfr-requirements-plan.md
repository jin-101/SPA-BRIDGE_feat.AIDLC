# NFR Requirements Plan - UOW-03 Angular Source Analysis

## Unit Context

- **Unit**: UOW-03 Angular Source Analysis
- **Primary Package**: `packages/source-angular`
- **Functional Design Status**: Complete
- **Primary Stories**: US-003
- **Supporting Stories**: US-004, US-005, US-006, US-012
- **Key Responsibilities**: Angular application discovery, scoped source inventory, TypeScript/decorator/template/style/route analysis, dependency graph assembly, diagnostics, and source model handoff.

## Purpose

Define non-functional requirements and technology decisions for Angular source analysis, with emphasis on safe local file analysis, deterministic parser output, bounded scan scope, graph scalability, diagnostics safety, and property-based testability.

## Checklist

- [x] Load UOW-03 functional design artifacts.
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

- **TypeScript Parser**: TypeScript Compiler API is the primary TypeScript parser.
- **Template Parser**: Angular compiler parser is used to extract template ASTs.
- **Runtime Dependencies**: Only TypeScript and Angular compiler parser dependencies are allowed, and all must be exact-pinned.
- **Performance**: 100+ component project scans should typically complete in 30 seconds or less; 500+ component projects require benchmark coverage.
- **Memory/Scalability**: Use bounded in-memory models and streaming-friendly file reads for 500+ component projects.
- **Determinism**: Inventory, graph nodes/edges, diagnostics, and artifact refs require stable ordering and stable IDs.
- **Path Safety**: Enforce workspace/source root containment, traversal blocking, and explicit external refs only.
- **Diagnostic Privacy**: Diagnostics record safe path/ref/code data; raw source snippets are forbidden by default.
- **PBT Scope**: Inventory determinism, classification idempotence, graph invariants, and diagnostic stability are blocking PBT requirements.
- **Error Tolerance**: Fatal workspace/config errors fail; per-file parse errors produce partial results with severity-based diagnostics.

## Draft NFR Focus

- Parser dependency choices for TypeScript and Angular templates.
- Scan scope and path containment.
- Performance targets for 100+ and 500+ component projects.
- Memory limits and graph scaling expectations.
- Deterministic artifact ordering and stable identifiers.
- Safe diagnostics and no source execution.
- PBT and example-based test obligations.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
TypeScript parsing tech stack은 어떻게 선택할까요?

A) TypeScript Compiler API를 primary parser로 사용
B) Babel parser를 primary parser로 사용
C) ts-morph 같은 wrapper library를 primary parser로 사용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
Angular template parsing은 어떤 방식으로 구현하는 것이 적절할까요?

A) Angular compiler parser를 사용해 template AST를 추출
B) HTML parser와 Angular binding heuristic을 조합
C) 초기에는 template raw text와 external ref만 수집
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
runtime dependency policy는 어떻게 둘까요?

A) TypeScript와 Angular compiler 관련 parser dependency만 정확 버전으로 허용
B) parser, glob, graph utility 등 경량 dependency를 폭넓게 허용
C) UOW-01 외 runtime dependency 없이 구현
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
source scan 성능 목표는 어떻게 둘까요?

A) 100+ component project scan은 일반적으로 30초 이하, 500+ component project는 benchmark 대상으로 정의
B) 100+ component project scan은 일반적으로 60초 이하
C) 성능 목표는 아직 두지 않고 정확성만 우선
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
memory/scalability 요구사항은 어느 수준으로 둘까요?

A) 500+ component project에서도 bounded in-memory model과 streaming-friendly file reads를 지향
B) 전체 source text와 AST를 모두 메모리에 유지해 구현 단순성을 우선
C) 프로젝트 크기 제한을 100 components로 두고 초과 시 경고
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
determinism 요구사항은 어느 수준까지 필요할까요?

A) Inventory, graph nodes/edges, diagnostics, artifact refs 모두 stable ordering과 stable IDs 적용
B) graph만 stable ordering을 보장하고 diagnostics는 발생 순서 유지
C) determinism은 report 단계에서 정렬해 처리
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
path safety와 scan scope는 어느 수준으로 강제할까요?

A) workspace/source root containment, traversal 차단, explicit external refs만 허용
B) source root containment만 적용하고 외부 참조는 경고 후 허용
C) caller가 넘긴 path를 신뢰
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
diagnostic privacy 요구사항은 어떻게 둘까요?

A) diagnostics에는 safe path/ref/code 중심으로 기록하고 raw source snippet은 기본 금지
B) 짧은 raw source snippet은 diagnostics에 포함 허용
C) privacy는 masking unit에서만 처리하고 analyzer는 원문을 기록
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
PBT coverage는 어디까지 blocking requirement로 둘까요?

A) inventory determinism, classification idempotence, graph invariants, diagnostic stability를 blocking PBT로 지정
B) graph invariants만 blocking PBT로 지정
C) UOW-03은 example-based tests만 blocking으로 지정
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
analysis error tolerance와 output quality gate는 어떻게 정의할까요?

A) Fatal workspace/config errors fail; per-file parse errors produce partial result with blocking/non-blocking diagnostics by severity
B) 모든 parse error는 전체 분석 실패로 처리
C) 모든 parse error는 warning으로 처리하고 downstream에서 판단
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated artifacts will use Markdown tables and textual relationships.
