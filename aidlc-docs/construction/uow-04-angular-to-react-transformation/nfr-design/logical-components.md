# UOW-04 Logical Components

## Component Overview

| Component | Purpose | Primary Outputs |
|---|---|---|
| `TransformationService` | Public package-facing service that coordinates transformation. | `TransformationResult`. |
| `TransformationRequestValidator` | Validates input refs, target strategy, rule pack configuration, and provider-neutral boundaries. | Valid request or blocking diagnostics. |
| `ContextNormalizer` | Builds deterministic conversion context from IR/source entities, graph evidence, and strategies. | `TransformationContext`. |
| `RuleRegistry` | Stores built-in and extension rules using stable metadata. | Registered rule set. |
| `RegistryValidator` | Validates duplicate IDs, dependencies, cycles, conflicts, and phases. | Registry diagnostics. |
| `ExecutionPlanner` | Produces deterministic phase/dependency/priority/ruleId execution plan. | `RuleExecutionPlan`. |
| `TransformationPipeline` | Runs staged conversion phases and coordinates builders/validators. | Drafts, traces, diagnostics, summaries. |
| `ComponentConverter` | Converts component entity evidence into React component drafts. | `ReactComponentDraft[]`. |
| `TemplateConverter` | Converts template and binding evidence into JSX/template drafts. | `ReactTemplateDraft[]`. |
| `BehaviorConverter` | Converts events, lifecycle hooks, forms, and hook intent. | `ReactHookDraft[]`, review items. |
| `ServiceDiConverter` | Converts services, providers, DI tokens, and dependency evidence. | `ReactServiceDraft[]`. |
| `RouteConverter` | Converts Angular route evidence into React route drafts. | `ReactRouteDraft[]`. |
| `StateStrategyConverter` | Converts state artifacts through selected strategy. | `ReactStateDraft[]`. |
| `DraftBuilder` | Accumulates compact target drafts with stable IDs. | `ReactTargetDraftSet`. |
| `TraceBuilder` | Accumulates source-to-target traces. | `ConversionTrace[]`. |
| `DraftValidator` | Validates schema, trace coverage, ordering, and unsupported mapping preservation. | Validation diagnostics. |
| `SafeReviewDiagnosticBuilder` | Creates safe manual-review diagnostics and review items. | Diagnostics and `ManualReviewItem[]`. |
| `ProviderNeutralMappingRequestBuilder` | Creates safe difficult-mapping metadata without invoking providers. | Provider-neutral mapping requests. |
| `PassSummaryCollector` | Collects safe counts and coverage summaries. | Pass summaries. |
| `TransformationPbtGenerators` | Provides test generators and invalid-registry models. | PBT arbitraries/generators. |
| `BenchmarkFixtureFactory` | Produces 100+ and 500+ component-equivalent source model fixtures. | Benchmark fixtures. |

## Component Responsibilities

### TransformationService

Responsibilities:
- Accept `TransformationRequest`.
- Run request validation, context normalization, rule planning, pipeline execution, draft validation, and finalization.
- Return `failed`, `partial`, or `succeeded` transformation result.
- Keep UOW-04 independent from raw source scanning, final React file writing, concrete AI providers, masking, and report rendering.

Collaborators:
- `TransformationRequestValidator`
- `ContextNormalizer`
- `RuleRegistry`
- `RegistryValidator`
- `ExecutionPlanner`
- `TransformationPipeline`
- `DraftValidator`
- `PassSummaryCollector`

### TransformationRequestValidator

Responsibilities:
- Validate required source/IR refs, graph refs, target framework, target project strategy, state strategy, and enabled rule packs.
- Reject direct provider invocation configuration in UOW-04.
- Emit safe blocking diagnostics for invalid requests.

NFR mapping:
- Fail-fast invalid request handling.
- Provider-neutral boundary enforcement.
- SECURITY-05 validation gate.

### ContextNormalizer

Responsibilities:
- Build normalized source entity views from IR and Angular analysis evidence.
- Normalize graph references, strategy selections, prior diagnostics, and available rule scopes.
- Preserve partial source identity and diagnostics.
- Avoid raw source text retention.

NFR mapping:
- Bounded memory model.
- Deterministic context for rule selection.
- Source/IR treated as untrusted structured input.

### RuleRegistry

Responsibilities:
- Register built-in and extension rule packs.
- Store rule metadata: `ruleId`, phase, priority, dependencies, conflicts, applies-to constraints, and diagnostic policy.
- Provide stable rule metadata to `RegistryValidator` and `ExecutionPlanner`.

