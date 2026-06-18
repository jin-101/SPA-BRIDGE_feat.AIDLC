# SPA-Bridge Requirements V2

## Purpose

This document tracks post-greenfield requirement changes discovered while exercising SPA-Bridge against real Angular-to-React conversion expectations.

The original requirements remain in `requirements.md`. This file records later change requests, implemented results, and remaining gaps.

## V2 Product Goal

The generated React project should be usable as a replacement project:

- A user provides a full Angular repository.
- SPA-Bridge generates a full React repository.
- The user runs the source-compatible package manager install command and dev command in the generated React repository, for example `yarn install`/`yarn dev`, `pnpm install`/`pnpm dev`, or `npm install`/`npm run dev`.
- The generated React app should show and behave as close as possible to the original Angular app, with unresolved differences clearly reported.

## Change Request Summary

### CR-V2-001 End-to-End Repository Conversion

Request:
- Convert a whole Angular repository into a whole React repository, not only internal plans or documentation.

Implemented result:
- CLI now runs source analysis, transformation, target generation, file materialization, and report export.
- Generated target files are written to the requested output directory.
- Conversion summaries and manual review artifacts are written under `.spa-bridge/`.

Remaining gap:
- Generated output still requires deeper semantic conversion rules for complex Angular-specific behavior.

### CR-V2-002 Local-First AI Refinement

Request:
- Use local Ollama EXAONE 3.5 by default.
- Allow external LLM API only when security conditions are satisfied.

Implemented result:
- Local-first AI refinement path is wired.
- Ollama EXAONE 3.5 is the default provider.
- OpenAI-compatible external provider support exists behind explicit opt-in and policy checks.
- AI refinement results are written to `.spa-bridge/ai-refinement-results.json`.

Remaining gap:
- AI refinement currently supplements deterministic mapping; it is not yet a full automatic repair loop for every generated React compile/runtime issue.

### CR-V2-003 Safe Target File Naming

Request:
- Fix target generation failures caused by very long review filenames.

Implemented result:
- Review stub filenames are bounded and stable.
- Original long review identifiers are preserved inside review stub content instead of being used directly as filenames.

Remaining gap:
- None known for the reported `ENAMETOOLONG` case.

### CR-V2-004 Component Logic Conversion

Request:
- React components must contain converted logic, not empty placeholders.
- Angular class logic should be converted to equivalent React hooks/functions where practical.

Implemented result:
- Angular class properties and methods are extracted.
- Non-readonly component fields become React `useState` values.
- Basic assignments such as `this.title = id` become setter calls such as `setTitle(id)`.
- Lifecycle method bodies can be emitted inside `useEffect`.
- Angular member references such as `this.value` are rewritten to local React references where practical.

Remaining gap:
- Complex method bodies, nested control flow, async RxJS chains, Angular platform APIs, and DOM/ViewChild-specific logic still need deeper conversion rules or review.

### CR-V2-005 Angular HTML to JSX Conversion

Request:
- Angular `.html` templates must be used in generated React components.
- JSX should reflect Angular bindings and events.

Implemented result:
- Template raw text is carried from source analysis through transformation into target generation.
- Basic template conversion now handles:
  - `class` to `className`
  - interpolation such as `{{ title }}` to `{title}`
  - event bindings such as `(click)` to React event props
  - property bindings such as `[value]` to JSX expression props
  - basic `[(ngModel)]` to value/change handling
  - asset references such as `assets/...` to public-path references
- Structural directives are preserved with reviewable `data-ng-*` markers when they cannot be safely expanded.

Remaining gap:
- Full `*ngIf`, `*ngFor`, `ng-template`, `ng-container`, pipes, projection, and complex form/template syntax require deeper JSX generation rules.

### CR-V2-006 Styles and Assets

Request:
- Angular images and LESS/CSS/SCSS files should be included in the generated React project.

Implemented result:
- Angular style files are copied into the React target under `src/styles/angular/...`.
- Component style references generate React-side imports/placeholders under `src/styles/components/...`.
- Template asset references are copied into `public/assets/...` where resolvable.
- Resource copy results are written to `.spa-bridge/resource-copy-summary.json`.
- LESS support is added to the target dev dependencies.

Remaining gap:
- Asset resolution may still need project-specific handling for custom asset pipelines, CDN aliases, webpack aliases, and nonstandard Angular build configuration.

### CR-V2-007 Dependency Carry-Over

Request:
- Packages from the Angular `package.json` that are still needed by the React target should be installed in the generated React project.
- External libraries and internal API/client packages must not be silently dropped.

