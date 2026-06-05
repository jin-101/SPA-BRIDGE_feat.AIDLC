# NFR Design Plan - UOW-03 Angular Source Analysis

## Unit Context

- **Unit**: UOW-03 Angular Source Analysis
- **Primary Package**: `packages/source-angular`
- **NFR Requirements Status**: Complete
- **Key NFRs**: TypeScript Compiler API, Angular compiler parser, exact-pinned parser dependencies, 30-second target for 100+ components, 500+ component benchmark, bounded memory, stable IDs/order, strict path containment, safe diagnostics, blocking PBT for inventory/classification/graph/diagnostics.

## Purpose

Translate UOW-03 NFR requirements into concrete design patterns and logical components for safe, deterministic, scalable Angular source analysis.

## Checklist

- [x] Load UOW-03 NFR requirements artifacts.
- [x] Identify NFR design decision areas.
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

- **Pipeline**: Staged pipeline with path guard, workspace profile, inventory, parser adapters, graph builder, diagnostics, and artifact mapper.
- **Parser Adapters**: Separate `TypeScriptParserAdapter` and `AngularTemplateParserAdapter` integrated through common `Result` and diagnostic contracts.
- **Bounded Memory**: File-at-a-time parsing with compact source summaries; raw source and AST live only while needed.
- **Stable IDs**: Normalized relative path plus symbol/template/edge kind plus deterministic ordinal.
- **Graph Assembly**: `GraphBuilder` uses normalized node/edge collectors and sorts/validates during finalize.
- **Diagnostic Privacy**: `SafeDiagnosticBuilder` permits only source refs, codes, tags, and safe messages; raw snippets are blocked.
- **Partial Result**: `AnalysisResult` state machine with `failed`, `partial`, and `succeeded` statuses plus severity-based blocking diagnostics.
- **Benchmarking**: Synthetic fixture generator for 100+ and 500+ component projects plus recorded benchmark instructions.
- **PBT Organization**: Dedicated generators for inventories, classified records, graph nodes/edges, diagnostics, and parser summaries.
- **Component Boundaries**: `PathGuard`, `WorkspaceProfiler`, `SourceInventoryBuilder`, TypeScript parser, template parser, route analyzer, graph builder, diagnostic builder, artifact mapper.

## Draft NFR Design Focus

- Safe source scanning pipeline.
- Parser adapter isolation for TypeScript and Angular templates.
- Bounded source model and graph construction.
- Stable ID and deterministic ordering strategy.
- Safe diagnostic builder.
- Fatal/partial result state handling.
- PBT generator and model organization.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
source analysis pipeline pattern은 어떻게 구성할까요?

A) Staged pipeline: path guard, workspace profile, inventory, parser adapters, graph builder, diagnostics, artifact mapper
B) Single analyzer service가 모든 단계를 순차 처리
C) Parser 중심으로 시작하고 graph/diagnostics는 후속 단계에서 확장
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
parser adapter design은 어떻게 둘까요?

A) TypeScriptParserAdapter와 AngularTemplateParserAdapter를 분리하고 공통 Result/diagnostic contract로 통합
B) 하나의 AngularParserAdapter가 TypeScript와 template을 모두 처리
C) parser adapter 없이 analyzer 내부 private functions로 구현
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
bounded memory pattern은 어떻게 적용할까요?

A) File-at-a-time parsing plus compact source summaries; raw source/AST는 필요한 동안만 유지
B) 전체 raw source와 AST를 캐시해서 후속 단계가 재사용
C) 작은 프로젝트는 전체 캐시, 큰 프로젝트는 fallback 처리
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
stable ID strategy는 어떻게 설계할까요?

A) normalized relative path + symbol/template/edge kind + deterministic ordinal 기반 stable ID
B) UUID/random ID를 생성하고 manifest에 저장
C) parser가 제공하는 위치 정보만 ID로 사용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
dependency graph assembly pattern은 어떻게 둘까요?

A) GraphBuilder가 normalized node/edge collector를 사용하고 finalize 단계에서 정렬/검증
B) parser 단계마다 graph에 직접 append하고 마지막에 그대로 반환
C) graph는 report 단계에서 inventory를 다시 읽어 생성
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
diagnostic privacy pattern은 어떻게 구성할까요?

A) SafeDiagnosticBuilder가 source refs, codes, tags, safe messages만 허용하고 raw snippets를 차단
B) 각 parser가 직접 diagnostic object를 생성
C) raw parser errors를 그대로 diagnostic message로 사용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
failure/partial result pattern은 어떻게 설계할까요?

A) AnalysisResult state machine with failed, partial, succeeded statuses and severity-based blocking diagnostics
B) boolean success/failure와 diagnostic list만 사용
C) 예외를 던지고 UOW-02에서 상태를 해석
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
performance benchmark design은 어떻게 둘까요?

A) Synthetic fixture generator for 100+ and 500+ component projects plus recorded benchmark instructions
B) 실제 외부 sample project만 benchmark에 사용
C) benchmark는 Build/Test 문서에서만 설명하고 design에는 포함하지 않음
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
PBT generator/model organization은 어떻게 둘까요?

A) Dedicated test generators for file inventories, classified records, graph nodes/edges, diagnostics, and parser summaries
B) 각 test file 안에서 필요한 generator를 직접 작성
C) PBT는 graph builder에만 적용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
logical component boundaries는 어느 수준으로 나눌까요?

A) PathGuard, WorkspaceProfiler, SourceInventoryBuilder, TS Parser, Template Parser, Route Analyzer, GraphBuilder, DiagnosticBuilder, ArtifactMapper
B) Scanner, Parser, Graph 세 개의 큰 컴포넌트만 둠
C) 단일 SourceAngularService만 두고 내부 구현은 숨김
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated NFR design artifacts will use Markdown tables and text sections.
