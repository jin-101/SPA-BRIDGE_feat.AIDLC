# SPA-Bridge V2 Gap Implementation Requirements

## Purpose

This specification expands the `Remaining High-Priority Gaps` section of `requirements_v2.md` into implementable requirements.

The goal is to move SPA-Bridge closer to Next.js/React runtime parity: a generated Next.js project should install, run, render, and behave as close as practical to the source Angular project.

## Scope

This document covers eight high-priority implementation areas:

- Dependency compatibility filtering and React replacement mapping.
- RxJS observable and subscription conversion.
- NgRx action, reducer, selector, and effect conversion.
- Angular reactive forms conversion.
- Advanced Angular template conversion.
- Angular animation conversion.
- Dependency alias and path mapping.
- Generated Next.js/React self-correction loop.
- Next.js target default and runtime parity quality scoring.
- Private Nexus/npm registry, environment variable, and source script parity.

## Global Acceptance Criteria

The V2 gap implementation is acceptable only when:

- Generated React projects remain deterministic for the same Angular input.
- All generated files remain inside the requested target root.
- Source-to-target traceability is preserved for converted artifacts.
- Unsupported or lossy mappings produce manual-review diagnostics.
- Sensitive source snippets are not sent to external providers unless masking and explicit provider policy allow it.
- Workspace-level `npm run build` and `npm test` continue to pass.
- At least one example-based regression test and one property-based invariant are added for each major converter where practical.

## V2-GAP-FR-000 Dependency Compatibility Filter And Replacement

### Requirement

SPA-Bridge must prevent Angular-only runtime packages from being copied into generated Next.js/React projects when those packages cannot install or run in a Next.js target.

The converter must classify source dependencies before writing target `package.json`:

- React-compatible dependencies that can be carried over unchanged.
- Framework-neutral dependencies that can be carried over unchanged.
- Angular-only dependencies that must be removed.
- Angular wrapper dependencies that should be replaced with framework-neutral or React-specific packages.
- Unknown dependencies that require manual review.

### Source Patterns

The converter must detect:

- Angular namespace packages such as `@angular/*`.
- NgRx packages such as `@ngrx/*`.
- Angular CLI/build packages such as `@angular-devkit/*`, `@schematics/*`, `zone.js`, and Angular-only build tooling.
- Angular wrapper packages such as `ngx-*`, `angularx-*`, and known Angular-specific wrappers.
- Custom allowlisted migration mappings.

### Target Behavior

The converter should generate:

- A target dependency manifest that excludes Angular-only packages.
- Replacement dependencies for known React-compatible equivalents.
- A dependency compatibility report showing carried, replaced, removed, and review-required packages.
- Manual-review diagnostics for unknown package usage or code-level API differences.

### Custom Package Mapping

The custom package mapping below is supported as a package-level replacement:

| Angular Source Package | React Target Package | Version Policy | Usage-Site Policy |
|---|---|---|---|
| `@wds/wc-angular-lib` | `@wds/wc-react-lib` | Preserve source version when identical compatible version exists, e.g. `0.1.43` -> `0.1.43` | Do not assume import/API parity. Generate usage-site review diagnostics unless import paths and component props/events can be verified by conversion rules. |

This replacement must not blindly rewrite all usage sites as equivalent. The converter may replace the package dependency, but code references must be checked separately because React component exports, prop names, event names, wrapper initialization, styling, and peer dependency expectations may differ.

### Acceptance Criteria

- Generated React `package.json` does not include known Angular-only packages.
- `@wds/wc-angular-lib@0.1.43` is replaced by `@wds/wc-react-lib@0.1.43` at dependency-manifest level.
- Any source import or template usage that depends on `@wds/wc-angular-lib` is traced and either rewritten by an explicit rule or emitted as a manual-review item.
- Dependency compatibility report lists package-level replacement rationale and usage-site review status.
- `npm install` failures caused by Angular-only packages are reduced by default filtering and replacement.

### Implementation Artifacts

- Dependency compatibility classifier.
- Replacement rule registry.
- Target dependency manifest integration.
- Dependency compatibility report.
- Tests for Angular-only filtering, known replacements, custom WDS mapping, and unknown package diagnostics.

## V2-GAP-FR-001 RxJS Conversion

