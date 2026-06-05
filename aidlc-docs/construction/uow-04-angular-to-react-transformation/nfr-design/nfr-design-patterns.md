# UOW-04 NFR Design Patterns

## Unit Context

- **Unit**: UOW-04 Angular-to-React Transformation
- **Primary Package**: `packages/transform-angular-react`
- **NFR Requirements Status**: Complete
- **NFR Design Status**: Complete

## Design Summary

UOW-04 uses a deterministic transformation pipeline. The package validates transformation requests and rule registries before execution, normalizes context, plans ordered rule execution, generates compact React target drafts, validates trace coverage, and emits safe review diagnostics and summaries.

The design is provider-neutral and library-focused. It does not execute source code, generated code, Angular expressions, or AI provider calls.

## Deterministic Rule Registry Pattern

| Concern | Design |
|---|---|
| Rule storage | Rules are registered inside an in-package `RuleRegistry`. |
| Stable identity | Every rule has a unique stable `ruleId`. |
| Execution phase | Every rule declares a phase such as `component`, `template`, `behavior`, `service`, `route`, `state`, or `finalize`. |
| Ordering | Rules are ordered by phase, dependency, priority, and `ruleId`. |
| Rule packs | Built-in and extension rule packs use the same registry contract. |
| Output | The registry produces a validated rule set for `ExecutionPlanner`. |

Design rules:
- Registration order must not define final execution order.
- Duplicate rule IDs are blocking registry errors.
- All ordering inputs must be deterministic and serializable.
- Rule metadata must be safe to expose in reports and review summaries.

## Registry Validation Fail-Fast Pattern

`RegistryValidator` blocks invalid rule plans before any transformation executes.

| Invalid State | Behavior |
|---|---|
| Duplicate rule ID | Fail fast with blocking diagnostic. |
| Dangling dependency | Fail fast with blocking diagnostic. |
| Dependency cycle | Fail fast with blocking diagnostic. |
| Unresolved conflict | Fail fast with blocking diagnostic. |
| Unknown phase | Fail fast with blocking diagnostic. |
| Unsupported strategy constraint | Skip rule with safe rationale or fail when required. |

This pattern prevents ambiguous conversion behavior and makes invalid plugin states testable.

## Staged Conversion Pipeline Pattern

| Stage | Responsibility | Output |
|---|---|---|
| Validate Request | Check source/IR refs, graph refs, target framework, state strategy, and rule pack configuration. | Validated request or blocking diagnostics. |
| Normalize Context | Build conversion context from source entities, graph evidence, strategies, and prior diagnostics. | `TransformationContext`. |
| Plan Rules | Validate registry and produce deterministic execution plan. | `RuleExecutionPlan`. |
| Execute Phases | Run entity-scoped converter rules by phase. | Drafts, traces, review items, diagnostics. |
| Validate Drafts | Check schemas, trace coverage, deterministic ordering, and unsupported mapping preservation. | Valid draft set or blocking diagnostics. |
| Finalize | Sort outputs, compute summaries, and prepare handoff refs. | `TransformationResult`. |

Design rules:
- Expected unsupported mappings produce structured diagnostics, not thrown exceptions.
- Invalid requests and registries fail before conversion work begins.
- Per-entity uncertainty preserves partial drafts with manual-review items.
- Final output is sorted and stable.

## Entity-Scoped Execution Pattern

Rule execution is scoped to normalized entities rather than raw files.

| Entity Type | Typical Rule Scope |
|---|---|
| Component | Component name, props, state, lifecycle, hooks, imports. |
| Template | JSX draft nodes, bindings, events, forms, structural directives. |
| Service | Service module, hook, context, provider scope, dependencies. |
| Route | Route path, nested routes, guards, lazy targets, redirects. |
| State | Store, selector, action, effect, service-state evidence. |

Benefits:
- Avoids retaining raw source text.
- Keeps rule inputs compact and testable.
- Enables future incremental conversion.
- Makes PBT generators smaller and clearer.

## Bounded Draft and Trace Builder Pattern

`DraftBuilder` and `TraceBuilder` accumulate compact structured output.

| Concern | Design |
|---|---|
| Raw source | Not stored in drafts, traces, diagnostics, or summaries. |
| Draft identity | Stable IDs derived from source refs, draft kind, rule IDs, and deterministic ordinals. |
| Trace identity | Stable IDs derived from source refs, generated refs, and contributing rule IDs. |
| Partial drafts | Preserved with source refs and review markers. |
| Memory growth | Store summaries and refs rather than duplicated source or generated code text. |

This pattern supports 500+ component transformation without turning drafts into hidden source mirrors.

