# V2-GAP-UOW-03 Reactive Forms Conversion Functional Design Plan

## Unit

V2-GAP-UOW-03 Reactive Forms Conversion

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-003 Reactive Forms Conversion

Supporting requirements:
- V2-GAP-FR-004 Advanced Template Conversion handoff markers from `ngModel`, `formGroup`, `formControlName`, and `ngSubmit`.

## Goal

Convert Angular reactive forms and common template-driven form bindings into React controlled form state, validation helpers, and submit handlers.

The converter should support common Angular forms patterns:

- `FormGroup`
- `FormControl`
- `FormArray`
- `FormBuilder`
- built-in validators
- custom validator references
- async validator references
- `formGroup`
- `formControlName`
- `formArrayName`
- `ngSubmit`
- `[(ngModel)]`
- `ngModelChange`

## Current Brownfield Baseline

Existing template conversion can preserve `ngModel` handoff markers, and component materialization can create basic state setters from property initializers.

Known gap:
- Angular form model declarations are not extracted as first-class form models.
- Template form bindings are not connected to generated React state.
- Validators are not converted to React validation functions.
- Submit handling does not consistently prevent default and call source handlers.
- `FormArray` and nested controls are not represented.

## Proposed Functional Design

### 1. Form Source Model

Add form extraction in `packages/source-angular`:

- detect `FormGroup`, `FormControl`, `FormArray`, `FormBuilder`.
- detect object-literal form declarations.
- detect validator arrays and options.
- detect custom and async validator references.
- detect template bindings related to forms.

### 2. Form IR Carry-Through

Extend transformation model with:

- `NormalizedFormModel`
- `NormalizedFormControl`
- `NormalizedFormArray`
- `NormalizedValidator`
- `FormBindingIntent`
- `FormSubmitIntent`

### 3. React Form Target Model

Generate React controlled form state:

- initial values.
- `setFormValue` helper.
- validation helper functions.
- error state.
- submit handler with `event.preventDefault()`.
- manual-review diagnostics for custom/async validators.

### 4. Template Integration

Map template bindings:

- `[formGroup]="form"` -> target form object context.
- `formControlName="email"` -> `value`, `onChange`, `aria-invalid`, and error display intent.
- `(ngSubmit)="submit()"` -> `onSubmit={(event) => { event.preventDefault(); submit(); }}`.
- `[(ngModel)]="name"` -> controlled input state.
- `(ngModelChange)="onNameChange($event)"` -> change callback wiring.

### 5. Diagnostics And Safety

Unsupported or lossy mappings should:

- preserve visible controls where safe.
- generate manual-review diagnostics.
- preserve source refs and generated refs.
- never execute validators during conversion.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the default React forms approach?

A) Generate project-local controlled form helpers without adding a form library
B) Add `react-hook-form` as the default target library
C) Preserve form markup only and leave behavior for manual review
X) Other (please describe after [Answer]: tag below)

[Answer]: X
#### Core Strategy & Infrastructure
* **Architecture**: Generate a proprietary set of pure TypeScript custom hooks (`useFormControl`, `useFormGroup`, `useFormArray`) within the target project's shared utility directory (`/src/utils/forms/`).
* **Zero External Dependencies**: Reject third-party form libraries (e.g., `react-hook-form`) to ensure the generated code remains transparent, lightweight, and isolated from downstream ecosystem shifts.

#### Mapping & Lifecycle Specification
* **Component Translation**: Rewrite Angular `FormGroup` and `FormBuilder` definitions into clean 1:1 functional invocations of the local adapter hooks inside the target React components.
* **Template Integration**: Resolve template directives like `formControlName` and `formGroup` into standard React controlled-input props (`value`, `onChange`, `onBlur`) exposed natively by the hooks.
* **Validation & Event Layer**: Map Angular `Validators` to deterministic JavaScript predicate functions. Automatically wrap `ngSubmit` with `preventDefault()` via the `useFormGroup` submission orchestrator.

