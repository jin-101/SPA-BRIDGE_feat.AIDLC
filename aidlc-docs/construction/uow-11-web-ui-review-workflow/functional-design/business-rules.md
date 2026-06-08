# Business Rules - UOW-11 Web UI Review Workflow

## Review Dashboard Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| WEB-001 | The dashboard must use shared application and reporting data as the source of truth. | Reject locally invented state. |
| WEB-002 | The initial view must show the current run, report summary, and pending manual review items. | Render the dashboard with stable sections. |
| WEB-003 | Review sections must be stable across reloads for equivalent inputs. | Use deterministic ordering and stable IDs. |
| WEB-004 | The UI must preserve the canonical report link for traceability. | Include safe refs in every item summary. |

## Report Browsing Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| WEB-101 | Reports must be browsed through grouped lists, stable filters, and safe detail panes. | Do not render a raw unstructured log view. |
| WEB-102 | Manual review items must include severity, category, reason code, and safe remediation hints. | Reject malformed review items. |
| WEB-103 | Report detail views must remain redaction-safe. | Escape text and redact raw sensitive content. |
| WEB-104 | The UI must not alter canonical report content. | Render read-only report views. |

## Remediation Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| WEB-201 | Remediation actions must require explicit user confirmation. | Show a confirmation gate before execution. |
| WEB-202 | Remediation must flow through the shared application service, not through direct file mutation in the UI. | Trigger rerun handoff only. |
| WEB-203 | Follow-up runs must refresh the dashboard and report views after completion. | Requery state after action completion. |
| WEB-204 | Unsafe or ambiguous remediation requests must remain pending review. | Do not auto-apply risky changes. |

## Access and Safety Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| WEB-301 | The UI must expose role-based gating points without hardcoding an auth provider. | Keep auth integration abstract. |
| WEB-302 | The UI must never display raw prompts, raw provider responses, raw source snippets, secrets, or tokens. | Use sanitized display models only. |
| WEB-303 | Sensitive content must be redacted consistently in all view states. | Use a shared safe renderer. |
| WEB-304 | The UI must remain usable with keyboard navigation and responsive layout constraints. | Provide accessible interactions and stable layout regions. |

## Progress and Export Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| WEB-401 | Progress and status indicators must match the shared application service state. | Re-read state after user actions. |
| WEB-402 | Export references must point to canonical reporting outputs. | Never invent a separate UI-only export model. |
| WEB-403 | Export actions must not expose filesystem details beyond safe refs. | Render safe output locations only. |

## PBT Rules

| Rule ID | Rule | Property Category |
|---|---|---|
| WEB-PBT-001 | Equivalent input state must produce equivalent dashboard composition. | Determinism |
| WEB-PBT-002 | Report-to-view mapping must preserve item counts and group boundaries. | Invariant |
| WEB-PBT-003 | Confirmation flow must always block action execution until acknowledged. | Safety invariant |
| WEB-PBT-004 | Safe rendering must be idempotent for already sanitized content. | Idempotence |
| WEB-PBT-005 | Access-gated sections must be stable for equivalent role hook states. | Invariant |

## Review Completion Criteria

Functional design for UOW-11 is complete when:

- The review dashboard layout and state model are defined.
- Report browsing and manual review triage are explicit.
- Remediation confirmation and rerun handoff rules are defined.
- Access-control and safe-display rules are set.
- PBT properties cover navigation, mapping, confirmation, sanitization, and gating invariants.
