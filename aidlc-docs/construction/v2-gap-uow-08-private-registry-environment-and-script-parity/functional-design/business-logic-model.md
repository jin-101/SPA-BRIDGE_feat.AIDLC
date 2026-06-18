# V2-GAP-UOW-08 비즈니스 로직 모델

## 개요

V2-GAP-UOW-08의 로직은 source repository의 install/runtime 계약을 읽고, Next.js target에서 안전하게 재현 가능한 형태로 정규화한다. 전체 흐름은 `.npmrc` 분석, 내부 패키지 분류, script intent 변환, 환경변수 계약 생성, target artifact materialization, reporting/quality 연동 순서로 진행된다.

## 처리 흐름

1. Angular source project root와 workspace root를 확인한다.
2. `.npmrc` 후보 파일을 탐지한다.
3. `.npmrc` entry를 safe entry와 secret entry로 분류한다.
4. source `package.json`의 dependencies, devDependencies, scripts를 읽는다.
5. 내부 package scope와 registry scope mapping을 연결한다.
6. dependency compatibility classifier 결과와 합쳐 target package manifest를 결정한다.
7. source script를 intent별로 분류한다.
8. Next.js-safe script mapping을 생성한다.
9. `.env*`, Angular environment files, package scripts, source reference에서 환경변수를 inventory화한다.
10. 환경변수를 server-only, client-exposed, secret, placeholder, unknown으로 분류한다.
11. target `.npmrc`, `.npmrc.example`, `.env.example`, review report artifact를 생성한다.
12. CLI/reporting/runtime parity/self-correction summary에 registry/script/env readiness를 연결한다.

## `.npmrc` 분석 로직

`.npmrc` parser는 line-based로 동작한다.

- 빈 줄과 comment는 보존 또는 생략 가능하다.
- `@scope:registry=...`는 scope registry entry로 분류한다.
- `registry=...`는 default registry entry로 분류한다.
- `_authToken`, `_auth`, `password`, `username` 계열은 secret entry로 분류한다.
- `${NPM_TOKEN}` 같은 env substitution도 raw secret은 아니지만 credential-required 항목으로 분류한다.

출력:
- safe target `.npmrc`
- credential placeholder가 포함된 `.npmrc.example`
- secret-required diagnostic

## 내부 패키지 분류 로직

내부 패키지는 다음 기준으로 식별한다.

- `.npmrc`에 scope registry가 존재하는 scope
- 설정 가능한 internal scope allowlist
- package name pattern: `@company/*`, `@wds/*` 같은 scoped package

분류 결과:
- `carry`: target에 그대로 포함
- `replace`: 명시 replacement rule 적용
- `remove`: Angular-only 또는 unsafe
- `review`: 설치는 보존하되 API 확인 필요

## script 변환 로직

script classifier는 command text와 script name을 함께 본다.

예시 mapping:
- `ng serve`, `npm run start:*` with Angular dev server -> `dev: next dev`
- `ng build`, Angular production build -> `build: next build`
- `ng test`, karma/jasmine-only -> review 또는 target test script
- `ng lint`, eslint-compatible -> `lint: next lint`
- `webpack-bundle-analyzer` 또는 analyze command -> optional analyze script
- deploy/publish/ci wrapper -> review

생성되는 `package.json` script는 Next.js 기본 script를 우선하고, source script intent에서 안전하게 변환 가능한 것만 추가한다.

## 환경변수 inventory 로직

탐지 위치:
- `.env`, `.env.local`, `.env.development`, `.env.production`
- `package.json` scripts 내 `FOO=bar`, `cross-env FOO=bar`
- Angular environment files
- source code 내 `process.env.FOO`, `import.meta.env.FOO`

분류 기준:
- 이름에 `TOKEN`, `SECRET`, `PASSWORD`, `KEY`, `AUTH`가 포함되면 secret 후보
- browser bundle에서 사용되면 client-exposed 후보
- server/runtime script에서만 사용되면 server-only 후보
- 값 없이 참조만 있으면 placeholder 후보

Next.js mapping:
- client-exposed: `NEXT_PUBLIC_*`
- server-only: 기존 이름 유지
- secret: `.env.example` placeholder만 생성
- unknown: review 필요

## quality 연동 로직

registry/script/env readiness는 다음 signal로 제공된다.

- `registryConfigReady`
- `secretPlaceholderCount`
- `internalPackageReviewCount`
- `translatedScriptCount`
- `unsupportedScriptCount`
- `environmentVariableCount`
- `clientExposedEnvCount`
- `secretEnvCount`
- `envManualReviewCount`

이 signal은 runtime parity quality artifact와 self-correction summary에 반영될 수 있다.
