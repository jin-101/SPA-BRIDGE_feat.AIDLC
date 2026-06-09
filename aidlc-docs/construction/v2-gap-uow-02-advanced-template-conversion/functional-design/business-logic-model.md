# V2-GAP-UOW-02 Business Logic Model

## Overview

Advanced template conversion uses a deterministic pipeline:

1. Read Angular template text from source analysis.
2. Build a lightweight structured template IR.
3. Resolve custom component selectors against component drafts.
4. Convert structural directives, bindings, events, pipes, and projection into JSX intent.
5. Generate safe JSX output and helper requirements.
6. Emit traceable diagnostics for unsupported or lossy mappings.

## Pipeline

### Step 1. Template IR Construction

Input:
- `TemplateParseSummary.rawText`
- template binding summaries
- owner component metadata
- selector registry

Output:
- ordered template node tree
- directive records
- binding/event records
- pipe usage records
- diagnostics

Behavior:
- Preserve source order.
- Keep stable node IDs.
- Avoid executing source expressions.
- Retain enough metadata for React materialization.

### Step 2. Structural Directive Planning

Each structural directive becomes a render plan:

- `ifRenderPlan`
- `forRenderPlan`
- `fragmentRenderPlan`
- `templateRenderPlan`
- `projectionRenderPlan`

Plans include:
- condition or iterable expression.
- local variables.
- key expression if applicable.
- diagnostics when partial.

### Step 3. JSX Emission

The JSX emitter receives the render plan and produces:

- JSX lines for component materialization.
- helper function requirements.
- imports for custom components.
- diagnostics for unresolved constructs.

Emission rules:
- Use React fragments for wrapper-less Angular containers.
- Use `.map(...)` for repeated children.
- Use conditional expressions for `*ngIf`.
- Keep readable formatting and deterministic indentation.

### Step 4. Helper Requirement Collection

The converter records required helper functions:

- `formatDatePipe`
- `formatNumberPipe`
- `formatCurrencyPipe`
- `applyClassMap`
- `applyStyleMap`
- `renderTemplateFragment`

Helpers may be emitted locally in component files first. A later refactor can centralize them.

### Step 5. Diagnostic Collection

Diagnostics are emitted for:

- unresolved `ng-template` references.
- complex `trackBy`.
- unknown pipes.
- unknown custom selectors.
- ambiguous template refs.
- unsafe external references.

Diagnostics are stable and use safe source references.

## Handoff To Other V2 Units

V2-GAP-UOW-03 Reactive Forms:
- receives `ngModel`, `formGroup`, `formControlName`, `ngSubmit`, and validation intent.

V2-GAP-UOW-04 RxJS:
- receives `async` pipe references and observable-like expression metadata.

V2-GAP-UOW-06 Animation:
- receives animation trigger bindings such as `[@trigger]`.

