# Code Generation Plan - UOW-02 Core Application Orchestration and Run Workspace

## Unit Context

- **Unit**: UOW-02 Core Application Orchestration and Run Workspace
- **Primary Package**: `packages/core-application`
- **Primary Owner Role**: Migration Engineer
- **Reviewer Roles**: Architect, Security Reviewer, Project Manager
- **Primary Stories**: US-001
- **Supporting Stories**: US-002, US-007, US-008, US-009, US-011, US-013
- **Prerequisites**: Functional Design, NFR Requirements, and NFR Design are complete.

## Purpose

Generate the shared in-process application service used by CLI and Web UI to start conversions, resolve configuration, manage the run workspace and manifest, enforce provider policy, expose status and resume behavior, and hand off report export state.

## Scope

### In Scope

- Package scaffold for `packages/core-application`.
- Public service entry points and request/response models.
- Config loading, normalization, merge, and validation pipeline.
- Path safety helpers and run workspace management for `.spa-bridge/runs/<runId>`.
- Manifest lifecycle, status reader, and resume planner support.
- Workflow coordinator and provider policy gate orchestration.
- Report handoff and structured event publication.
- Unit tests for config resolution, workspace derivation, manifest transitions, policy gating, status lookup, and resume behavior.
- Markdown code summary under `aidlc-docs/construction/uow-02-core-application-orchestration-and-run-workspace/code/`.

### Out of Scope

- Angular parsing and source analysis.
- Angular-to-React transformation rules and target generation.
- Security masking implementation details beyond policy coordination.
- AI provider adapters.
- Frontend CLI/Web UI components.
- Database migration scripts.
- Deployment artifacts.
- Any code under `aidlc-docs/` other than markdown summaries.

## Story Traceability

| Story | Coverage in This Unit |
|---|---|
| US-001 Convert an Angular project from CLI or Web UI | Public application service, run startup, workspace creation, manifest lifecycle, status and export use cases |
| US-002 Choose a React target strategy for the output project | Configuration resolution and target strategy pass-through to downstream units |
| US-007 Control the LLM/provider execution mode | Provider policy coordination and gated provider-adjacent workflow handoff |
| US-008 Review conversion progress and outputs in Web UI | Status lookup, report handoff, and manual review state access |
| US-009 Mask sensitive information before external provider use | Policy-gated provider coordination and safe event/report boundaries |
| US-011 Validate generated output with quality gates | Workflow coordination hooks and run-state handoff to quality services |
| US-013 Generate conversion reports and exports | Canonical report state, export request handoff, and run-finalization export behavior |

## Target Paths

### Application Code

- `packages/core-application/package.json`
- `packages/core-application/tsconfig.json`
- `packages/core-application/src/index.ts`
- `packages/core-application/src/application/`
- `packages/core-application/src/config/`
- `packages/core-application/src/workspace/`
- `packages/core-application/src/run/`
- `packages/core-application/src/workflow/`
- `packages/core-application/src/policy/`
- `packages/core-application/src/report/`
- `packages/core-application/src/events/`
- `packages/core-application/src/resume/`
- `packages/core-application/src/testing/`
- `packages/core-application/tests/`

### Documentation

- `aidlc-docs/construction/uow-02-core-application-orchestration-and-run-workspace/code/summary.md`
- `aidlc-docs/construction/uow-02-core-application-orchestration-and-run-workspace/code/artifact-index.md`

## Generation Checklist

- [x] Step 1: Re-read unit design artifacts and confirm generation boundaries.
- [x] Step 2: Create the `packages/core-application` package scaffold and public export surface.
- [x] Step 3: Generate config pipeline, public request/response models, and application service entry points.
- [x] Step 4: Generate path safety, run workspace, manifest lifecycle, and status reader modules.
- [x] Step 5: Generate workflow coordinator, provider policy gate, resume planner, report handoff, and structured event publisher modules.
- [x] Step 6: Generate package integration wiring and shared exports for CLI and Web UI callers.
- [x] Step 7: Generate unit tests for config merge precedence, workspace derivation, manifest transitions, policy gating, status lookup, and resume behavior.
- [x] Step 8: Generate markdown code summaries and artifact index documentation.
- [x] Step 9: Verify all application code lives in the workspace root and no generated code was placed in `aidlc-docs/`.
- [x] Step 10: Mark completed steps and story coverage in the plan during generation.

## Generation Notes

- This unit is orchestration and workspace focused, so API surface generation is the public application service layer.
- No repository, frontend, database migration, or deployment steps are expected for this unit.
- Generated code must remain framework-neutral, deterministic, and safe for reuse by all later units.

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- All file paths are ASCII and resolve under the workspace root or `aidlc-docs/construction/.../code/`.
