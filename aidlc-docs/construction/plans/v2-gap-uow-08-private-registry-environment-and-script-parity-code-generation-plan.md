# V2-GAP-UOW-08 Private Registry, Environment, and Script Parity 코드 생성 계획

## 목적

V2-GAP-FR-009 요구사항을 구현합니다. Angular source repository를 Next.js target repository로 변환할 때 private Nexus/npm registry 설정, 내부 패키지 설치 조건, source package script 의도, 환경변수 계약이 안전하게 보존되어야 합니다. 단, registry token, password, auth header, secret 환경변수 값은 생성 파일과 report에 절대 기록하지 않습니다.

## 유닛 컨텍스트

- **Unit**: V2-GAP-UOW-08 Private Registry, Environment, and Script Parity
- **Primary Requirement**: V2-GAP-FR-009
- **Primary Packages**:
  - `packages/source-angular`
  - `packages/target-react`
  - `packages/cli`
  - `packages/core-reporting`
  - `packages/core-quality`
- **기존 의존성**:
  - V2-GAP-UOW-00 dependency compatibility filter and replacement
  - V2-GAP-UOW-01 alias and path mapping
  - V2-GAP-UOW-07 generated Next.js self-correction loop
  - Next.js target default and runtime parity quality gate

## 설계 입력

- `aidlc-docs/inception/requirements/requirements_v2.md`
- `aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`
- `aidlc-docs/construction/v2-gap-uow-08-private-registry-environment-and-script-parity/functional-design/domain-entities.md`
- `aidlc-docs/construction/v2-gap-uow-08-private-registry-environment-and-script-parity/functional-design/business-rules.md`
- `aidlc-docs/construction/v2-gap-uow-08-private-registry-environment-and-script-parity/functional-design/business-logic-model.md`
- `aidlc-docs/construction/v2-gap-uow-08-private-registry-environment-and-script-parity/functional-design/frontend-components.md`

## 사용자 스토리 추적성

- **US-001**: CLI 사용자가 Angular repository를 변환하고 실행 가능한 target 결과를 받는다.
- **US-002**: 사용자가 생성된 Next.js target에서 `npm install` 및 `npm run dev`를 실행할 수 있다.
- **US-009**: 민감 정보가 diagnostics, report, generated artifact에 노출되지 않는다.
- **US-011**: install/runtime readiness 신호가 quality gate와 self-correction에 반영된다.
- **US-013**: report가 registry, script, environment parity 상태와 manual review 항목을 안전하게 제공한다.

## Application Code 위치

Application code는 workspace root의 package 내부에만 생성 또는 수정합니다.

- `packages/target-react/src/enterprise/`
- `packages/target-react/src/generation/target-generation-service.ts`
- `packages/target-react/src/strategies/nextjs-typescript.ts`
- `packages/target-react/src/types.ts`
- `packages/target-react/src/index.ts`
- `packages/target-react/tests/target-react.test.ts`
- `packages/cli/src/bridges/application-bridge.ts`
- `packages/cli/tests/cli.test.ts`
- `packages/core-reporting/src/types.ts`
- `packages/core-reporting/src/view-model/report-view-model-builder.ts`
- `packages/core-reporting/tests/core-reporting.test.ts`
- `packages/core-quality/src/runtime-parity/runtime-parity-quality-gate.ts`
- `packages/core-quality/tests/core-quality.test.ts`

Documentation summary는 아래 경로에만 생성합니다.

- `aidlc-docs/construction/v2-gap-uow-08-private-registry-environment-and-script-parity/code/`

## 실행 단계

### Step 1: Enterprise Parity Type 정의

- [x] `packages/target-react/src/types.ts`에 registry, npmrc, script, environment parity model을 추가합니다.
- [x] `SourceNpmrcEntry`, `RegistryMigrationPlan`, `SourceScriptIntent`, `ScriptMigrationPlan`, `EnvironmentVariableInventoryItem`, `EnvironmentContractReport`, `EnterpriseParityArtifacts`를 serializable type으로 정의합니다.
- [x] `TargetGenerationRequest`에 source `.npmrc`, source scripts, source env evidence를 전달할 수 있는 optional field를 추가합니다.
- [x] `TargetGenerationResult`와 `TargetGenerationSummary`에 enterprise parity summary를 추가합니다.

### Step 2: `.npmrc` 안전 파서 및 Registry Migration Planner

