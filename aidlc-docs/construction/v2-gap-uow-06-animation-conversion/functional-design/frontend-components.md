# V2-GAP-UOW-06 Animation Conversion Frontend Components

## Generated Next.js Component Behavior

Animation conversion affects generated frontend files in the Next.js target project.

## Component-Level Rules

### Client Component Promotion

Generated components must include `"use client"` when they require:
- `useEffect`,
- `useRef`,
- browser animation APIs,
- `lottie-web`,
- `gsap`,
- `animejs`,
- animation event callback handling.

Components that only receive static CSS classes can remain server-compatible when no hook or browser API is required.

### JSX Binding Shape

Angular template animation bindings should map as follows:

| Angular Source | Target Shape |
|---|---|
| `[@trigger]="state"` | stable class/helper binding derived from `state` |
| `[@trigger]` | default trigger helper binding |
| `(@trigger.start)="onStart($event)"` | React callback wrapper or review diagnostic |
| `(@trigger.done)="onDone($event)"` | React callback wrapper or review diagnostic |

## Generated Helper Modules

Animation helpers should be generated under stable target paths such as:

- `src/animations/{component-name}-{trigger-name}.ts`
- `src/animations/use-{trigger-name}-animation.ts`
- `src/animations/lottie-adapter.tsx`

Helper modules must avoid raw source snippets and preserve source trace refs through comments only when safe.

## Style Output

CSS output should be deterministic and compatible with the existing style materialization strategy:

- global animation helpers can be appended to `src/app/globals.css`,
- component-specific classes can be emitted as colocated CSS modules when that strategy is available,
- existing source LESS/CSS assets remain copied through the resource preservation flow.

## Third-Party Animation UI

For known third-party libraries:

- `lottie-web`: generate a client wrapper with ref-based initialization and cleanup.
- `ngx-lottie`: replace dependency only when a known React target adapter is available; otherwise emit manual review.
- `gsap`: preserve imperative animation calls inside safe `useEffect` wrappers where traceable.
- `animejs`: preserve imperative calls inside safe `useEffect` wrappers where traceable.

## Review UX

Manual review output should identify:

- affected component,
- trigger name,
- unsupported construct,
- missing asset if any,
- likely visual impact,
- suggested Next.js/React remediation path.