Implemented result:
- CLI reads source `package.json` dependencies and devDependencies.
- Target generation carries over non-Angular-specific dependencies.
- Angular-only packages are filtered from the React target package manifest, including `@angular/*`, `@ngrx/*`, `zone.js`, Angular devkit packages, webpack, and TypeScript where target-controlled.
- React/Vite dependencies still take precedence for target runtime.

Remaining gap:
- Some Angular wrapper packages may need explicit mapping to React-compatible equivalents rather than direct carry-over.
- Package aliases, private registries, workspace protocols, and peer dependency conflicts may need additional handling.

### CR-V2-008 Custom Angular Tag Conversion

Request:
- Custom Angular component tags such as `<ke-konbini-pres>` should become React component references.

Implemented result:
- Angular component selectors are carried into React component drafts.
- Target generation builds a selector registry.
- Template custom tags matching known selectors are rewritten to React component names.
- Required imports are generated for referenced React components.

Remaining gap:
- Inputs/outputs on nested custom component tags need deeper prop mapping for all Angular binding forms.
- Unknown third-party custom elements are preserved and may require review or wrapper generation.

### CR-V2-009 Source-Like Folder Structure

Request:
- Generated React components should preserve a folder structure similar to the Angular project instead of flattening all components into one folder.

Implemented result:
- Component output paths are derived from original source paths.
- Example pattern:
  - Angular `src/app/example/example.component.ts`
  - React `src/app/example/ExampleComponent.tsx`
- Route imports are updated to reference nested component paths.

Remaining gap:
- Some naming rules may need refinement for enterprise conventions, barrel exports, feature modules, and lazy-loaded route boundaries.

### CR-V2-010 EventEmitter Conversion

Request:
- Angular `EventEmitter` outputs should be converted to React-style callback props.

Implemented result:
- Parser detects `@Output` and `EventEmitter` properties.
- Output properties become callback props.
- `.emit(value)` calls are rewritten to optional callback invocation, for example `props.selected?.(value)`.

Remaining gap:
- Event payload typing and nested child-to-parent wiring need more complete propagation through JSX custom component usage.

### CR-V2-011 Router, Services, and State Scaffolding

Request:
- Router, Angular DI/service, and state handling should be closer to React runtime behavior.

Implemented result:
- React routes now use generated component elements where route component references are available.
- Services are generated as hook/context-oriented service scaffolds.
- Local state scaffolding uses React hooks.
- Store strategy can generate Redux Toolkit slice-like scaffolding.

Remaining gap:
- Route guards, resolvers, lazy loading, NgRx reducers/effects/selectors, RxJS streams, and Angular service semantics require deeper transformation rules.

### CR-V2-012 Package Manager Parity

Request:
- Generated Next.js targets should not force npm when the source Angular repository uses Yarn or pnpm.
- Package manager type and version should follow the source repository where practical.
- Generated install/dev guidance and validation should avoid npm-only peer dependency failures when the source repository is Yarn-based or pnpm-based.
- Generated scripts should avoid confusing Angular `start` semantics with Next.js production `next start`. Angular-style `start` should launch the development server unless the user explicitly chooses a production serve command.

Implemented result:
- Source package manager evidence is detected from `package.json#packageManager`, `yarn.lock`, `pnpm-lock.yaml`, `package-lock.json`, `.yarnrc`, `.yarnrc.yml`, `.npmrc`, `pnpm-workspace.yaml`, and `.pnpmfile.cjs`.
- Generated Next.js `package.json` receives a compatible `packageManager` field when source evidence is available.
- Generated target self-correction command planning uses the detected package manager instead of always using npm.
- Package manager parity is summarized in generated enterprise parity artifacts.
- Generated Next.js targets use `start: next dev` for Angular-style developer startup parity and expose production startup separately as `serve: next start`.

Remaining gap:
- The converter does not fetch private package peer metadata from Nexus during conversion. Peer conflicts between internal packages may still require manual dependency alignment or validation with the source-compatible package manager.
- Production startup still requires `build` before `serve`, following Next.js semantics.

### CR-V2-013 Generated Next.js Build Import and DAM/Proxy Asset Evidence

요청:
- 생성된 Next.js/TypeScript 소스가 로컬 `.ts`/`.tsx` 모듈을 import할 때 불필요하게 `.js` 확장자를 붙여 build가 깨지지 않아야 한다.
- Angular 스타일 파일의 CSS `url(...)` 참조 중 로컬 이미지/폰트는 가능한 한 생성된 target에 함께 복사되어야 한다.
- Angular `.less`/`.scss`/`.sass` 스타일을 생성된 Next.js target에서 직접 import하지 않아야 한다. Next.js build가 읽는 스타일 entry는 CSS-compatible artifact여야 한다.
- DAM, CDN, proxy 기반 자산처럼 정적 변환 시 완전한 런타임 주소를 알 수 없는 항목은 조용히 누락하지 않고 미리 감지해 review artifact로 남겨야 한다.
- 기존 Angular 레포지토리의 환경별 `proxy.*` 설정 파일은 내용 노출 없이 안전한 메타데이터로 탐지되어 Next.js rewrites, middleware, 배포 proxy 설정 검토에 활용되어야 한다.

