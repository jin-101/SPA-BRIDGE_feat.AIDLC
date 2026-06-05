# UOW-04 Business Rules

## Transformation Scope Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW04-SCOPE-01 | UOW-04 consumes framework-neutral source/IR artifacts and Angular analysis evidence, not raw project source text. | Keeps scanning/parsing responsibilities in UOW-03. |
| UOW04-SCOPE-02 | UOW-04 emits React-oriented target drafts, not final project files. | Keeps target scaffolding and file writing in UOW-07. |
| UOW04-SCOPE-03 | Transformation logic must be available through a reusable package API. | Allows orchestration, CLI, Web UI, and later adapters to reuse the engine. |
| UOW04-SCOPE-04 | Built-in rules and extension rule packs must use the same registry contract. | Supports plugin-friendly extensibility. |
| UOW04-SCOPE-05 | Concrete AI provider calls are out of scope for this unit. | Provider adapters and policy are handled by UOW-05/UOW-06. |

## Rule Registry Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW04-RULE-01 | Every transformation rule must have a stable `ruleId`, phase, priority, and declared scope. | Enables deterministic ordering and traceability. |
| UOW04-RULE-02 | Rule ordering must be deterministic by phase, dependency, priority, and `ruleId`. | Prevents nondeterministic conversion output. |
| UOW04-RULE-03 | Conflicting rules must be detected before execution. | Prevents ambiguous conversion behavior. |
| UOW04-RULE-04 | Rules must not mutate input source artifacts in place. | Preserves idempotence and replayability. |
| UOW04-RULE-05 | Rules must emit structured diagnostics for unsupported or lossy mappings. | Prevents silent behavior drift. |
| UOW04-RULE-06 | Rule results must include source refs, generated refs, or explicit synthetic-origin markers. | Supports traceability and reporting. |

## Component and Template Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW04-COMP-01 | Component conversion maps Angular class evidence into React component draft name, props, state, hooks, imports, and JSX draft. | Supports meaningful component migration. |
| UOW04-COMP-02 | Angular inputs map to React props unless a selected state strategy requires a different representation. | Preserves external component contract intent. |
| UOW04-COMP-03 | Angular outputs and event emitters map to callback props or review-marked event draft fields. | Preserves event intent while surfacing uncertainty. |
| UOW04-COMP-04 | Angular lifecycle hooks map to React hook drafts only when the mapping is supported and traceable. | Avoids unsafe lifecycle guesses. |
| UOW04-TEMPLATE-01 | Supported template bindings, events, and structural directives map to JSX draft structures. | Produces useful target draft artifacts. |
| UOW04-TEMPLATE-02 | Unsupported template syntax must produce manual-review diagnostics and remain attached to the partial draft. | Keeps unresolved conversion visible. |
| UOW04-TEMPLATE-03 | Template expressions must not be executed during conversion. | Treats source as untrusted input. |
| UOW04-FORM-01 | Forms and two-way bindings must be mapped only when enough evidence exists to preserve behavior. | Prevents incorrect form behavior. |
| UOW04-FORM-02 | Uncertain forms and two-way bindings must produce manual-review diagnostics. | Makes risky conversion explicit. |

## Service, DI, Routing, and State Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW04-SERVICE-01 | Angular services map to service modules, hooks, or context drafts according to source evidence and selected target strategy. | Preserves service intent without forcing global singletons. |
| UOW04-DI-01 | DI tokens and provider scopes must be represented explicitly in service/DI drafts. | Prevents hidden dependency behavior. |
| UOW04-DI-02 | Ambiguous provider scope must produce manual-review diagnostics. | Avoids unsafe dependency mapping. |
| UOW04-ROUTE-01 | Angular route evidence maps to route drafts through a dedicated route strategy adapter. | Keeps routing target choices explicit. |
| UOW04-ROUTE-02 | Guards, resolvers, lazy routes, redirects, and dynamic route targets must be preserved as draft evidence or review diagnostics. | Prevents route behavior from disappearing. |
| UOW04-STATE-01 | State artifacts map through a selected state strategy adapter. | Supports multiple React state choices. |
| UOW04-STATE-02 | Unsupported state evidence must produce review markers rather than being dropped. | Maintains conversion accountability. |

## Manual Review and Diagnostic Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW04-DIAG-01 | Diagnostics must use UOW-01 severity values: `info`, `warning`, `error`, `manual-review`, or `security-blocker`. | Preserves shared diagnostic semantics. |
| UOW04-DIAG-02 | Uncertain, lossy, dynamic, or unsupported mappings must use `manual-review` severity unless they block valid draft construction. | Keeps reviewable issues distinct from fatal failures. |
| UOW04-DIAG-03 | Diagnostics must include stable code, safe message, source refs where available, generated refs where available, and tags. | Supports reporting and remediation. |
| UOW04-DIAG-04 | Raw sensitive source snippets must not appear in diagnostics or report-facing strings. | Reduces leakage risk. |
| UOW04-DIAG-05 | Partial drafts must preserve diagnostic refs and source identity. | Enables Web UI review and report traceability. |

