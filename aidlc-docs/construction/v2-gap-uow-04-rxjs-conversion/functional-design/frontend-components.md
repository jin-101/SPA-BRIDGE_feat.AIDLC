# V2-GAP-UOW-04 Frontend Components Design

## Component Hook Integration

Generated React components should initialize RxJS hooks near the top of the component body, after regular state declarations and before event handlers.

Example:

```tsx
const passengersValue = useObservable(passengers$, []);
```

Hook names must be deterministic and valid React identifiers.

## Async Pipe Rendering

Angular:

```html
<span>{{ passengers$ | async }}</span>
```

React:

```tsx
<span>{passengersValue}</span>
```

For nullable values, the generated expression should preserve safe fallback behavior:

```tsx
<span>{passengersValue ?? null}</span>
```

## Property Bindings

Angular:

```html
<flight-card [flight]="selectedFlight$ | async"></flight-card>
```

React:

```tsx
<FlightCard flight={selectedFlightValue} />
```

Custom component selector conversion from earlier V2 work should receive resolved async hook values as normal JSX props.

## Subscription Effects

Angular:

```ts
ngOnInit() {
  this.flight$.subscribe((flight) => this.selectedFlight = flight);
}
```

React:

```tsx
useSubscriptionEffect(() => flight$.subscribe((flight) => {
  setSelectedFlight(flight);
}), [flight$]);
```

Generated effects must not be placed inside conditional branches or render loops.

## Subject State Bridges

Angular:

```ts
private readonly selected$ = new BehaviorSubject<string>('');
```

React:

```tsx
const selectedValue = useSubjectValue(selected$, '');
```

When subject read/write semantics are unclear, generated code should include a nearby review comment and central diagnostic.

## Event Handlers And Next Calls

Angular:

```ts
select(id: string) {
  this.selected$.next(id);
}
```

React target intent:

```tsx
const select = (id: string) => {
  selectedSubject.next(id);
};
```

If a safe state bridge is generated, the handler may also update local state through the generated adapter.

## Review Comments

When conversion is uncertain, generated code may include:

```tsx
/* AIDLC_MANUAL_REVIEW_RXJS: flattening operator chain preserved for review */
```

The comment must be local to the uncertain hook, operator chain, or binding and paired with a central diagnostic.

## Runtime Utility Imports

Components should import only the RxJS helpers they use:

```tsx
import { useObservable, useSubscriptionEffect } from '../utils/rxjs/index.js';
```

The target generation stage must avoid unused helper imports.

