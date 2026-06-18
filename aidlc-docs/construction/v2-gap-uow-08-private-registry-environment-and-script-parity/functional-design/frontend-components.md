# V2-GAP-UOW-08 사용자 표시 및 리뷰 흐름

## CLI 사용자 흐름

CLI 변환이 끝나면 사용자는 생성된 Next.js 프로젝트와 함께 registry/script/env migration 결과를 확인할 수 있어야 한다.

CLI summary에 표시할 내용:
- `.npmrc` registry migration 상태
- credential placeholder 필요 여부
- 내부 패키지 review 필요 개수
- 변환된 script 개수
- review가 필요한 script 개수
- environment contract artifact 경로
- `.env.example` 생성 여부

## 생성 프로젝트 내 리뷰 파일

생성된 Next.js target에는 다음 review 파일이 포함된다.

- `src/review/registry-migration-report.json`
- `src/review/script-migration-report.json`
- `src/review/environment-contract-report.json`

각 파일은 사람이 확인하기 쉬운 summary와 machine-readable details를 모두 포함한다.

## `.npmrc` 사용자 경험

target `.npmrc`는 안전한 registry routing만 포함한다.

예시:

```text
@wds:registry=https://nexus.example/repository/npm/
always-auth=true
```

target `.npmrc.example`은 credential placeholder를 포함한다.

예시:

```text
//nexus.example/repository/npm/:_authToken=${NPM_TOKEN}
```

사용자는 `.npmrc.example`을 보고 본인의 로컬/CI 환경에서 token을 주입할 수 있다.

## `.env.example` 사용자 경험

`.env.example`은 값을 복사하지 않고 필요한 변수의 placeholder만 보여준다.

예시:

```text
API_BASE_URL=
NEXT_PUBLIC_CDN_URL=
AUTH_TOKEN=
```

secret으로 분류된 값은 실제 값 없이 placeholder와 review 설명만 제공한다.

## Web UI 리뷰 흐름

Web UI에서 표시할 경우 다음 패널로 나눌 수 있다.

- Registry migration summary
- Internal package compatibility summary
- Script translation summary
- Environment contract summary
- Manual review action list

각 패널은 secret 값을 표시하지 않는다.

## 수동 검증 흐름

사용자는 변환 후 다음 순서로 확인한다.

1. `.npmrc.example`에서 필요한 token/env placeholder 확인
2. 로컬 또는 CI secret store에 token 설정
3. `.env.example` 기준으로 필요한 환경변수 설정
4. generated Next.js project에서 `npm install`
5. `npm run dev`
6. review report에서 unresolved item 확인
