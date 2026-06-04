# NFR Requirements Plan - UOW-02 Core Application Orchestration and Run Workspace

## Unit Context

- **Unit**: UOW-02 Core Application Orchestration and Run Workspace
- **Primary Package**: `packages/core-application`
- **Functional Design Status**: Complete
- **Primary Stories**: US-001
- **Supporting Stories**: US-002, US-007, US-008, US-009, US-011, US-013
- **Key Responsibilities**: conversion service orchestration, config resolution, run workspace lifecycle, manifest updates, policy coordination, report export handoff, resume/recovery.

## Purpose

Define non-functional requirements and technology decisions for the shared application orchestration layer, with emphasis on deterministic local execution, safe path/config validation, recoverable manifests, policy-gated provider coordination, and testability.

## Checklist

- [x] Load UOW-02 functional design artifacts.
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

- **Runtime Dependencies**: Only depend on UOW-01 by default; no additional runtime dependency unless later explicitly approved.
- **Validation Pattern**: Reuse UOW-01 Zod/schema-first validation pattern.
- **Path Safety**: Normalize and validate input, output, and workspace paths relative to workspace root; block traversal.
- **Manifest Reliability**: Use atomic write pattern for manifest, resolved config, and report state.
- **Status Performance**: Single run status lookup should typically complete under 50 ms.
- **Concurrency**: Multiple runs may execute in the same workspace with runId directory isolation.
- **Resume Reliability**: Valid manifest plus checkpoint must yield deterministic resume plan.
- **Provider Policy**: Fail closed when policy or masking state is unclear for provider-adjacent steps.
- **Observability/Audit**: Structured events require correlationId, runId, stepId, status, and safe message.
- **PBT Scope**: Config merge, path derivation, manifest transitions, and resume plan require PBT/stateful PBT coverage.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
UOW-02의 runtime dependency policy는 어떻게 둘까요?

A) UOW-01 의존성만 사용하고 추가 runtime dependency는 기본 금지
B) 경량 config/path utility dependency는 허용
C) orchestration framework 또는 workflow engine 도입 허용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
configuration schema/validation은 어떤 방식으로 구현하는 것이 적절할까요?

A) UOW-01 Zod/validation pattern을 재사용해 schema-first로 구현
B) TypeScript type-first + custom validation 함수로 구현
C) JSON Schema 파일을 별도로 두고 validator로 검증
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
path validation과 workspace safety 요구사항은 어느 수준까지 필요할까요?

A) 모든 input/output/workspace path를 workspace root 기준으로 정규화하고 traversal을 차단
B) run workspace path만 엄격하게 검증하고 input/output은 caller 책임
C) path validation은 CLI/Web UI에서 처리하고 core-application은 신뢰
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
manifest write reliability는 어떤 수준이 필요할까요?

A) Atomic write pattern으로 manifest/config/report state 손상 가능성을 낮춤
B) 단순 overwrite로 시작하고 복구는 후속 단계에서 보강
C) append-only event log를 primary로 사용하고 manifest는 derived view로 생성
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
run status 조회 성능 목표는 어떻게 둘까요?

A) 단일 run status 조회는 일반적으로 50ms 이하
B) 단일 run status 조회는 일반적으로 100ms 이하
C) 성능 목표는 아직 두지 않고 기능 정확성만 우선
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
동시 실행과 run isolation은 어느 수준까지 지원할까요?

A) 같은 workspace에서 여러 run을 병렬 생성 가능하되 runId별 directory isolation 보장
B) 한 workspace에서는 한 번에 하나의 run만 허용
C) 동시 실행은 후속 버전으로 미루고 설계만 반영
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
resume/recovery reliability 요구사항은 어떻게 둘까요?

A) Valid manifest와 checkpoint가 있으면 deterministic resume plan을 생성해야 함
B) resume는 best-effort로 처리하고 실패하면 새 run을 권장
C) resume는 MVP에서 제외하고 restart만 지원
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
provider policy enforcement의 NFR은 어떻게 정의할까요?

A) Fail-closed: policy/masking 상태가 불명확하면 provider-adjacent step은 실행하지 않음
B) External provider만 fail-closed, local/internal provider는 경고 후 진행
C) Provider policy는 UOW-05에서만 검증하고 UOW-02는 이벤트 기록만 함
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
observability와 audit 요구사항은 어느 수준이 필요할까요?

A) Structured events with correlationId, runId, stepId, status, safe message를 필수화
B) 최소 diagnostic 기록만 남기고 audit/logging은 후속 unit에서 처리
C) console-style progress event만 정의
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
PBT와 stateful testing 범위는 어디까지 둘까요?

A) Config merge, path derivation, manifest transitions, resume plan을 PBT/stateful PBT 대상으로 지정
B) Config merge와 path derivation만 PBT 대상으로 지정
C) UOW-02는 example-based tests만 사용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated artifacts will use Markdown tables and textual relationships.