#### Engineering Rationale for Runtime Parity
* **Deterministic Transparency**: Exposing the form engine as local source code removes black-box anomalies and guarantees runtime parity with the source Angular form state.
* **Complexity Management**: Encapsulates intricate reactive validation paths and nested dynamic array updates without inflating component-level file size.
* **Self-Correction Optimization**: Provides highly readable, localized TypeScript interfaces that allow the `aidlc` self-correction loop to diagnose and repair compilation or type errors with maximum efficiency.


Recommendation: A. It avoids another major dependency and keeps generated behavior transparent/deterministic.

### Question 2
How should Angular `FormGroup` and `FormControl` declarations be represented?

A) Extract a form IR and generate React state objects with initial values and typed control metadata
B) Convert only template `formControlName` attributes and ignore TypeScript declarations
C) Generate comments for every form declaration
X) Other (please describe after [Answer]: tag below)

[Answer]: X
#### Core Implementation Specification
* **Form IR Extraction**: Extract a structured Form Intermediate Representation (Form IR) from the Angular TypeScript class, capturing nested group hierarchies, control validation tokens, and explicit initial data types.
* **Adapter Integration**: Pass this extracted metadata model directly into the project-local custom form adapters (`useFormGroup`, `useFormControl`) established in the previous specification.
* **Dual-Layer Reconstruction**: Synchronize the TypeScript structural state layer with the JSX interactive input layer, eliminating raw decoupled states.

#### Engineering Rationale for Runtime Parity
* **Type Safety & Predictability**: Preserving types and structural nested arrays inside the Form IR prevents runtime field errors and ensures the UI strictly matches the original business logic data schema.
* **Deterministic Input Binding**: Feeding structured metadata into the custom adapters ensures the input fields, validation flags, and form-level states dynamically sync without erratic rerendering bugs.


Recommendation: A. Runtime parity needs both TypeScript form model and template bindings.

### Question 3
How should built-in validators be converted?

A) Convert common validators to generated validation helper functions
B) Drop validators and keep only input values
C) Keep validator names as comments only
X) Other (please describe after [Answer]: tag below)

[Answer]: X
#### Core Implementation Specification
* **Predicate Engine Mapping**: Convert standard Angular validation tokens (`Validators.required`, `Validators.minLength`, `Validators.pattern`, etc.) into pure, reusable JavaScript predicate functions.
* **Adapter Integration**: Embed these predicate functions directly inside the configuration metadata object passed to the custom project-local form adapters (`useFormControl`/`useFormGroup`).
* **Error State Standardization**: Standardize the output format of validation errors to return an object matching Angular's structure (e.g., `{ required: true }`), ensuring seamless UI error-display rendering.

#### Engineering Rationale for Runtime Parity
* **UI Invariant Preservation**: Standard validation rules must execute continuously during runtime to ensure that submit buttons, error styling, and boundary prompts change state exactly as they did in the Angular application.
* **Self-Correction Integration**: Centralizing these validators inside the custom adapter config layer keeps individual JSX components pristine and type-safe, preventing compilation bugs in the `aidlc` loop.

Recommendation: A. Built-in validators are deterministic and safe to convert.

### Question 4
How should custom and async validators be handled?

A) Preserve references, generate review diagnostics, and create placeholder validation hooks where safe
B) Try to execute the validators during conversion to infer behavior
C) Drop custom and async validators
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. It preserves intent without unsafe execution.

### Question 5
How should `FormArray` be handled?

A) Generate array state helpers for add/remove/update and review diagnostics for nested complex arrays
B) Convert `FormArray` to a plain object
C) Mark all `FormArray` usages unsupported
X) Other (please describe after [Answer]: tag below)

[Answer]: X
#### Core Implementation Specification
* **Dedicated Custom Hook Mapping**: Map Angular `FormArray` usages directly to the project-local `useFormArray` custom hook, which encapsulates array mutators (`append`, `remove`, `insert`, `move`).
* **Hierarchical State Binding**: Track form control or group states within the array dynamically, exposing an iterative data interface that clean maps to JSX `.map()` loops.
* **Complex Nested Diagnostics**: Provide fallback logging and high-priority diagnostics for deeply nested or condition-heavy complex arrays, preserving raw metadata pointers.

