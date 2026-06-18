# V2-GAP-UOW-08 도메인 엔티티

## 목적

이 유닛은 Angular 소스 레포지토리의 설치/런타임 환경 계약을 생성된 Next.js 프로젝트로 안전하게 이전하기 위한 도메인 모델을 정의한다. 핵심은 private Nexus/npm registry, 내부 패키지, `package.json` scripts, 환경변수를 보존하되 secret 값을 생성물에 직접 쓰지 않는 것이다.

## 엔티티

### SourceNpmrcFile

소스 레포지토리에서 발견된 `.npmrc` 파일을 나타낸다.

필드:
- `path`: source `.npmrc` 경로
- `scopeRegistries`: scope별 registry mapping
- `safeEntries`: secret이 아닌 npm config entry
- `secretEntries`: token/password/auth 관련 entry
- `diagnostics`: secret redaction 또는 unsupported config 진단

규칙:
- root와 project-level `.npmrc`를 모두 탐지한다.
- `_authToken`, `_auth`, password, username, token-like 값은 secret으로 분류한다.
- secret 값은 target `.npmrc`에 직접 복사하지 않는다.

### RegistryMigrationPlan

source registry 설정을 target registry artifact로 변환하는 계획이다.

필드:
- `safeTargetNpmrcEntries`: target `.npmrc`에 쓸 수 있는 안전한 entry
- `exampleNpmrcEntries`: `.npmrc.example`에 쓸 placeholder entry
- `credentialPlaceholders`: 사용자가 채워야 하는 credential placeholder
- `manualReviewItems`: 직접 확인이 필요한 registry 설정

규칙:
- scope routing은 최대한 보존한다.
- credential이 필요한 경우 placeholder와 review 항목을 생성한다.
- registry URL 자체가 private이라도 secret은 아니므로 scope routing 정보로 보존할 수 있다.

### InternalPackageDependency

source `package.json`에 있는 내부 패키지 dependency를 나타낸다.

필드:
- `packageName`: 내부 패키지명
- `scope`: npm scope
- `version`: source version
- `dependencyKind`: dependencies 또는 devDependencies
- `registryScopeMatched`: `.npmrc` scope rule과 연결되었는지 여부
- `compatibilityStatus`: carry, replace, remove, review
- `apiReviewRequired`: React/Next.js API 호환성 확인 필요 여부

규칙:
- Angular-only로 분류되지 않는 내부 패키지는 기본적으로 보존한다.
- API 호환성이 불확실하면 package는 보존하되 manual review를 생성한다.
- 내부 패키지가 Angular wrapper일 가능성이 있으면 dependency compatibility classifier 결과를 우선한다.

### SourceScriptIntent

source `package.json` script의 의도를 분류한 결과이다.

필드:
- `scriptName`: source script 이름
- `sourceCommand`: 원본 command
- `intent`: dev, build, start, lint, test, analyze, env-setup, deploy, angular-only, unknown
- `targetScriptName`: 생성될 Next.js script 이름
- `targetCommand`: 생성될 Next.js-safe command
- `migrationStatus`: translated, copied-safe, dropped, review
- `reason`: 변환 근거

규칙:
- Angular CLI 의존 script는 그대로 복사하지 않는다.
- `ng serve`/dev server 계열은 `next dev`로 변환한다.
- `ng build`/production build 계열은 `next build`로 변환한다.
- 배포/사내 wrapper script는 실행 위험이 있으므로 review로 둔다.

### EnvironmentVariableInventoryItem

소스에서 발견된 환경변수 사용을 나타낸다.

필드:
- `name`: source variable 이름
- `sourceLocations`: 발견 위치
- `sourceKind`: env-file, package-script, angular-environment-file, source-reference
- `classification`: server-only, client-exposed, secret, placeholder, unknown
- `targetName`: Next.js target variable 이름
- `copyPolicy`: omit, example-placeholder, generated-reference
- `manualReviewRequired`: 확인 필요 여부

규칙:
- secret 값은 `.env`로 복사하지 않는다.
- browser에서 필요한 값만 `NEXT_PUBLIC_` prefix를 사용한다.
- 분류가 불확실하면 `unknown` 또는 `manualReviewRequired`로 둔다.

### EnvironmentContractReport

생성된 Next.js 프로젝트가 요구하는 환경변수 계약을 나타낸다.

필드:
- `variables`: 환경변수 inventory 목록
- `exampleEnvEntries`: `.env.example`에 들어갈 placeholder
- `secretCount`: secret 변수 개수
- `clientExposedCount`: client-exposed 변수 개수
- `manualReviewCount`: review 필요 항목 개수

규칙:
- raw secret 값은 포함하지 않는다.
- 사용자가 설치/실행 전에 채워야 할 변수를 명확히 보여준다.

### EnterpriseParityArtifacts

V2-GAP-UOW-08이 생성하는 target artifact 묶음이다.

필드:
- `.npmrc`
- `.npmrc.example`
- `.env.example`
- `src/review/registry-migration-report.json`
- `src/review/script-migration-report.json`
- `src/review/environment-contract-report.json`

규칙:
- 모든 artifact는 deterministic ordering을 가져야 한다.
- secret 값은 artifact에 직접 포함하지 않는다.
- report는 CLI/reporting export와 연결된다.
