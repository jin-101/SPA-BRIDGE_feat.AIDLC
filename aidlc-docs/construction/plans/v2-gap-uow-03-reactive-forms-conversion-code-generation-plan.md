# V2-GAP-UOW-03 Reactive Forms Conversion Code Generation Plan

## Unit

V2-GAP-UOW-03 Reactive Forms Conversion

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-003 Reactive Forms Conversion

Supporting requirements:
- V2-GAP-FR-004 Advanced Template Conversion handoff markers for `formGroup`, `formControlName`, `formArrayName`, `ngSubmit`, `ngModel`, and `ngModelChange`.
- Global V2 acceptance goal that generated React output should install, start, and preserve runtime behavior as far as deterministic conversion can safely support.

## Goal

Implement Angular reactive and common template-driven form conversion so generated React components use project-local controlled form hooks, deterministic validators, safe submit handlers, and traceable manual-review diagnostics.

The implementation must not add a third-party form library. Target projects should receive local utilities under `src/utils/forms/` that expose `useFormControl`, `useFormGroup`, `useFormArray`, and Angular-like validation error objects.

## Brownfield Code Locations

Application code must be modified in-place under the workspace root:

- `packages/source-angular/src/types.ts`
- `packages/source-angular/src/forms/`
- `packages/source-angular/src/service/source-angular-analysis-service.ts`
- `packages/source-angular/src/templates/`
- `packages/transform-angular-react/src/types.ts`
- `packages/transform-angular-react/src/context/context-normalizer.ts`
- `packages/transform-angular-react/src/converters/`
- `packages/target-react/src/types.ts`
- `packages/target-react/src/drafts/react-draft-normalizer.ts`
- `packages/target-react/src/generation/target-generation-service.ts`
- `packages/target-react/src/materializers/`
- affected package tests under `packages/*/tests/`

Documentation summaries may be added under:

- `aidlc-docs/construction/v2-gap-uow-03-reactive-forms-conversion/code/`

## Dependencies

This unit builds on:

- Existing Angular TypeScript parse summaries.
- Existing template IR extraction and advanced JSX rendering from V2-GAP-UOW-02.
- Existing transformation carry-through model.
- Existing target React generation and materializer pipeline.
- Existing deterministic diagnostics and path-containment patterns.

## Story And Requirement Traceability

- V2-GAP-FR-003: Convert Angular reactive forms and template-driven form bindings.
- V2-GAP-FR-004: Consume template binding markers produced by advanced template conversion.
- Security Baseline: no source code execution, no raw sensitive snippets in diagnostics, target-root containment.
- Property-Based Testing: stable form IR, deterministic validator conversion, deterministic diagnostics, valid generated identifiers.

## Implementation Plan

### Step 1. Source Form Model Types

- [x] Extend `packages/source-angular/src/types.ts` with form model types:
  - `AngularFormModel`
  - `AngularFormControlModel`
  - `AngularFormGroupModel`
  - `AngularFormArrayModel`
  - `AngularValidatorModel`
  - `FormTemplateBindingIntent`
  - `FormSubmitIntent`
- [x] Include stable IDs, safe source refs, owner component IDs, control paths, declaration kinds, validator metadata, and diagnostics.
- [x] Keep source expressions as safe text references only; do not evaluate Angular code or validators.

### Step 2. Form Model Extractor

- [x] Create `packages/source-angular/src/forms/form-model-extractor.ts`.
- [x] Detect direct declarations:
  - `new FormGroup(...)`
  - `new FormControl(...)`
  - `new FormArray(...)`
- [x] Detect FormBuilder declarations:
  - `this.formBuilder.group(...)`
  - `this.fb.group(...)`
  - `fb.group(...)`
  - `builder.group(...)`
  - matching `control(...)` and `array(...)` usages.
- [x] Extract nested groups, arrays, controls, initial values, and stable dot/bracket control paths.
- [x] Preserve unknown or complex expressions as safe fallback metadata with manual-review diagnostics.

### Step 3. Validator Normalization

- [x] Normalize built-in validators into deterministic metadata:
  - `Validators.required`
  - `Validators.minLength(n)`
  - `Validators.maxLength(n)`
  - `Validators.pattern(pattern)`
  - `Validators.email`
  - `Validators.min(n)`
  - `Validators.max(n)`
- [x] Preserve custom and async validator references without execution.
- [x] Emit manual-review diagnostics for custom, async, unknown, or lossy validator patterns.
- [x] Preserve Angular-like error object keys in the target validator contract.

### Step 4. Template Form Binding Extraction

- [x] Extend template/form integration to detect:
  - `[formGroup]`
  - `formControlName`
  - `formArrayName`
  - `(ngSubmit)`
  - `[(ngModel)]`
  - `[ngModel]`
  - `(ngModelChange)`
