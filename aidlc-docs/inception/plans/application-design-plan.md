# Application Design Plan

## Purpose

Define the high-level application architecture for SPA-Bridge: main components, responsibilities, interfaces, service orchestration, and dependencies. Detailed business rules will be handled later during Functional Design per unit.

## Design Scope

SPA-Bridge needs a shared conversion core used by both CLI and Web UI, plus components for source scanning, Angular parsing, intermediate representation, framework mapping, LLM-assisted refinement, masking, target generation, quality gates, reporting, and governance.

## Checklist

- [x] Load approved requirements.
- [x] Load approved user stories and personas.
- [x] Load approved execution plan.
- [x] Confirm Application Design is marked EXECUTE.
- [x] Create application design plan with questions.
- [x] Wait for user answers to all `[Answer]:` tags.
- [x] Validate answers for completeness, contradictions, and ambiguity.
- [x] Resolve follow-up questions if needed.
- [x] Generate `aidlc-docs/inception/application-design/components.md`.
- [x] Generate `aidlc-docs/inception/application-design/component-methods.md`.
- [x] Generate `aidlc-docs/inception/application-design/services.md`.
- [x] Generate `aidlc-docs/inception/application-design/component-dependency.md`.
- [x] Generate consolidated `aidlc-docs/inception/application-design/application-design.md`.
- [x] Validate design completeness and consistency.
- [x] Present Application Design completion message for review.

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None blocking. Multi-package monorepo plus in-process shared application service is interpreted as a local multi-package runtime with shared core service calls.
- **Follow-up Questions**: Not required.

## Approved Design Preferences

- **Architecture Style**: Multi-package monorepo.
- **CLI/Web UI Core Call**: Shared application service direct in-process call.
- **IR Model**: Angular-specific input model plus framework-neutral core IR.
- **Rule Engine**: Plugin-friendly rule packs with internal extension points.
- **LLM Abstraction**: Provider registry, policy checks, masking integration, provider-specific adapters.
- **Web UI Auth**: Access-control hooks only; concrete auth deferred.
- **Run State**: File-based run workspace and manifest.
- **Self-Correction**: Dedicated SelfCorrectionService.
- **Reporting**: Canonical JSON report with Markdown/HTML views.
- **Dependency Principle**: Ports and adapters.

## Proposed Component Groups

- **Interface Layer**: CLI, Web UI, optional internal API/controller boundary.
- **Application Orchestration Layer**: conversion run service, workflow coordinator, configuration service.
- **Source Analysis Layer**: project scanner, Angular parser, dependency graph builder.
- **Model Layer**: intermediate representation, diagnostics, report schema, masking token model.
- **Transformation Layer**: rule engine, mapping strategy selector, component/template/state/routing converters.
- **AI Layer**: LLM provider abstraction, local/internal provider adapter, optional external provider adapter.
- **Security/Governance Layer**: masking service, audit/logging policy, provider policy, supply chain checks.
- **Generation and Quality Layer**: React project generator, formatter/linter/compiler runner, self-correction service, PBT/test planning hooks.
- **Reporting Layer**: report builder, export service, Web UI review data provider.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
초기 애플리케이션 아키텍처 스타일은 무엇을 기준으로 설계할까요?

A) Modular monolith: 하나의 TypeScript workspace 안에서 명확한 모듈 경계로 분리
B) Multi-package monorepo: core, cli, web, parser, generator 등 패키지로 분리
C) Service-oriented: Web/API와 conversion worker를 별도 서비스로 분리
D) Library-first: core SDK를 먼저 만들고 CLI/Web UI가 얇게 감싸는 구조
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2
CLI와 Web UI는 core engine을 어떤 방식으로 호출해야 하나요?

A) 같은 process 안에서 shared application service를 직접 호출
B) Web UI는 API 서버를 호출하고 CLI는 core service를 직접 호출
C) CLI와 Web UI 모두 local API/server boundary를 통해 호출
D) 초기에는 CLI 직접 호출만 구현하고 Web UI는 같은 인터페이스를 나중에 사용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
Intermediate Representation(IR)은 어느 정도 독립된 모델로 설계할까요?

A) Angular-to-React MVP에 필요한 최소 IR
B) Angular 특화 입력 모델과 framework-neutral core IR을 분리
C) 모든 source/target framework를 고려한 강한 framework-neutral IR
D) 초기에는 parser output과 target generator input을 단순 DTO로 연결
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 4
변환 rule engine은 어떤 구조가 적절한가요?

A) Rule registry + ordered pipeline
B) Strategy pattern 기반 converter set
C) Plugin-friendly rule packs with internal extension points
D) MVP는 hardcoded pipeline, 이후 plugin 구조로 확장
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 5
LLM provider abstraction은 초기 설계에서 어디까지 포함할까요?

A) Provider interface와 local/internal adapter만 포함
B) Provider interface, local/internal adapter, external adapter interface까지 포함
C) Provider registry, policy checks, masking integration, provider-specific adapters까지 포함
D) 초기에는 mock provider만 설계하고 실제 provider는 Construction에서 결정
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 6
Web UI 인증/권한 설계는 현재 Application Design에 포함할까요?

A) 포함: 인증/권한 컴포넌트와 기본 access control 흐름 설계
B) 부분 포함: Web UI/API boundary에 access control hook만 남김
C) 제외: local-only 도구로 가정하고 후속 NFR Design에서 재검토
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 7
conversion run 상태 관리는 어디에 둘까요?

A) In-memory run state 중심, report/export 파일로 결과 보존
B) 파일 기반 run workspace와 manifest 중심
C) lightweight embedded database 사용
D) Web UI를 고려해 persistence abstraction만 설계하고 구현 선택은 후속 단계에서 결정
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 8
self-correction orchestration은 어떤 컴포넌트 경계로 설계할까요?

A) QualityGateService 안에 포함
B) 별도 SelfCorrectionService가 quality gate 결과와 converter/LLM provider를 조율
C) ConversionWorkflowService가 직접 correction loop를 관리
D) 초기 설계에서는 interface만 정의
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 9
reporting은 어떤 산출물 구조를 기본으로 할까요?

A) Markdown + JSON report 모두 생성
B) JSON report를 canonical format으로 두고 Markdown/HTML은 view/export로 생성
C) Web UI용 report model을 canonical format으로 사용
D) Markdown report 중심으로 시작
X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 10
컴포넌트 의존성 원칙은 어느 쪽을 선호하나요?

A) Strict layered dependencies: interface -> orchestration -> domain/model -> adapters
B) Ports and adapters: core는 ports만 알고 adapters가 외부 도구/LLM/FS를 구현
C) Feature modules: 각 변환 domain이 자체 parser/converter/generator 의존성을 가짐
D) 단순 dependency graph로 시작하고 순환 의존만 금지
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- The generated design artifacts should include text tables and dependency matrices; diagrams should include text alternatives if added.