### Requirement

SPA-Bridge must convert common RxJS observable, subscription, and async stream patterns into React-compatible hooks or async state utilities.

### Source Patterns

The converter must detect:

- `Observable<T>` properties.
- `Subject`, `BehaviorSubject`, `ReplaySubject`, and `AsyncSubject`.
- `.subscribe(...)` calls.
- `pipe(...)` chains.
- Operators such as `map`, `filter`, `tap`, `switchMap`, `mergeMap`, `concatMap`, `catchError`, `debounceTime`, `distinctUntilChanged`, `takeUntil`, and `shareReplay`.
- `async` pipe usage in templates.
- Subscription cleanup in `ngOnDestroy`.

### Target Behavior

The converter should generate:

- `useEffect`-based subscription setup and cleanup.
- `useState` for latest emitted values.
- Reusable helper hooks such as `useObservable`, `useSubjectValue`, or equivalent project-local utilities.
- Safe fallback diagnostics for unsupported operator chains.

### Acceptance Criteria

- `this.data$.subscribe(value => this.data = value)` becomes React state update logic with cleanup.
- Template `{{ data$ | async }}` becomes JSX that reads from a generated observable hook value.
- `takeUntil(this.destroy$)` and `ngOnDestroy` cleanup are reflected in React cleanup logic.
- Unsupported or side-effect-heavy streams generate manual-review diagnostics without dropping source evidence.

### Implementation Artifacts

- RxJS pattern extraction in source analysis.
- RxJS intermediate representation in transformation.
- React hook generator in target generation.
- Conversion diagnostics for lossy operator chains.

## V2-GAP-FR-002 NgRx Conversion

### Requirement

SPA-Bridge must convert NgRx state artifacts into a selected React state strategy, with Redux Toolkit as the default target for NgRx-heavy projects.

### Source Patterns

The converter must detect:

- `createAction`, `props`, and action groups.
- `createReducer` and `on(...)` handlers.
- `createSelector` and feature selectors.
- `createEffect`.
- `Store<T>` injection.
- `store.select(...)` and `store.dispatch(...)`.
- `@ngrx/entity` adapters and entity selectors.
- `@ngrx/router-store` usage.

### Target Behavior

The converter should generate:

- Redux Toolkit slices for reducers.
- Action creators mapped from NgRx actions.
- Selectors mapped to Redux selectors.
- Effects mapped to thunks or listener middleware where practical.
- React hooks such as `useAppDispatch` and `useAppSelector`.
- Diagnostics for effects that require manual review.

### Acceptance Criteria

- NgRx actions appear in generated React state files.
- Reducer transitions are preserved as Redux Toolkit reducer cases.
- Selectors are emitted as target selector functions.
- Component `store.select(selector)` usage becomes React selector hook usage where traceable.
- Component `store.dispatch(action(...))` usage becomes dispatch hook usage.
- Entity adapter usage either maps to Redux Toolkit entity adapter or generates explicit review diagnostics.

### Implementation Artifacts

- NgRx analyzer extension.
- NgRx intermediate state model.
- Redux Toolkit materializer.
- Component-level store usage rewriter.
- State conversion report section.

## V2-GAP-FR-003 Reactive Forms Conversion

### Requirement

SPA-Bridge must convert Angular reactive forms and template-driven forms into React form state and validation logic.

### Source Patterns

The converter must detect:

- `FormGroup`, `FormControl`, `FormArray`, `FormBuilder`.
- Built-in validators such as `required`, `minLength`, `maxLength`, `pattern`, `email`, `min`, and `max`.
- Custom validator functions.
- Async validators.
- `formGroup`, `formControlName`, `formArrayName`, and `ngSubmit`.
- `[(ngModel)]` and `ngModelChange`.

### Target Behavior

The converter should generate:

- React controlled inputs.
- Form state initialization.
- Validation functions or a selected form library adapter.
- Submit handlers.
- Error display placeholders where Angular templates reference validation state.

### Acceptance Criteria

- Simple `FormGroup` definitions become equivalent React form state.
- `formControlName` bindings become `value` and `onChange` props.
- Built-in validators are converted to target validation logic.
- Custom or async validators are preserved and flagged for review when not safely convertible.
- `ngSubmit` maps to React `onSubmit` with `preventDefault`.

