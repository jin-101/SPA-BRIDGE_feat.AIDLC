# V2-GAP-UOW-03 Business Logic Model

## Overview

Reactive forms conversion uses a four-layer pipeline:

1. Extract Angular form declarations from TypeScript.
2. Extract template form binding intents from template IR and raw template text.
3. Normalize both sources into Form IR.
4. Generate local React form adapters and controlled JSX bindings.

## Source Extraction

Inputs:
- TypeScript class summaries.
- property initializers.
- method body text.
- imports and constructor dependencies.
- template IR and bindings from V2-GAP-UOW-02.

Outputs:
- `AngularFormModel`
- normalized validators.
- template binding intents.
- submit intents.
- diagnostics.

Extraction should detect:
- direct constructors such as `new FormGroup`.
- `FormBuilder` methods such as `fb.group`.
- validators inside array shorthand.
- `FormArray` declarations and mutator methods.
- `ngSubmit`, `formControlName`, and `ngModel` usage.

## Transformation

The transformation stage maps extracted forms into target drafts:

- `ReactFormDraft`
- `ReactFormControlDraft`
- `ReactFormArrayDraft`
- `ReactValidatorDraft`
- `FormDiagnostic`

The drafts are associated with owning component drafts so component materialization can include form state and bindings.

## Target Generation

The target stage generates shared local utilities:

- `src/utils/forms/useFormControl.ts`
- `src/utils/forms/useFormGroup.ts`
- `src/utils/forms/useFormArray.ts`
- `src/utils/forms/validators.ts`
- `src/utils/forms/index.ts`

Generated components then import and use those utilities.

## Adapter Semantics

`useFormControl`:
- owns value state.
- tracks touched/dirty.
- runs synchronous validators.
- exposes `inputProps`.

`useFormGroup`:
- owns named controls.
- computes group validity.
- exposes `handleSubmit`.
- preserves Angular-like error object shapes.

`useFormArray`:
- owns ordered item state.
- exposes `append`, `remove`, `insert`, `move`, and `update`.
- preserves item order for `.map()` rendering.

## Diagnostics

Diagnostics are emitted for:
- custom validators.
- async validators.
- complex nested `FormArray`.
- unresolved control names.
- unsupported dynamic form construction.
- ambiguous error display expressions.

Diagnostics must be stable and safe.

