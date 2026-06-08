# UOW-11 Artifact Index - Web UI Review Workflow

## Application Code

| Artifact | Path |
|---|---|
| Package manifest | `packages/web/package.json` |
| TypeScript config | `packages/web/tsconfig.json` |
| Public exports | `packages/web/src/index.ts` |
| Shared types | `packages/web/src/types.ts` |
| Error model | `packages/web/src/shared-errors.ts` |
| Safe content renderer | `packages/web/src/rendering/safe-content-renderer.ts` |
| Redaction helpers | `packages/web/src/rendering/redaction-helpers.ts` |
| Navigation state | `packages/web/src/navigation/navigation-state.ts` |
| Responsive layout | `packages/web/src/layout/responsive-layout.ts` |
| Role hook | `packages/web/src/access/role-hook.ts` |
| Access gate helpers | `packages/web/src/access/access-gate.ts` |
| Dashboard view-model builder | `packages/web/src/state/dashboard-view-model-builder.ts` |
| Report browser view-model builder | `packages/web/src/state/report-view-model-builder.ts` |
| Triage view-model builder | `packages/web/src/state/review-triage-view-model-builder.ts` |
| Web state adapter | `packages/web/src/state/web-state-adapter.ts` |
| Dashboard render model | `packages/web/src/components/web-review-dashboard.ts` |
| Report browser panel render model | `packages/web/src/components/report-browser-panel.ts` |
| Triage panel render model | `packages/web/src/components/review-triage-panel.ts` |
| Confirmation dialog | `packages/web/src/actions/confirmation-dialog.ts` |
| Remediation bridge | `packages/web/src/actions/remediation-bridge.ts` |
| Web UI service facade | `packages/web/src/generation/web-ui-service.ts` |
| Property-based generators | `packages/web/src/testing/generators.ts` |
| Tests | `packages/web/tests/web.test.ts` |

## Documentation

| Artifact | Path |
|---|---|
| Code summary | `aidlc-docs/construction/uow-11-web-ui-review-workflow/code/summary.md` |
| Artifact index | `aidlc-docs/construction/uow-11-web-ui-review-workflow/code/artifact-index.md` |

## Notes

- The web review workflow stays framework-neutral at the package boundary, with safe render-model builders and deterministic state adapters.
- The package consumes shared canonical report, quality, and security surfaces so the CLI and browser workflows remain behaviorally aligned.