### Implementation Artifacts

- Form model extraction.
- Form binding template converter.
- React form hook/materializer.
- Validator conversion diagnostics.

## V2-GAP-FR-004 Advanced Template Conversion

### Requirement

SPA-Bridge must convert advanced Angular template constructs into JSX while preserving render behavior as much as possible.

### Source Patterns

The converter must detect:

- `*ngIf`, including `else` templates.
- `*ngFor`, including index, trackBy, first, last, odd, and even aliases.
- `ng-template`.
- `ng-container`.
- `ng-content` content projection.
- Angular pipes.
- Template reference variables.
- `ngClass` and `ngStyle`.
- Nested custom Angular components and their inputs/outputs.

### Target Behavior

The converter should generate:

- Conditional JSX expressions for `*ngIf`.
- `.map(...)` rendering for `*ngFor`.
- React fragments for `ng-container`.
- Slot-like props or `children` for projection.
- Pipe function imports or local helper placeholders.
- Prop mapping for nested component inputs and outputs.

### Acceptance Criteria

- `*ngIf="condition"` becomes conditional JSX.
- `*ngFor="let item of items"` becomes `items.map(...)`.
- `[input]="value"` on custom component tags becomes `input={value}`.
- `(output)="handler($event)"` on custom component tags becomes callback prop wiring.
- Unknown pipes generate imported helper stubs or review diagnostics.

### Implementation Artifacts

- Template AST or structured template token model.
- JSX node generator.
- Custom component selector/prop linker.
- Pipe helper generator.

## V2-GAP-FR-005 Animation Conversion

### Requirement

SPA-Bridge must convert Angular animation metadata and common animation library usage into React-compatible animation behavior or reviewable animation adapters.

### Source Patterns

The converter must detect:

- Angular `trigger`, `state`, `style`, `transition`, `animate`, `query`, `stagger`, and `group`.
- `@Component({ animations: [...] })`.
- Animation bindings in templates.
- Third-party animation libraries such as `lottie-web`, `ngx-lottie`, `gsap`, and `animejs`.

### Target Behavior

The converter should generate:

- CSS transitions for simple state-based animations.
- React hook wrappers for imperative animation libraries.
- Lottie component wrappers where applicable.
- Manual-review diagnostics for complex Angular animation timelines.

### Acceptance Criteria

- Simple `state`/`transition` animations map to CSS class or inline style transitions.
- Lottie asset references are preserved.
- GSAP/animejs calls are preserved as React-safe `useEffect` calls where practical.
- Complex Angular animation DSL constructs are not silently dropped.

### Implementation Artifacts

- Animation metadata extractor.
- Animation target adapter.
- Generated animation helper modules.
- Animation diagnostics.

## V2-GAP-FR-006 Dependency Alias and Path Mapping

### Requirement

SPA-Bridge must preserve or translate source dependency resolution behavior so generated React code can import internal modules and assets correctly.

### Source Patterns

The converter must detect:

- `tsconfig.json` and nested `tsconfig.*.json` `paths`.
- `baseUrl`.
- Angular workspace library projects.
- npm workspace references.
- package aliases.
- webpack aliases.
- Angular asset configuration.
- private registry or workspace protocol package declarations.

### Target Behavior

The converter should generate:

- Target `tsconfig.json` path aliases where compatible.
- Next.js `webpack.resolve.alias` entries where needed.
- Legacy Vite `resolve.alias` entries only when the explicit Vite strategy is selected.
- Package dependency carry-over for private/internal packages.
- Asset copy or public path mappings.
- Diagnostics for aliases that cannot be resolved.

### Acceptance Criteria

- Imports using source path aliases still resolve in the generated React project.
- Internal package dependencies from source `package.json` are not dropped.
- Workspace protocol dependencies are preserved or converted to documented target equivalents.
- Asset aliases used by templates/styles are reflected in copy rules or Next.js aliases.

### Implementation Artifacts

- Dependency resolver analyzer.
- Alias mapping model.
- Next.js config generator extension.
- Legacy Vite config generator compatibility where explicitly selected.
- Package manifest merge policy.

## V2-GAP-FR-007 Generated Next.js/React Self-Correction Loop

### Requirement

