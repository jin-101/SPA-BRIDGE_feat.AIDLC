# NFR Requirements Plan - UOW-01 Core Model and Ports Foundation

## Unit Context

- **Unit**: UOW-01 Core Model and Ports Foundation
- **Primary Package**: `packages/core-model`
- **Functional Design Status**: Complete
- **Next Stage**: NFR Requirements

## NFR Focus

UOW-01 defines schema-bearing artifacts and ports that every other unit consumes. NFR decisions must cover type safety, schema validation, serialization compatibility, PBT framework selection, maintainability, performance of validation, security redaction guarantees, and package dependency rules.

## Checklist

- [x] Load UOW-01 functional design artifacts.
- [x] Identify NFR-sensitive decisions.
- [x] Create NFR requirements plan with questions.
- [x] Wait for user answers to all `[Answer]:` tags.
- [x] Validate answers for completeness, contradictions, and ambiguity.
- [x] Resolve follow-up questions if needed.
- [x] Generate `nfr-requirements.md`.
- [x] Generate `tech-stack-decisions.md`.
- [x] Validate Security Baseline compliance.
- [x] Validate PBT compliance, especially framework selection.
- [x] Present NFR Requirements completion message for review.

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved NFR Choices

- **Validation Library**: Zod.
- **Package Format**: Source TypeScript inside monorepo; build format decided later.
- **PBT Framework**: fast-check with Vitest.
- **Validation Performance**: Typical artifacts under 100ms each.
- **Versioning**: Explicit migrations for all persisted schema versions.
- **Redaction**: Core schemas forbid raw sensitive values in diagnostics/reports.
- **Port Errors**: Result type (`Ok`/`Err`) for all port calls.
- **Dependencies**: Zero runtime dependencies except validation library.
- **Scalability**: 500+ components and large traceability maps.
- **Maintainability**: Public model/port APIs require doc comments and examples.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
Core model runtime/schema validation library는 무엇을 선호하나요?

A) Zod
B) TypeBox + Ajv
C) Valibot
D) JSON Schema only with generated TypeScript types
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
TypeScript package format은 어떻게 둘까요?

A) ESM only
B) CommonJS only
C) Dual ESM/CJS
D) Source TypeScript only inside monorepo, build format decided later
X) Other (please describe after [Answer]: tag below)

[Answer]: D

### Question 3
PBT framework는 무엇으로 확정할까요?

A) fast-check with Vitest
B) fast-check with Jest
C) fast-check with Node test runner
D) Defer test runner until Code Generation but reserve fast-check
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
schema validation performance 목표는 어떻게 둘까요?

A) Validate typical artifacts under 100ms each
B) Validate typical artifacts under 500ms each
C) No fixed latency target; focus on correctness first
D) Lazy validation only at persistence boundaries
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
backward compatibility/versioning 요구사항은 어떻게 둘까요?

A) No backward compatibility in MVP; schemaVersion only
B) Support reading current and previous minor schema versions
C) Support explicit migrations for all persisted schema versions
D) Defer compatibility policy to later releases
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 6
security redaction requirement는 어느 정도로 강제할까요?

A) Redaction metadata only; enforcement in reporting/security units
B) Core schemas must distinguish raw vs redacted fields by type
C) Core schemas forbid raw sensitive values in diagnostics/reports entirely
D) Core schemas support raw fields but require explicit unsafe marker
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 7
port error handling model은 어떻게 표준화할까요?

A) Throw exceptions for port failures
B) Result type (`Ok`/`Err`) for all port calls
C) Hybrid: domain validation returns Result, infrastructure ports may throw
D) Defer to implementation conventions
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 8
dependency policy for `packages/core-model`은 어떻게 둘까요?

A) Zero runtime dependencies except validation library
B) Allow small utility dependencies
C) Allow dependencies as long as pinned and scanned
D) No restriction beyond monorepo standards
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
artifact size/scalability constraint는 어떻게 둘까요?

A) Design for projects with 100+ components only
B) Design for 500+ components and large traceability maps
C) No explicit size target yet
D) Streaming/chunked artifact support required in MVP
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 10
documentation/maintainability requirement는 어떻게 둘까요?

A) Public model/port APIs require doc comments and examples
B) All domain entities require doc comments
C) Markdown reference docs plus generated API docs
D) Minimal docs during MVP
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated NFR artifacts will use Markdown tables and text sections.
