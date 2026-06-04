# [요구사항 분석서] AI 기반 SPA 프레임워크 자동 전환 소프트웨어 (SPA-Bridge)

## 1. 개요 (Introduction)
* **프로젝트명:** SPA-Bridge (가칭)
* **목적:** 특정 SPA 프레임워크(예: Angular 15+)로 작성된 웹 애플리케이션 소스코드를 입력받아, 타겟 SPA 프레임워크(예: React 18+)의 구조 및 소스코드로 자동 변환하는 소스 대 소스 컴파일러(Transpiler) 개발.
* **배경:** 프레임워크 마이그레이션은 막대한 시간과 비용, 그리고 휴먼 에러를 동반함. 이를 자동화하여 레거시 현대화(Modernization) 비용을 획기적으로 줄이고 개발 생산성을 극대화하고자 함.
* **개발 방법론:** AI-DLC (AI-Driven Development Life Cycle)

---

## 2. 시스템 아키텍처 및 핵심 워크플로우 (System Architecture)

전환 프로세스는 크게 **구문 분석(Parsing) -> 매핑 및 변환(Mapping & Transformation) -> 코드 생성(Generation)**의 3단계 Pipeline으로 구성됩니다.

```
[Source Code (Angular)] 
       │
       ▼
1. 소스 분석기 (AST Parsing) ──────> 컴포넌트/디렉토리 구조 파악
       │
       ▼
2. AI 프레임워크 매핑 엔진 ───────> LLM 기반 문맥 및 상태 관리 변환
       │
       ▼
3. 타겟 코드 생성기 (Generation) ──> 정적 분석 및 포맷팅 (Prettier/ESLint)
       │
       ▼
[Target Code (React)]
```

---

## 3. 기능적 요구사항 (Functional Requirements)

### 3.1. 소스코드 분석 및 추상 구문 트리(AST) 추출
* **F-101: 다중 파일 및 디렉토리 구조 스캔**
    * 시스템은 프로젝트 루트 폴더를 입력받아 파일 트리를 분석해야 함.
    * Angular의 `*.module.ts`, `*.component.ts`, `*.html`, `*.scss` 등 프레임워크 특화 파일 간의 연관 관계(의존성 그래프)를 파악해야 함.
* **F-102: 정적 분석 및 AST 생성**
    * Babel, TypeScript Compiler API 등을 활용해 소스코드를 AST(Abstract Syntax Tree)로 파악하고, 프레임워크 종속적인 문법 구조를 추출해야 함.

### 3.2. 프레임워크 핵심 요소 매핑 및 변환 (Core Mapping Engine)
* **F-201: 컴포넌트 구조 변환**
    * Angular의 데코레이터(`@Component`) 기반 클래스 구조를 React의 함수형 컴포넌트(Functional Component) 구조로 변환해야 함.
    * Template(`html`)과 Style(`scss/css`), Logic(`ts`) 파일로 분리된 구조를 단일 JSX/TSX 파일 또는 React 컨벤션 구조로 통합/재배치해야 함.
* **F-202: 데이터 바인딩 및 상태 관리 변환**
    * Angular의 양방향 바인딩(`[(ngModel)]`), 단방향 바인딩(`[value]`), 이벤트 바인딩(`(click)`)을 React의 `useState` 및 이벤트 핸들러 구조로 매핑해야 함.
    * Angular 서비스(`@Injectable`) 및 NgRx 기반 상태 관리를 React Context API, Redux Toolkit, 또는 Zustand 등 타겟 상태 관리 코드로 전환해야 함.
* **F-203: 의존성 주입(DI) 및 생명주기 매핑**
    * Angular Constructor를 통한 의존성 주입(Dependency Injection) 패턴을 분석하여 React의 Hook 기반 주입 패턴이나 모듈 임포트 방식으로 변환해야 함.
    * 생명주기 메서드(`ngOnInit`, `ngOnChanges`, `ngOnDestroy`)를 React의 `useEffect` 훅으로 정밀 매핑해야 함.

### 3.3. AI 기반 코드 최적화 및 보정 (AI-Driven Refinement)
* **F-301: 룰 기반(Rule-based) 변환 한계 극복**
    * 단순 1:1 매핑이 불가능한 복잡한 비즈니스 로직 및 라이브러리 의존성은 LLM(Large Language Model)을 활용하여 컨텍스트를 유지한 채 타겟 프레임워크 스타일 코드로 재작성(Refactoring)해야 함.
* **F-302: 타입 에러 및 유효성 검증 자동 수정**
    * 변환 후 발생할 수 있는 TypeScript 컴파일 에러를 AI가 스스로 감지하고(Self-Debugging Feed-forward) 코드를 보정해야 함.

### 3.4. 결과물 생성 및 환경 설정
* **F-401: 프로젝트 환경 구성 (Boilerplate 생성)**
    * 타겟 프레임워크에 맞는 빌드 도구(`Vite`, `Webpack` 등) 환경 설정 파일(`package.json`, `tsconfig.json`, `vite.config.ts` 등)을 자동으로 생성해야 함.
