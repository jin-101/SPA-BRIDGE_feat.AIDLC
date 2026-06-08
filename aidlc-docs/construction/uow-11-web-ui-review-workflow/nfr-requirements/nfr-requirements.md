# NFR Requirements - UOW-11 Web UI Review Workflow

## Purpose

UOW-11 must provide a browser-based review workflow that is responsive, safe, and aligned with the shared application and reporting services. The Web UI is a presentation and interaction layer only; it must not duplicate backend conversion, reporting, or quality logic.

## Scope

| Area | Requirement |
|---|---|
| Package | `packages/web` |
| Primary outputs | Review dashboard, report browsing, manual review triage, remediation actions, export handoff |
| Primary consumers | Local browser users, project reviewers, remediation workflows |
| Primary dependencies | `core-application`, `core-reporting`, `core-quality`, `core-security`, and shared workspace packages |

## Performance Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-WEB-PERF-001 | The initial review dashboard should render quickly enough for interactive local use. | Visible dashboard state in seconds on a typical developer machine |
| NFR-WEB-PERF-002 | Report browsing and filter changes should feel immediate for local review. | Deterministic local updates with no unnecessary full reloads |
| NFR-WEB-PERF-003 | Remediation action submission should provide responsive feedback. | Clear in-progress and completion states |
| NFR-WEB-PERF-004 | Canonical report handoff should reuse shared reporting outputs rather than rebuilding report content in the UI. | No duplicate report generation work in the web layer |

## Responsiveness and Scalability Requirements

| ID | Requirement | Rationale |
|---|---|---|
| NFR-WEB-SCALE-001 | The UI must remain usable for large review bundles with many diagnostics and manual review items. | Keeps browsing manageable for real conversion projects |
| NFR-WEB-SCALE-002 | Dashboard, report, and triage views must use grouped, paged, or filtered layouts rather than a single unbounded list. | Prevents visual overload |
| NFR-WEB-SCALE-003 | The UI should support incremental refresh of the current run state and report views. | Improves review responsiveness |
| NFR-WEB-SCALE-004 | The browser app must remain local-first and not require external hosting for the review workflow. | Keeps the workflow lightweight and portable |

## Accessibility Requirements

| ID | Requirement | Enforcement |
|---|---|---|
| NFR-WEB-A11Y-001 | Navigation must be keyboard-friendly. | Focus order and action controls must be testable |
| NFR-WEB-A11Y-002 | Text and status indicators must remain readable with contrast-safe styling. | Use safe display text and visible state cues |
| NFR-WEB-A11Y-003 | Interactive controls must expose clear labels and predictable focus states. | Component-level accessibility checks |
| NFR-WEB-A11Y-004 | Layout must remain responsive for local browser review. | Use stable responsive regions rather than fixed-width assumptions |

## Safety and Privacy Requirements

| ID | Requirement | Enforcement |
|---|---|---|
| NFR-WEB-SEC-001 | The UI must never render raw prompts, raw provider payloads, raw source snippets, secrets, or tokens. | Sanitized view models only |
| NFR-WEB-SEC-002 | The UI must display sanitized, redaction-safe content and safe refs only. | Shared safe renderer and sanitized report models |
| NFR-WEB-SEC-003 | Access-control hooks must remain provider-neutral and role-based. | Abstract gating points only |
| NFR-WEB-SEC-004 | Remediation actions must fail closed when the action is unsafe or ambiguous. | Confirmation gates and safe diagnostics |
| NFR-WEB-SEC-005 | Browser UI output must not invent unsafe absolute paths or raw filesystem details. | Safe path refs only |

## Determinism and State Requirements

| ID | Requirement | Enforcement |
|---|---|---|
| NFR-WEB-DET-001 | Equivalent report and run inputs must map to the same dashboard composition. | Deterministic state adapters |
| NFR-WEB-DET-002 | Equivalent filters and view selections must produce stable visible results. | Stable selection and grouping logic |
| NFR-WEB-DET-003 | Equivalent remediation actions must map to the same handoff behavior and result categories. | Stable action-result mapping |
| NFR-WEB-DET-004 | Re-rendering already sanitized content must not reintroduce unsafe content. | Idempotent safe rendering |

