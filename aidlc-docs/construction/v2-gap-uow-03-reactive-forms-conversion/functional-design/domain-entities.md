# V2-GAP-UOW-03 Domain Entities

## AngularFormModel

Represents a source Angular form declaration extracted from TypeScript and templates.

Fields:
- `id`: stable form ID.
- `ownerComponentId`: owning component draft ID.
- `sourceRef`: safe source reference.
- `declarationKind`: `form-group`, `form-control`, `form-array`, `form-builder`, or `template-driven`.
- `rootControl`: top-level control tree.
- `templateBindings`: associated template form bindings.
- `submitIntents`: submit expressions from `ngSubmit`.
- `diagnostics`: manual-review and safety findings.

## AngularFormControlModel

Represents one form control.

Fields:
- `name`: control name.
- `path`: stable dot/bracket path such as `passenger.email`.
- `initialValue`: safe expression or literal placeholder.
- `valueType`: inferred text such as `string`, `number`, `boolean`, `unknown`.
- `validators`: normalized validator list.
- `asyncValidators`: referenced async validator list.
- `sourceExpression`: safe expression reference, not executed.

## AngularFormGroupModel

Represents a nested form object.

Fields:
- `name`: group name.
- `controls`: child controls.
- `groups`: child groups.
- `arrays`: child arrays.
- `validators`: group-level validators.

## AngularFormArrayModel

Represents a dynamic list of controls/groups.

Fields:
- `name`: array name.
- `itemKind`: `control`, `group`, `array`, or `unknown`.
- `initialItems`: safe extracted initial item metadata.
- `mutatorRefs`: source method references that add/remove/insert/move items.
- `complexity`: `simple` or `review-required`.

## NormalizedValidator

Represents a validator without executing source code.

Kinds:
- `required`
- `minLength`
- `maxLength`
- `pattern`
- `email`
- `min`
- `max`
- `custom`
- `async`
- `unknown`

Fields:
- `kind`
- `arguments`
- `sourceRef`
- `reviewRequired`

## ReactFormAdapterContract

Project-local target utilities generated under `src/utils/forms/`.

Required hooks:
- `useFormControl`
- `useFormGroup`
- `useFormArray`

Required behavior:
- expose `value`, `setValue`, `touched`, `dirty`, `errors`, `valid`, `invalid`.
- expose controlled-input props such as `value`, `onChange`, `onBlur`.
- expose array helpers such as `append`, `remove`, `insert`, `move`, `update`.
- return Angular-like error objects such as `{ required: true }`.