처리 결과:
- 생성된 Next.js/Vite React target의 로컬 TS/TSX import는 확장자 없는 import로 생성된다.
- component, route, provider, source style, RxJS runtime helper import에서 `.js` suffix를 제거했다.
- Angular source inventory가 `.less`와 `.sass`를 style 파일로 분류하도록 보강했다.
- Generated target scaffold는 `src/source-styles.ts` 대신 `src/source-styles.css`를 layout에서 직접 import한다.
- CLI resource copy 단계는 `less` compiler를 사용해 source `.less`를 CSS로 컴파일 시도하고, 프로젝트 특화 Less import 실패 시 build-safe fallback CSS를 생성한다.
- Generated component style placeholder는 `.less`가 아닌 `.css`로 생성되어 Next.js webpack loader 오류를 피한다.
- CLI resource copy 단계가 style 파일의 CSS `url(...)`을 분석해 복사 가능한 로컬 자산을 target 내부로 복사한다.
- CLI resource copy 단계는 Less 컴파일 결과 CSS의 `url(...)`도 다시 분석한다. Imported Less에서 유입된 이미지/폰트 상대 경로까지 복사 대상에 포함한다.
- 상대 CSS asset 경로가 원본 style 파일 기준으로 바로 해석되지 않을 경우 source tree에서 안전한 suffix match로 후보 파일을 찾아, 생성된 CSS가 참조하는 target 상대 위치에 복사한다.
- DAM/remote/dynamic/package 기반 CSS asset reference는 `.spa-bridge/css-asset-resolution-summary.json`에 남긴다.
- source project 내 `proxy.*` 파일은 `.spa-bridge/proxy-config-summary.json`에 안전한 메타데이터로 남긴다.
- CLI report warning과 React Target summary에 CSS asset/proxy 검토 지표가 표시된다.

남은 gap:
- DAM host, 인증 방식, 환경별 rewrite 정책은 조직별 proxy/deployment 설정에 의존하므로 자동 확정하지 않는다. 생성된 summary를 기준으로 Next.js `rewrites`, middleware, CDN/DAM 환경변수, 배포 proxy 설정을 검토해야 한다.
- 원본 Less import chain이 private asset/mixin에 의존해 컴파일할 수 없으면 fallback CSS가 생성된다. 이 경우 build는 진행되지만 원본 스타일 parity는 review 대상이다.
- 동일한 파일명을 가진 asset이 source tree 여러 위치에 존재하는 경우 suffix match는 가장 안정적인 정렬 순서의 후보를 사용한다. 충돌 가능성이 있는 프로젝트에서는 `.spa-bridge/css-asset-resolution-summary.json` 확인이 필요하다.

## Remaining High-Priority Gaps

The original high-priority V2 gap list has been converted into the V2 gap brownfield implementation track and implemented as focused units:

- Dependency compatibility filtering and replacement.
- Dependency alias/path mapping.
- Advanced Angular template conversion.
- Reactive forms conversion.
- RxJS conversion.
- NgRx conversion.
- Next.js target default and runtime parity quality scoring.
- Angular animation conversion.
- Generated Next.js/React self-correction loop foundation.
- Private Nexus/npm registry, `.npmrc`, environment variable, and source script parity.
- Generated target build import cleanup, Less-to-CSS safe style output, and DAM/proxy CSS asset evidence capture.

The main remaining product validation work is no longer a missing implementation unit. It is an end-to-end conversion validation task: run a representative Angular repository through SPA-Bridge, install the generated Next.js project with its source-compatible package manager, run the generated dev command, compare behavior, and use the generated review/quality artifacts to prioritize further converter rules.

Current limitation: the self-correction loop now plans and records safe generated target validation/correction behavior, but SPA-Bridge does not yet automatically execute generated target package-manager install or `next build` during conversion. Those commands should be run manually or added later behind explicit command execution policy.

Additional limitation: DAM/proxy runtime parity depends on deployment-specific infrastructure. SPA-Bridge now detects CSS DAM/remote references and `proxy.*` configuration evidence, but it does not automatically infer private DAM hosts, authentication headers, environment-specific rewrites, or CDN rules without explicit source evidence.

## Verification Status

Latest verified commands:

```bash
npm run build
npm test
```

Both commands passed after the V2 changes listed above. The latest verification passed `npm run build` and `npm test` with 145 tests passing.
