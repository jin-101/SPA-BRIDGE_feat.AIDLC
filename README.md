# SPA-Bridge

SPA-Bridge는 Angular SPA 프로젝트를 React 기반 프로젝트로 전환하기 위한 패키지형 변환 도구입니다. Angular 소스 분석, 중립 IR 구성, Angular-to-React 변환, React 타깃 생성, 보안 마스킹, 품질 게이트, 리포트, CLI/Web 검토 흐름을 하나의 monorepo 안에서 제공합니다.

이 프로젝트는 AIDLC 워크플로우로 설계 및 구현되었으며, 현재 UOW-01부터 UOW-11까지의 Construction 단계 개발과 build/test 검증이 완료된 상태입니다. Operations 단계는 향후 배포/운영 확장을 위한 placeholder입니다.

## 목표

- Angular 15 기반 SPA 소스 전체를 분석해 React 18 + TypeScript 타깃 프로젝트로 변환합니다.
- 컴포넌트, 서비스, 라우팅, 상태, 폼, i18n, 애니메이션, 지도, 미디어, QR/barcode, service worker 관련 변환을 추적 가능한 산출물로 남깁니다.
- 변환이 불확실하거나 손실 가능성이 있는 부분은 임의로 추측하지 않고 manual-review 항목으로 기록합니다.
- 외부 AI provider는 disabled-by-default 정책, masking, context minimization, validation gate를 통과한 경우에만 사용하도록 설계합니다.
- CLI와 Web review workflow를 통해 변환 실행, 검증, 리포트 확인, 검토 항목 처리를 지원합니다.

## 최종 사용자 흐름

1. 사용자가 Angular 프로젝트 경로와 React 출력 경로를 지정합니다.
2. SPA-Bridge가 workspace path, policy, provider 사용 가능 여부를 검증합니다.
3. Angular 소스 분석기가 컴포넌트, 템플릿, 서비스, 라우팅, 상태, 의존성 그래프를 수집합니다.
4. 변환 엔진이 Angular 모델을 React-oriented draft와 traceable artifact로 변환합니다.
5. React target generator가 Vite + React 18 + TypeScript 프로젝트 구조와 소스 파일 write plan을 생성합니다.
6. Quality gate와 self-correction 단계가 산출물의 안정성, 경로 안전성, trace coverage, manual-review 항목을 평가합니다.
7. Reporting 패키지가 JSON/Markdown/HTML 리포트를 생성합니다.
8. CLI 또는 Web review workflow에서 진행 상황, 품질 결과, 검토 항목, export 결과를 확인합니다.

## 설치 및 실행

### 요구사항

- Node.js 22 LTS 이상 권장
- npm 10 이상 권장

### 의존성 설치

```bash
npm install
```

### 전체 빌드

```bash
npm run build
```

### 전체 테스트

```bash
npm test
```

또는 같은 명령입니다.

```bash
npm run test
```

### 특정 패키지만 빌드/테스트

```bash
npm run build --workspace @spa-bridge/cli
npm run test --workspace @spa-bridge/web
```

### CLI 흐름 사용

빌드 후에는 CLI entry를 직접 실행할 수 있습니다. 입력은 zip 업로드가 아니라 압축 해제된 Angular repo 폴더 경로입니다. 출력은 지정한 React output 폴더에 생성됩니다.

```bash
npm run build

node packages/cli/dist/bin/spa-bridge.js convert \
  --workspace /path/to/workspace \
  --input angular-app \
  --output react-output \
  --report-format json \
  --non-interactive \
  --confirm
```

`npm install` 이후 package bin symlink가 갱신되어 있다면 아래처럼 실행할 수도 있습니다.

```bash
npx spa-bridge convert \
  --workspace /path/to/workspace \
  --input angular-app \
  --output react-output \
  --report-format json \
  --non-interactive \
  --confirm
```

위 예시에서 `/path/to/workspace/angular-app`은 Angular 프로젝트 루트여야 하며, `angular.json`, `package.json`, `src/main.ts` 또는 `src/app/app.component.ts` 같은 Angular entry 파일을 포함해야 합니다. 출력 폴더에는 Vite + React 18 + TypeScript 프로젝트 파일과 `.spa-bridge` 변환 요약, `report.json`이 함께 생성됩니다.

API로 직접 실행할 수도 있습니다.

```ts
import { runCli } from '@spa-bridge/cli';

const result = await runCli([
  'convert',
  '--workspace',
  '/path/to/workspace',
  '--input',
  '/path/to/angular-app',
  '--output',
  '/path/to/react-output',
  '--non-interactive',
  '--confirm',
]);

if (!result.ok) {
  console.error(result.error.message);
}
```

