# UOW-04 Domain Entities

## Entity Overview

| Entity | Purpose | Key Relationships |
|---|---|---|
| `TransformationRequest` | Request to convert analyzed Angular/IR artifacts into React target drafts. | Produces `TransformationResult`. |
| `TransformationContext` | Normalized conversion state built from source artifacts, graph, strategies, and rule packs. | Used by all rules. |
| `TransformationRule` | Deterministic conversion unit with scope, phase, priority, and transform behavior. | Registered in `RuleRegistry`. |
| `RuleRegistry` | Ordered set of built-in and extension rules. | Produces `RuleExecutionPlan`. |
| `RuleExecutionPlan` | Deterministic ordered rule list grouped by phase. | Drives `ConversionPipeline`. |
| `ConversionPipeline` | Runs validation, context normalization, rule execution, and finalization. | Produces drafts and diagnostics. |
| `ReactTargetDraftSet` | Collection of React-oriented target drafts. | Consumed by UOW-07. |
| `ReactComponentDraft` | Draft React component structure. | References template, hooks, state, services, and traces. |
| `ReactTemplateDraft` | Draft JSX model and binding/event metadata. | Belongs to component draft. |
| `ReactHookDraft` | Draft React hook/effect/state behavior. | Derived from lifecycle, state, or DI evidence. |
| `ReactServiceDraft` | Draft service module, hook, or context provider. | Derived from Angular service/DI evidence. |
| `ReactRouteDraft` | Draft routing model. | Derived from Angular route evidence. |
| `ReactStateDraft` | Draft state representation for selected strategy. | Derived from source state artifacts. |
| `ConversionTrace` | Source-to-target trace record with rule and confidence metadata. | Used by reports and review. |
| `ManualReviewItem` | Reviewable unresolved conversion concern. | Backed by diagnostics and source refs. |
| `TransformationDiagnostic` | UOW-04-specific diagnostic mapped to UOW-01 `Diagnostic`. | References source refs, generated refs, and rule IDs. |
| `TransformationResult` | Final result returned to orchestration. | Contains drafts, traces, diagnostics, summaries, and artifact refs. |

## Core Request Entities

### TransformationRequest

| Field | Description |
|---|---|
| `runId` | Conversion run identifier from UOW-02. |
| `correlationId` | Correlation ID for diagnostics and audit events. |
| `sourceModelRef` | Source/IR artifact ref from UOW-01/UOW-03. |
| `graphRef` | Angular dependency graph artifact ref. |
| `diagnosticRefs` | Prior analysis diagnostic refs to preserve context. |
| `targetFramework` | Target framework, initially React. |
| `targetProjectStrategy` | Target project strategy such as Vite + React + TypeScript. |
| `stateStrategy` | Selected React state strategy or default strategy. |
| `enabledRulePacks` | Built-in and extension rule pack identifiers. |
| `providerPolicyRef` | Optional policy ref for provider-assisted future refinement. |

Business rules:
- Must include source model or IR refs and graph refs.
- Must not require raw source file reads.
- Must reject missing or unsupported target framework choices.

### TransformationContext

| Field | Description |
|---|---|
| `schemaVersion` | Context schema version. |
| `sourceEntities` | Normalized components, templates, services, routes, and state evidence. |
| `dependencyGraph` | Source relationship graph from UOW-03. |
| `strategy` | Target framework, project, route, and state strategy choices. |
| `activeRules` | Rule registry subset selected for the request. |
| `diagnostics` | Diagnostics carried from input and emitted during normalization. |
| `traceBuilder` | Accumulates source-to-target trace records. |
| `draftBuilder` | Accumulates target draft entities. |

Business rules:
- Context normalization must be deterministic.
- Context must preserve source identity for partial entities.
- Context must not execute source expressions.

## Rule Entities

### TransformationRule

| Field | Description |
|---|---|
| `ruleId` | Stable rule identifier. |
| `displayName` | Safe display name. |
| `phase` | Pipeline phase such as `component`, `template`, `behavior`, `route`, `state`, or `finalize`. |
| `priority` | Numeric ordering value inside phase. |
| `appliesTo` | Source entity types, target strategy constraints, and feature flags. |
| `requires` | Rule IDs that must run first. |
| `conflictsWith` | Rule IDs that cannot run with this rule. |
| `transform` | Pure conversion operation. |
| `diagnosticPolicy` | Rule-specific diagnostic mapping behavior. |

Business rules:
- `ruleId` values must be unique.
- Rule dependencies and conflicts must resolve before execution.
- Rules must not mutate normalized input entities in place.

### RuleRegistry

| Field | Description |
|---|---|
| `schemaVersion` | Registry schema version. |
| `rulePacks` | Ordered collection of built-in and extension rule packs. |
| `rules` | Registered transformation rules. |
| `conflicts` | Detected rule conflict metadata. |
| `diagnostics` | Registry validation diagnostics. |

Business rules:
- Registry output must be stable for equivalent rule sets.
- Duplicate rules or unresolved dependencies produce blocking diagnostics.

### RuleExecutionPlan

| Field | Description |
|---|---|
| `planId` | Stable plan identifier. |
| `phases` | Ordered phase definitions. |
| `orderedRules` | Deterministically sorted active rules. |
| `skippedRules` | Inactive rules with safe rationale. |
| `diagnostics` | Rule selection and ordering diagnostics. |

Business rules:
- Equivalent context and registry input must produce equivalent plans.
- Conflicting plans must never execute.

## Draft Entities

### ReactTargetDraftSet

