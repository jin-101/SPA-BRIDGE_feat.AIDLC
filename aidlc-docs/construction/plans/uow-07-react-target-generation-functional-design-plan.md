# Functional Design Plan - UOW-07 React Target Generation

## Unit Context

- **Unit**: UOW-07 React Target Generation
- **Primary Package(s)**: `packages/target-react`
- **Primary Owner Role**: Application Developer
- **Reviewer Roles**: Migration Engineer, Architect, Security Reviewer
- **Primary Story**: US-002
- **Supporting Stories**: US-005, US-006, US-011, US-013, US-014
- **Dependencies**: UOW-01 Core Model and Ports Foundation, UOW-04 Transformation Rule Engine and Converters, UOW-05 Security, Masking, and Provider Policy, UOW-06 AI Provider Adapters and Refinement

## Functional Design Tasks

- [x] Define React target generation request and result model.
- [x] Define target project type selection and default Vite + React + TypeScript behavior.
- [x] Define generated project structure, file refs, and deterministic write plan.
- [x] Define React component, route, service, state, and style draft materialization rules.
- [x] Define state strategy output behavior for React Context API, Redux Toolkit, and Zustand.
- [x] Define routing output behavior and route guard/manual-review preservation.
- [x] Define package metadata, tsconfig, lint, formatting, and entry file generation rules.
- [x] Define overwrite, conflict, and idempotent regeneration behavior.
- [x] Define diagnostics, traceability, and reporting handoff.
- [x] Generate functional design artifacts after answers are validated.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should UOW-07 generate as the default target project?

A) Vite + React 18 + TypeScript project with deterministic package/config/source layout
B) Next.js project by default
C) Only individual `.tsx` files without project scaffolding
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should target project type selection work?

A) Use an explicit target strategy registry with Vite React TypeScript as the default and future generators behind strategy interfaces
B) Hardcode Vite behavior directly in the writer with no strategy registry
C) Ask the user for every output file and config decision during generation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
How should UOW-07 consume UOW-04 transformation output?

A) Consume React-oriented target drafts and traceable conversion artifacts, then materialize final project files
B) Re-read raw Angular files and perform transformation again
C) Ignore drafts and generate placeholder React files only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
How should generated file writes be represented?

A) Produce a deterministic write plan with file refs, content hashes, source traces, conflict policy, and diagnostics before writing
B) Write files immediately as each draft is processed
C) Only return strings to the caller and leave all file planning to CLI/Web UI
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
How should overwrite and conflict behavior work?

A) Fail closed on unsafe output paths, preserve existing files by default, and require explicit overwrite policy for replacement
B) Always overwrite target files to keep generation simple
C) Skip conflict handling until CLI implementation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should state strategy generation be handled?

A) Generate strategy-specific output adapters for React Context API, Redux Toolkit, and Zustand, with selected strategy rationale preserved
B) Always generate React Context API regardless of source state complexity
C) Defer all state output to manual review files
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
How should routing generation be handled?

A) Generate React Router-compatible route modules from route drafts while preserving guard/lazy-load uncertainties as manual-review diagnostics
B) Generate route comments only and skip route modules
C) Use browser location checks without a routing library
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
How should unsupported or uncertain target materialization behave?

A) Preserve partial generated output, emit manual-review diagnostics, and maintain traceability to the source draft
B) Drop unsupported drafts silently
C) Fail the entire generation for any unsupported draft
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
How should package/config generation handle dependencies?

A) Generate a minimal allowlisted dependency set for React, React DOM, Vite, TypeScript, and selected state/routing libraries
B) Copy all Angular dependencies into the React package metadata
C) Let generated source imports decide dependencies later
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
What should be the blocking PBT focus for this unit?

A) Write-plan determinism, path containment, idempotent generation, dependency selection stability, and trace coverage
B) Only example-based tests for a few generated files
C) UI interaction properties
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved Functional Design Focus

- **Default Target**: Vite + React 18 + TypeScript.
- **Target Strategy**: Explicit target strategy registry with future generator interfaces.
- **Input Boundary**: UOW-04 React-oriented drafts and traceable conversion artifacts.
- **Output Boundary**: Deterministic write plan and final target project files.
- **Conflict Policy**: Safe path containment, preserve-by-default, explicit overwrite policy.
- **State Strategy**: React Context API, Redux Toolkit, and Zustand adapters.
- **Routing Strategy**: React Router-compatible route modules with guard/lazy-load review preservation.
- **Manual Review**: Partial output, diagnostics, and traceability for uncertain materialization.
- **Dependency Policy**: Minimal allowlisted React/Vite/strategy dependencies.
- **PBT Focus**: Write-plan determinism, path containment, idempotent generation, dependency selection stability, and trace coverage.

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Markdown uses plain lists and parse-safe question blocks.