SPA-Bridge must run a controlled validation and correction loop against the generated Next.js/React project.

### Validation Steps

The loop should be able to run:

- `npm install` or configured package-manager install.
- TypeScript typecheck.
- Target build.
- Lint/format checks when configured.
- Optional test command if generated or supplied.

### Correction Behavior

The loop should:

- Capture errors as structured diagnostics.
- Apply deterministic fixers for known issues.
- Use local AI refinement for complex but safe fixes.
- Use external AI only when policy, masking, and opt-in allow it.
- Stop after a configurable maximum number of attempts.

### Acceptance Criteria

- Generated project validation results are written to `.spa-bridge/quality-gate-results.json`.
- Known import extension problems, missing local helper imports, and simple type errors are fixed deterministically.
- Unresolved build failures produce actionable diagnostics and manual-review items.
- The loop never executes arbitrary generated scripts beyond the configured allowlist.

### Implementation Artifacts

- Target project command runner.
- Quality gate result model.
- Deterministic fixer registry.
- AI-assisted repair adapter.
- Safety policy for executable commands.

## V2-GAP-FR-008 Next.js Target Default And Runtime Parity Quality Scoring

### Requirement

SPA-Bridge must generate a Next.js App Router project by default and score generated output against runtime parity readiness before reporting completion.

### Target Behavior

The converter should generate:

- `package.json` with `next`, `react`, `react-dom`, `dev`, `build`, `start`, and `lint` support.
- `next.config.mjs` with deterministic alias mapping.
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/providers.tsx`, and `src/app/globals.css`.
- `src/review/runtime-parity-quality.json` summarizing scaffold readiness, package install readiness, empty components, manual-review markers, TODO markers, and remaining Angular syntax residue.
- Vite generation only when an explicit legacy target strategy is selected.

### Acceptance Criteria

- CLI conversion defaults to `nextjs-typescript`.
- Generated projects are structured as installable Next.js projects.
- Runtime parity scoring is deterministic for identical generated file plans.
- Quality findings are safe and do not include raw sensitive source snippets.
- Workspace-level `npm run build` and `npm test` pass after the target strategy change.

### Implementation Artifacts

- Next.js target strategy.
- Target dependency manifest framework selection.
- Runtime parity quality gate.
- CLI/core application default strategy update.
- Tests for Next.js default generation and legacy Vite strategy selection.

## V2-GAP-FR-009 Private Registry, Environment, And Script Parity

### Requirement

SPA-Bridge must preserve install/runtime environment assumptions from the Angular source repository when generating a Next.js target, especially for enterprise repositories that use private Nexus/npm registries, `.npmrc` scope mappings, internal packages, environment variables, and project-specific package scripts.

### Source Patterns

The converter must detect:

- Root and project-level `.npmrc` files.
- Scoped registry entries such as `@scope:registry=https://nexus.example/repository/npm/`.
- Safe npm config keys such as `registry`, `always-auth`, `strict-ssl`, and `legacy-peer-deps`.
- Unsafe or secret-bearing npm config values such as `_authToken`, `_auth`, username/password, and token-like environment substitutions.
- Internal package scopes from `package.json` dependencies and devDependencies.
- Source `package.json` scripts such as `start`, `build`, `serve`, `test`, `lint`, `analyze`, environment setup scripts, and custom deployment/build wrappers.
- Environment variable references from `.env*`, package scripts, Angular environment files, and source usage such as `process.env.*`.
- Source package manager evidence from `package.json#packageManager`, `yarn.lock`, `pnpm-lock.yaml`, `package-lock.json`, `.yarnrc`, `.yarnrc.yml`, `.npmrc`, `pnpm-workspace.yaml`, and `.pnpmfile.cjs`.

### Target Behavior

The generated Next.js target should:

- Generate a safe `.npmrc` when source registry configuration is required.
- Preserve scoped Nexus registry routing without copying secret tokens directly.
- Emit `.npmrc.example` or review diagnostics for secret-bearing registry values that require user-provided credentials.
- Carry compatible internal packages from source `package.json` through the existing dependency compatibility classifier.
- Flag internal packages with unknown React/Next.js API compatibility for manual review.
- Translate source scripts into Next.js-safe scripts when possible.
- Preserve useful source script intent through deterministic mappings, for example:
  - Angular dev/serve scripts -> `next dev` with compatible env prefix handling.
  - Angular production build scripts -> `next build`.
  - Analyze scripts -> Next.js bundle analysis script only when required package support exists.
  - Test/lint scripts -> compatible target scripts when safe.
