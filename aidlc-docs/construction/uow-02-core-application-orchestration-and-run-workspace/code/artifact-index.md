# UOW-02 Artifact Index

## Code Artifacts

| Path | Purpose |
|---|---|
| `packages/core-application/package.json` | Package metadata, scripts, and workspace dependency declaration. |
| `packages/core-application/tsconfig.json` | TypeScript build configuration for the package. |
| `packages/core-application/src/index.ts` | Public export surface for the application package. |
| `packages/core-application/src/application/application-service.ts` | Shared in-process service for start, status, resume, and export use cases. |
| `packages/core-application/src/config/config.ts` | Config resolution, override precedence, and config validation. |
| `packages/core-application/src/workspace/workspace.ts` | Path guarding and run workspace derivation. |
| `packages/core-application/src/run/run.ts` | Run manifest model, lifecycle transitions, and status reader. |
| `packages/core-application/src/workflow/workflow.ts` | Workflow coordination and step execution orchestration. |
| `packages/core-application/src/policy/policy.ts` | Provider policy gate. |
| `packages/core-application/src/report/report.ts` | Canonical report snapshot creation and export handoff. |
| `packages/core-application/src/events/events.ts` | Structured event publication to logger/audit ports. |
| `packages/core-application/src/resume/resume.ts` | Resume plan derivation. |
| `packages/core-application/src/testing/test-support.ts` | In-memory test doubles for application dependencies. |
| `packages/core-application/tests/core-application.test.ts` | Unit test coverage for the package. |

## Workflow Artifacts

| Path | Purpose |
|---|---|
| `aidlc-docs/construction/plans/uow-02-core-application-orchestration-and-run-workspace-code-generation-plan.md` | Approved code generation plan and generation checklist. |
| `aidlc-docs/construction/uow-02-core-application-orchestration-and-run-workspace/code/summary.md` | Human-readable summary of generated code. |

## Verification Artifacts

- `npm run build`
- `npm test`
