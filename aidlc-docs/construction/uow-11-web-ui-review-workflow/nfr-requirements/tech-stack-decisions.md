# Technology Stack Decisions - UOW-11 Web UI Review Workflow

## Runtime Stack

| Area | Decision | Rationale |
|---|---|---|
| UI framework | React 18 with TypeScript | Matches the rest of the workspace and keeps the review workflow composable. |
| Build tool | Vite | Lightweight local dev/build flow for a browser review app. |
| State integration | Shared application/report adapters | Prevents local UI state from duplicating backend logic. |
| Routing | Browser-friendly client routing | Supports dashboard, report, and triage views without server coupling. |
| Styling | Minimal component-driven styling with responsive layout primitives | Keeps the UI usable and maintainable. |
| Rendering model | Safe client-side rendering only | Avoids remote rendering and preserves control over sanitized content. |

## Dependency Decisions

| Area | Decision | Rationale |
|---|---|---|
| Runtime dependencies | Minimal exact-pinned dependencies only | Reduces supply-chain surface and keeps the web layer predictable. |
| Shared packages | Reuse `core-application`, `core-reporting`, `core-quality`, and `core-security` | Keeps the UI aligned with canonical backend outputs. |
| UI libraries | Add only when necessary for local review ergonomics | Avoids unnecessary bundle bloat. |
| Auth integration | Provider-neutral hooks only | Leaves auth implementation open for later integration. |

## Validation and Testing Stack

| Area | Decision | Rationale |
|---|---|---|
| Unit tests | Vitest | Consistent with the workspace test stack. |
| Property-based tests | fast-check | Matches the enabled PBT extension and TypeScript stack. |
| UI smoke tests | Component and view-model smoke coverage | Validates dashboard, report browsing, and remediation flows. |
| Accessibility checks | Keyboard and focus-state coverage | Supports the local review workflow. |

## Extension Compliance Notes

### Security Baseline
- Compliant: safe display, redaction-safe content, role-based gating hooks, safe path refs, and fail-closed remediation actions.
- N/A: deployment, network, and specific auth-provider implementation details are outside this NFR set.

### Property-Based Testing
- Compliant: navigation/state invariants, report-to-view mapping, confirmation gating, safe rendering, and access-control gating.
- N/A: round-trip codecs, oracle-backed algorithms, and stateful engines are not the primary concern of the Web UI layer.