#### Engineering Rationale for Runtime Parity
* **Dynamic UI Synchronization**: A functional UI must allow adding, removing, or reordering dynamic rows (such as invoice line items or user address lists) just like the source Angular app. Mapping this to a managed `useFormArray` utility ensures stable React re-renders.
* **Prevention of Layout Collapse**: Converting `FormArray` to a plain object (Option B) destroys the length and order properties of the list, resulting in total UI breakdown, while skipping it (Option C) cripples complex dynamic data entry screens.

Recommendation: A. It covers practical list-form behavior while still flagging complex nesting.

### Question 6
How should `ngSubmit` be converted?

A) Convert to React `onSubmit` with `event.preventDefault()` and call the original submit expression
B) Convert to `onClick` on the first button
C) Preserve `ngSubmit` as a custom attribute
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. This is the direct React equivalent for form submission.

### Question 7
How should template-driven `[(ngModel)]` be handled?

A) Convert to controlled input state and tag as template-driven form conversion
B) Leave `[(ngModel)]` unchanged
C) Remove the binding
X) Other (please describe after [Answer]: tag below)

[Answer]: X
#### Core Implementation Specification
* **Controlled State Extraction**: Extract the internal property and event intents of `[(ngModel)]="value"` into an explicit React dynamic state wrapper (`value` and `onChange` hooks).
* **Form Adapter Harmonization**: Route this state binding directly through the custom project-local form adapters (`useFormControl`) to maintain a single source of truth across both reactive and inline input fields.
* **Property Lifecycle Synchronization**: Automatically resolve compound variations like `[ngModel]="x" (ngModelChange)="y($event)"` into React `value={x}` and `onChange={(e) => y(e.target.value)}`.

#### Engineering Rationale for Runtime Parity
* **Bidirectional Data Flow**: A seamless Angular UI relies heavily on immediate, two-way data propagation between the input element and the component class. Synthesizing this into a unified custom hook interface avoids state duplication and prevents dynamic form fields from freezing.
* **Prevention of Form Desynchronization**: Relying on option B breaks compilation, while option C removes user input processing entirely. Merging template-driven semantics into the custom hook engine guarantees full data parity.

Recommendation: A. This matches the desired runtime behavior and current template handoff direction.

### Question 8
How should validation error display be generated?

A) Generate minimal error state and placeholders where templates reference control validity/errors
B) Generate no error UI
C) Invent complete UI messages for every validator
X) Other (please describe after [Answer]: tag below)

[Answer]: X
#### Core Implementation Specification
* **Conditional JSX Guard Generation**: Convert Angular template error queries (e.g., `form.get('email').hasError('required')` or `control.errors?.required`) into clean conditional JSX expressions checking the custom form adapter's state (e.g., `form.email.errors?.required && (...)`).
* **Original Message Preservation**: Preserve the original fallback text, inner alert markups, or structural error message blocks exactly as written in the source Angular HTML template.
* **Property Fallback Injection**: Inject safe fallback error diagnostics or conditional warning stubs if the template expression relies on complex, unresolvable component class validation states.

#### Engineering Rationale for Runtime Parity
* **Visual Presentation Alignment**: To achieve a React application that renders and behaves identically to the source, the error text layout must be perfectly preserved. Option B breaks visual parity, while option C risks inventing arbitrary localized messages that diverge from the original product copy.
* **Deterministic Layout Structure**: Mapping error blocks directly to the custom local adapter state guarantees that error divs trigger on screen under the exact same conditional criteria, preventing unexpected layout shifts or silent failures during the `aidlc` verification run.

Recommendation: A. It preserves behavior without inventing product copy.

### Question 9
How should uncertain form conversion be reported?

