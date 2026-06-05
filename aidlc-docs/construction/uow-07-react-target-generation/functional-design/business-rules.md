# UOW-07 Business Rules

## Target Strategy Rules

- Vite + React 18 + TypeScript is the default target when no explicit target strategy is provided.
- Target strategies must have stable strategy IDs.
- The strategy registry must select targets deterministically by requested strategy ID, default flag, priority, and strategy ID.
- Unknown target strategies produce blocking diagnostics.
- Future target strategies must implement the same request, write-plan, diagnostics, and traceability contracts.

## Input and Draft Consumption Rules

- UOW-07 consumes UOW-04 React-oriented target drafts and conversion artifacts.
- UOW-07 must not re-read raw Angular source files to perform transformation.
- UOW-07 must not silently ignore draft categories that it recognizes.
- Draft schema version mismatches produce blocking diagnostics.
- Missing required component, route, state, or service draft refs produce blocking or manual-review diagnostics based on severity.

## Write Plan Rules

- Every generated file must be represented in a write plan before any write is performed.
- Write plans must include stable file refs, target-relative paths, content hashes, generation category, source draft refs, and conflict status.
- Write plans must be sorted deterministically by normalized target-relative path and file ref.
- Duplicate target paths are rejected unless explicitly merged by a strategy-defined rule.
- Duplicate file refs are rejected.
- File content must be deterministic for equivalent inputs.

## Path and Conflict Rules

- Generated paths must remain inside the configured target output root.
- Path traversal segments and absolute paths from draft data are rejected.
- Existing files are preserved by default.
- Overwrite is allowed only when the caller provides an explicit overwrite policy.
- Conflicts produce safe diagnostics with file refs and target-relative paths.
- Unsafe path diagnostics are blocking.

## Project Scaffold Rules

- The default scaffold includes package metadata, TypeScript config, Vite config, `index.html`, `src/main.tsx`, `src/App.tsx`, and stable source folders.
- Package scripts must include at least `build` and `test` placeholders or strategy-approved commands.
- Generated package metadata must not copy Angular package scripts.
- Generated config files must be derived from target strategy defaults and selected dependencies.

## Dependency Selection Rules

- Dependencies must come from a target allowlist.
- React and React DOM are required for the default target.
- Vite and TypeScript tooling are required for the default target.
- React Router is included only when route drafts require runtime routing output.
- Redux Toolkit is included only when the selected state strategy is Redux Toolkit.
- Zustand is included only when the selected state strategy is Zustand.
- Angular runtime dependencies must not be copied into the generated React package metadata.
- Dependency selection must be deterministic for equivalent target strategy and draft summaries.

## Component Materialization Rules

- Component drafts are materialized into `.tsx` files under the configured component output folder.
- Component names, exports, imports, props, hooks, event handlers, JSX, and style refs must derive from UOW-04 drafts.
- Unsupported JSX nodes or behavior mappings must produce manual-review diagnostics.
- Every generated component file must include traceability to at least one component draft or explicit synthetic origin.

## Service and DI Materialization Rules

- Service drafts are materialized into service modules, hooks, context providers, or review stubs according to UOW-04 recommendations.
- Dependency injection scopes that cannot be represented safely must produce manual-review diagnostics.
- UOW-07 must not invent runtime access-control or provider semantics.

## State Strategy Rules

- React Context API output includes context, provider, and hook files.
- Redux Toolkit output includes store setup, slice files, selectors, and review items for unresolved effects.
- Zustand output includes store modules and hooks.
- Selected strategy rationale must be preserved for reporting.
- State drafts that cannot be materialized safely must produce partial output and manual-review diagnostics.

## Routing Rules

- Route drafts are materialized into React Router-compatible route modules.
- Nested routes and route parameters are preserved when represented in route drafts.
- Guards, lazy loading, dynamic route targets, and access-control behavior that cannot be safely materialized produce manual-review diagnostics.
- Routing output must not silently weaken route guard semantics.

## Manual Review and Diagnostics Rules

- Unsupported or uncertain target materialization must preserve partial output when safe.
- Manual-review diagnostics must include stable reason codes and safe refs.
- Diagnostics must not contain raw sensitive source snippets.
- Manual-review stubs must be deterministic and traceable to draft refs.
- Blocking diagnostics prevent write-plan execution.

## Traceability Rules

- Every generated file must have at least one source draft ref or explicit synthetic origin.
- Generated refs must be stable across equivalent generation runs.
- Trace records must link generated file refs to draft refs, strategy IDs, and diagnostic refs where applicable.
- Traceability records are handed off to UOW-09 reporting.

## Out-of-Scope Rules

- UOW-07 does not run TypeScript compilation, linting, formatting, build, or tests.
- UOW-07 does not perform AI provider calls.
- UOW-07 does not own CLI or Web UI interaction flows.
- UOW-07 does not render final conversion reports.
- UOW-07 does not deploy the generated React project.
