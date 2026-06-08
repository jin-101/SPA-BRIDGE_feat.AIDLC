# Domain Entities - UOW-11 Web UI Review Workflow

## Entity Overview

| Entity | Purpose | Key Fields |
|---|---|---|
| `ReviewWorkspaceSession` | Represents the browser session bound to a workspace review run. | `sessionId`, `workspaceRef`, `activeRunRef`, `roleHookState` |
| `ReviewDashboardViewModel` | Top-level dashboard state rendered by the UI. | `currentRun`, `reportSummary`, `manualReviewCount`, `qualitySummary`, `exportSummary` |
| `ReportBrowserViewModel` | Structured report browsing state. | `sections`, `filters`, `selectedSectionId`, `selectedItemId` |
| `ReviewItemViewModel` | Safe triage item shown to the user. | `itemId`, `severity`, `category`, `reasonCode`, `safeSummary`, `sourceRefs`, `generatedRefs` |
| `RemediationActionRequest` | User-selected follow-up action from the UI. | `actionId`, `runRef`, `itemRefs`, `confirmationState`, `requestedBy` |
| `RemediationActionResult` | Result of a follow-up action or rerun handoff. | `actionId`, `status`, `newRunRef`, `diagnostics`, `reportRef` |
| `WebAccessGateState` | Encodes the current UI access/visibility state. | `roleName`, `canViewSensitiveDetails`, `canTriggerRemediation`, `canExport` |
| `SanitizedContentViewModel` | Safe display representation for any sensitive or potentially unsafe text. | `displayText`, `isRedacted`, `safeRefs`, `reasonCode` |
| `ExportLinkViewModel` | Safe export destination shown in the UI. | `format`, `reportRef`, `locationRef`, `contentHash` |
| `UiNavigationState` | Tracks the active page and selected pane. | `routeName`, `activeTab`, `selectionRef`, `breadcrumbs` |

## Entity Relationships

| Source Entity | Related Entity | Relationship |
|---|---|---|
| `ReviewWorkspaceSession` | `ReviewDashboardViewModel` | A session owns the dashboard state for a single active run. |
| `ReviewDashboardViewModel` | `ReportBrowserViewModel` | The dashboard embeds the report browser as a subordinate view. |
| `ReportBrowserViewModel` | `ReviewItemViewModel` | The report browser surfaces grouped review items for triage. |
| `ReviewItemViewModel` | `SanitizedContentViewModel` | Review items rely on sanitized safe content for display. |
| `RemediationActionRequest` | `RemediationActionResult` | Action requests produce results after shared-service handoff. |
| `WebAccessGateState` | `ReviewDashboardViewModel` | Access state controls which dashboard actions and panes are visible. |
| `ExportLinkViewModel` | `ReportBrowserViewModel` | Export links are derived from canonical report data. |
| `UiNavigationState` | `ReviewDashboardViewModel` | Navigation state controls active page and pane selection. |

## Entity Invariants

| Entity | Invariant |
|---|---|
| `ReviewDashboardViewModel` | Must always reference a safe run view and a canonical report summary. |
| `ReviewItemViewModel` | Must include a reason code and safe summary even when the item is unresolved. |
| `RemediationActionRequest` | Must not execute without explicit confirmation. |
| `SanitizedContentViewModel` | Must never expose raw prompts, raw source snippets, tokens, or secrets. |
| `WebAccessGateState` | Must be derived from role hooks rather than hardcoded provider logic. |
| `ExportLinkViewModel` | Must point to canonical reporting output, not an ad hoc UI-only copy. |

## PBT and Test Support

| Support Type | Purpose |
|---|---|
| View-model generators | Model dashboard, report, and review item permutations. |
| Access-state generators | Exercise gating states and safe visibility combinations. |
| Action-flow generators | Model confirmation, rerun, and denial paths. |
| Sanitization generators | Verify safe content behavior for already-redacted and unsafe text. |

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown uses only headings, tables, lists, and inline code for parse safety.
