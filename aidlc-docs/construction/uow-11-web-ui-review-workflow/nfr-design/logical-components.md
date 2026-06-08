# Logical Components - UOW-11 Web UI Review Workflow

## Component Overview

`packages/web` is organized around a thin browser-review layer that consumes shared application and reporting outputs, then renders safe review screens, triage controls, and remediation bridges.

## Components

| Component | Responsibility | Key Inputs | Key Outputs |
|---|---|---|---|
| `WebReviewDashboard` | Render the top-level review workspace | run summary, quality summary, export summary | dashboard view model |
| `WebStateAdapter` | Map canonical application/report data into UI state | shared run/report outputs | page state |
| `ReportBrowserPanel` | Render grouped report sections and safe detail panes | report sections, filters, selected item | report browser state |
| `ReviewTriagePanel` | Display review items and filtering controls | review items, severity, category | triage state |
| `SafeContentRenderer` | Sanitize and render all user-visible content | raw display input, refs, redaction state | sanitized display model |
| `AccessGate` | Control sensitive sections and actions through role hooks | role state, sensitivity metadata | allowed/blocked UI state |
| `RemediationBridge` | Dispatch confirmation-guarded follow-up actions | action request, confirmation state | action result |
| `StatusAndProgressBar` | Show stable progress and current run state | current run, refresh state, action state | status view model |
| `ExportLinkPanel` | Surface canonical report/export references | export summary, report refs | safe export links |
| `WebUiGenerators` | Provide fast-check generators for UI invariants | generator config | dashboard, report, role, and action cases |

## Public API Shape

### Web Review Facade

The package should expose a small facade that:

- loads shared data into view models
- renders safe dashboard/report/triage screens
- dispatches confirmation-guarded remediation actions
- refreshes state after actions complete

Expected API shape:

```typescript
renderWebReview(appState: SharedReviewState): WebReviewRenderResult
```

### Shared State Adapters

State adapters should remain reusable and explicit:

- `buildDashboardViewModel`
- `buildReportBrowserViewModel`
- `buildReviewTriageViewModel`
- `buildAccessGateState`

### Output Formatting

All visible content should flow through safe render helpers:

- no raw prompts
- no raw provider payloads
- no raw source snippets
- no secrets or tokens
- no unsafe absolute paths

## Component Interactions

| Step | Component | Next Component |
|---|---|---|
| 1 | `WebStateAdapter` | `WebReviewDashboard` / `ReportBrowserPanel` / `ReviewTriagePanel` |
| 2 | `AccessGate` | `SafeContentRenderer` |
| 3 | `SafeContentRenderer` | dashboard/report/triage panes |
| 4 | `RemediationBridge` | shared application service |
| 5 | shared application service response | `StatusAndProgressBar` / `ExportLinkPanel` |
| 6 | `WebUiGenerators` | PBT assertions |

## Error Model

| Error Category | Source Component | Behavior |
|---|---|---|
| Missing data | `WebStateAdapter` | render a safe empty/partial state |
| Unsafe content | `SafeContentRenderer` | redact and omit unsafe fields |
| Access denial | `AccessGate` | hide or disable the section/action |
| Confirmation denial | `RemediationBridge` | preserve current state and do not dispatch |
| Action failure | `RemediationBridge` / shared service response | surface safe diagnostics and keep the review state intact |
| Export mismatch | `ExportLinkPanel` | show safe refs only, no invented filesystem path |

## Package Directory Plan

| Directory | Purpose |
|---|---|
| `src/state` | view-model builders and adapters |
| `src/components` | dashboard, report, triage, and action components |
| `src/rendering` | sanitized display helpers |
| `src/access` | role hooks and gates |
| `src/actions` | remediation and rerun bridges |
| `src/navigation` | page state and selection handling |
| `src/generation` | UI generators for PBT |
| `tests` | example-based and property-based UI tests |

## Data Contracts

| Contract | Owner | Notes |
|---|---|---|
| `WebReviewState` | `web` | Bound state for the current browser review session |
| `WebReviewRenderResult` | `web` | Safe render result for the dashboard and subpanels |
| `DashboardViewModel` | `web` | Summary cards and current run status |
| `ReportViewModel` | `web` | Grouped report sections and trace refs |
| `TriageViewModel` | `web` | Manual review items and filters |
| `ActionRequest` | `web` | Confirmation-guarded remediation request |
| `ActionResult` | `web` | Result after shared-service handoff |
| `RoleGateState` | `web` | Visibility and action gating state |

## Dependency Boundaries

Allowed:

- `@spa-bridge/core-application`
- `@spa-bridge/core-reporting`
- `@spa-bridge/core-quality`
- `@spa-bridge/core-security`
- existing workspace dev dependencies such as React, Vitest, and fast-check

Avoided:

- remote rendering services
- auth-provider-specific UI SDKs
- duplicated reporting or quality logic

## PBT Generator Families

| Generator Family | Purpose |
|---|---|
| dashboard states | validate composition invariants |
| report sections | validate report-to-view mapping |
| role states | validate access gating |
| action requests | validate confirmation flow |
| sanitized content | validate safe rendering |
| navigation states | validate route and selection invariants |

## Example Test Families

- render the dashboard with current run and report summary
- browse grouped diagnostics and manual review items
- confirm remediation before dispatch
- verify safe rendering for sanitized and redacted content
- verify responsive layout and keyboard navigation behavior
- verify access-gated sections follow role state

## Design Constraints

- Application code belongs in `packages/web`, not `aidlc-docs`.
- The web UI must not implement conversion, reporting, or quality rules directly.
- The package must remain local-first and browser-focused.
- Output must remain safe even when detail panes are expanded.
