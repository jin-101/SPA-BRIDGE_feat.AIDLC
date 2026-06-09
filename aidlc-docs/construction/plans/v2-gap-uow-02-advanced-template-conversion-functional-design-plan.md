# V2-GAP-UOW-02 Advanced Template Conversion Functional Design Plan

## Unit

V2-GAP-UOW-02 Advanced Template Conversion

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-004 Advanced Template Conversion

Supporting requirements:
- V2-GAP-FR-003 Reactive Forms Conversion
- V2-GAP-FR-010 Runtime parity and review diagnostics from `requirements_v2.md`

## Goal

Improve Angular HTML template conversion so generated React components render meaningful JSX instead of preserving Angular-specific markers or raw placeholders.

The converter should handle common Angular template constructs deterministically:

- `*ngIf`
- `*ngFor`
- `ng-template`
- `ng-container`
- `ng-content`
- interpolation
- property binding
- event binding
- two-way binding markers
- pipes
- `ngClass`
- `ngStyle`
- nested custom Angular components with inputs and outputs

## Current Brownfield Baseline

Existing target materialization already performs simple string-based conversion for:

- interpolation
- some property/event binding syntax
- custom selector tag replacement
- class/style attribute normalization
- safe asset path handling

Known gap:
- structural directives are still represented too shallowly.
- `*ngIf` and `*ngFor` are not emitted as idiomatic conditional JSX and `.map(...)`.
- pipe conversion is limited.
- template references/projection are not modeled.
- custom component input/output conversion needs stronger rules and diagnostics.

## Proposed Functional Design

### 1. Structured Template IR

Add a lightweight template IR that can be produced from parsed or heuristic template text:

- `TemplateElementNode`
- `TemplateTextNode`
- `TemplateInterpolationNode`
- `TemplateDirective`
- `TemplateBinding`
- `TemplateEvent`
- `TemplatePipeUsage`
- `TemplateProjectionSlot`
- `TemplateConversionDiagnostic`

The IR should preserve source order and stable IDs.

### 2. Structural Directive Conversion

Define deterministic mappings:

- `*ngIf="condition"` -> `{condition && (...)}`.
- `*ngIf="condition; else elseRef"` -> ternary or helper-rendered branch with review fallback.
- `*ngFor="let item of items"` -> `{items.map((item) => (...))}`.
- `index as i` -> map index parameter.
- `trackBy` -> stable `key` expression when safe; otherwise review diagnostic.
- `ng-container` -> React fragment.
- `ng-template` -> named render helper or reviewable fragment.

### 3. Binding And Event Conversion

Define mappings:

- `[input]="expr"` -> `input={expr}`.
- `[class.foo]="expr"` -> className composition helper.
- `[style.width.px]="expr"` -> style object conversion.
- `(click)="handler($event)"` -> `onClick={(event) => handler(event)}`.
- `(output)="handler($event)"` on custom components -> callback prop based on output name.
- `[(ngModel)]="value"` -> defer to forms unit but preserve controlled-input intent.

### 4. Pipe Handling

Define mappings:

- known display pipes such as `date`, `number`, `currency`, `uppercase`, `lowercase`, `json` -> local helper functions.
- `async` pipe -> emit review diagnostic for this unit and tag for V2-GAP-UOW-04 RxJS handling.
- unknown pipes -> imported helper stub plus manual-review diagnostic.

### 5. Custom Component Tags

Use selector registry from component drafts:

- Replace Angular custom element tags with React component names.
- Convert input bindings to props.
- Convert output bindings to callback props.
- Preserve projected children where possible.
- Generate review diagnostics when selector target is missing.

### 6. Diagnostics And Safety

Do not silently drop template content.

Unsupported or lossy constructs should:

- preserve surrounding JSX where safe.
- produce manual-review diagnostics.
- avoid raw source snippets in reports beyond generated component output.
- keep generated JSX deterministic.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the primary implementation approach for advanced template conversion?

