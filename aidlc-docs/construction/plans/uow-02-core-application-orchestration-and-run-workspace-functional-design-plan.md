# Functional Design Plan - UOW-02 Core Application Orchestration and Run Workspace

## Unit Context

- **Unit**: UOW-02 Core Application Orchestration and Run Workspace
- **Primary Package**: `packages/core-application`
- **Primary Owner Role**: Migration Engineer
- **Reviewer Roles**: Architect, Security Reviewer, Project Manager
- **Primary Stories**: US-001
- **Supporting Stories**: US-002, US-007, US-008, US-009, US-011, US-013
- **Prerequisites**: Units Generation is complete; UOW-01 foundational contracts are available.

## Purpose

Design the shared in-process conversion application service, run workspace lifecycle, configuration flow, policy coordination boundaries, report export handoff, and recovery behavior for CLI and Web UI callers.

## Checklist

- [ ] Load unit definition.
- [ ] Load story map and dependencies.
- [ ] Confirm Functional Design is required for this unit.
- [ ] Create functional design plan with questions.
- [ ] Wait for user answers to all `[Answer]:` tags.
- [ ] Validate answers for completeness, contradictions, and ambiguity.
- [ ] Resolve follow-up questions if needed.
- [ ] Generate `business-logic-model.md`.
- [ ] Generate `business-rules.md`.
- [ ] Generate `domain-entities.md`.
- [ ] Validate PBT property candidates for UOW-02.
- [ ] Present Functional Design completion message for review.

## Answer Validation

- **Completeness**: Pending user answers.
- **Validity**: Pending user answers.
- **Contradictions**: Pending user answers.
- **Ambiguities**: Pending user answers.
- **Follow-up Questions**: Pending user answers.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
`packages/core-application`의 shared conversion service는 어떤 책임 범위를 가져야 할까요?

A) CLI/Web UI용 run 시작, config validation, workspace 초기화, manifest 저장, orchestration을 모두 담당
B) run 시작과 config validation만 담당하고 나머지는 개별 인터페이스가 처리
C) config loading만 담당하고 orchestration은 하위 서비스에 위임
D) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 2
configuration source와 precedence는 어떻게 둘까요?

A) Project config file을 기본으로 하고 CLI/UI overrides가 우선 적용
B) File-based config만 사용하고 UI/CLI overrides는 허용하지 않음
C) UI/CLI 입력만 사용하고 config file은 선택 사항
D) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 3
run workspace 위치와 구조는 어떻게 정의할까요?

A) Workspace root 아래의 hidden directory, 예: `.spa-bridge/runs/<runId>`
B) Build/output 디렉터리 아래의 dated run folders
C) 사용자가 지정한 output path만 사용하고 별도 workspace는 두지 않음
D) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 4
run manifest lifecycle은 어떻게 될까요?

A) Run 시작 시 생성하고, 진행 중 계속 업데이트하며, 종료 시 최종 상태를 기록
B) Run 완료 후에만 생성하는 snapshot 방식
C) Read-only snapshot만 유지하고 중간 업데이트는 하지 않음
D) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 5
core application과 adapters의 책임 분리는 어디까지로 할까요?

A) Core application은 config, workspace, policy coordination, report export handoff만 맡고 실제 parsing/transformation은 하지 않음
B) Core application이 일부 parsing/transform orchestration까지 직접 담당
C) CLI/Web UI가 orchestration 대부분을 직접 수행
D) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 6
error handling과 recovery strategy는 어떻게 둘까요?

A) Fail-fast를 기본으로 하되 partial artifacts와 diagnostic state는 보존
B) 가능한 범위에서 자동 재시도 후 실패를 판정
C) Best-effort로 진행하면서 가능한 한 많이 계속 수행
D) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 7
provider policy integration은 어떤 위치에서 이뤄져야 할까요?

A) Core application이 policy를 강제하고, provider는 항상 ports/policy를 통해서만 호출
B) Policy는 security unit에만 있고 core application은 provider를 직접 호출
C) External provider만 policy 대상이고 internal provider는 예외
D) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 8
report export flow는 어떻게 구성할까요?

A) Core application이 canonical report를 항상 생성하고, exporter port로 markdown/html export를 요청
B) CLI/Web UI가 report를 직접 생성하고 core application은 상태만 제공
C) 완료 시점에만 report를 생성하고 중간 상태는 저장하지 않음
D) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 9
resume/restart behavior는 어떻게 둘까요?

A) 이전 run이 recoverable하면 manifest 기준으로 resume 가능
B) 항상 새 run으로 시작하며 resume는 허용하지 않음
C) 수동 import가 있을 때만 resume와 유사한 작업을 허용
D) Other (please describe after [Answer]: tag below)

[Answer]: 

### Question 10
manual review state는 core application에서 어떻게 다룰까요?

A) Manifest/report에 manual review item을 기록하고 CLI/Web UI가 이를 읽어 표시
B) Reporting unit만 관리하고 core application은 전달만 함
C) Core application은 manual review state를 모름
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated artifacts will use Markdown tables and textual relationships.
