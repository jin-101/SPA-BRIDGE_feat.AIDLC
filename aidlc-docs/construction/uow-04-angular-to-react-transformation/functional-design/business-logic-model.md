# UOW-04 Business Logic Model

## Unit Purpose

UOW-04 converts analyzed Angular source-model evidence into React-oriented target drafts. It owns deterministic transformation logic, rule ordering, manual-review diagnostics, and traceable conversion artifacts used by the later React target generation unit.

The unit does not scan raw Angular projects, write final React project files, execute quality gates, call concrete AI providers, or apply masking itself. It consumes UOW-01/UOW-03 contracts and produces conversion drafts that remain reviewable, reproducible, and safe to hand off.

## Approved Scope

| Decision Area | Approved Choice | Design Effect |
|---|---|---|
| Transformation approach | Framework-neutral rule registry with ordered passes and explicit precedence | Enables plugin-friendly rules and deterministic conversion. |
| Pipeline input/output | Consume framework-neutral IR and emit React-oriented target drafts | Keeps raw source analysis and final code generation in separate units. |
| Component depth | Map props, state, events, lifecycle hooks, and template bindings | Supports meaningful component migration rather than placeholders. |
| Routing and state | Dedicated route and state strategy adapters | Allows target choices without hard-coding one React stack. |
| Services and DI | Map services and DI tokens into hooks, context, or service modules with review markers | Preserves behavior intent while surfacing uncertain mappings. |
| Uncertain bindings/forms | Emit manual-review diagnostics instead of guessing | Prevents silent behavior drift. |
| Package scope | Dedicated transformation package with rule engine and draft generators | Makes conversion reusable by CLI, Web UI, and orchestration. |
| PBT focus | Rule ordering, idempotent conversion, graph invariants, diagnostic stability | Carries conversion-sensitive properties into implementation. |
| Downstream handoff | Target drafts and traceable conversion artifacts | Gives UOW-07 enough structured evidence to generate React output. |
| Unresolved mappings | Preserve partial draft with manual-review diagnostic | Keeps progress without hiding risk. |

## Core Business Capabilities

| Capability | Description | Primary Outputs |
|---|---|---|
| Transformation Request Handling | Validate conversion input, selected strategies, and available source artifacts. | `TransformationRequest`, validation diagnostics |
| Rule Registry | Register ordered conversion rules with stable IDs, priorities, scopes, and dependencies. | `TransformationRule[]`, precedence graph |
| Conversion Pipeline | Run ordered passes for components, templates, lifecycle, services, DI, routing, and state. | `TransformationResult`, pass summaries |
| Component Conversion | Convert Angular component evidence into React component drafts. | `ReactComponentDraft[]` |
| Template and Binding Conversion | Convert supported Angular template syntax into JSX draft structures and review markers. | `ReactTemplateDraft`, binding diagnostics |
| Lifecycle Conversion | Map Angular lifecycle hooks to React hook draft effects where supported. | `ReactHookDraft[]`, lifecycle diagnostics |
| Service and DI Conversion | Convert service and provider evidence into module, hook, or context draft recommendations. | `ReactServiceDraft[]`, DI diagnostics |
| Routing Conversion | Convert Angular route evidence into React route draft models. | `ReactRouteDraft[]` |
| State Strategy Mapping | Represent state evidence according to selected target strategy. | `ReactStateDraft[]`, strategy diagnostics |
| Manual Review Emission | Mark uncertain, dynamic, lossy, or unsupported mappings for user review. | UOW-01 `Diagnostic[]` |
| Traceability Mapping | Preserve source-to-draft links for reports, review, and later code generation. | `ConversionTrace[]`, generated refs |

## Primary Workflow

### Transform Angular Source Model

1. Receive a `TransformationRequest` from orchestration with source model refs, graph refs, diagnostics, target strategy choices, and enabled rule packs.
2. Validate schema versions, required artifact refs, selected target framework, and target state strategy.
3. Load and normalize transformation context from the framework-neutral source model and Angular analysis graph.
4. Build the rule registry from built-in rules and approved extension rule packs.
5. Resolve rule ordering by phase, priority, dependency, and explicit precedence.
6. Run component discovery and component draft conversion passes.
7. Run template, binding, event, form, and lifecycle conversion passes.
8. Run service, dependency injection, routing, and state strategy conversion passes.
9. Emit manual-review diagnostics for uncertain, unsupported, dynamic, or lossy mappings.
10. Validate draft consistency and trace coverage.
11. Return target drafts, conversion traces, diagnostics, pass summaries, and artifact refs to orchestration.

## Conversion Pipeline Phases

| Phase | Responsibility | Failure Behavior |
|---|---|---|
| Input Validation | Confirm required source artifacts, schema versions, target strategy, and rule pack configuration. | Blocking diagnostics for missing required artifacts. |
| Context Normalization | Build a conversion context from IR entities, source refs, graph edges, and prior diagnostics. | Preserve partial context with diagnostics when possible. |
| Rule Selection | Choose active rules by source entity type, target strategy, and enabled rule packs. | Reject ambiguous duplicate precedence. |
| Component Pass | Create component drafts and initial source-to-target traces. | Preserve partial component draft with review diagnostics. |
| Template Pass | Convert template structures into JSX draft nodes and binding drafts. | Mark unsupported syntax for manual review. |
| Behavior Pass | Map events, lifecycle hooks, forms, inputs, outputs, services, and DI. | Prefer explicit diagnostics over guessed behavior. |
| Route and State Pass | Convert routes and state evidence according to target strategy adapters. | Preserve unresolved routes/state with review items. |
| Finalize Pass | Sort outputs, validate traceability, and produce artifact summaries. | Return blocking diagnostic only for corrupted draft graph or invalid rule state. |

