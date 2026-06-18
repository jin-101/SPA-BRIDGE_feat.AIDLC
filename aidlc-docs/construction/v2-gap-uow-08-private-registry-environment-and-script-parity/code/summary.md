# V2-GAP-UOW-08 코드 생성 요약

## 구현 범위

V2-GAP-UOW-08은 Angular source repository의 기업형 실행 전제 조건을 생성된 Next.js target repository로 안전하게 옮기기 위한 기능입니다. 이번 구현은 private Nexus/npm registry, `.npmrc`, 내부 패키지, source package scripts, 환경변수 계약, package manager parity를 target generation pipeline에 연결했습니다.

## 주요 구현

- `packages/target-react/src/enterprise/`에 enterprise parity 모듈을 추가했습니다.
- `.npmrc` parser와 registry migration planner를 추가해 safe registry/scope routing은 보존하고 auth token, password, secret-like 값은 placeholder로 치환합니다.
- source `package.json` scripts를 intent별로 분류하고 Next.js-safe `dev`, `build`, `start`, `lint`, `typecheck`, `analyze` script로 변환합니다.
- `.env*`, package script, Angular environment evidence에서 환경변수 key를 수집하고 server/client/secret 분류 및 `.env.example` contract를 생성합니다.
- source `package.json#packageManager`, `yarn.lock`, `pnpm-lock.yaml`, `package-lock.json`, `.yarnrc*`, `pnpm-workspace.yaml` 등을 감지해 generated target의 package manager와 version을 보존합니다.
- target write plan에 `.npmrc`, `.npmrc.example`, `.env.example`, registry/script/environment review JSON artifact를 추가합니다.
- target write plan에 `src/review/package-manager-parity-report.json`을 추가합니다.
- CLI bridge가 Angular project root와 workspace root에서 `.npmrc`, source scripts, env key evidence를 수집해 target generation request로 전달하도록 연결했습니다.
- CLI bridge가 source package manager evidence를 수집해 target generation request로 전달하도록 연결했습니다.
- runtime parity quality gate가 enterprise parity artifact와 `typecheck` script readiness를 quality signal로 반영하도록 확장했습니다.
- reporting view model에 enterprise parity summary field를 optional로 추가했습니다.

## 생성되는 Target Artifact

- `.npmrc`
- `.npmrc.example`
- `.env.example`
- `src/review/registry-migration-report.json`
- `src/review/script-migration-report.json`
- `src/review/environment-contract-report.json`
- `src/review/package-manager-parity-report.json`
- `.spa-bridge/registry-migration-summary.json`
- `.spa-bridge/script-migration-summary.json`
- `.spa-bridge/environment-contract-summary.json`
- `.spa-bridge/package-manager-parity-summary.json`

## 보안 정책

- `.npmrc` token, password, auth 값은 생성 파일과 report에 기록하지 않습니다.
- `.env` raw value는 target generation request와 generated artifact에 복사하지 않고 key와 placeholder만 사용합니다.
- source script는 변환 중 실행하지 않습니다.
- unsafe script와 Angular-only script는 target `package.json`에 복사하지 않고 manual review item으로 남깁니다.

## 테스트 및 검증

- `npm run test --workspace @spa-bridge/target-react` 통과
- `npm run test --workspace @spa-bridge/cli` 통과
- `npm run test --workspace @spa-bridge/core-reporting` 통과
- `npm run test --workspace @spa-bridge/core-quality` 통과
- `npm test` 통과, 145 tests passed
- `npm run build` 통과

## 남은 검토 사항

- 실제 private Nexus 환경에서는 생성된 `.npmrc.example`의 placeholder에 CI 또는 로컬 secret 값을 설정해야 합니다.
- 내부 패키지는 dependency compatibility filter와 함께 설치 가능성은 보존하지만, package API 차이는 manual review와 self-correction validation으로 확인해야 합니다.
- 내부 패키지 간 peer dependency metadata를 Nexus에서 직접 조회하지는 않으므로, source package manager 기준 설치 검증과 manual review가 필요할 수 있습니다.
- deploy/publish 계열 source script는 자동 변환하지 않으므로 target 운영 방식에 맞춰 별도 검토가 필요합니다.
