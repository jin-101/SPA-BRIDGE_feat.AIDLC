# V2-GAP-UOW-02 Domain Entities

## TemplateConversionModel

Represents the structured template conversion state for one Angular template.

Fields:
- `templateId`: stable template identifier.
- `sourceRef`: safe source reference for traceability.
- `ownerComponentId`: component that owns the template.
- `nodes`: ordered template node tree.
- `selectorRegistryRefs`: component selectors available for custom tag conversion.
- `diagnostics`: safe diagnostics for unsupported or lossy mappings.

## TemplateNode

Common node contract for source-order-preserving template conversion.

Node variants:
- `TemplateElementNode`: HTML, Angular custom element, or special Angular container.
- `TemplateTextNode`: static text content.
- `TemplateInterpolationNode`: `{{ expression }}`.
- `TemplateProjectionSlot`: `ng-content` slot.
- `TemplateDeferredFragment`: reviewable fragment for complex `ng-template` usage.

Rules:
- Every node has a stable ID.
- Node order follows source order.
- Unsupported content is preserved as safe JSX comments or manual-review metadata, not silently dropped.

## TemplateDirective

Represents structural and attribute-level Angular template directives.

Supported directive categories:
- `if`: `*ngIf`, including simple `else` references.
- `for`: `*ngFor`, including item variable, iterable expression, index alias, and trackBy expression.
- `container`: `ng-container`.
- `template`: `ng-template`.
- `projection`: `ng-content`.
- `class`: `ngClass`, `[class.foo]`.
- `style`: `ngStyle`, `[style.foo]`, `[style.foo.unit]`.
- `form`: `ngModel`, `formGroup`, `formControlName` markers for V2-GAP-UOW-03 handoff.

## TemplateBinding

Represents Angular property-like bindings.

Examples:
- `[input]="value"`
- `bind-input="value"`
- `input="{{ value }}"`
- `[attr.aria-label]="label"`
- `[class.active]="active"`
- `[style.width.px]="width"`

Target intent:
- Normal inputs become JSX props.
- Class/style bindings become className/style composition expressions.
- Attribute bindings become valid React DOM props when safe.

## TemplateEvent

Represents Angular event/output bindings.

Examples:
- `(click)="save($event)"`
- `on-click="save($event)"`
- `(selected)="onSelected($event)"` on custom components.

Target intent:
- DOM events become React event props such as `onClick`.
- Custom component outputs become callback props based on output name.
- `$event` becomes the generated callback parameter `event`.

## TemplatePipeUsage

Represents a pipe expression in interpolation or property binding.

Known display pipes:
- `date`
- `number`
- `currency`
- `uppercase`
- `lowercase`
- `json`

Special handling:
- `async` is tagged for RxJS follow-up in V2-GAP-UOW-04.
- Unknown pipes generate helper stubs plus manual-review diagnostics.

## TemplateConversionDiagnostic

Safe diagnostic emitted when conversion is unsupported, partial, or unsafe.

Diagnostic categories:
- `unsupported-structural-directive`
- `unsupported-pipe`
- `unsafe-reference`
- `ambiguous-template-ref`
- `unknown-custom-selector`
- `lossy-binding`

Diagnostics must include safe source refs and generated refs without exposing sensitive raw snippets in reports.

