# Functional Design Plan - UOW-06 AI Provider Adapters and Refinement

## Unit Context

- **Unit**: UOW-06 AI Provider Adapters and Refinement
- **Primary Package(s)**: `packages/adapters-ai`
- **Primary Owner Role**: Architect
- **Reviewer Roles**: Security Reviewer, Migration Engineer, Application Developer
- **Primary Story**: US-007
- **Supporting Stories**: US-009, US-011, US-014
- **Dependencies**: UOW-01 Core Model and Ports Foundation, UOW-05 Security, Masking, and Provider Policy

## Functional Design Tasks

- [x] Define provider registry responsibilities and provider lifecycle.
- [x] Define local/internal provider adapter behavior.
- [x] Define optional external provider adapter behavior behind security policy gates.
- [x] Define mock provider behavior for deterministic tests.
- [x] Define prompt/context minimization and safe response handling.
- [x] Define refinement request/result entities.
- [x] Define failure, timeout, retry, and manual-review handoff rules.
- [x] Define provider audit evidence and traceability boundaries.
- [x] Define PBT candidates for provider selection and context minimization.
- [x] Generate functional design artifacts after answers are validated.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should be the primary provider strategy for the initial UOW-06 implementation?

A) Local/internal provider first, external provider support behind explicit opt-in and UOW-05 policy gate
B) External provider first, local/internal provider as fallback
C) Mock provider only for now, defer real provider adapters
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should provider adapters receive conversion context?

A) Only provider-neutral, minimized, structured mapping requests from UOW-04 after UOW-05 policy/masking evaluation
B) Raw source snippets and transformation draft objects directly from UOW-04
C) Full project files so providers can infer context independently
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
What should happen when the policy gate blocks a provider call?

A) Return a structured blocked result with safe diagnostics and manual-review handoff
B) Throw an exception and stop the whole conversion
C) Retry with a different provider automatically
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
How should provider responses be represented?

A) As structured refinement suggestions with confidence, safe rationale, trace refs, and AI-assisted provenance
B) As raw text only, passed downstream for later parsing
C) As final source code patches applied directly by the provider adapter
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
How should provider registry selection work?

A) Deterministic registry using provider id, mode, capability tags, priority, and policy readiness
B) First registered provider wins
C) Provider chosen randomly to spread load
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should provider failures, timeouts, and malformed responses be handled?

A) Fail closed for unsafe provider states, preserve partial conversion, and emit manual-review diagnostics
B) Keep retrying until a response is produced
C) Silently ignore failures
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
What level of mock provider support is needed?

A) Deterministic mock provider with scripted responses, failure injection, and audit-safe evidence
B) Simple mock provider that always returns a fixed string
C) No mock provider
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
How should external provider adapters be implemented in this unit?

A) Provide a generic external adapter boundary and disabled-by-default sample adapter shape, without hardcoding a commercial provider
B) Implement one concrete commercial provider as the default
C) Exclude external provider adapter boundaries from this unit
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
What should the refinement service own?

A) Provider selection, policy-gated invocation, response validation, diagnostic creation, and safe result packaging
B) Transformation rule execution and React target code generation
C) Security masking internals and token vault storage
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
What should be the blocking PBT focus for this unit?

A) Provider selection determinism, context minimization, fail-closed decisions, response validation, and mock provider reproducibility
B) Only example-based tests
C) UI interaction properties
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Markdown content uses plain text, simple lists, and parse-safe tables are not required.
