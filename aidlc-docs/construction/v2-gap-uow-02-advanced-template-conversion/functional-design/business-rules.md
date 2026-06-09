# V2-GAP-UOW-02 Business Rules

## Conversion Priority

1. Preserve valid visible template content whenever safe.
2. Convert known Angular constructs to idiomatic JSX.
3. Preserve traceability from source template to generated React output.
4. Emit manual-review diagnostics for unsupported or uncertain mappings.
5. Never silently drop source evidence.

## Structural Directives

- `*ngIf="condition"` converts to conditional JSX using `condition && (...)`.
- `*ngIf="condition; else elseRef"` converts to a ternary when the else template can be resolved.
- Unresolved `else` templates preserve the primary branch and emit a manual-review diagnostic.
- `*ngFor="let item of items"` converts to `items.map((item) => (...))`.
- `index as i` adds the map index parameter.
- `trackBy` is used for `key` only when the expression can be safely represented.
- Unsafe or ambiguous `trackBy` generates a manual-review diagnostic and falls back to a stable best-effort key.

## Angular Containers And Projection

- `ng-container` converts to a React fragment.
- Simple `ng-template` blocks convert to named render helpers or deferred fragments.
- Complex `ng-template` usage emits a review diagnostic while preserving safe children.
- `ng-content` converts to `children` or slot-like props when the selector is simple.
- Complex projection selectors produce manual-review diagnostics.

## Bindings

- `[input]="expr"` converts to `input={expr}`.
- `[attr.name]="expr"` converts to the equivalent safe React attribute when known.
- Unknown `attr.*` bindings are preserved as reviewable props or diagnostics.
- `[class.name]="expr"` contributes to `className` composition.
- `[style.name]="expr"` and `[style.name.unit]="expr"` contribute to `style` object expressions.
- `[(ngModel)]` preserves controlled-input intent and is tagged for V2-GAP-UOW-03.

## Events And Outputs

- DOM events convert to React event props using React naming, such as `click` to `onClick`.
- `$event` converts to the callback parameter `event`.
- Custom component outputs convert to callback props.
- Unknown or unsafe event expressions are preserved with manual-review diagnostics.

## Pipes

- Known display pipes convert to generated helper functions.
- `async` pipe emits a follow-up diagnostic for V2-GAP-UOW-04 RxJS conversion.
- Unknown pipes generate helper stubs and manual-review diagnostics.
- Pipe conversion must preserve expression order and be deterministic.

## Custom Components

- Angular selectors are resolved through the component selector registry.
- Known custom component tags convert to React component identifiers.
- Input bindings become props.
- Output bindings become callback props.
- Projected content remains as children when safe.
- Unknown selectors remain visible and generate manual-review diagnostics.

## Safety Rules

- Template conversion must not execute source code.
- `javascript:` references remain unsafe and must produce blocking or review diagnostics.
- Generated JSX must not use `dangerouslySetInnerHTML` by default.
- Generated output must be deterministic for equivalent input.
- Generated file paths remain target-root contained.