NFR mapping:
- Extensibility without external rule-engine dependency.
- Stable rule identity for traceability.

### RegistryValidator

Responsibilities:
- Detect duplicate rule IDs.
- Detect dangling dependencies.
- Detect dependency cycles.
- Detect unresolved conflicts.
- Detect unknown phases or unsupported strategy constraints.
- Return blocking diagnostics before rule execution.

NFR mapping:
- Fail-fast invalid registry pattern.
- Stateful/model-based PBT target.

### ExecutionPlanner

Responsibilities:
- Group active rules by phase.
- Resolve dependencies.
- Sort by phase, dependency order, priority, and ruleId.
- Record skipped rules with safe rationale.
- Produce deterministic `RuleExecutionPlan`.

NFR mapping:
- Rule ordering determinism.
- Rule selection stability.
- Diff-friendly conversion output.

### TransformationPipeline

Responsibilities:
- Execute stages: validate, normalize context, plan rules, execute phases, validate drafts, finalize.
- Run entity-scoped converter modules.
- Coordinate draft, trace, review, mapping request, and summary builders.
- Preserve partial drafts when entity-level mappings are uncertain.

NFR mapping:
- Staged pipeline reliability.
- Bounded entity-scoped execution.
- Partial-result behavior.

### ComponentConverter

Responsibilities:
- Convert component names, props, local state, imports, and component-level dependencies.
- Map Angular inputs to props where supported.
- Emit review items for unsupported component contracts.

NFR mapping:
- Meaningful component conversion.
- Unsupported mapping preservation.

### TemplateConverter

Responsibilities:
- Convert template bindings, events, structural directives, interpolations, and template refs into JSX draft structures.
- Preserve uncertain syntax as review markers.
- Avoid executing template expressions.

NFR mapping:
- Safe conversion of untrusted template evidence.
- Manual-review diagnostic pattern.

### BehaviorConverter

Responsibilities:
- Convert lifecycle hooks, event emitters, forms, two-way bindings, and effect intent.
- Represent hook body intent as structured metadata.
- Emit review items for side effects or uncertain form behavior.

NFR mapping:
- Prevents unsafe lifecycle/form guesses.
- Keeps generated behavior reviewable.

### ServiceDiConverter

Responsibilities:
- Convert service classes, provider scopes, DI tokens, and dependencies into module/hook/context drafts.
- Preserve provider scope evidence.
- Emit review items for unknown DI behavior.

NFR mapping:
- Avoids flattening DI into unsafe global singletons.
- Maintains service traceability.

### RouteConverter

Responsibilities:
- Convert route paths, nested routes, lazy targets, guards, resolvers, and redirects.
- Preserve dynamic route and guard behavior as review markers.

NFR mapping:
- Prevents route behavior from disappearing.
- Supports target routing strategy handoff.

### StateStrategyConverter

Responsibilities:
- Convert source state artifacts using selected target state strategy.
- Preserve stores, actions, selectors, effects, or service-state evidence.
- Emit review items for unsupported state patterns.

NFR mapping:
- Supports multiple target state strategies.
- Keeps strategy gaps visible.

### DraftBuilder

Responsibilities:
- Create stable IDs for component, template, hook, service, route, and state drafts.
- Accumulate compact structured drafts.
- Sort draft collections deterministically.
- Preserve partial draft identity.

NFR mapping:
- Bounded draft model.
- Draft ordering PBT.

### TraceBuilder

Responsibilities:
- Create stable source-to-target trace records.
- Associate source refs, generated refs, rule IDs, confidence, and diagnostics.
- Provide trace coverage data to validators and summaries.

NFR mapping:
- Trace coverage requirement.
- Reporting and review handoff.

### DraftValidator

Responsibilities:
- Validate draft schemas.
- Validate trace coverage.
- Validate deterministic ordering.
- Validate unsupported mapping preservation.
- Emit blocking diagnostics for invalid handoff artifacts.

NFR mapping:
- Finalize-stage quality gate.
- Prevents invalid drafts crossing into UOW-07.

### SafeReviewDiagnosticBuilder

Responsibilities:
- Create safe UOW-01-compatible diagnostics.
- Create manual review items.
- Enforce ruleId/sourceRef/generatedRef/category-driven messages.
- Block raw source, generated code snippets, raw provider prompts, and unbounded exceptions.

NFR mapping:
- Diagnostic privacy.
- Stable review output.

### ProviderNeutralMappingRequestBuilder

