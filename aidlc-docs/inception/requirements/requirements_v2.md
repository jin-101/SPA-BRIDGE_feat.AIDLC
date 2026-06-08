# SPA-Bridge Requirements V2

## Purpose

This document tracks post-greenfield requirement changes discovered while exercising SPA-Bridge against real Angular-to-React conversion expectations.

The original requirements remain in `requirements.md`. This file records later change requests, implemented results, and remaining gaps.

## V2 Product Goal

The generated React project should be usable as a replacement project:

- A user provides a full Angular repository.
- SPA-Bridge generates a full React repository.
- The user runs `npm install` and `npm run dev` in the generated React repository.
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

## Remaining High-Priority Gaps

The following areas remain important for reaching the V2 product goal:

- RxJS observable and subscription conversion to React hooks or async state utilities.
- NgRx action/reducer/selector/effect conversion to Redux Toolkit or another selected state strategy.
- Full Angular reactive forms conversion, including validators and form groups.
- `*ngIf`, `*ngFor`, `ng-template`, content projection, and pipe conversion.
- Angular animation conversion to React-compatible animation libraries or CSS transitions.
- Full dependency alias/path mapping from `tsconfig`, webpack, and Angular build configuration.
- Generated React project self-correction loop that runs install/build/typecheck and applies deterministic or AI-assisted fixes.

## Verification Status

Latest verified commands:

```bash
npm run build
npm test
```

Both commands passed after the V2 changes listed above.