## Rule Registry Model

Rules are deterministic transformation units with declared scope and ordering metadata.

| Rule Attribute | Purpose |
|---|---|
| `ruleId` | Stable identifier for diagnostics, traceability, and test replay. |
| `phase` | Pipeline phase where the rule executes. |
| `priority` | Deterministic ordering inside a phase. |
| `appliesTo` | Source entity kinds and target strategy constraints. |
| `requires` | Rule IDs that must run before this rule. |
| `conflictsWith` | Rule IDs that cannot run in the same context. |
| `transform` | Pure transformation function over conversion context and entity evidence. |
| `diagnosticPolicy` | How unsupported or uncertain mappings are surfaced. |

## Draft Handoff Model

UOW-04 produces React-oriented drafts, not final files.

| Draft Type | Examples | Downstream Consumer |
|---|---|---|
| `ReactComponentDraft` | Component name, props, state, hooks, JSX draft, imports. | UOW-07 React Target Generation |
| `ReactTemplateDraft` | JSX node tree, event bindings, property bindings, review markers. | UOW-07 React Target Generation |
| `ReactServiceDraft` | Service module, hook, context provider, dependency requirements. | UOW-07 React Target Generation |
| `ReactRouteDraft` | Route paths, element refs, nested routes, guard review markers. | UOW-07 React Target Generation |
| `ReactStateDraft` | Selected state strategy, stores/selectors/actions/effects draft evidence. | UOW-07 React Target Generation |
| `ConversionTrace` | Source refs, generated refs, rule IDs, confidence, diagnostic refs. | UOW-09 Reporting and UOW-11 Review |

## Manual Review Model

Manual review is a first-class output. It is not an implementation afterthought.

| Review Category | Example Trigger | Output |
|---|---|---|
| Unsupported Template Syntax | Dynamic structural directive or unsupported pipe chain. | `manual-review` diagnostic and partial JSX draft. |
| Lossy Binding Mapping | Two-way binding with custom accessor semantics. | Review marker on binding draft. |
| Lifecycle Ambiguity | Lifecycle hook with side effects that cannot map cleanly. | Hook draft plus review diagnostic. |
| DI Ambiguity | Provider scope cannot be mapped safely to module, context, or hook. | Service/DI draft with review marker. |
| Route Ambiguity | Dynamic route target or guard behavior. | Route draft with manual review item. |
| State Strategy Gap | Source state evidence not supported by selected target strategy. | State draft diagnostic and fallback review item. |

## Handoff Boundaries

| Consumer | UOW-04 Provides | UOW-04 Does Not Provide |
|---|---|---|
| UOW-01 Core Model | Diagnostics, generated refs, traces, draft summaries. | Core schema migrations. |
| UOW-02 Orchestration | Transformation status, artifact refs, blocking diagnostics, summary counts. | Workflow scheduling beyond transformation completion. |
| UOW-06 AI Provider | Structured difficult mapping prompts may be prepared later through ports. | Concrete provider calls or external LLM policy. |
| UOW-07 React Generation | React target drafts and traceable conversion artifacts. | Final project scaffolding and file writes. |
| UOW-08 Quality | Property candidates, conversion diagnostics, and draft consistency checks. | Tool execution and correction loop orchestration. |
| UOW-09 Reporting | Conversion traces, manual review items, pass summaries. | Markdown/HTML rendering. |

## Testable Properties

| Property | Category | Candidate Scope |
|---|---|---|
| Rule ordering is deterministic | Invariant | Same rule registry produces same phase ordering. |
| Rule selection is stable | Invariant | Equivalent source context and strategy select equivalent rules. |
| Conversion is idempotent | Idempotence | Re-running conversion on the same normalized context produces equivalent drafts. |
| Trace coverage is complete for generated drafts | Invariant | Every target draft has at least one source ref or explicit synthetic origin. |
| Diagnostics are stable | Invariant | Same unresolved mapping produces same diagnostic code and severity. |
| Partial draft preservation is stable | Invariant | Unresolved mappings preserve draft identity and source refs. |
| Unsupported mappings do not disappear | Invariant | Unsupported source evidence yields diagnostics or review markers. |
| Conflicting rules are rejected | Stateful / invariant | Registry states with conflicts never execute ambiguous conversion order. |

## Security Considerations

- Treat source model input as untrusted conversion evidence.
- Do not execute Angular expressions, generated JavaScript, route guards, or service code during transformation.
- Keep diagnostics safe and avoid raw sensitive snippets.
- Fail closed when provider-assisted mapping would be required but policy/masking state is unavailable.
- Preserve source refs for review without expanding source access scope.
- Keep transformation deterministic so security review and report output can be reproduced.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