## Monorepo 패키지

| Package | 역할 |
| --- | --- |
| `@spa-bridge/core-model` | 공통 Result 타입, ID, diagnostics, artifact refs, graph, ports의 기반 모델 |
| `@spa-bridge/core-application` | run workspace, pipeline orchestration, execution state, artifact handoff |
| `@spa-bridge/source-angular` | Angular source scan, TypeScript/template 분석, inventory와 dependency graph 생성 |
| `@spa-bridge/transform-angular-react` | Angular IR을 React-oriented draft로 변환하는 rule engine과 converters |
| `@spa-bridge/core-security` | masking, provider policy, safe context, provider boundary enforcement |
| `@spa-bridge/adapters-ai` | AI provider registry, context minimizer, response validator, refinement orchestration |
| `@spa-bridge/target-react` | Vite + React 18 + TypeScript target project generation과 file materializer |
| `@spa-bridge/core-quality` | quality gates, self-correction, PBT/fixture 기반 검증 모델 |
| `@spa-bridge/core-reporting` | JSON/Markdown/HTML 리포트와 export artifact 생성 |
| `@spa-bridge/cli` | convert/validate/report/help CLI command flow, option/path validation, output formatting |
| `@spa-bridge/web` | Web review workflow용 dashboard, report browser, triage, remediation confirmation 모델 |

## UOW-01 ~ UOW-11 역할 요약

| UOW | 이름 | 최종 사용자 흐름에서의 역할 |
| --- | --- | --- |
| UOW-01 | Core Model and Ports Foundation | 모든 패키지가 공유하는 도메인 모델, ID, diagnostics, artifact, graph, port 계약을 제공합니다. |
| UOW-02 | Core Application Orchestration and Run Workspace | 사용자의 변환 실행을 하나의 run으로 묶고, 단계별 상태와 산출물 흐름을 조정합니다. |
| UOW-03 | Angular Source Analysis | 입력 Angular repo를 스캔해 컴포넌트, 템플릿, 서비스, 라우팅, 상태, 의존성 정보를 수집합니다. |
| UOW-04 | Angular-to-React Transformation | Angular 분석 결과를 React-oriented draft, 변환 trace, manual-review diagnostic으로 바꿉니다. |
| UOW-05 | Security, Masking, and Provider Policy | 민감 정보 노출을 막고, 외부 provider 사용 가능 여부를 정책적으로 통제합니다. |
| UOW-06 | AI Provider Adapters and Refinement | 필요한 경우 안전한 provider context와 response validation을 통해 변환 보강을 수행합니다. |
| UOW-07 | React Target Generation | 변환 draft를 바탕으로 React 18 + TypeScript 프로젝트 구조와 파일 생성 계획을 만듭니다. |
| UOW-08 | Quality Gates, Self-Correction, and PBT Integration | 변환 결과의 결정성, 경로 안전성, trace coverage, 품질 조건을 검증합니다. |
| UOW-09 | Reporting and Exports | 변환 결과, 품질 결과, 검토 항목을 JSON/Markdown/HTML 리포트로 내보냅니다. |
| UOW-10 | CLI Interface | 사용자가 terminal에서 convert, validate, report 흐름을 실행할 수 있는 명령 계층을 제공합니다. |
| UOW-11 | Web UI Review Workflow | 브라우저 기반 검토 흐름에서 진행 상태, 리포트, 검토 항목, 조치 확인을 다룰 수 있게 합니다. |

## 주요 문서 위치

- `aidlc-docs/aidlc-state.md`: AIDLC 진행 상태와 완료된 단계 기록
- `aidlc-docs/audit.md`: 사용자 입력과 AI 응답에 대한 audit trail
- `aidlc-docs/inception/application-design/unit-of-work.md`: UOW-01 ~ UOW-11 설계 분해
- `aidlc-docs/construction/build-and-test/`: build, unit test, integration test, performance test 지침
- `aidlc-docs/construction/<uow-name>/`: 각 UOW의 functional design, NFR, code summary 문서

## 현재 상태와 주의사항

- UOW-01 ~ UOW-11 개발은 완료되었고, workspace-level build/test 흐름이 구성되어 있습니다.
- Web UI 패키지는 현재 review workflow의 TypeScript render model과 상태/interaction 계층 중심으로 구현되어 있습니다.
- 외부 AI provider 호출은 기본 비활성화이며, policy readiness와 masking/context minimization을 통과해야 합니다.
- 변환 불확실성이 있는 항목은 자동으로 숨기지 않고 manual-review diagnostic으로 남기는 방향입니다.
