# V2-GAP-UOW-08 Private Registry, Environment, and Script Parity 기능 설계 계획

## 유닛 컨텍스트

V2-GAP-UOW-08은 dependency filtering만으로 해결할 수 없는 기업형 설치/런타임 호환성을 다룹니다. 많은 Angular 소스 레포지토리는 private Nexus/npm registry, `.npmrc` scope routing, 내부 배포 패키지, 환경변수, source package script에 의존합니다. 생성되는 Next.js 타깃은 credential을 유출하지 않고 Angular 전용 명령을 무작정 복사하지 않으면서, 이러한 전제 조건을 안전하게 보존해야 합니다.

## 추천 기본값

현재 제품 목표 기준으로 모든 질문의 추천 답변은 A입니다. A 선택지는 private registry routing, 내부 패키지 설치 가능성, 기존 script 의도, 환경변수 계약을 보존하면서 secret이 생성 파일과 리포트에 기록되지 않도록 합니다.

## 기능 설계 작업

- [x] `.npmrc` 탐지 및 안전한 registry materialization 정책 확정
- [x] 내부 패키지 scope 분류 및 compatibility 동작 확정
- [x] source script 분류 및 Next.js script 변환 규칙 확정
- [x] 환경변수 inventory 및 노출 정책 확정
- [x] 생성 artifact, diagnostic, reporting 연동 확정
- [x] 테스트 및 property-based invariant 확정
- [x] 답변 승인 후 기능 설계 산출물 생성

## 질문

각 질문의 `[Answer]:` 태그 뒤에 선택지 문자를 입력해 주세요. 선택지가 맞지 않으면 `X) Other`를 선택하고 `[Answer]:` 뒤에 원하는 방식을 설명해 주세요.

### Question 1
Nexus/private registry 설정이 들어 있는 source `.npmrc` 파일은 어떻게 처리할까요?

A) root/project `.npmrc`를 파싱하고, 안전한 registry/scope routing은 보존하며, secret은 redaction하고 credential이 필요한 경우 target `.npmrc`와 `.npmrc.example`을 생성
B) source `.npmrc`를 byte-for-byte로 생성된 Next.js 프로젝트에 그대로 복사
C) `.npmrc`를 무시하고 private registry 설정은 전부 사용자가 직접 처리
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
secret이 포함된 npm config 값은 어떻게 처리할까요?

A) raw token/password는 절대 복사하지 않고 placeholder, secret-required diagnostic, manual-review action을 생성
B) 환경변수 substitution 형태로 되어 있으면 token도 복사 허용
C) 생성 프로젝트의 설치 동작을 맞추기 위해 모든 값을 그대로 복사
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
내부 패키지 scope는 생성된 Next.js target에 어떻게 반영할까요?

A) 호환 가능한 내부 패키지와 version은 보존하고 registry scope rule과 연결하며, API compatibility가 불확실하면 manual review로 표시
B) 호환성을 보장할 수 없으므로 모든 내부 패키지 제거
C) 모든 내부 패키지를 diagnostic 없이 그대로 복사
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
source `package.json` scripts는 어떻게 변환할까요?

A) script intent를 분류하고 dev/build/start/lint/test/analyze를 Next.js-safe script로 생성하며 Angular 전용 script는 제거하거나 review 표시
B) source script를 정확히 그대로 복사
C) source script는 무시하고 기본 Next.js script만 생성
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
환경변수는 어떻게 탐지할까요?

A) `.env*`, package script, Angular environment 파일, `process.env.*` 또는 import-meta env 사용을 모두 inventory화
B) `.env` 파일만 읽기
C) 환경변수는 검사하지 않음
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
Next.js용 환경변수 mapping은 어떻게 처리할까요?

A) server-only, client-exposed, secret, placeholder로 분류하고, client-exposed 값에만 `NEXT_PUBLIC_`을 사용하며 secret 값은 절대 복사하지 않음
B) 모든 변수에 `NEXT_PUBLIC_` prefix 적용
C) source `.env` 값을 생성 프로젝트에 그대로 복사
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
어떤 target artifact를 생성해야 할까요?

A) 안전한 `.npmrc`, `.npmrc.example`, `.env.example`, registry migration report, script migration report, environment contract report 생성
B) `package.json`만 생성
C) 새 artifact 없이 diagnostic만 생성
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
reporting 및 review output과는 어떻게 연동할까요?

A) registry/script/env summary를 CLI/reporting export에 추가하고, secret/unsupported script/internal package API 불확실성에 대해 manual-review item 생성
B) JSON artifact만 쓰고 CLI/reporting 연동은 생략
C) terminal warning만 출력
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
self-correction 및 install readiness는 이 정보를 어떻게 활용해야 할까요?

A) 안전하지 않은 script는 실행하지 않되, 생성된 registry/script/env artifact를 runtime parity 및 self-correction quality signal에 반영
B) 변환 중 모든 migrated source script를 자동 실행
C) 이 유닛은 quality gate와 연결하지 않음
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
blocking test는 어디에 집중해야 할까요?

A) Nexus `.npmrc` scope 보존, secret redaction, 내부 패키지 carry-over, script translation, env classification, artifact determinism, report safety, generated package manifest integration
B) `.npmrc` 복사 example test만 작성
C) private registry 동작은 환경 의존적이므로 테스트하지 않음
X) Other (please describe after [Answer]: tag below)

[Answer]: A
