# Code Generation Plan - UOW-04 Angular-to-React Transformation

## Unit Context

- **Unit**: UOW-04 Angular-to-React Transformation
- **Primary Package**: `packages/transform-angular-react`
- **Primary Owner Role**: Application Developer
- **Reviewer Roles**: Migration Engineer, Architect, Security Reviewer
- **Primary Stories**: US-005, US-006
- **Supporting Stories**: US-002, US-007, US-011, US-012, US-014
- **Prerequisites**: UOW-01 core contracts, UOW-02 orchestration conventions, UOW-03 Angular analysis models, UOW-04 Functional Design, UOW-04 NFR Requirements, and UOW-04 NFR Design are complete.

## Purpose

Generate the Angular-to-React transformation package, including deterministic rule registry, execution planner, staged pipeline, converter modules, draft and trace builders, draft validation, safe review diagnostics, provider-neutral mapping metadata, summary collection, PBT helpers, unit tests, and markdown summaries.

## Scope

### In Scope

- Package scaffold for `packages/transform-angular-react`.
- Public transformation service and request/result models.
- Deterministic rule registry, registry validator, and execution planner.
- Staged transformation pipeline.
- Context normalizer for UOW-01/UOW-03-compatible source evidence.
- Component, template, behavior, service/DI, route, and state converter modules.
- Compact target draft and trace builders.
- Draft validation for schema shape, trace coverage, deterministic ordering, and unsupported mapping preservation.
- Safe manual-review diagnostic and review item builder.
- Provider-neutral difficult mapping request metadata builder.
- Pass summary collector.
- Test generators and PBT support for registry, context, drafts, diagnostics, and unsupported mappings.
- Unit tests for ordering, fail-fast registry validation, conversion idempotence, trace coverage, unsupported mapping preservation, and representative conversion fixtures.
- Markdown code summary under `aidlc-docs/construction/uow-04-angular-to-react-transformation/code/`.

### Out of Scope

- Raw Angular project scanning or parsing.
- Final React project scaffolding or file generation.
- Concrete AI provider calls.
- Security masking implementation.
- Quality gate execution and self-correction loops.
- CLI and Web UI components.
- Database migration scripts.
- Deployment artifacts.
- Any application code under `aidlc-docs/`.

## Story Traceability

| Story | Coverage in This Unit |
|---|---|
| US-005 Convert Components, Templates, Bindings, and Lifecycle | Component, template, behavior, lifecycle, and review-safe draft converters. |
| US-006 Convert Services, Dependency Injection, Routing, and State | Service/DI, route, and state strategy draft converters. |
| US-002 Choose Target Project and State Strategy | Target strategy and state strategy fields are consumed by rule selection and draft conversion. |
| US-007 Use Local/Internal LLM for Difficult Mappings | Provider-neutral mapping metadata is produced without direct provider calls. |
| US-011 Run Self-Correction and Quality Gates | Draft validation and structured summaries provide later quality inputs. |
| US-012 Apply Property-Based Testing to Conversion-Sensitive Logic | PBT generators and properties for registry, pipeline, drafts, traces, and diagnostics. |
| US-014 Preserve Extensible Architecture Evidence | Rule registry and extension-compatible rule contracts. |

## Target Paths

### Application Code

- `packages/transform-angular-react/package.json`
- `packages/transform-angular-react/tsconfig.json`
- `packages/transform-angular-react/src/index.ts`
- `packages/transform-angular-react/src/types.ts`
- `packages/transform-angular-react/src/service/`
- `packages/transform-angular-react/src/context/`
- `packages/transform-angular-react/src/registry/`
- `packages/transform-angular-react/src/planner/`
- `packages/transform-angular-react/src/pipeline/`
- `packages/transform-angular-react/src/converters/`
- `packages/transform-angular-react/src/drafts/`
- `packages/transform-angular-react/src/trace/`
- `packages/transform-angular-react/src/validation/`
- `packages/transform-angular-react/src/diagnostics/`
- `packages/transform-angular-react/src/ai-handoff/`
- `packages/transform-angular-react/src/summary/`
- `packages/transform-angular-react/src/testing/`
- `packages/transform-angular-react/tests/`
- `package.json`

### Documentation

- `aidlc-docs/construction/uow-04-angular-to-react-transformation/code/summary.md`
- `aidlc-docs/construction/uow-04-angular-to-react-transformation/code/artifact-index.md`

## Dependencies and Interfaces

| Dependency | Use |
|---|---|
| `@spa-bridge/core-model` | Result, diagnostics, refs, validation patterns, generated refs. |
| `@spa-bridge/source-angular` | Angular source analysis model types for transformation input. |
| `typescript` | TypeScript build dependency only, aligned with existing packages. |
| `vitest` | Unit and property-oriented test runner. |
| `fast-check` | PBT generators and properties. |

No database entities, API endpoints, infrastructure resources, or frontend components are owned by this unit.

## Generation Checklist

- [x] Step 1: Re-read UOW-04 design artifacts and confirm code generation boundaries.
- [x] Step 2: Create the `packages/transform-angular-react` package scaffold and public export surface.
- [x] Step 3: Generate transformation request/result models, draft models, trace models, rule contracts, review item models, and summary models.
- [x] Step 4: Generate `TransformationRequestValidator`, `ContextNormalizer`, and shared stable ID helpers.
- [x] Step 5: Generate `RuleRegistry`, `RegistryValidator`, and `ExecutionPlanner`.
- [x] Step 6: Generate `DraftBuilder`, `TraceBuilder`, `DraftValidator`, `SafeReviewDiagnosticBuilder`, `ProviderNeutralMappingRequestBuilder`, and `PassSummaryCollector`.
- [x] Step 7: Generate component, template, behavior, service/DI, route, and state converter modules.
- [x] Step 8: Generate `TransformationPipeline` and public `TransformationService`.
- [x] Step 9: Generate PBT/test support generators for rule registries, contexts, drafts, traces, diagnostics, and unsupported mappings.
- [x] Step 10: Generate unit tests for registry ordering, invalid registry fail-fast, conversion idempotence, draft validation, trace coverage, unsupported mapping preservation, and representative conversion fixtures.
- [x] Step 11: Update workspace root scripts to include `@spa-bridge/transform-angular-react` build and test commands.
- [x] Step 12: Generate markdown code summary and artifact index documentation.
- [x] Step 13: Verify all application code lives in the workspace root and only markdown summaries live under `aidlc-docs/`.

## Generation Notes

- This unit emits React-oriented drafts, not final React files.
- The transformation package must remain deterministic and provider-neutral.
- Manual-review diagnostics are first-class outputs, not error-only behavior.
- No provider calls, file generation, masking, CLI behavior, Web UI behavior, or deployment artifacts are expected for this unit.

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- All file paths are ASCII and resolve under the workspace root or `aidlc-docs/construction/.../code/`.