Responsibilities:
- Create safe metadata for difficult mappings.
- Include mapping category, source refs, draft refs, rule IDs, diagnostic refs, and safe context.
- Avoid direct provider invocation.

NFR mapping:
- Provider boundary isolation.
- UOW-05/UOW-06 handoff compatibility.

### PassSummaryCollector

Responsibilities:
- Collect rule execution counts.
- Collect phase and entity counts.
- Collect diagnostic and review item counts.
- Collect trace coverage summaries.
- Provide safe structured output for reporting and UI status.

NFR mapping:
- Observability without raw source logs.
- Report-friendly structured evidence.

### TransformationPbtGenerators

Responsibilities:
- Generate valid and invalid rule registries.
- Generate conversion contexts, draft sets, traces, diagnostics, and unsupported mapping cases.
- Support model-based invalid-registry tests and conversion idempotence tests.

NFR mapping:
- Required blocking PBT coverage.
- Seed/replay support during Code Generation and Build/Test.

### BenchmarkFixtureFactory

Responsibilities:
- Generate 100+ and 500+ component-equivalent source model fixtures.
- Include representative component, template, lifecycle, service, DI, route, and state cases.
- Support repeatable local benchmark instructions.

NFR mapping:
- 30-second 100+ component target.
- 500+ component benchmark baseline.

## Dependency Boundaries

| Component | May Depend On | Must Not Depend On |
|---|---|---|
| `TransformationService` | UOW-04 components, UOW-01 contracts | Raw source scanner, React file writer, AI providers |
| `TransformationRequestValidator` | UOW-01 result/diagnostic contracts | Converter internals |
| `ContextNormalizer` | UOW-01 contracts, UOW-03 source model outputs | File system traversal, source parser internals |
| `RuleRegistry` | Rule contracts | Converter runtime state |
| `RegistryValidator` | Rule metadata, diagnostics | Provider adapters |
| `ExecutionPlanner` | Validated rule metadata | Source text or generated code |
| Converter modules | Normalized context, builders, safe diagnostics | Direct file writes, provider calls |
| `DraftValidator` | Drafts, traces, schemas, diagnostics | UOW-07 generation internals |
| `ProviderNeutralMappingRequestBuilder` | Safe refs and review metadata | Concrete provider adapters or masking implementation |
| `PassSummaryCollector` | Counts, refs, rule IDs, diagnostic metadata | Raw source/generated snippets |

## Data Flow

1. `TransformationService` receives request.
2. `TransformationRequestValidator` validates required refs and strategy inputs.
3. `ContextNormalizer` builds normalized conversion context.
4. `RuleRegistry` provides candidate rules.
5. `RegistryValidator` blocks invalid registry states.
6. `ExecutionPlanner` builds deterministic execution plan.
7. `TransformationPipeline` executes phase-based converter modules.
8. `DraftBuilder` and `TraceBuilder` accumulate compact outputs.
9. `SafeReviewDiagnosticBuilder` creates diagnostics and review items.
10. `ProviderNeutralMappingRequestBuilder` records difficult mapping handoff metadata when needed.
11. `DraftValidator` validates schemas, trace coverage, ordering, and unsupported mapping preservation.
12. `PassSummaryCollector` emits safe structured summaries.
13. `TransformationService` returns `TransformationResult`.

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Safe diagnostic and summary components prevent raw source/generated content in report-facing output. |
| SECURITY-05 | Compliant | Request, registry, draft, trace, and diagnostic validation are explicit component responsibilities. |
| SECURITY-10 | Compliant | Logical components avoid external rule-engine dependencies by default. |
| SECURITY-11 | Compliant | Provider calls, source execution, and generated code execution are outside UOW-04 boundaries. |
| SECURITY-13 | Compliant | Context normalization treats source/IR artifacts as untrusted structured data. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Logical components map to identified properties. |
| PBT-03 | Compliant | Registry, draft, trace, and unsupported mapping invariants are represented as components. |
| PBT-04 | Compliant | Pipeline and context components expose conversion idempotence targets. |
| PBT-06 | Compliant | `RegistryValidator` and `ExecutionPlanner` support stateful/model-based invalid-registry tests. |
| PBT-07 | N/A | Concrete generator implementation occurs during Code Generation. |
| PBT-08 | N/A | Seed/replay behavior is finalized in Code Generation and Build/Test. |
| PBT-10 | Compliant | Component tests combine fixtures and property-based generators. |

## Blocking Findings

- **Security**: None.
- **PBT**: None.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
