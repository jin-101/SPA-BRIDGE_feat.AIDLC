# UOW-11 Business Logic Model

## Purpose

UOW-11 provides the browser-based review workflow for SPA-Bridge. It does not own conversion, quality, or reporting semantics. Instead, it renders and coordinates the shared results produced by `packages/core-application`, `packages/core-reporting`, `packages/core-quality`, and `packages/core-security`.

The unit exists to help a user start a conversion, inspect the current run and canonical report, triage manual review items, and trigger safe remediation follow-up through the shared application service.

## Approved Scope

| Decision Area | Approved Choice | Design Effect |
|---|---|---|
| Primary purpose | Local browser-based review workflow for conversion setup, report inspection, and remediation | Keeps the UI focused on review and follow-up rather than conversion internals. |
| Data source | Shared application service and reporting outputs as the single source of truth | Prevents the web UI from drifting away from the CLI and backend behavior. |
| Entry experience | Review dashboard with current run, report summary, and pending manual review items | Gives users immediate situational awareness. |
| Browsing model | Grouped lists, stable filters, safe detail panes, and canonical report links | Makes review manageable and traceable. |
| Remediation model | Explicit safe actions with confirmations and rerun handoff | Prevents silent changes and keeps user control clear. |
| Accessibility | Keyboard-friendly navigation, readable safe text, responsive layouts | Supports local browser use without a heavy UX burden. |
| Sensitive content | Sanitized, redaction-safe summaries only | Keeps raw snippets and secrets out of the UI. |
| Access control | Role-based hooks and safe gating points without hardcoded auth provider | Leaves provider choice open for later integration. |
| Reuse | Reusable Web UI layer with state adapters, report viewers, review-item components, and action bridges | Supports tests and future extension. |
| PBT focus | Navigation/state invariants, report mapping, confirmation flow, safe rendering, and access-control gating | Protects the review workflow from regression. |

## Core Business Capabilities

| Capability | Responsibility | Primary Output |
|---|---|---|
| Review Dashboard | Show run status, report summary, and review workload | `ReviewDashboardViewModel` |
| Report Browser | Present canonical report sections and grouped diagnostics | `ReportBrowserViewModel` |
| Manual Review Triage | Group, filter, and prioritize review items | `ReviewTriageModel` |
| Remediation Bridge | Trigger safe follow-up actions through the shared application service | `RemediationActionResult` |
| Access Gating | Expose safe authorization hooks without hardcoding provider details | `WebAccessGateState` |
| Export Handoff | Surface report export destinations and link back to canonical outputs | `WebExportSummary` |
| UI Safety | Sanitize content before rendering | `SanitizedContentViewModel` |

## End-to-End Review Flow

1. The user opens the local web UI and lands on the current run review dashboard.
2. The UI queries the shared application service for run status and the canonical report metadata.
3. The dashboard renders grouped summaries for diagnostics, manual review items, and quality results.
4. The user filters or opens a review item to inspect a safe, sanitized detail view.
5. The user selects a remediation action or rerun request when the item is safe to address.
6. The UI routes the request back through the shared application service.
7. The dashboard refreshes the run and report state after the handoff completes.
8. The UI keeps sensitive text redacted and never exposes raw prompts, tokens, or source snippets.
9. The user can navigate to export locations and canonical report links for traceability.

## UI Subsystems

| Subsystem | Function |
|---|---|
| Review Layout | Organizes dashboard sections, panes, and navigation. |
| State Adapter | Maps shared application/reporting data into UI state. |
| Report Viewer | Renders canonical report sections and review item groups. |
| Remediation Bridge | Sends safe follow-up actions to the application service. |
| Access Gate | Enforces role-aware visibility and action gating points. |
| Safe Renderer | Ensures all user-visible content is sanitized. |

## Testable Properties

| Property | Category | Candidate Scope |
|---|---|---|
| Navigation state is deterministic | Invariant | The same input run state maps to the same active page and summary layout. |
| Report mapping is stable | Determinism | Equivalent report input produces equivalent review view models. |
| Safe rendering is idempotent | Idempotence | Sanitizing already-safe content does not change the rendered result. |
| Confirmation flow is explicit | Safety invariant | Remediation actions require deliberate user confirmation. |
| Access gating is traceable | Traceability | Actions and visible sections respect the current role hook state. |

## Traceability and Reporting Boundaries

- The UI must show safe refs to runs, report sections, and remediation follow-ups.
- The UI must not render raw prompts, raw provider responses, raw source snippets, secrets, or tokens.
- The canonical report remains the source of truth; the UI presents a safe view over it.

## Security and PBT Compliance Summary

| Rule Group | Status | Rationale |
|---|---|---|
| Security Baseline - Safe display / redaction | Compliant | UI content is sanitized and redaction-safe. |
| Security Baseline - Access control hooks | Compliant | Role-aware hooks exist without binding to a specific auth provider. |
| Security Baseline - Deployment/network/auth provider rules | N/A | This functional design does not define deployment or a concrete auth provider. |
| PBT - Navigation and mapping invariants | Compliant | The review workflow can be modeled with deterministic state/view relationships. |
| PBT - UI smoke-only / no PBT needed cases | N/A | This unit benefits from property-based validation because the view model and action flow have stable invariants. |

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown is limited to headings, tables, lists, and inline code for parse safety.
