# Unit of Work Plan

## Purpose

Decompose SPA-Bridge into logical units of work for Construction. Units will align with the approved multi-package TypeScript monorepo, ports-and-adapters architecture, story map, and component boundaries.

## Planning Checklist

- [x] Load approved requirements.
- [x] Load approved user stories and personas.
- [x] Load approved application design artifacts.
- [x] Confirm Units Generation is marked EXECUTE in the execution plan.
- [x] Create unit of work plan with decomposition questions.
- [x] Wait for user answers to all `[Answer]:` tags.
- [x] Validate answers for completeness, contradictions, and ambiguity.
- [x] Resolve follow-up questions if needed.
- [x] Obtain explicit approval of this unit of work plan.

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None blocking. "Start coarse in INCEPTION and split further during Construction" is interpreted as package/domain-aligned medium-to-coarse units now, with later refinement during per-unit Construction stages.
- **Follow-up Questions**: Not required.

## Approved Decomposition Preferences

- **Decomposition Axis**: Package/domain aligned units matching the multi-package monorepo.
- **Granularity**: Start coarse in INCEPTION and split further during Construction.
- **CLI/Web UI Placement**: Separate CLI unit and Web UI unit.
- **Core Model/IR vs Source Analysis**: Separate Angular source analysis unit and core model/IR unit.
- **LLM/Security Split**: Masking in core security unit, provider in AI adapter unit, policy in orchestration unit.
- **Quality/PBT/Self-Correction**: One Quality and Self-Correction unit.
- **Sequencing**: Foundation-first.
- **Ownership**: Include both primary owner role and reviewer roles.
- **Code Organization Detail**: Package list plus major directories and dependency rules.
- **Story Mapping**: Primary unit plus supporting units.

## Mandatory Generation Steps After Plan Approval

- [x] Generate `aidlc-docs/inception/application-design/unit-of-work.md` with unit definitions and responsibilities.
- [x] Generate `aidlc-docs/inception/application-design/unit-of-work-dependency.md` with dependency matrix.
- [x] Generate `aidlc-docs/inception/application-design/unit-of-work-story-map.md` mapping stories to units.
- [x] Document greenfield code organization strategy in `unit-of-work.md`.
- [x] Validate unit boundaries and dependencies.
- [x] Ensure all stories are assigned to units.

## Proposed Decomposition Baseline

The baseline decomposition is package/domain aligned:

1. Workspace, configuration, CLI, and run orchestration.
2. Angular source analysis and dependency graph.
3. Core models, IR, traceability, diagnostics, and report schema.
4. Transformation rule engine and Angular-to-React domain converters.
5. LLM provider abstraction, policy, masking, and AI refinement.
6. React target generation.
7. Quality gates, self-correction, and PBT integration.
8. Reporting, exports, and Web UI review workflow.
9. Security/governance cross-cutting controls.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
unit decomposition의 기본 축은 무엇으로 할까요?

A) Package/domain aligned units matching the multi-package monorepo
B) User journey aligned units matching conversion workflow steps
C) Story epic aligned units matching the 7 user-story epics
D) Layer aligned units: interface, application, domain, adapters
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
초기 unit granularity는 어느 정도가 적절한가요?

A) Coarse: 4-5 large units
B) Balanced: 8-10 medium units
C) Fine-grained: 12+ small units
D) Start coarse in INCEPTION and split further during Construction
X) Other (please describe after [Answer]: tag below)

[Answer]: D

### Question 3
CLI와 Web UI는 unit 관점에서 어떻게 배치할까요?

A) 하나의 Interface unit에 함께 포함
B) CLI unit과 Web UI unit을 분리
C) CLI는 orchestration unit에 포함하고 Web UI만 별도 unit
D) Web UI는 후순위 unit으로 분리하고 CLI를 먼저 구현
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 4
core model/IR과 Angular source analysis는 같은 unit으로 묶을까요?

A) 분리: Angular source analysis unit과 core model/IR unit을 분리
B) 통합: parser부터 IR까지 source modeling unit으로 묶음
C) Core model/IR을 다른 core orchestration unit에 포함
D) 초기에는 통합하고 나중에 분리
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
LLM provider, masking, security policy는 어떻게 unit을 나눌까요?

A) 하나의 AI and Security unit으로 통합
B) LLM provider unit과 Security/Masking unit을 분리
C) Masking은 core security unit, provider는 AI adapter unit, policy는 orchestration unit에 배치
D) Security/Governance를 cross-cutting unit으로 두고 LLM provider와 연결
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 6
quality gates, self-correction, PBT는 어떻게 묶을까요?

A) 하나의 Quality and Self-Correction unit으로 통합
B) Quality Gate unit과 Self-Correction unit을 분리
C) PBT는 별도 Testing Strategy unit으로 분리
D) Quality/PBT는 각 기능 unit에 분산하고 self-correction만 별도 unit
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
unit dependency sequencing은 어떤 방식이 좋을까요?

A) Foundation-first: model/ports -> source analysis -> transform -> generation -> quality -> interfaces
B) Workflow-first: CLI path end-to-end skeleton -> enrich each stage
C) Risk-first: masking/LLM/security and parser risks 먼저 해결
D) UI-first: Web UI review/reporting skeleton first
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
team ownership을 unit 문서에 어떻게 표현할까요?

A) Persona/role-based ownership suggestions only
B) Package owner suggestions for each unit
C) No ownership; keep units purely technical
D) Include both primary owner role and reviewer roles
X) Other (please describe after [Answer]: tag below)

[Answer]: D

### Question 9
greenfield code organization strategy는 어느 수준으로 문서화할까요?

A) Top-level package list only
B) Package list plus major directories and dependency rules
C) Detailed file/module skeleton per package
D) Defer exact structure to Code Generation stage
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 10
story-to-unit mapping에서 cross-cutting stories는 어떻게 처리할까요?

A) Assign each story to one primary unit only
B) Assign primary unit plus supporting units
C) Duplicate cross-cutting stories under every relevant unit
D) Use separate cross-cutting unit for Security/PBT/Reporting stories
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated unit artifacts should use Markdown tables and text alternatives for dependency descriptions.