## Draft Validation Gate Pattern

Draft validation is a finalize-stage gate.

| Validator | Responsibility |
|---|---|
| `DraftSchemaValidator` | Validates draft shapes against schema-first contracts. |
| `TraceCoverageValidator` | Ensures every non-synthetic draft has source trace evidence. |
| `DeterministicOrderingValidator` | Verifies stable ordering of drafts, traces, diagnostics, and review items. |
| `UnsupportedMappingValidator` | Ensures unsupported source evidence maps to review items or diagnostics. |

Blocking validation failures:
- Invalid draft schema.
- Missing trace coverage for generated drafts.
- Unsorted finalized artifacts.
- Unsupported source evidence lost without review item or diagnostic.

## Safe Manual Review Diagnostic Pattern

`SafeReviewDiagnosticBuilder` is the only component that creates review-facing diagnostics and review items for UOW-04.

Allowed fields:
- Stable diagnostic code.
- UOW-01 diagnostic severity.
- Rule ID.
- Category.
- Safe source refs.
- Safe generated refs.
- Tags.
- Safe remediation hint.

Blocked by default:
- Raw Angular source snippets.
- Raw React generated snippets.
- Raw provider prompt content.
- Secret-like strings and credentials.
- Unbounded exception messages.

## Provider-Neutral Mapping Request Pattern

`ProviderNeutralMappingRequestBuilder` prepares difficult mapping metadata without calling providers.

| Metadata | Purpose |
|---|---|
| `mappingRequestId` | Stable handoff ID. |
| `category` | Template, lifecycle, DI, route, state, form, or unknown. |
| `sourceRefs` | Safe source refs requiring help. |
| `draftRefs` | Affected draft refs. |
| `ruleIds` | Rules that surfaced the difficult mapping. |
| `diagnosticRefs` | Existing review diagnostics. |
| `safeContext` | Structured metadata only, no raw snippets by default. |

Provider invocation remains owned by UOW-06 and policy/masking remains owned by UOW-05.

## Pass Summary Collector Pattern

`PassSummaryCollector` gathers observability data as safe structured output.

| Summary Field | Description |
|---|---|
| Rule counts | Rules executed, skipped, failed validation, and emitted diagnostics. |
| Phase counts | Entity counts and output counts by phase. |
| Diagnostic counts | Counts by severity, category, and rule ID. |
| Review counts | Counts by review category and affected draft kind. |
| Trace coverage | Draft counts with and without trace evidence. |
| Performance markers | Optional safe timing and count data under documented local conditions. |

Design rules:
- Summaries must not contain raw source or generated code.
- Counts and categories must be stable for equivalent input.
- Summaries are suitable for reporting and CLI/Web status display.

## PBT Design Pattern

UOW-04 uses a dedicated test support layer for property-based and model-based testing.

| Generator / Model | Properties |
|---|---|
| Rule registry generator | Deterministic ordering, duplicate detection, dependency validity. |
| Invalid registry model | Cycles, dangling dependencies, conflicts, and duplicate IDs fail fast. |
| Transformation context generator | Rule selection stability and conversion idempotence. |
| Draft generator | Draft ordering and trace coverage. |
| Diagnostic/review generator | Stable diagnostic severity, codes, and safe messages. |
| Unsupported mapping generator | Unsupported evidence always yields diagnostics or review markers. |

PBT complements example fixtures for common Angular component, template, lifecycle, service, DI, route, and state conversions.

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Safe review diagnostics and summaries avoid raw source/generated content. |
| SECURITY-05 | Compliant | Request, registry, draft, trace, and diagnostic validation are explicit design gates. |
| SECURITY-10 | Compliant | Design avoids external rule-engine dependencies by default. |
| SECURITY-11 | Compliant | Provider calls and source/generated code execution are isolated away from UOW-04. |
| SECURITY-13 | Compliant | Source/IR artifacts are validated and transformed as untrusted structured input. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | NFR design maps identified properties to generators and components. |
| PBT-03 | Compliant | Registry, draft ordering, trace coverage, and unsupported mapping invariants are central design patterns. |
| PBT-04 | Compliant | Conversion idempotence is explicitly designed. |
| PBT-06 | Compliant | Invalid registry states support stateful/model-based tests. |
| PBT-07 | N/A | Concrete generator code belongs to Code Generation. |
| PBT-08 | N/A | Seed logging and replay are finalized in Code Generation and Build/Test. |
| PBT-10 | Compliant | PBT complements representative conversion fixtures. |

## Blocking Findings

- **Security**: None.
- **PBT**: None.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