## Handoff and Traceability Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW04-HANDOFF-01 | Transformation output must include target drafts, conversion traces, diagnostics, and pass summaries. | Gives downstream units complete conversion evidence. |
| UOW04-HANDOFF-02 | Every generated target draft must include trace evidence. | Enables user review and report reconstruction. |
| UOW04-HANDOFF-03 | Draft ordering must be deterministic. | Stabilizes generated output, reports, and tests. |
| UOW04-HANDOFF-04 | UOW-04 must not write final React files. | Keeps ownership with UOW-07. |
| UOW04-HANDOFF-05 | UOW-04 must preserve manual-review items for UOW-09 and UOW-11. | Enables review workflows. |

## Validation Rules

| Rule ID | Rule | Validation |
|---|---|---|
| UOW04-VALIDATION-01 | Transformation request must include source model or IR refs, graph refs, target framework, and target strategy. | Reject missing required inputs with blocking diagnostics. |
| UOW04-VALIDATION-02 | Rule registry must have no duplicate rule IDs. | Reject invalid registry state. |
| UOW04-VALIDATION-03 | Rule dependencies must reference known active rules. | Reject dangling rule dependencies. |
| UOW04-VALIDATION-04 | Rule conflicts must be resolved before execution. | Reject ambiguous conversion order. |
| UOW04-VALIDATION-05 | Draft outputs must validate trace coverage and deterministic ordering. | Reject invalid draft artifact sets. |
| UOW04-VALIDATION-06 | Diagnostics must contain safe display strings. | Prevent raw sensitive values in user-facing output. |

## PBT Property Requirements

| Property ID | Property | Category |
|---|---|---|
| UOW04-PBT-01 | Rule ordering is deterministic for equivalent registries. | Invariant |
| UOW04-PBT-02 | Rule selection is stable for equivalent conversion contexts. | Invariant |
| UOW04-PBT-03 | Conversion is idempotent for equivalent normalized input. | Idempotence |
| UOW04-PBT-04 | Draft ordering is deterministic. | Invariant |
| UOW04-PBT-05 | Every draft has trace evidence or explicit synthetic origin. | Invariant |
| UOW04-PBT-06 | Unsupported mappings produce diagnostics or review markers. | Invariant |
| UOW04-PBT-07 | Diagnostic normalization preserves severity and stable codes. | Invariant |
| UOW04-PBT-08 | Conflicting rule registry states never execute. | Stateful / invariant |
| UOW04-PBT-09 | Partial conversion preserves source identity. | Invariant |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | UOW-04 functional design defines transformation logic and artifacts, not deployed storage resources. |
| SECURITY-03 | Compliant | Diagnostics and review markers are safe and structured; concrete logging remains in orchestration/reporting/UI units. |
| SECURITY-05 | Compliant | Transformation requests, registry state, draft outputs, traces, and diagnostics require validation. |
| SECURITY-10 | N/A | Dependency pinning and vulnerability scanning are handled during NFR Requirements, Code Generation, and Build/Test. |
| SECURITY-11 | Compliant | The design avoids execution of Angular expressions, guards, services, generated code, or provider calls during transformation. |
| SECURITY-13 | Compliant | Source-model input is treated as untrusted data and transformed through validated structured rules. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Testable properties are identified for rule ordering, conversion idempotence, trace coverage, diagnostics, conflicts, and partial drafts. |
| PBT-02 | N/A | Round-trip properties are not primary for UOW-04 functional design; draft serialization may be considered in Code Generation. |
| PBT-03 | Compliant | Draft trace coverage, deterministic ordering, unsupported mapping preservation, and registry integrity invariants are documented. |
| PBT-04 | Compliant | Conversion idempotence is identified as a blocking property candidate. |
| PBT-05 | N/A | No independent oracle is defined in functional design; reference fixtures may be added during implementation. |
| PBT-06 | Compliant | Conflicting rule registry states are identified as stateful candidates. |
| PBT-07 | N/A | Generator implementation belongs to Code Generation. |
| PBT-08 | N/A | Seed/reproducibility belongs to Code Generation and Build/Test. |
| PBT-09 | N/A | Framework selection is already standardized on fast-check/Vitest by earlier units. |
| PBT-10 | Compliant | Critical transformation paths require example-based and property-based tests in later implementation. |

## Blocking Findings

- **Security**: None.
- **PBT**: None.

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
