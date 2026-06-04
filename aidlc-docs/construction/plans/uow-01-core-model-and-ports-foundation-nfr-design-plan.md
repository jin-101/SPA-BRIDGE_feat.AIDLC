# NFR Design Plan - UOW-01 Core Model and Ports Foundation

## Unit Context

- **Unit**: UOW-01 Core Model and Ports Foundation
- **Package**: `packages/core-model`
- **NFR Requirements Status**: Complete

## Purpose

Convert UOW-01 NFR requirements into concrete design patterns and logical components for validation, serialization, schema migration, redaction-safe models, Result-based ports, performance guardrails, and PBT support.

## Checklist

- [x] Load NFR requirements artifacts.
- [x] Identify NFR design decisions.
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

- **Zod/TypeScript Pattern**: Schema-first.
- **Result Shape**: Minimal discriminated union.
- **Migration Pattern**: Versioned migration registry per artifact type.
- **Redaction Model**: Branded types.
- **Traceability Performance**: Canonical JSON plus derived in-memory indexes.
- **Validation Guardrail**: Boundary validation plus benchmark fixture suite.
- **PBT Generators**: Exported domain generators for downstream reuse.
- **Organization**: Separate `src/ir`, `src/report`, `src/ports`, `src/validation`, `src/migration` directories.
- **Logical Components**: Artifact-specific components and cross-cutting utilities.
- **Benchmark Fixtures**: 500 components typical, 1000 components stress.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
Zod schema와 TypeScript type 정의는 어떤 패턴으로 구성할까요?

A) Schema-first: Zod schemas define types via inference
B) Type-first: TypeScript interfaces plus matching Zod schemas
C) Hybrid: schemas for persisted artifacts, interfaces for in-memory helper types
D) Defer exact organization to Code Generation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
Result type은 어떤 shape로 설계할까요?

A) Minimal discriminated union: `{ ok: true, value } | { ok: false, error }`
B) Rich Result helpers with map/flatMap utilities
C) Use a small external Result library
D) Domain-specific result types per port
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
schema migration design은 어떤 패턴이 적절할까요?

A) Versioned migration registry per artifact type
B) Inline migration functions next to each schema
C) Central migration pipeline for all artifacts
D) MVP stores version but only implements current version validation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
redaction-safe string model은 어떻게 설계할까요?

A) Branded types: `RedactedString`, `SafeDisplayString`
B) Wrapper objects with value and redaction metadata
C) Plain strings plus validation rules
D) Separate report-safe DTOs only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
large traceability map performance pattern은 어떻게 둘까요?

A) Plain arrays with validation; optimize later if needed
B) Indexed collections by source/IR/generated refs
C) Chunked traceability artifacts required from start
D) Hybrid: plain canonical JSON plus derived indexes in memory
X) Other (please describe after [Answer]: tag below)

[Answer]: D

### Question 6
validation performance guardrail은 어떻게 구현 설계에 반영할까요?

A) Benchmark tests only
B) Validation timing metadata in test utilities
C) Boundary validation plus benchmark fixture suite
D) Runtime timing in production validation
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 7
PBT generator organization은 어떻게 설계할까요?

A) Test-only generator utilities colocated with tests
B) Dedicated `test/generators` package area inside `core-model`
C) Domain generators exported for reuse by downstream packages
D) Defer generator organization to Code Generation
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 8
port interfaces와 domain models의 package organization은 어떻게 구성할까요?

A) Separate directories: `src/ir`, `src/report`, `src/ports`, `src/validation`, `src/migration`
B) Feature directories with models, schemas, migrations together
C) Single public API barrel with internal directories hidden
D) Defer exact package organization to Code Generation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
logical components는 어느 수준까지 쪼갤까요?

A) Validation, migration, result, redaction, ports, schemas, PBT utilities
B) Only schemas and ports
C) Artifact-specific components: IR, report, manifest, diagnostics, traceability
D) Both artifact-specific components and cross-cutting utilities
X) Other (please describe after [Answer]: tag below)

[Answer]: D

### Question 10
NFR Design에서 benchmark fixture size를 어느 정도로 명시할까요?

A) 100 components typical, 500 components large
B) 500 components typical, 1000 components stress
C) No fixed fixture sizes yet
D) Use generated randomized fixtures only
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated NFR design artifacts will use Markdown tables and text sections.
