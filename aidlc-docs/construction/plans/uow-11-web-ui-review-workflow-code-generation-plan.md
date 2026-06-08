# Code Generation Plan - UOW-11 Web UI Review Workflow

## Plan Metadata

- **Unit**: UOW-11 Web UI Review Workflow
- **Primary Package**: `packages/web`
- **Stage**: Code Generation
- **Status**: Pending Approval
- **Primary Story**: US-008 Review and Remediate Conversion Results in a Web UI
- **Supporting Stories**: US-001, US-010, US-013

## Objective

Generate the reusable `packages/web` workspace package that provides the local browser review workflow for conversion runs, canonical report browsing, manual review triage, and safe remediation handoff through the shared application service.

## Unit Context

UOW-11 is the browser interaction layer over the shared application and reporting services. It must stay thin and delegate core behavior to other packages:

- `packages/core-application` owns orchestration, run state, and action handoff.
- `packages/core-reporting` owns canonical reports and export views.
- `packages/core-quality` owns quality summaries, evidence, and review item context.
- `packages/core-security` owns sanitization, safe display, and access-control hooks.
- `packages/cli` shares the same application/reporting surface, so the web UI must remain behaviorally aligned with it.

### Dependencies

| Dependency | Use |
|---|---|
| `@spa-bridge/core-application` | Shared orchestration and remediation handoff |
| `@spa-bridge/core-reporting` | Canonical report data and export references |
| `@spa-bridge/core-quality` | Quality summaries and review-item metadata |
| `@spa-bridge/core-security` | Sanitized display and access-control hooks |
| React 18 + TypeScript | Browser UI implementation stack |
| Vite | Local browser build/dev flow |
| Vitest | Example-based tests |
| fast-check | Property-based tests |

### Public Package Boundary

`packages/web` should expose:

- dashboard and report view-model builders
- grouped report browser components
- triage components for manual review items
- safe content rendering helpers
- access gate and role hook utilities
- remediation and rerun action bridges
- responsive layout helpers
- fast-check generators and UI test helpers

## Story Traceability

| Story | Coverage in This Plan |
|---|---|
| US-008 | Dashboard, report review, triage, remediation, and safe access handling |
| US-001 | Run state and status display through shared orchestration |
| US-010 | Access-control hooks and safe gating points |
| US-013 | Canonical report links, export handoff, and review traceability |

## Generation Steps

### Step 1: Package Scaffold

- [x] Create `packages/web/package.json`.
- [x] Create `packages/web/tsconfig.json`.
- [x] Create `packages/web/vite.config.ts` or equivalent local build configuration if needed.
- [x] Create `packages/web/src/index.ts` and top-level UI entry files.
- [x] Align package scripts and compiler options with existing workspace packages.

### Step 2: Shared Types and UI State Model

- [x] Create `packages/web/src/types.ts`.
- [x] Create `packages/web/src/shared-errors.ts`.
- [x] Define dashboard, report browser, triage, access gate, action, safe content, and export link types.

### Step 3: State Adapters

- [x] Create `packages/web/src/state/web-state-adapter.ts`.
- [x] Create `packages/web/src/state/dashboard-view-model-builder.ts`.
- [x] Create `packages/web/src/state/report-view-model-builder.ts`.
- [x] Create `packages/web/src/state/review-triage-view-model-builder.ts`.
- [x] Map canonical application/report data into deterministic page state.

### Step 4: Safe Rendering Pipeline

- [x] Create `packages/web/src/rendering/safe-content-renderer.ts`.
- [x] Create `packages/web/src/rendering/redaction-helpers.ts`.
- [x] Ensure all user-visible content is sanitized and redaction-safe.

### Step 5: Access Gates and Role Hooks

- [x] Create `packages/web/src/access/role-hook.ts`.
- [x] Create `packages/web/src/access/access-gate.ts`.
- [x] Define provider-neutral visibility and action gating behavior.

### Step 6: Report Browsing Components

- [x] Create `packages/web/src/components/web-review-dashboard.ts`.
- [x] Create `packages/web/src/components/report-browser-panel.ts`.
- [x] Create `packages/web/src/components/review-triage-panel.ts`.
- [x] Create grouped sections, filter models, detail panes, and trace links.

### Step 7: Action Bridges and Remediation Flow

- [x] Create `packages/web/src/actions/remediation-bridge.ts`.
- [x] Create `packages/web/src/actions/confirmation-dialog.ts`.
- [x] Integrate confirmation-guarded rerun and remediation handoff.

### Step 8: Responsive Layout and Interaction Helpers

- [x] Create `packages/web/src/layout/`.
- [x] Create `packages/web/src/navigation/`.
- [x] Preserve navigation, summary, and detail visibility on local screens.

### Step 9: PBT Generators and Test Utilities

- [x] Create `packages/web/src/testing/generators.ts`.
- [x] Provide fast-check generators for dashboard states, report sections, role states, action requests, and sanitized content.

### Step 10: Unit and Property-Based Tests

- [x] Create `packages/web/tests/web.test.ts`.
- [x] Cover dashboard composition, report mapping, safe rendering, access gating, action confirmation, and responsive state helpers.
- [x] Cover PBT properties for navigation/state invariants, mapping stability, confirmation flow, safe rendering, and access-control gating.

### Step 11: Workspace Integration

- [x] Update root `package.json` build script to include `packages/web` if the package is added in this unit.
- [x] Update root `package.json` test script to include `packages/web` if the package is added in this unit.

### Step 12: Verification

- [x] Run `npm run build --workspace <web-package-name>`.
- [x] Run `npm run test --workspace <web-package-name>`.
- [x] Run `npm run build`.
- [x] Run `npm run test`.

### Step 13: Code Documentation

- [x] Create `aidlc-docs/construction/uow-11-web-ui-review-workflow/code/summary.md`.
- [x] Create `aidlc-docs/construction/uow-11-web-ui-review-workflow/code/artifact-index.md`.
- [x] Summarize generated application code, tests, and verification results.

### Step 14: Completion Review

- [x] Confirm every generation step is checked.
- [x] Confirm UOW-11 story coverage is implemented.
- [x] Confirm Security Baseline and PBT extension findings are non-blocking.
- [x] Move AI-DLC state to UOW-11 Code Generation Review.

## Expected Application Code Paths

- `packages/web/package.json`
- `packages/web/tsconfig.json`
- `packages/web/vite.config.ts`
- `packages/web/src/index.ts`
- `packages/web/src/types.ts`
- `packages/web/src/shared-errors.ts`
- `packages/web/src/state/`
- `packages/web/src/rendering/`
- `packages/web/src/access/`
- `packages/web/src/components/`
- `packages/web/src/actions/`
- `packages/web/src/layout/`
- `packages/web/src/navigation/`
- `packages/web/src/testing/`
- `packages/web/tests/web.test.ts`

## Expected Documentation Paths

- `aidlc-docs/construction/uow-11-web-ui-review-workflow/code/summary.md`
- `aidlc-docs/construction/uow-11-web-ui-review-workflow/code/artifact-index.md`

## Approval Gate

This plan is the single source of truth for UOW-11 Code Generation. Code generation must not begin until this plan is explicitly approved.
