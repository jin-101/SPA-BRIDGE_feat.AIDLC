# V2-GAP-UOW-03 Business Rules

## Runtime Parity Rules

- Generated React forms must use project-local custom hooks, not external form libraries.
- `FormGroup`, `FormControl`, and `FormArray` declarations must produce structured Form IR before target generation.
- Template form bindings must connect to the same generated form adapter state.
- Submit handlers must call `event.preventDefault()` before invoking the original submit expression.
- Custom and async validators must not be executed during conversion.

## Form Model Extraction Rules

- `new FormGroup({...})` maps to a root `AngularFormGroupModel`.
- `new FormControl(initial, validators)` maps to `AngularFormControlModel`.
- `new FormArray([...])` maps to `AngularFormArrayModel`.
- `this.formBuilder.group({...})`, `fb.group({...})`, and `builder.group({...})` map to `AngularFormGroupModel`.
- Nested groups and arrays preserve hierarchy and stable paths.
- Unknown expressions create type-safe fallback metadata and manual-review diagnostics.

## Validator Rules

- `Validators.required` maps to a local required predicate.
- `Validators.minLength(n)` maps to a min-length predicate.
- `Validators.maxLength(n)` maps to a max-length predicate.
- `Validators.pattern(pattern)` maps to a pattern predicate.
- `Validators.email`, `Validators.min(n)`, and `Validators.max(n)` map to deterministic predicates.
- Built-in validator output must use Angular-like error object keys.
- Custom validators preserve references and emit manual-review diagnostics.
- Async validators preserve references and emit manual-review diagnostics.

## Template Binding Rules

- `[formGroup]="form"` binds child controls to the generated `useFormGroup` instance.
- `formControlName="name"` emits controlled props from `form.controls.name`.
- `formArrayName="items"` binds array rendering to `useFormArray`.
- `[(ngModel)]="value"` emits controlled input state through `useFormControl`.
- `[ngModel]="x" (ngModelChange)="y($event)"` emits `value={x}` and `onChange` callback wiring.
- `(ngSubmit)="submit()"` emits React `onSubmit` with `preventDefault()`.

## Error Display Rules

- Existing Angular error message markup is preserved where structurally safe.
- Error conditions such as `control.errors?.required` map to adapter error state.
- The converter must not invent new localized messages.
- Complex unresolved error expressions produce fallback diagnostics and safe comments.

## Uncertainty Rules

- Clear adjacent controls must still convert when one control is ambiguous.
- Ambiguous controls create fallback object shapes so generated JSX can compile.
- The generated code may include `AIDLC_MANUAL_REVIEW_FORM` comments at the exact local point of uncertainty.
- Central diagnostics must point to safe source refs and generated refs.

