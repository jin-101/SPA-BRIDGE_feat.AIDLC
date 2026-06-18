# V2-GAP-UOW-08 비즈니스 규칙

## `.npmrc` 및 Nexus registry 규칙

- source root와 Angular project root의 `.npmrc`를 모두 탐지한다.
- scope registry entry는 target `.npmrc`에 보존한다.
- `registry`, `always-auth`, `strict-ssl`, `legacy-peer-deps`처럼 안전하게 복사 가능한 값은 target에 반영한다.
- `_authToken`, `_auth`, password, username, token-like 값은 target 파일에 raw value로 쓰지 않는다.
- secret entry는 `.npmrc.example`에 placeholder로 기록하고 manual-review diagnostic을 생성한다.
- `.npmrc`가 없지만 내부 package scope가 있으면 registry 설정 누락 diagnostic을 생성한다.

## 내부 패키지 규칙

- source `dependencies`와 `devDependencies`에서 내부 scope 패키지를 식별한다.
- dependency compatibility classifier가 Angular-only로 분류한 패키지는 제거 또는 replacement 규칙을 따른다.
- Angular-only가 아닌 내부 패키지는 version을 보존한다.
- 내부 패키지의 React/Next.js API 호환성이 검증되지 않았으면 manual-review item을 생성한다.
- internal package와 registry scope rule이 연결되지 않으면 install-readiness warning을 생성한다.

## `package.json` script 변환 규칙

- source script를 intent 기준으로 분류한다.
- 기본 Next.js target script는 항상 생성한다:
  - `dev`: `next dev`
  - `build`: `next build`
  - `start`: `next start`
  - `lint`: `next lint`
- Angular CLI 전용 script는 그대로 복사하지 않는다.
- `ng serve`, `ng build`, Angular builder command는 Next.js-safe script로 변환하거나 review 처리한다.
- 사내 deploy, publish, Jenkins, shell wrapper, credential setup script는 자동 실행/복사하지 않고 review 처리한다.
- source script에서 환경변수를 설정하는 경우 환경변수 inventory로 연결한다.

## 환경변수 규칙

- `.env*`, package scripts, Angular environment files, source code reference를 모두 inventory 대상으로 삼는다.
- raw secret value는 target `.env`에 쓰지 않는다.
- `.env.example`에는 placeholder만 기록한다.
- browser/client에서 필요한 변수만 `NEXT_PUBLIC_` prefix를 부여한다.
- server-only 변수는 prefix 없이 계약만 보존한다.
- 분류가 불확실한 변수는 `unknown`으로 표시하고 review가 필요하다.

## artifact 생성 규칙

- target에는 안전한 `.npmrc`와 `.npmrc.example`을 생성할 수 있다.
- target에는 `.env.example`을 생성한다.
- review artifact는 다음을 포함한다:
  - `src/review/registry-migration-report.json`
  - `src/review/script-migration-report.json`
  - `src/review/environment-contract-report.json`
- 모든 artifact는 stable ordering으로 생성한다.
- artifact에는 raw secret, credential, token이 포함되면 안 된다.

## reporting 및 quality 연동 규칙

- CLI/reporting export에는 registry/script/env summary를 포함한다.
- manual-review item은 secret placeholder, unsupported script, internal package API uncertainty, missing registry scope를 명확히 표시한다.
- runtime parity 및 self-correction quality signal에는 registry/script/env readiness를 반영한다.
- 안전하지 않은 source script는 변환 중 자동 실행하지 않는다.

## 테스트 규칙

- Nexus scope registry 보존 테스트가 필요하다.
- secret redaction 테스트가 필요하다.
- internal package carry-over 테스트가 필요하다.
- script translation 테스트가 필요하다.
- env classification 및 `.env.example` 생성 테스트가 필요하다.
- report artifact determinism 테스트가 필요하다.
