# Functional Design Plan - UOW-11 Web UI Review Workflow

## Plan Metadata

- **Unit**: UOW-11 Web UI Review Workflow
- **Primary Package**: `packages/web`
- **Primary Story**: US-008 Review and Remediate Conversion Results in a Web UI
- **Supporting Stories**: US-001, US-010, US-013
- **Stage**: Functional Design
- **Status**: In Progress

## Objective

Define the browser-based review workflow that helps users start a conversion, inspect the resulting report, triage manual review items, and continue remediation through the shared application service. UOW-11 should provide a clear local review experience without duplicating business logic that already lives in the core packages.

## Context Summary

UOW-11 depends on the packages that already exist:

- `packages/core-application` provides the shared orchestration entry points and run status APIs.
- `packages/core-reporting` provides canonical report generation and export views.
- `packages/core-quality` provides quality results, evidence bundles, and review item summaries.
- `packages/core-security` provides safe display and access-control hooks for any sensitive UI content.
- `packages/cli` shares the same application and reporting surface, so the web UI must remain behaviorally aligned with it.

## Planned Functional Design Work

- [x] Review the UOW-11 unit definition, web UI-related stories, and prior workflow artifacts.
- [x] Define the top-level review layout, navigation, and state model for the web UI.
- [x] Define conversion setup and run-start behavior through the shared application service.
- [x] Define report viewing, filtering, and review-item triage behavior.
- [x] Define remediation action flows, safe confirmations, and follow-up run handling.
- [x] Define access-control hooks and safe display rules for sensitive content.
- [x] Define progress, status, and export handoff behavior.
- [x] Define responsive/interactive behavior expectations for local browser use.
- [x] Identify functional PBT properties and example-based UI scenarios.
- [x] Generate functional design artifacts after answers are provided and validated.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the primary purpose of UOW-11?

A) Provide a local browser-based review workflow for conversion setup, report inspection, and remediation
B) Replace the CLI and application service with a separate web-only conversion engine
C) Only display static marketing content and documentation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should the web UI obtain conversion/run data?

A) Use the shared application service and reporting outputs as the single source of truth
B) Read files directly from the workspace and infer state heuristically
C) Maintain its own independent conversion state separate from the backend services
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
What should the default Web UI entry experience be?

A) A review dashboard that shows the current run, report summary, and pending manual review items
B) A blank shell that requires users to navigate several pages before seeing any data
C) A settings page only, with review features deferred
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
How should report and review-item browsing behave?

A) Support grouped lists, stable filters, safe detail panes, and links back to the canonical report
B) Show every item in a single unstructured scroll view
C) Hide review items until a separate debug mode is enabled
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
How should remediation actions be handled?

A) Use explicit safe actions with confirmations and re-run handoff through the shared application service
B) Apply fixes automatically without showing the user what changed
C) Leave remediation completely outside the web UI
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should accessibility and responsive behavior be treated?

A) Support keyboard-friendly navigation, readable safe text, and responsive layouts for local browser use
B) Optimize only for large desktop screens
C) Rely entirely on browser defaults with no layout guidance
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
How should sensitive content be displayed?

A) Show sanitized, redaction-safe summaries with safe refs and no raw secrets or source snippets
B) Show raw source snippets for easier debugging
C) Hide all report details whenever a sensitive field exists
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
How should access-control hooks behave?

A) Expose role-based hooks and safe gating points without hardcoding a specific auth provider
B) Hardcode a single auth provider into the UI flow
C) Skip access control entirely in the first version
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
What reusable UI API shape best fits later automation or tests?

A) A reusable Web UI layer with state adapters, report viewers, review-item components, and action bridges
B) A single static page with no reusable component boundaries
C) A CLI wrapper embedded in the browser bundle
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
What should be the blocking PBT focus for this unit?

A) Navigation/state invariants, report-to-view mapping, action confirmation flow, safe content rendering, and access-control gating
B) Only example-based UI smoke tests
C) PBT is not useful for browser workflows
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Recommended Answers

For this project, option **A** is the recommended answer for all questions. It keeps the Web UI focused on review and remediation, aligned with the shared backend services, and safe for both sensitive data handling and future automation.

## Content Validation Notes

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown structure uses standard headings, lists, and inline code only.
- All questions include meaningful choices and the required `X) Other` option.

## Next Step

After answers are provided, validate completeness and consistency, then generate:

- `aidlc-docs/construction/uow-11-web-ui-review-workflow/functional-design/business-logic-model.md`
- `aidlc-docs/construction/uow-11-web-ui-review-workflow/functional-design/business-rules.md`
- `aidlc-docs/construction/uow-11-web-ui-review-workflow/functional-design/domain-entities.md`