## Reliability Requirements

| ID | Requirement | Behavior |
|---|---|---|
| NFR-WEB-REL-001 | Failures must preserve the current review state whenever possible. | Keep dashboard context intact |
| NFR-WEB-REL-002 | Unsafe or ambiguous actions must not be auto-applied. | Require explicit confirmation or block the action |
| NFR-WEB-REL-003 | Report and remediation handoffs must stay aligned with the shared application service. | Avoid UI-local state drift |
| NFR-WEB-REL-004 | Partial data availability must still permit safe browsing of the available report sections. | Render partial views with diagnostics |

## Maintainability Requirements

| ID | Requirement | Rationale |
|---|---|---|
| NFR-WEB-MAINT-001 | The web UI must use shared state adapters and bridges rather than duplicating backend orchestration. | Keeps logic in one place |
| NFR-WEB-MAINT-002 | Report viewers, triage components, and action bridges should remain reusable and composable. | Supports later automation and tests |
| NFR-WEB-MAINT-003 | Browser state, access gating, and safe rendering should live in separate logical boundaries. | Prevents monolithic UI code |
| NFR-WEB-MAINT-004 | New review panels should be additive and preserve current behavior. | Maintains compatibility |

## Dependency Requirements

| ID | Requirement | Decision |
|---|---|---|
| NFR-WEB-TECH-001 | Prefer minimal exact-pinned runtime dependencies. | Required baseline |
| NFR-WEB-TECH-002 | Reuse shared workspace packages for application, reporting, quality, and security behavior. | Required |
| NFR-WEB-TECH-003 | Add UI libraries only when necessary for local review ergonomics. | Exception path |
| NFR-WEB-TECH-004 | Avoid remote rendering services or browser-hosted conversion dependencies. | Required |

## PBT Requirements

| ID | Property | Required |
|---|---|---|
| NFR-WEB-PBT-001 | Navigation and view-state mapping must be deterministic. | Yes |
| NFR-WEB-PBT-002 | Report-to-view mapping must preserve grouped counts and stable item boundaries. | Yes |
| NFR-WEB-PBT-003 | Confirmation gating must remain mandatory before remediation actions execute. | Yes |
| NFR-WEB-PBT-004 | Safe rendering must be idempotent for already sanitized content. | Yes |
| NFR-WEB-PBT-005 | Access-controlled sections must remain stable for equivalent role hook states. | Yes |

## Example-Based Test Requirements

- Render the dashboard with a current run and report summary.
- Browse grouped diagnostics and manual review items.
- Verify safe confirmation before remediation actions.
- Verify sanitized rendering of safe and redacted content.
- Verify responsive layout and keyboard navigation behavior.
- Verify access-gated sections are shown or hidden according to role state.

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | Compliant | The UI relies on shared safe data and does not invent new unsafe content. |
| SECURITY-03 | Compliant | Display models are sanitized and redaction-safe. |
| SECURITY-05 | Compliant | Safe path refs and confirmation gates are enforced before actions. |
| SECURITY-10 | Compliant | Runtime dependencies are minimal and explicit. |
| SECURITY-13 | Compliant | Traceability is preserved through safe refs and canonical report links. |
| SECURITY-14 | Compliant | The UI surfaces report and quality outcomes rather than hiding them. |
| SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12 | N/A | This NFR set does not define deployment, network, or provider-specific auth implementation details. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Navigation and report-to-view mapping are deterministic targets. |
| PBT-03 | Compliant | State and action stability are invariant targets. |
| PBT-04 | Compliant | Safe rendering is modeled as an idempotence property. |
| PBT-07 | Compliant | Generator families can cover dashboard, report, and access states. |
| PBT-08 | Compliant | Failures can be replayed from recorded state and action cases. |
| PBT-09 | Compliant | The TypeScript stack is appropriate for UI property testing. |
| PBT-10 | Compliant | Example-based UI smoke tests remain useful alongside PBT. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not define round-trip codecs, oracle-backed algorithms, or a stateful engine as its primary concern. |
