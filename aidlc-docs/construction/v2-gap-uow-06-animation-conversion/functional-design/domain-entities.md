# V2-GAP-UOW-06 Animation Conversion Domain Entities

## Purpose

This functional design defines the domain model for converting Angular animation behavior into Next.js/React output while preserving runtime parity where practical.

## Animation Source Model

### AngularAnimationDeclaration

Represents animation metadata extracted from `@Component({ animations: [...] })`.

Fields:
- `id`: Stable animation declaration ID.
- `sourceRef`: Safe source reference to the component file.
- `componentId`: Owning Angular component ID.
- `triggers`: Ordered `AnimationTriggerModel` entries.
- `rawConstructKinds`: Detected Angular DSL constructs without raw source snippets.
- `diagnostics`: Safe extraction diagnostics.

### AnimationTriggerModel

Represents a named Angular animation trigger.

Fields:
- `triggerName`: Angular trigger name such as `openClose`.
- `states`: Stable ordered state definitions.
- `transitions`: Stable ordered transition definitions.
- `bindings`: Template binding references that use this trigger.
- `complexity`: `simple`, `moderate`, or `complex`.
- `conversionEligibility`: `css-transition`, `react-helper`, `adapter-scaffold`, or `manual-review`.

### AnimationStateModel

Represents a `state(...)` entry.

Fields:
- `stateName`: State name or wildcard expression.
- `styleProperties`: Safe style property/value summary.
- `sourceRef`: Safe source reference.
- `requiresReview`: True when style values include dynamic or unsupported expressions.

### AnimationTransitionModel

Represents a `transition(...)` entry.

Fields:
- `expression`: Normalized transition expression.
- `durationMs`: Parsed duration when deterministic.
- `easing`: Parsed easing when deterministic.
- `usesQuery`: Whether `query(...)` appears.
- `usesStagger`: Whether `stagger(...)` appears.
- `usesGroup`: Whether `group(...)` appears.
- `requiresRuntimeHelper`: True when CSS-only conversion is not enough.
- `requiresManualReview`: True when behavior cannot be safely approximated.

### TemplateAnimationBindingModel

Represents animation usage in templates.

Fields:
- `triggerName`: Referenced trigger.
- `bindingExpression`: Safe expression summary for `[@trigger]`.
- `startHandler`: Optional normalized handler for `@trigger.start`.
- `doneHandler`: Optional normalized handler for `@trigger.done`.
- `targetElementRef`: Stable target element reference.
- `conversionPlan`: Target JSX/class/hook binding plan.

### ThirdPartyAnimationUsage

Represents animation libraries and wrappers used by the source project.

Fields:
- `packageName`: Package name.
- `usageKind`: `lottie`, `gsap`, `animejs`, `angular-wrapper`, or `unknown`.
- `importRefs`: Safe import references.
- `assetRefs`: Related animation assets.
- `targetDependencyDecision`: `carry`, `replace`, `remove`, or `review`.
- `targetAdapterPlan`: React helper or review plan.

### AnimationAssetRef

Represents referenced animation assets.

Fields:
- `sourcePath`: Safe contained source path.
- `targetPath`: Deterministic target path under the generated Next.js project.
- `assetKind`: `lottie-json`, `image`, `sprite`, `style`, or `unknown`.
- `copyStatus`: `planned`, `copied`, `missing`, or `review`.

### AnimationConversionDiagnostic

Represents a safe diagnostic for unsupported or lossy animation conversion.

Fields:
- `code`: Stable diagnostic code.
- `severity`: `info`, `warning`, `blocking`, or `manual-review`.
- `sourceRef`: Safe source reference.
- `triggerName`: Optional trigger name.
- `category`: `metadata`, `template-binding`, `third-party-library`, `asset`, or `nextjs-client-boundary`.
- `runtimeParityImpact`: `none`, `low`, `medium`, or `high`.
- `suggestedTargetApproach`: Safe action text.

## Relationships

- One Angular component can own many `AngularAnimationDeclaration` entries.
- One animation declaration can contain many triggers.
- One trigger can be referenced by many template animation bindings.
- One third-party usage can reference many animation assets.
- Each generated target helper, CSS class, or review item must link back to its source model through traceability.
