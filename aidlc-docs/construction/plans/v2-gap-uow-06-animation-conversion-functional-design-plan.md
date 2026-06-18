# V2-GAP-UOW-06 Animation Conversion Functional Design Plan

## Context

This plan covers V2-GAP-UOW-06 Animation Conversion for the brownfield SPA-Bridge implementation.

The runtime parity target is now Next.js App Router + React 18 + TypeScript. Animation conversion must therefore favor generated output that can install, run with `npm run dev`, and preserve visible behavior as much as practical.

## Requirement Coverage

- V2-GAP-FR-005 Animation Conversion
- Supports V2-GAP-FR-004 Advanced Template Conversion
- Supports V2-GAP-FR-008 Next.js Target Default And Runtime Parity Quality Scoring

## Primary Packages

- `packages/source-angular`
- `packages/transform-angular-react`
- `packages/target-react`
- `packages/core-quality`

## Functional Design Tasks

- [x] Confirm animation conversion scope and target behavior.
- [x] Define Angular animation source model additions.
- [x] Define third-party animation library handling.
- [x] Define generated Next.js/React animation helper strategy.
- [x] Define style and asset preservation rules for animation behavior.
- [x] Define diagnostics and manual-review rules for lossy mappings.
- [x] Define tests and quality gates.
- [x] Generate functional design artifacts after answers are complete.

## Recommended Defaults

For the stated product goal, the recommended answer for every question below is `A`. These choices prioritize runtime parity, deterministic output, installability, and explicit diagnostics over silent drops or placeholder-only conversion.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the default conversion strategy for Angular `@Component({ animations: [...] })` metadata?

A) Extract Angular animation metadata into a structured model, convert simple state/transition cases to CSS or React helpers, and emit manual-review diagnostics for complex timelines
B) Preserve only the raw animation metadata in review notes without generating runtime behavior
C) Ignore Angular animation metadata during conversion
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should template animation bindings such as `[@trigger]`, `@trigger.start`, and `@trigger.done` be handled?

A) Convert trigger bindings into generated React props/classes/hooks where traceable, and convert start/done callbacks to React event-style handlers or review diagnostics
B) Strip animation bindings and rely on static JSX output
C) Convert all animation bindings to TODO comments only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
How should simple Angular state transitions be materialized in the Next.js target?

A) Generate deterministic CSS classes plus small React helper hooks when needed, using `src/app/globals.css` or colocated CSS modules according to the existing style strategy
B) Generate inline style objects only
C) Require all state transitions to be manually reimplemented after conversion
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
How should complex Angular animation DSL constructs such as `query`, `stagger`, `group`, and dynamic `animate(...)` expressions be handled?

A) Preserve source traceability, generate the closest safe adapter scaffold when possible, and emit blocking or manual-review diagnostics for lossy behavior
B) Approximate everything as a simple CSS transition without diagnostics
C) Drop complex animation constructs from the target output
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
How should third-party animation libraries such as `lottie-web`, `ngx-lottie`, `gsap`, and `animejs` be converted?

A) Carry framework-neutral libraries where compatible, replace Angular wrappers with React-compatible adapters where known, preserve asset references, and generate React `useEffect` wrappers for imperative calls
B) Remove all third-party animation libraries from generated package manifests
C) Keep every source package unchanged, including Angular wrapper packages
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should Lottie and animation asset references be preserved?

A) Copy referenced animation assets into the Next.js target, rewrite safe public/import paths, and report unresolved assets explicitly
B) Leave asset paths unchanged and let users fix broken paths manually
C) Do not copy animation assets
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
How should generated animation code interact with Next.js server/client component boundaries?

A) Mark animation-bearing generated components or helper wrappers with `"use client"` when they require effects, browser APIs, or imperative animation libraries
B) Generate all components as server components regardless of animation behavior
C) Disable all animation behavior to avoid client components
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
How should diagnostics classify unsupported or uncertain animation mappings?

A) Use structured diagnostics with safe source refs, trigger names, category, severity, suggested target approach, and runtime parity impact
B) Emit one generic warning per project
C) Suppress diagnostics unless conversion crashes
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
What should be the blocking test focus for this unit?

A) Angular metadata extraction, template binding conversion, generated CSS/helper determinism, asset preservation, package compatibility, and diagnostic stability
B) Only example-based tests for one simple transition
C) No blocking tests for animation conversion because animations are visual
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
How should runtime parity quality scoring include animation conversion?

A) Add animation-specific quality signals for unresolved triggers, missing assets, wrapper replacements, client-boundary requirements, and manual-review counts
B) Keep animation quality entirely out of runtime parity scoring
C) Only count animation conversion as successful when no diagnostics exist
X) Other (please describe after [Answer]: tag below)

[Answer]: A
