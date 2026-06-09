# V2-GAP-UOW-00 Code Summary

## Implemented Scope

V2-GAP-UOW-00 adds a deterministic dependency compatibility layer to React target generation. Source Angular package manifests are no longer copied with only shallow Angular core filtering. They are classified into carry, replace, remove, or review decisions before the generated `package.json` is materialized.

## Key Behaviors

- Angular framework/build packages are removed from generated React dependencies.
- NgRx packages are removed from generated React dependencies and expected to be handled by state conversion units.
- `ngx-*`, `@ngx-*`, `angularx-*`, and `ngrx-store-localstorage` are excluded and marked review-required.
- Framework-neutral libraries such as `dayjs`, `rxjs`, `mapbox-gl`, `lottie-web`, `js-cookie`, `uuid`, and Turf packages are carried.
- `@wds/wc-angular-lib@0.1.43` is replaced with `@wds/wc-react-lib@0.1.43`.
- WDS replacement always emits usage-site review because import, prop, event, and custom-element API parity is not assumed.
- A Markdown compatibility report is generated at `src/review/dependency-compatibility.md`.

## AI Boundary

The unit includes a schema-safe dependency advisory boundary for future Ollama integration. It parses advisory JSON defensively and discards invalid or low-confidence candidates. No live AI or network call is made by this unit, and deterministic registry decisions remain authoritative.

## Tests

Added example tests and property-based tests covering:

- Angular-only dependency removal.
- Angular wrapper package exclusion and review behavior.
- WDS package replacement.
- Framework-neutral dependency carry behavior.
- Compatibility report generation.
- Deterministic classification and unique target package names.

## Residual Limitations

- Usage-site import rewriting for replacement packages is review-only in this unit.
- React-specific replacements for general Angular wrappers are not inferred unless explicit deterministic rules exist.
- Generated target install/runtime validation remains part of later self-correction and integration workflow.