| Field | Description |
|---|---|
| `schemaVersion` | Draft set schema version. |
| `targetFramework` | React. |
| `projectStrategy` | Target project strategy. |
| `components` | React component drafts. |
| `templates` | JSX/template drafts. |
| `services` | Service/hook/context drafts. |
| `routes` | Route drafts. |
| `state` | State strategy drafts. |
| `manualReviewItems` | Reviewable conversion concerns. |
| `diagnostics` | Draft-level diagnostics. |

Business rules:
- Draft ordering must be deterministic.
- Every draft must have trace evidence or synthetic-origin metadata.
- Partial drafts must be preserved when safe.

### ReactComponentDraft

| Field | Description |
|---|---|
| `componentId` | Stable generated component draft ID. |
| `sourceComponentRef` | Source component or IR entity ref. |
| `name` | Target component name. |
| `props` | Props derived from Angular inputs and external usage. |
| `state` | Local state draft fields. |
| `hooks` | Hook drafts for lifecycle/state/effects. |
| `templateDraftRef` | Associated JSX/template draft. |
| `serviceRefs` | Required service or context dependencies. |
| `imports` | Target import requirements. |
| `reviewItemRefs` | Review items attached to this component. |

Business rules:
- Component names must be stable and safe.
- Unsupported lifecycle or binding behavior must attach review refs.

### ReactTemplateDraft

| Field | Description |
|---|---|
| `templateDraftId` | Stable template draft ID. |
| `sourceTemplateRef` | Source template ref. |
| `jsxNodes` | Draft JSX node model. |
| `bindings` | Converted property, attribute, interpolation, and event binding drafts. |
| `forms` | Form and two-way binding draft evidence. |
| `reviewItemRefs` | Review items attached to template conversion. |

Business rules:
- Template expressions must be represented as data, not executed.
- Uncertain forms and bindings must be marked for review.

### ReactHookDraft

| Field | Description |
|---|---|
| `hookDraftId` | Stable hook draft ID. |
| `hookKind` | `state`, `effect`, `memo`, `callback`, `custom`, or `unknown`. |
| `sourceRef` | Source lifecycle, state, or dependency evidence. |
| `dependencies` | Draft dependency references. |
| `bodyIntent` | Safe structured behavior intent, not executable source text. |
| `reviewItemRefs` | Review refs for uncertain hook behavior. |

Business rules:
- Hook bodies remain draft intent until UOW-07 code generation.
- Side effects with uncertain ordering require review.

### ReactServiceDraft

| Field | Description |
|---|---|
| `serviceDraftId` | Stable service draft ID. |
| `sourceServiceRef` | Angular service or DI source ref. |
| `draftKind` | `module`, `hook`, `context`, or `unknown`. |
| `providerScope` | Preserved provider scope evidence. |
| `dependencies` | DI dependencies and token refs. |
| `publicMethods` | Service method draft refs. |
| `reviewItemRefs` | DI or service review markers. |

Business rules:
- Provider scope must not be silently flattened.
- Unknown DI token behavior requires review.

### ReactRouteDraft

| Field | Description |
|---|---|
| `routeDraftId` | Stable route draft ID. |
| `sourceRouteRef` | Angular route source ref. |
| `path` | Route path or parameterized path draft. |
| `elementRef` | Target component draft ref. |
| `children` | Nested route draft refs. |
| `guardRefs` | Guard/resolver evidence needing target handling. |
| `lazyTargetRef` | Lazy-loading evidence. |
| `reviewItemRefs` | Route review markers. |

Business rules:
- Dynamic routes must preserve review evidence.
- Guard behavior must not be dropped silently.

### ReactStateDraft

| Field | Description |
|---|---|
| `stateDraftId` | Stable state draft ID. |
| `strategy` | Selected state strategy. |
| `sourceStateRefs` | Source state artifacts. |
| `stores` | Store or container draft refs. |
| `actions` | Action/command draft refs. |
| `selectors` | Selector/query draft refs. |
| `effects` | Effect draft refs. |
| `reviewItemRefs` | State review markers. |

Business rules:
- State evidence maps through selected strategy adapters.
- Unsupported source state evidence must remain visible.

## Review and Trace Entities

### ConversionTrace

| Field | Description |
|---|---|
| `traceId` | Stable trace identifier. |
| `sourceRefs` | Source refs involved in the mapping. |
| `generatedRefs` | Generated/draft refs produced by the mapping. |
| `ruleIds` | Rules that contributed to the mapping. |
| `confidence` | Confidence value or category. |
| `diagnosticRefs` | Diagnostics associated with the mapping. |

Business rules:
- Trace IDs must be deterministic.
- Every non-synthetic draft should have trace coverage.

### ManualReviewItem

| Field | Description |
|---|---|
| `reviewItemId` | Stable review item ID. |
| `category` | Template, lifecycle, DI, route, state, form, or unknown. |
| `severity` | Review severity mapped to diagnostics. |
| `sourceRefs` | Source refs requiring review. |
| `draftRefs` | Draft refs affected by review. |
| `message` | Safe display message. |
| `recommendedAction` | Safe remediation hint. |

Business rules:
- Manual review messages must be safe and deterministic.
- Review items must reference affected drafts when available.

### TransformationResult

| Field | Description |
|---|---|
| `schemaVersion` | Result schema version. |
| `status` | `succeeded`, `partial`, or `failed`. |
| `draftSet` | React target draft set. |
| `traces` | Conversion trace records. |
| `diagnostics` | Diagnostics emitted during transformation. |
| `passSummaries` | Per-phase and per-rule execution summaries. |
| `artifactRefs` | Persisted artifact refs for downstream units. |

Business rules:
- Result status is `partial` when manual-review diagnostics exist but draft construction remains valid.
- Result status is `failed` only for invalid required input, invalid registry state, or corrupted draft artifacts.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