- [x] Attach template binding intents and submit intents to the owning `AngularFormModel`.
- [x] Preserve original display/error markup when structurally safe.
- [x] Emit safe diagnostics for ambiguous form bindings while preserving adjacent controls.

### Step 5. Source Analysis Integration

- [x] Wire the form extractor into `SourceAngularAnalysisService`.
- [x] Add form models to `AngularAnalysisResult`.
- [x] Update source summary counts for forms, controls, arrays, validators, and diagnostics.
- [x] Ensure extraction remains deterministic by sorting forms, controls, validators, and diagnostics.

### Step 6. Transformation Carry-Through

- [x] Extend transformation types with normalized form metadata:
  - `NormalizedFormModel`
  - `NormalizedFormControl`
  - `NormalizedFormArray`
  - `NormalizedValidator`
  - `FormBindingIntent`
  - `FormSubmitIntent`
- [x] Update `ContextNormalizer` to preserve source form models.
- [x] Update component/template converters so `ReactComponentDraft` can carry associated form drafts.
- [x] Keep unsupported mapping diagnostics traceable to safe source and generated refs.

### Step 7. Target Form Runtime Utilities

- [x] Add generation support for project-local target utilities:
  - `src/utils/forms/useFormControl.ts`
  - `src/utils/forms/useFormGroup.ts`
  - `src/utils/forms/useFormArray.ts`
  - `src/utils/forms/validators.ts`
  - `src/utils/forms/index.ts`
- [x] Implement controlled-input props: `value`, `onChange`, `onBlur`, `touched`, `dirty`, `errors`, `valid`, and `invalid`.
- [x] Implement array helpers: `append`, `remove`, `insert`, `move`, and `update`.
- [x] Implement built-in validators as pure functions returning Angular-like error objects.
- [x] Keep generated helpers dependency-free and TypeScript-safe.

### Step 8. Component Materializer Integration

- [x] Update `ComponentMaterializer` and template JSX rendering to import and use generated form helpers.
- [x] Convert `[formGroup]` and `formControlName` into controlled props from the generated form instance.
- [x] Convert `(ngSubmit)` into `onSubmit` handlers that call `event.preventDefault()` before invoking the original expression.
- [x] Convert `[(ngModel)]` and `[ngModel]` plus `(ngModelChange)` into controlled state through `useFormControl`.
- [x] Convert form error display guards to adapter error state where structurally safe.
- [x] Insert `AIDLC_MANUAL_REVIEW_FORM` comments at local uncertainty points.

### Step 9. Tests

- [x] Add source-angular example tests for `FormGroup`, `FormControl`, `FormArray`, `FormBuilder`, validators, custom validators, async validators, and template binding extraction.
- [x] Add target-react tests for generated form utilities and component materialization.
- [x] Add submit handling tests that verify `event.preventDefault()` and original submit expression preservation.
- [x] Add diagnostic tests for unsupported validators, complex nested arrays, ambiguous controls, and unresolved error expressions.
- [x] Add property-based tests for deterministic form IR, validator normalization, stable diagnostics, and valid generated identifiers.

### Step 10. Documentation Summary

- [x] Create `aidlc-docs/construction/v2-gap-uow-03-reactive-forms-conversion/code/summary.md`.
- [x] Create `aidlc-docs/construction/v2-gap-uow-03-reactive-forms-conversion/code/artifact-index.md`.
- [x] Record implemented files, tests, runtime helper strategy, diagnostics, and residual limitations.

### Step 11. Verification

- [x] Run affected package tests:
  - `npm run test --workspace @spa-bridge/source-angular`
  - `npm run test --workspace @spa-bridge/transform-angular-react`
  - `npm run test --workspace @spa-bridge/target-react`
- [x] Run workspace build:
  - `npm run build`
- [x] Run workspace tests:
  - `npm test`
- [x] Update this plan checklist immediately as implementation steps complete.

## Security Baseline Compliance

- Form extraction must not execute source code, validators, or template expressions.
- Diagnostics must use safe source refs and generated refs, not raw sensitive snippets.
- Generated form helpers must avoid `dangerouslySetInnerHTML` and unsafe code evaluation.
- Target files must remain contained under the generated React output root.
- No external form dependency is introduced by default.

## Property-Based Testing Compliance

Required properties:

- Equivalent form declarations produce stable form IR.
- Built-in validator normalization is deterministic.
- Unsupported validators produce stable diagnostics.
- Generated control names and helper identifiers remain valid TypeScript identifiers.
- Generated target helper paths remain target-root contained.

## Approval Gate

Status: Code generation executed. Awaiting review approval to continue to V2-GAP-UOW-04.