- [x] `packages/target-react/src/enterprise/npmrc-parser.ts`를 생성합니다.
- [x] root/project `.npmrc` line을 stable entry로 파싱하고 comment, blank line, registry scope line, auth/secret line을 분류합니다.
- [x] `packages/target-react/src/enterprise/registry-migration-planner.ts`를 생성합니다.
- [x] safe registry/scope routing은 target `.npmrc`에 보존하고 `_authToken`, `_auth`, `password`, `username`, token-like value는 redaction 및 placeholder로 변환합니다.
- [x] secret-required diagnostic과 manual review reason code를 안정적으로 생성합니다.

### Step 3: Source Script Intent Classifier 및 Next.js Script Translator

- [x] `packages/target-react/src/enterprise/source-script-translator.ts`를 생성합니다.
- [x] `ng serve`, `ng build`, `ng test`, `ng lint`, `webpack`, `cross-var`, deploy/publish wrapper, analyze command를 intent별로 분류합니다.
- [x] target `package.json`에는 Next.js-safe 기본 script인 `dev`, `build`, `start`, `lint`, `typecheck`를 생성합니다.
- [x] source script 중 안전하게 변환 가능한 script는 target script로 추가하고, Angular CLI 전용 또는 destructive script는 제외하고 review item으로 남깁니다.
- [x] script ordering과 conflict resolution을 deterministic하게 유지합니다.

### Step 4: Environment Variable Inventory 및 Contract Builder

- [x] `packages/target-react/src/enterprise/environment-contract-builder.ts`를 생성합니다.
- [x] `.env*`, package script env assignment, Angular environment file evidence, `process.env.*` evidence를 입력 model로 inventory화합니다.
- [x] 변수별로 `server-only`, `client-exposed`, `secret`, `placeholder`, `unknown`을 분류합니다.
- [x] client-exposed 변수만 `NEXT_PUBLIC_` prefix를 적용합니다.
- [x] secret raw value는 절대 복사하지 않고 `.env.example`에는 placeholder만 생성합니다.

### Step 5: Enterprise Artifact Materializer

- [x] `packages/target-react/src/enterprise/enterprise-artifact-materializer.ts`를 생성합니다.
- [x] target write plan에 `.npmrc`, `.npmrc.example`, `.env.example`을 생성합니다.
- [x] target write plan에 `src/review/registry-migration-report.json`, `src/review/script-migration-report.json`, `src/review/environment-contract-report.json`을 생성합니다.
- [x] JSON artifact는 stable ordering, safe relative path, secret-free content를 보장합니다.
- [x] 생성 artifact에는 raw source token, password, absolute private path를 포함하지 않습니다.

### Step 6: Target Generation 통합

- [x] `packages/target-react/src/generation/target-generation-service.ts`에서 enterprise parity planner/materializer를 호출합니다.
- [x] dependency compatibility report와 enterprise parity report를 함께 manual review item으로 연결합니다.
- [x] `packages/target-react/src/strategies/nextjs-typescript.ts`의 package script 생성 로직이 source script translation 결과를 반영하도록 수정합니다.
- [x] generated file count, review item count, summary count가 enterprise artifacts를 포함하도록 조정합니다.

### Step 7: CLI Source Evidence 수집

- [x] `packages/cli/src/bridges/application-bridge.ts`에서 Angular project root의 `.npmrc`, workspace root `.npmrc`, source `package.json` scripts, `.env*` 파일 이름과 safe env key를 읽습니다.
- [x] `.npmrc` secret 값과 `.env` raw value는 CLI memory model에서도 redaction하여 target generation request로 전달합니다.
- [x] 변환 완료 후 `.spa-bridge/registry-migration-summary.json`, `.spa-bridge/script-migration-summary.json`, `.spa-bridge/environment-contract-summary.json`을 기록합니다.
- [x] CLI report payload에 enterprise parity section을 추가합니다.

### Step 8: Reporting 및 Quality Gate 통합

- [x] `packages/core-reporting/src/types.ts`에 enterprise parity report section type을 추가합니다.
- [x] `packages/core-reporting/src/view-model/report-view-model-builder.ts`가 registry/script/env summary를 표시하도록 수정합니다.
- [x] `packages/core-quality/src/runtime-parity/runtime-parity-quality-gate.ts`에서 `package.json` script readiness, `.npmrc.example`, `.env.example`, enterprise review artifact 존재 여부를 quality signal로 반영합니다.
- [x] self-correction은 unsafe source script를 실행하지 않고 artifact 기반 readiness만 평가합니다.

