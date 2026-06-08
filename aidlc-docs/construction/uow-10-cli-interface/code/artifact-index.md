# UOW-10 Artifact Index - CLI Interface

## Application Code

| Artifact | Path |
|---|---|
| Package manifest | `packages/cli/package.json` |
| TypeScript config | `packages/cli/tsconfig.json` |
| Public exports | `packages/cli/src/index.ts` |
| Shared types | `packages/cli/src/types.ts` |
| Error model | `packages/cli/src/shared-errors.ts` |
| Parser | `packages/cli/src/parsing/cli-command-parser.ts` |
| Help content | `packages/cli/src/parsing/help-content-builder.ts` |
| Option resolution | `packages/cli/src/config/cli-option-resolver.ts` |
| Path guard | `packages/cli/src/path/workspace-path-guard.ts` |
| Application bridge | `packages/cli/src/bridges/application-bridge.ts` |
| Report bridge | `packages/cli/src/bridges/report-bridge.ts` |
| Output formatter | `packages/cli/src/output/cli-output-formatter.ts` |
| Progress emitter | `packages/cli/src/output/progress-emitter.ts` |
| Exit code mapper | `packages/cli/src/exit-codes/exit-code-mapper.ts` |
| Confirmation coordinator | `packages/cli/src/interaction/confirmation-coordinator.ts` |
| CLI service facade | `packages/cli/src/generation/cli-service.ts` |
| CLI generators | `packages/cli/src/generation/generators.ts` |
| Tests | `packages/cli/tests/cli.test.ts` |

## Documentation

| Artifact | Path |
|---|---|
| Code summary | `aidlc-docs/construction/uow-10-cli-interface/code/summary.md` |
| Artifact index | `aidlc-docs/construction/uow-10-cli-interface/code/artifact-index.md` |

## Notes

- The CLI package is intentionally bridge-driven so it can be wired to the shared application service without changing the terminal surface.
- Reporting output remains delegated to the reporting bridge to preserve canonical export behavior.