- Generate a script migration report that lists copied, translated, dropped, and review-required scripts.
- Generate an environment contract report listing required variables, source locations, target variable name, exposure level, and whether manual review is needed.
- Preserve package manager type and version in generated `package.json#packageManager` when source evidence is available.
- Plan generated target validation commands with the detected package manager, for example Yarn repositories use `yarn install` and `yarn build` rather than npm commands.
- Generate package manager parity evidence in enterprise parity reports so install instructions match source repository behavior.

### Environment Variable Policy

The converter must distinguish:

- Server-only variables that should remain unprefixed and never be exposed to the browser.
- Client-exposed variables that must use `NEXT_PUBLIC_` in Next.js.
- Secret variables that must not be copied into generated `.env` files.
- Placeholder variables that may be emitted into `.env.example`.

Raw secret values must not be written to generated target files, reports, logs, or AI provider context.

### Acceptance Criteria

- Source scoped registry mappings are preserved in generated `.npmrc` or `.npmrc.example` without leaking tokens.
- Internal package dependencies are not dropped unless classified as Angular-only or unsafe.
- Secret-bearing npm config entries produce manual-review diagnostics instead of direct copying.
- Generated Next.js `package.json` includes deterministic scripts derived from source script intent plus required Next.js defaults.
- Angular-only scripts are not blindly copied.
- Environment variable usage is summarized in a generated environment contract artifact.
- Reports include registry/script/env migration summaries.
- Reports include package manager parity summaries.
- Workspace `npm run build` and `npm test` pass after implementation.

### Implementation Artifacts

- `.npmrc` parser and safe registry materializer.
- Internal package scope classifier.
- Source script classifier and Next.js script translator.
- Environment variable inventory and target exposure classifier.
- Registry/script/env migration report materializers.
- Package manager detector and target package manager parity materializer.
- Tests for Nexus scoped registries, secret redaction, script translation, env contract generation, and package manifest integration.
- Tests for Yarn/pnpm/npm package manager detection, generated `packageManager` field preservation, and self-correction command planning.

## Prioritization

Recommended implementation order:

1. Dependency alias and path mapping.
2. Advanced template conversion.
3. Reactive forms conversion.
4. RxJS conversion.
5. NgRx conversion.
6. Animation conversion.
7. Self-correction loop.
8. Private registry, environment, and script parity.

Rationale:
- Alias/template/form correctness most directly affects whether the generated app renders.
- RxJS and NgRx improve runtime behavior after render parity is established.
- Animation improves visual parity.
- Self-correction should be strongest after deterministic conversion rules are broader.

## Verification Matrix

| Requirement | Example Tests | Property-Based Tests | Integration Tests |
|---|---:|---:|---:|
| V2-GAP-FR-001 RxJS | Required | Required | Required |
| V2-GAP-FR-002 NgRx | Required | Required | Required |
| V2-GAP-FR-003 Forms | Required | Required | Required |
| V2-GAP-FR-004 Templates | Required | Required | Required |
| V2-GAP-FR-005 Animation | Required | Optional | Required |
| V2-GAP-FR-006 Alias/Paths | Required | Required | Required |
| V2-GAP-FR-007 Self-Correction | Required | Optional | Required |
| V2-GAP-FR-009 Registry/Env/Scripts | Required | Required | Required |

## Definition of Done

The V2 gap implementation is complete when:

- Each V2-GAP-FR requirement has converter code, target materialization, diagnostics, and tests.
- A representative Angular sample using routes, forms, RxJS, NgRx, styles, assets, aliases, custom components, and animations produces a React project that installs and starts.
- A representative enterprise Angular sample using private registry `.npmrc`, internal packages, source scripts, and environment variables produces a generated Next.js project with safe registry config, translated scripts, env contract artifacts, and no leaked secrets.
- Manual review output clearly lists only genuinely unresolved or unsafe mappings.
- Build and test verification passes for the SPA-Bridge workspace.
