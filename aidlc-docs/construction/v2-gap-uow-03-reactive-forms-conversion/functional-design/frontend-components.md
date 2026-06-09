# V2-GAP-UOW-03 Frontend Components Design

## Component Form Integration

React components generated from Angular components should initialize local form adapter hooks near the top of the component body.

Example target shape:

```tsx
const passengerForm = useFormGroup({
  email: useFormControl('', [validators.required(), validators.email()]),
});
```

## Controlled Inputs

Angular:

```html
<input formControlName="email" />
```

React:

```tsx
<input {...passengerForm.controls.email.inputProps} aria-invalid={passengerForm.controls.email.invalid} />
```

## Template-Driven Inputs

Angular:

```html
<input [(ngModel)]="passengerName" />
```

React:

```tsx
<input value={passengerName.value ?? ''} onChange={(event) => passengerName.setValue(event.target.value)} />
```

## Submit Handling

Angular:

```html
<form [formGroup]="passengerForm" (ngSubmit)="save()">
```

React:

```tsx
<form onSubmit={passengerForm.handleSubmit(() => save())}>
```

`handleSubmit` must call `event.preventDefault()`.

## Error Blocks

Angular error display blocks should remain visually close to the source template:

```tsx
{passengerForm.controls.email.errors?.required && (
  <span>Email is required</span>
)}
```

The converter should preserve source error message text when present.

## FormArray Rendering

Angular `FormArray` should produce array helper usage and `.map()` rendering:

```tsx
{passengers.items.map((item, index) => (
  <input key={item.id ?? index} {...item.controls.name.inputProps} />
))}
```

Complex nested arrays receive diagnostics but should keep a compile-safe fallback shape.

## Manual Review Comments

When local conversion is uncertain, generated code may include:

```tsx
/* AIDLC_MANUAL_REVIEW_FORM: custom async validator preserved for review */
```

The comment must be local to the uncertain field and paired with a central diagnostic.