A) Preserve safe controls and emit manual-review diagnostics with source refs
B) Fail the entire conversion run
C) Guess the nearest behavior without diagnostics
X) Other (please describe after [Answer]: tag below)

[Answer]: X
#### Core Implementation Specification
* **Adaptive Fragment Preservation**: Guarantee the conversion of all syntactically clear form fields and group trees, ensuring valid adjacent fields are never dropped due to an isolated anomaly.
* **Inline Injection & Diagnostic Coupling**: Inject a structured TypeScript/JSX code comment (`/* AIDLC_MANUAL_REVIEW_FORM: Original Source */ TODO_FORM_FALLBACK`) directly at the specific point of failure in the file, while concurrently appending a high-priority diagnostic tracking entry to the central report.
* **Property Fallback Interface**: Ensure that any ambiguous controls produce a type-safe fallback object shape inside the local form adapter initialization, shielding downstream JSX from catastrophic runtime type crashes.

#### Engineering Rationale for Runtime Parity
* **Zero-Interruption Developer Ergonomics**: Halting the pipeline (Option B) prevents any screen visualization, while silent guessing (Option C) injects invisible logic bugs that corrupt state. Placing the original Angular snippet directly into the local target file code drastically reduces manual patching cycles.
* **Type Continuity Under Failure**: Forcing a safe structural object fallback for broken controls allows the rest of the form to compile, build, and mount seamlessly, giving the developer a functioning, executable canvas to finalize screen-to-screen parity.

Recommendation: A. It keeps the generated app runnable while surfacing gaps.

### Question 10
What should be the blocking test focus for this unit?

A) Form model extraction, built-in validator conversion, template binding conversion, submit handling, deterministic output, and diagnostics
B) Only snapshot tests for generated components
C) No blocking tests until all V2 units are complete
X) Other (please describe after [Answer]: tag below)

[Answer]: X
#### Core Implementation Specification
* **Integrated Form Pipeline Validation**: Enforce a strict blocking test suite covering form model extraction accuracy, custom adapter property injection, full native template bind mappings, and explicit submit preventDefault logic.
* **Deterministic Contract & Invariant Coverage**: Incorporate property-based tests to ensure that identical Angular form metadata graphs always produce structurally matched, un-corrupted React state shapes.
* **Type-Safety & Directory Boundary Restraint**: Enforce compiler verification checks ensuring that any generated custom form logic does not escape the targeted root folder or cause compilation breakage.

#### Engineering Rationale for Runtime Parity
* **Absolute Functional Dependability**: To deliver an executable React application that mimics Angular forms behavior perfectly, tests must inspect individual structural elements—such as control bindings and error guard states—individually. Purely relying on component snapshots (Option B) can miss subtle logical model failures that completely break dynamic screens.
* **Early Defect Trapping**: Delaying quality guardrails until the final phase (Option C) creates massive debugging costs. Validating complete structural models combined with strict type-safety invariants provides the precise automation layer needed for zero-error self-correction execution.

Recommendation: A. It covers the risky behavior and aligns with property-based testing expectations.

## Plan Checklist

- [x] Identify source requirement and affected packages.
- [x] Define functional design scope.
- [x] Define proposed forms conversion model.
- [x] Generate functional design questions.
- [x] Collect user answers.
- [x] Analyze answers for ambiguity.
- [x] Generate functional design artifacts.
- [x] Present functional design completion for approval.

## Security Baseline Compliance

- Form extraction must not execute source code or validator functions.
- Diagnostics must use safe source refs and generated refs.
- Generated validation helpers must not include raw sensitive snippets in reports.
- Unsafe form expressions must produce manual-review diagnostics.

## Property-Based Testing Compliance

Required properties:

- Equivalent form declarations produce stable form IR.
- Built-in validator conversion is deterministic.
- Generated form control names remain valid identifiers.
- Unsupported validators produce stable diagnostics.
- Generated files remain target-root contained.

## Approval Gate

Status: Functional design artifacts generated. Awaiting approval to continue to code generation planning.