### Step 9: Export 및 테스트 유틸리티 정리

- [x] `packages/target-react/src/index.ts`에서 enterprise parity public test utility 또는 service를 필요한 범위만 export합니다.
- [x] `packages/target-react/src/testing/generators.ts`에 npmrc/script/env generator를 추가합니다.
- [x] 기존 dependency compatibility test fixture와 충돌하지 않도록 fixture factory를 정리합니다.

### Step 10: Example Test 추가

- [x] `packages/target-react/tests/target-react.test.ts`에 Nexus scope registry 보존 test를 추가합니다.
- [x] secret redaction 및 placeholder 생성 test를 추가합니다.
- [x] 내부 패키지 carry-over와 `@wds/wc-angular-lib` replacement가 registry report와 함께 동작하는지 검증합니다.
- [x] source script가 Next.js-safe script로 변환되고 Angular CLI-only script가 review 처리되는지 검증합니다.
- [x] env variable이 server/client/secret/unknown으로 분류되고 `.env.example`에 raw secret이 없는지 검증합니다.

### Step 11: Property-Based Test 추가

- [x] `.npmrc` entry ordering과 secret redaction determinism property를 추가합니다.
- [x] script translation이 stable output과 unsafe command exclusion을 만족하는지 검증합니다.
- [x] env classification이 raw secret leakage 없이 deterministic artifact를 생성하는지 검증합니다.
- [x] package manifest integration에서 duplicate package/script key가 생기지 않는지 검증합니다.

### Step 12: Documentation Summary 생성

- [x] `aidlc-docs/construction/v2-gap-uow-08-private-registry-environment-and-script-parity/code/summary.md`를 생성합니다.
- [x] `aidlc-docs/construction/v2-gap-uow-08-private-registry-environment-and-script-parity/code/artifact-index.md`를 생성합니다.
- [x] 구현 파일, test, 보안 정책, 남은 manual review 조건, 검증 결과를 한국어로 기록합니다.

### Step 13: Verification

- [x] `npm run test --workspace @spa-bridge/target-react`를 실행합니다.
- [x] 필요 시 `npm run test --workspace @spa-bridge/cli`, `npm run test --workspace @spa-bridge/core-reporting`, `npm run test --workspace @spa-bridge/core-quality`를 실행합니다.
- [x] workspace `npm test`를 실행합니다.
- [x] workspace `npm run build`를 실행합니다.
- [x] 검증 결과를 code summary와 audit에 기록합니다.

## Acceptance Criteria

- 생성된 Next.js target이 safe `.npmrc`, `.npmrc.example`, `.env.example`을 포함합니다.
- private registry scope routing은 보존되지만 token/password/auth secret은 생성 결과에 포함되지 않습니다.
- source package scripts는 Next.js-safe scripts로 변환되고 unsafe/Angular-only scripts는 review 항목으로 남습니다.
- 환경변수 계약 report가 server/client/secret/unknown 분류와 `NEXT_PUBLIC_` mapping을 제공합니다.
- enterprise parity artifact가 CLI/reporting/runtime quality gate에 반영됩니다.
- 관련 example test와 property-style test가 추가됩니다.
- workspace build/test가 통과합니다.

## Security Baseline 준수

- `.npmrc`와 `.env` raw secret 값은 생성 파일, report, diagnostics, audit에 기록하지 않습니다.
- source script는 변환 중 실행하지 않습니다.
- registry URL과 scope routing만 safe artifact로 보존합니다.
- private package name은 dependency compatibility와 install readiness에 필요한 최소 범위로만 기록합니다.

## Property-Based Testing 준수

- 같은 `.npmrc`/script/env 입력은 항상 같은 artifact ordering을 생성해야 합니다.
- secret-like value는 어떤 생성 artifact에도 나타나면 안 됩니다.
- package/script/env key는 중복 없이 stable하게 병합되어야 합니다.
- unsafe script classification은 입력 순서와 무관하게 동일해야 합니다.

## 승인 게이트

Status: 코드 생성이 완료되었습니다. 생성 코드 리뷰 승인 후 V2-GAP-UOW-08 Build and Test closure로 진행합니다.