A) Add a lightweight structured template IR and generate JSX from that IR
B) Continue improving regex-only string replacement in the component materializer
C) Defer template conversion to AI refinement only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. This gives deterministic behavior and makes diagnostics/test coverage much stronger.

### Question 2
How should `*ngIf` be emitted by default?

A) Convert to conditional JSX with `condition && (...)`, using ternary when `else` is detected
B) Preserve `data-ng-if` markers and require manual conversion
C) Drop the directive but keep the inner markup
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It best matches the desired React runtime behavior.

### Question 3
How should `*ngFor` be emitted by default?

A) Convert to `.map(...)` JSX with stable key best-effort and diagnostics for unsafe `trackBy`
B) Preserve `data-ng-for` markers and require manual conversion
C) Generate placeholder comments only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It is the expected React equivalent for repeated DOM rendering.

### Question 4
How should `ng-template` and `ng-container` be handled?

A) Convert `ng-container` to fragments and convert simple `ng-template` blocks to render helpers or deferred fragments
B) Preserve both as literal custom elements
C) Drop both wrappers and keep only text children
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. This keeps React output valid while preserving branch/projection intent.

### Question 5
How should Angular pipes be handled in this unit?

A) Convert known display pipes to generated helper functions, tag `async` for RxJS follow-up, and diagnose unknown pipes
B) Leave all pipe expressions as raw Angular text
C) Remove pipe segments from expressions
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It improves display parity without pretending RxJS async behavior is solved here.

### Question 6
How should custom Angular component tags be converted?

A) Use the selector registry to convert tags to React component names and map `[input]`/`(output)` to props
B) Leave custom tags as kebab-case HTML tags
C) Replace unknown custom tags with placeholder divs
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. This matches your requirement that converted React code should call component names, not Angular selectors.

### Question 7
How should `ngClass` and `ngStyle` be converted?

A) Convert common object/array/string cases to `className` and `style` expressions with helper fallback diagnostics
B) Preserve Angular attributes as comments
C) Drop dynamic classes and styles
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. Visual parity depends heavily on dynamic classes and styles.

### Question 8
How should template reference variables such as `#inputRef` be handled?

A) Generate `useRef` intent metadata or review diagnostics depending on usage
B) Ignore template refs
C) Convert every template ref to a string prop
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. Some refs map cleanly, but many need usage-aware conversion.

### Question 9
What should happen when template conversion is uncertain?

A) Preserve safe surrounding JSX and emit manual-review diagnostics with traceable source refs
B) Guess the closest React syntax without diagnostics
C) Fail the entire conversion run
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. This keeps the generated project usable while making real gaps visible.

### Question 10
What should be the blocking test focus for this unit?

A) Structural directive conversion, custom component I/O mapping, pipe diagnostics, deterministic output, and JSX containment
B) Only example-based snapshot tests
C) No blocking tests until all V2 gaps are done
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It covers the highest-risk behavior and aligns with the enabled PBT extension.

## Plan Checklist

- [x] Identify source requirement and affected packages.
- [x] Define functional design scope.
- [x] Define proposed template conversion model.
- [x] Generate functional design questions.
- [x] Collect user answers.
- [x] Analyze answers for ambiguity.
- [x] Generate functional design artifacts.
- [x] Present functional design completion for approval.

## Security Baseline Compliance

- Template parsing must not execute source code.
- Diagnostics must use safe source refs and generated refs.
- Unsafe references such as `javascript:` URLs remain blocking or manual-review diagnostics.
- Generated JSX must not introduce executable raw HTML from untrusted source by default.

## Property-Based Testing Compliance

Required properties:

- Equivalent template input produces stable JSX output.
- Structural directive conversion preserves deterministic ordering.
- Generated component references remain valid identifiers.
- Unsupported constructs produce stable diagnostics.
- Generated JSX files remain inside the target root.

## Approval Gate

Status: Functional design artifacts generated. Awaiting approval to continue to code generation planning.
