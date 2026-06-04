# Requirements Verification Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose the last option, `Other`, and describe your preference after the tag.

## Question 1
초기 MVP에서 지원할 변환 범위는 어디까지인가요?

A) Angular 15+에서 React 18+로의 기본 컴포넌트, 템플릿, 스타일, 서비스 변환
B) A에 라우팅 변환까지 포함
C) B에 NgRx에서 타겟 상태 관리 라이브러리로의 변환까지 포함
D) 전체 요구사항 범위 모두 포함: 컴포넌트, 라우팅, 상태 관리, DI, 라이프사이클, 보일러플레이트, self-correction
X) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 2
SPA-Bridge의 주 사용자 인터페이스는 무엇으로 시작해야 하나요?

A) CLI 도구 중심
B) 웹 UI 중심
C) 라이브러리/SDK 중심
D) CLI와 웹 UI를 모두 제공
X) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 3
타겟 React 프로젝트 생성 방식은 무엇을 기본값으로 둘까요?

A) Vite + React + TypeScript
B) Next.js + TypeScript
C) 사용자가 입력 프로젝트별로 선택
D) 초기에는 코드 변환 산출물만 생성하고 프로젝트 보일러플레이트는 후순위
X) Other (please describe after [Answer]: tag below)

[Answer]: X 사용자가 프로젝트 별로 선택하게 하지만 선택이 없을 때는 기본 값(Vite + React + TypeScript)으로 실행.

## Question 4
Angular 상태 관리 변환의 기본 타겟은 무엇인가요?

A) React Context API
B) Redux Toolkit
C) Zustand
D) 입력 프로젝트의 복잡도에 따라 자동 선택
X) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 5
LLM 연동은 어떤 방식으로 우선 설계해야 하나요?

A) 외부 상용 LLM API 우선, 로컬 LLM은 확장 포인트로 설계
B) 로컬/내부 LLM 우선, 외부 API는 선택적 어댑터로 설계
C) 추상 Provider 인터페이스를 우선 만들고 두 방식을 동일 우선순위로 지원
D) 초기 버전에서는 LLM 호출을 mock/stub 처리하고 AST 룰 엔진부터 구현
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 6
변환 성공률 85% 목표를 어떤 기준으로 측정해야 하나요?

A) TypeScript 컴파일 성공률
B) ESLint/Prettier 통과율
C) 샘플 프로젝트 E2E 빌드 성공률
D) 컴파일, lint, 주요 테스트 통과를 조합한 품질 게이트
X) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 7
민감 정보 마스킹 파이프라인은 초기 릴리즈에서 어느 수준까지 필요하나요?

A) 외부 LLM 호출 전 필수 기능으로 구현
B) Provider 설정에 따라 외부 LLM 사용 시에만 활성화
C) 설계만 포함하고 구현은 후속 단계로 분리
D) 초기 릴리즈 범위에서 제외
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8
확장 가능한 플러그인 아키텍처는 어떤 수준으로 설계해야 하나요?

A) Angular to React만 구현하되 내부 인터페이스를 플러그인 친화적으로 분리
B) 소스/타겟 프레임워크 변환기를 실제 플러그인으로 로딩하는 구조까지 구현
C) 변환 룰과 LLM 프롬프트 템플릿만 플러그인화
D) 초기에는 플러그인 구조 없이 Angular to React 구현 집중
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 9
Property-Based Testing Extension을 이 프로젝트에 적용할까요?

A) Yes - 모든 PBT 규칙을 blocking constraint로 적용 (비즈니스 로직, 데이터 변환, 직렬화, 상태 컴포넌트가 있는 프로젝트에 권장)
B) Partial - 순수 함수와 직렬화 round-trip에만 PBT 규칙 적용
C) No - PBT 규칙을 적용하지 않음
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10
Security Baseline Extension을 이 프로젝트에 적용할까요?

A) Yes - 모든 SECURITY 규칙을 blocking constraint로 적용 (production-grade 애플리케이션에 권장)
B) No - SECURITY 규칙을 적용하지 않음 (PoC, prototype, experimental project에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: A

