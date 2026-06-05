# UOW-04 Tech Stack Decisions

## Decision Summary

| Area | Decision | Status |
|---|---|---|
| Package | `packages/transform-angular-react` | Approved |
| Primary Language | TypeScript | Approved |
| Runtime Dependencies | Minimal dependencies beyond internal contracts and validation | Approved |
| Rule Engine | In-package deterministic rule registry and execution planner | Approved |
| Validation | Reuse UOW-01 schema-first validation patterns | Approved |
| Testing | Vitest plus fast-check | Approved |
| Benchmarking | Vitest-compatible or script-based generated fixture benchmarks | Approved |
| AI Handoff | Provider-neutral metadata only; no provider calls in UOW-04 | Approved |

## Runtime Dependency Decision

| Decision | Rationale |
|---|---|
| Minimize runtime dependencies beyond UOW-01/core contracts and validation. | UOW-04 is core transformation logic. Keeping dependencies small improves auditability, deterministic behavior, supply-chain posture, and portability across CLI/Web/orchestration consumers. |

Implementation implications:
- Use TypeScript and internal package contracts first.
- Reuse UOW-01 validation/result/diagnostic patterns.
- Avoid introducing a generic external rule-engine framework by default.
- Exact-pin any approved runtime dependency during Code Generation.
- Document any later dependency expansion as a design change.

## Rule Registry Decision

| Decision | Rationale |
|---|---|
| Implement an in-package deterministic rule registry and execution planner. | The project needs explicit phase/dependency/priority/ruleId ordering, conflict fail-fast behavior, and traceable rule output. A local registry keeps the behavior easy to test and adapt. |

Ordering requirements:
- Sort by phase.
- Resolve declared dependencies before priority sorting.
- Sort by priority within phase and dependency level.
- Use `ruleId` as a deterministic tie-breaker.
- Fail fast on duplicate rule IDs, dangling dependencies, cycles, and unresolved conflicts.

## Validation Decision

| Area | Decision |
|---|---|
| Request validation | Require source/IR refs, graph refs, target framework, target strategy, and active rule pack configuration. |
| Registry validation | Reject duplicate IDs, dangling dependencies, dependency cycles, and unresolved conflicts. |
| Draft validation | Require schema validation, trace coverage, deterministic ordering, and safe review markers. |
| Diagnostic validation | Require stable code, severity, safe message, refs where available, and no raw snippets. |

## Performance and Benchmark Decision

| Scenario | Requirement |
|---|---|
| 100+ component conversion | Typical conversion target is 30 seconds or less under documented reference conditions. |
| 500+ component conversion | Benchmark fixture and recorded baseline are required. |
| Memory usage | Bounded draft/trace models and no raw source text retention are required. |
| Rule execution | Phase/entity scoped execution is preferred to enable future incremental conversion. |

## AI Handoff Decision

| Decision | Rationale |
|---|---|
| UOW-04 produces provider-neutral difficult-mapping metadata only. | This preserves clean boundaries. UOW-05 owns policy/masking and UOW-06 owns concrete provider adapters, so UOW-04 must not directly call local or external providers. |

Allowed:
- Structured difficult mapping records.
- Source refs and generated refs.
- Rule IDs, diagnostic codes, and safe context categories.
- Confidence/review metadata.

Not allowed:
- Direct local provider calls.
- Direct external provider calls.
- Provider-specific prompt execution.
- Raw source snippets in provider metadata by default.

## Observability Decision

| Output | Decision |
|---|---|
| Pass summary | Required as safe structured output. |
| Rule execution counts | Required by phase and rule ID. |
| Diagnostic counts | Required by severity and category. |
| Review-item counts | Required by category. |
| Trace coverage summary | Required for draft accountability. |
| Raw source evidence in logs | Not allowed. |

## Test Stack Decision

| Test Area | Decision |
|---|---|
| Example-based tests | Required for common component, template, lifecycle, service, DI, routing, and state conversion fixtures. |
| Property-based tests | Required for rule ordering, conversion idempotence, draft ordering, trace coverage, and unsupported mapping preservation. |
| PBT framework | fast-check with Vitest, aligned with UOW-01. |
| Performance fixtures | Generated or checked-in benchmark fixtures for 100+ and 500+ component-equivalent source models. |
| Invalid-state tests | Required for invalid request, duplicate rules, dangling dependencies, cycles, and conflicts. |

## Rejected Options

| Option | Reason |
|---|---|
| Broad runtime utility dependencies | Conflicts with the approved minimal dependency policy and increases supply-chain surface. |
| External generic rule-engine framework | Adds indirection and dependency risk before the local rule model has proven insufficient. |
| Registry order based on registration order | Too fragile for plugin-friendly deterministic conversion. |
| Warning-only rule conflicts | Allows ambiguous conversion behavior to proceed. |
| Raw snippets in diagnostics | Conflicts with privacy and safe reporting requirements. |
| Direct provider calls from UOW-04 | Violates security/provider boundaries assigned to UOW-05 and UOW-06. |
| Draft validation deferred entirely to UOW-07 | Would let invalid transformation artifacts cross unit boundaries. |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Diagnostic and observability output must be safe and structured. |
| SECURITY-05 | Compliant | Requests, registry state, drafts, traces, and diagnostics require validation. |
| SECURITY-10 | Compliant | Runtime dependencies must remain minimal and exact-pinned. |
| SECURITY-11 | Compliant | Provider calls and code execution are isolated away from UOW-04. |
| SECURITY-13 | Compliant | Source/IR artifacts are treated as untrusted input. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | NFRs carry forward identified properties from functional design. |
| PBT-03 | Compliant | Rule and draft invariants are explicit requirements. |
| PBT-04 | Compliant | Conversion idempotence is an explicit requirement. |
| PBT-06 | Compliant | Invalid registry state is suitable for stateful/model-based PBT. |
| PBT-09 | Compliant | fast-check/Vitest remains selected. |
| PBT-10 | Compliant | Example-based conversion fixtures complement PBT requirements. |

## Content Validation

- No Mermaid diagrams are included.
- No ASCII diagrams are included.
- Markdown tables and code identifiers were checked for parsing compatibility.
