# NFR Design Patterns - UOW-11 Web UI Review Workflow

## Purpose

This document translates the approved UOW-11 NFR requirements into concrete design patterns for a deterministic, safe, and responsive local browser review workflow.

## Pattern 1: Staged Review View-Model Pipeline

### Intent

Render shared application/report data into deterministic review screens without duplicating backend logic.

### Pipeline Stages

| Order | Stage | Responsibility | Failure Behavior |
|---|---|---|---|
| 1 | Load shared data | Fetch canonical run, report, and review data from shared services | Fail closed if data is missing or invalid |
| 2 | Build view models | Map shared data into dashboard, report browser, and review-triage state | Fail closed for malformed source data |
| 3 | Apply access state | Filter sensitive sections using role hooks and access gates | Hide gated content and surface safe diagnostics |
| 4 | Sanitize content | Redact and escape all user-visible text before rendering | Drop unsafe content from the rendered surface |
| 5 | Render layout | Compose dashboard, summary, report, and action panes | Preserve safe partial views when available |
| 6 | Handle action bridges | Dispatch confirmations and remediation requests to the shared application service | Block unsafe or ambiguous actions |

### Design Notes

- The UI should treat the shared application/reporting data as the single source of truth.
- View models must be deterministic for equivalent inputs.
- The browser layer should remain thin and focused on presentation and safe interaction.

## Pattern 2: Deterministic State Adapter Layer

### Intent

Keep state derivation stable by mapping canonical application/report data into page state through explicit adapters.

### Design Elements

| Element | Design |
|---|---|
| Dashboard adapter | Builds summary cards, current run state, and review counts from shared results |
| Report adapter | Produces grouped sections, filters, selected item state, and trace refs |
| Action adapter | Converts UI actions into shared-service requests |
| Refresh adapter | Rehydrates the current state after follow-up runs or report updates |

### Stability Rules

- Equivalent shared inputs must produce equivalent dashboard and report view models.
- The UI must not reconstruct backend state heuristically.
- Re-rendering sanitized data must not alter meaning or reintroduce unsafe content.

## Pattern 3: Safe Report Browsing and Sanitized Rendering

### Intent

Allow the user to browse reports and manual review items without exposing raw prompts, raw source snippets, or secrets.

### Design Elements

| Element | Design |
|---|---|
| Grouped report sections | Diagnostics, review items, quality results, traceability, and exports |
| Detail panes | Safe, read-only views for an individual item or section |
| Sanitized content renderer | Escapes text and enforces redaction-safe display |
| Trace-link renderer | Shows safe references back to canonical report items |

### Rendering Rules

- Render only sanitized text and safe refs.
- Never render raw provider payloads, raw prompts, raw snippets, tokens, or unsafe HTML.
- Keep grouping and ordering stable for equivalent inputs.

## Pattern 4: Access Gates and Confirmation-Bridged Remediation

### Intent

Expose safe gating points and explicit confirmation dialogs before any remediation or rerun handoff.

### Design Elements

| Element | Design |
|---|---|
| Role hook | Provider-neutral role state for visibility and action gating |
| Sensitive section gate | Hides or disables sensitive details until the role state allows it |
| Confirmation dialog | Requires explicit user consent before remediation dispatch |
| Action bridge | Hands off remediation requests to the shared application service |

### Failure Behavior

- Unsafe or ambiguous actions fail closed.
- The current UI state is preserved whenever possible.
- Diagnostics remain safe and do not leak sensitive content.

## Pattern 5: Responsive Local Review Layout

### Intent

Preserve a useful review experience across common local browser sizes without creating a heavy layout system.

### Layout Regions

| Region | Function |
|---|---|
| Top status band | Current run, quality, and export summary |
| Main navigation | Dashboard, report, triage, and action views |
| Report pane | Grouped report browsing and safe detail display |
| Action pane | Confirmation and follow-up run controls |

### Responsive Rules

- Keep navigation, summary, and detail visibility stable on common desktop layouts.
- Avoid fixed-width assumptions that hide core review information.
- Maintain keyboard focus order across responsive breakpoints.

## Pattern 6: Shared Dependency and Package Boundary Discipline

### Intent

Keep the web package reusable and aligned with the rest of the workspace.

### Boundary Rules

- `packages/web` must stay focused on browser interaction and presentation.
- Shared application, reporting, quality, and security behavior must remain in the shared workspace packages.
- Runtime dependencies should stay minimal and exact-pinned where needed.

## Pattern 7: PBT-Backed UI Properties

### Intent

Model the browser workflow with invariants that prevent regressions in navigation, view mapping, and safe rendering.

### Required Properties

| Property | Requirement |
|---|---|
| Navigation invariants | Equivalent inputs produce equivalent page selection and section visibility |
| Report-to-view mapping | Group counts and trace refs remain stable across equivalent data inputs |
| Confirmation flow | Remediation actions stay blocked until explicitly confirmed |
| Safe rendering | Sanitized content remains safe and idempotent across re-renders |
| Access gating | Equivalent role hook state produces equivalent visible sections and actions |

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | Compliant | Inputs are fetched from shared services and validated before rendering. |
| SECURITY-03 | Compliant | UI output is safe-summary oriented rather than raw-data oriented. |
| SECURITY-05 | Compliant | Actions and paths are gated before dispatch. |
| SECURITY-10 | Compliant | The package keeps runtime dependencies minimal and explicit. |
| SECURITY-13 | Compliant | Safe refs preserve traceability without unsafe payload leakage. |
| SECURITY-14 | Compliant | The UI surfaces review and report outcomes instead of suppressing them. |
| SECURITY-02, SECURITY-04, SECURITY-06, SECURITY-07, SECURITY-08, SECURITY-09, SECURITY-11, SECURITY-12 | N/A | This design does not define deployment, network, auth-provider, or production operations behavior. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Navigation and state mapping are deterministic targets. |
| PBT-03 | Compliant | Path, action, and view-state invariants are explicit. |
| PBT-04 | Compliant | Safe rendering is modeled as an idempotent transformation. |
| PBT-07 | Compliant | Generators can cover dashboard, report, role, and action permutations. |
| PBT-08 | Compliant | Failures can be replayed from recorded state and action cases. |
| PBT-09 | Compliant | The TypeScript test stack is appropriate for UI property testing. |
| PBT-10 | Compliant | Example-based smoke tests remain useful alongside PBT. |
| PBT-02, PBT-05, PBT-06 | N/A | This unit does not center round-trip codecs, oracle-backed algorithms, or mutable state machines. |
