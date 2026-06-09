# V2-GAP-UOW-02 Frontend Components Design

## React Component Materialization Impact

Generated React components should receive JSX created from structured template conversion rather than shallow Angular marker preservation.

Component materialization responsibilities:

- Build selector registry from converted component drafts.
- Convert custom Angular tags to React component imports.
- Emit JSX for structural directives.
- Include helper functions only when used.
- Preserve source-like folder structure.
- Attach review diagnostics to unresolved template constructs.

## JSX Patterns

### Conditional Rendering

Angular:

```html
<section *ngIf="ready">Ready</section>
```

React:

```tsx
{ready && (
  <section>Ready</section>
)}
```

### Repeated Rendering

Angular:

```html
<li *ngFor="let item of items; index as i">{{ item.name }}</li>
```

React:

```tsx
{items.map((item, i) => (
  <li key={item?.id ?? i}>{item.name}</li>
))}
```

### Custom Components

Angular:

```html
<ke-konbini-pres [passenger]="passenger" (selected)="onSelected($event)"></ke-konbini-pres>
```

React:

```tsx
<KeKonbiniPres passenger={passenger} onSelected={(event) => onSelected(event)} />
```

### Dynamic Class And Style

Angular:

```html
<div [ngClass]="{ active: isActive }" [ngStyle]="{ width: width + 'px' }"></div>
```

React:

```tsx
<div className={applyClassMap({ active: isActive })} style={applyStyleMap({ width: width + 'px' })} />
```

## Helper Strategy

Initial implementation may emit local helpers in generated component files:

- `applyClassMap`
- `applyStyleMap`
- known pipe helpers

If repeated across many components, later units may centralize helpers under `src/template-helpers/`.

## Review Output

Manual review items should be generated for:

- unknown pipes.
- unresolved custom component selectors.
- complex `ng-template` composition.
- unsafe URLs.
- structural directives that cannot be mapped safely.

Review items must point to generated files and safe source refs.