* **F-402: 코드 포맷팅**
    * 생성된 코드는 타겟 프레임워크의 표준 스타일에 맞게 `ESLint` 및 `Prettier`가 적용되어 출력되어야 함.

---

## 4. 비기능적 요구사항 (Non-Functional Requirements)

* **N-101: 코드 보존율 및 정확성**
    * 기존 비즈니스 로직의 누락이 없어야 하며, 자동 변환 성공률(컴파일 에러 없이 빌드되는 비율)은 최초 릴리즈 기준 **85% 이상**을 목표로 함.
* **N-102: 확장성 (Scalability)**
    * 현재는 Angular ➡️ React 변환을 주력으로 하지만, 향후 Vue.js, Svelte 등 타 프레임워크 쌍(Pair)이 추가되기 용이하도록 플러그인 아키텍처 구조를 가져야 함.
* **N-103: 변환 속도 및 효율성**
    * 대규모 프로젝트(컴포넌트 100개 이상) 기준 변환 완료까지 소요 시간이 적정 수준(AI API 처리 속도 포함 10분 이내)을 유지해야 함. 토큰 소모 효율화를 위한 하이브리드(AST 룰 + AI 보정) 방식을 채택함.

### 4.2. 보안 요구사항 (Security Requirements)
* **N-201: 데이터 로컬 전용 처리 (Zero-Outbound Option)**
    * 폐쇄망 환경을 요구하는 고객을 위해, 외부 API 호출 없이 로컬/내부 서버 환경에서 폐쇄형 LLM(Local LLM)을 연동할 수 있는 구동 모드를 지원해야 함.
* **N-202: AI 데이터 학습 방지 보장**
    * 상용 LLM API 연동 시, '데이터 학습 제외(Data Opt-Out)' 정책이 적용된 기업용 API 엔드포인트만을 활용해야 함.
* **N-203: 민감 정보 마스킹 (Data Masking Pipeline)**
    * 외부 LLM으로 코드를 전송하기 전, 사내 자산 정보(IP, URL, 고유 비즈니스 용어)를 자동으로 감지하여 가명화 처리하고, 코드 생성 완료 후 복원하는 가명화 모듈을 탑재해야 함.
    
---

## 5. AI-DLC 적용 개발 단계별 이정표 (Milestones)

본 프로젝트는 AI-DLC 방법론에 따라 각 단계별로 AI 프롬프트 엔지니어링, 코드 생성 AI 가이드를 적극 활용하여 린(Lean)하게 진행합니다.

| 단계 | 단계명 | 주요 태스크 및 AI 활용 방안 | 산출물 |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Architecture Design & Prompt Engineering** | • 프레임워크 간 문법 매핑 테이블 구체화<br>• AST 파싱 결과 요약 및 LLM 주입용 프롬프트 템플릿 설계 | 프롬프트 명세서, 시스템 아키텍처 다이어그램 |
| **Phase 2** | **Core AST Parser & Rule Engine Dev** | • AI 코딩 어시스턴트(Copilot 등)를 활용하여 Angular 소스 분석용 정적 분석기 고속 개발 | AST 파서 모듈, 파일 디렉토리 스캔 로직 |
| **Phase 3** | **AI Hybrid Translation Engine Dev** | • LLM API 연동 및 하이브리드 변환 엔진 구축<br>• 소스코드 프레임워크 전환 프롬프트 파인튜닝/퓨샷 임베딩 | 1차 변환 파이프라인 엔진 |
| **Phase 4** | **Self-Correction & Linting (QA)** | • 변환된 코드를 TypeScript Compiler API로 검사<br>• 에러 발생 시 AI에게 에러 로그와 코드를 재입력하여 자동 수정하는 피드백 루프 구현 | 자동 보정(Self-Healing) 모듈 |
| **Phase 5** | **E2E Testing & Evaluation** | • 샘플 Angular 프로젝트(컴포넌트, 서비스, 라우팅 포함)를 투입하여 React로 실제 빌드 및 구동 테스트 | 최종 테스트 결과 보고서, 패키징 소프트웨어 |

---

## 6. 제약 사항 및 고려 사항 (Constraints)
* **서드파티 라이브러리 의존성:** Angular Material, NgRx 등 Angular 전용 에코시스템 라이브러리는 React 계열(MUI, Redux Toolkit 등)로 완벽히 1:1 매핑되지 않을 수 있으므로, AI가 가장 유사한 대체재를 찾아 래핑하거나 관련 Stub 코드를 생성하도록 가이드라인이 필요함.
* **API 비용:** LLM API 호출 횟수 및 토큰 수에 따른 비용 최적화를 위해, 정적 분석(AST)으로 처리 가능한 영역과 AI가 처리해야 할 영역을 명확히 분리해야 함.
