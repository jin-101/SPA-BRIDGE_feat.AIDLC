# Functional Design Plan - UOW-03 Angular Source Analysis

## Unit Context

- **Unit**: UOW-03 Angular Source Analysis
- **Primary Package**: `packages/source-angular`
- **Primary Owner Role**: Application Developer
- **Reviewer Roles**: Migration Engineer, Architect
- **Primary Stories**: US-003
- **Supporting Stories**: US-004, US-005, US-006, US-012
- **Prerequisites**: Units Generation is complete; UOW-01 foundational contracts and UOW-02 orchestration are available.

## Purpose

Design the Angular project scanner, TypeScript and template parsing boundaries, dependency graph construction, source modeling, and diagnostic emission rules for Angular input projects.

## Checklist

- [x] Load unit definition.
- [x] Load story map and dependencies.
- [x] Confirm Functional Design is required for this unit.
- [x] Create functional design plan with questions.
- [x] Wait for user answers to all `[Answer]:` tags.
- [x] Validate answers for completeness, contradictions, and ambiguity.
- [x] Resolve follow-up questions if needed.
- [x] Generate `business-logic-model.md`.
- [x] Generate `business-rules.md`.
- [x] Generate `domain-entities.md`.
- [x] Validate PBT property candidates for UOW-03.
- [x] Present Functional Design completion message for review.

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved Functional Design Choices

- **Project Scope**: Application workspaces first; library/workspace variants are later extensions.
- **File Scope**: Ignore files outside main source unless they are explicit config, routing, template, or style dependencies.
- **TypeScript Parsing**: Parse AST, decorators, imports/exports, class members, and basic symbol references.
- **Template and Style Analysis**: Parse enough to map component bindings and external references.
- **Dependency Graph**: Include component/module/service/routing relationships plus file-level source dependencies.
- **Diagnostics**: Emit structured diagnostics and continue scanning when possible.
- **Partial Resolution**: Preserve partial models with diagnostics.
- **Downstream Handoff**: Produce source model and graph artifacts for transformation units.
- **Recovery**: Fail-soft for per-file issues; fail-fast only for fatal workspace/config corruption.
- **PBT Focus**: Scanner/parsing round-trips, graph invariants, and diagnostics stability.

## Draft Design Focus

- Angular workspace and project discovery.
- File inventory and classification for components, modules, standalone components, directives, pipes, services, routes, and state files.
- TypeScript AST parsing, decorator extraction, and symbol indexing.
- Template, style, and route file association.
- Dependency graph assembly for source relationships.
- Diagnostic emission for missing files, invalid decorators, unsupported patterns, and parse failures.
- Source-model handoff into downstream transformation units.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
`packages/source-angular` should initially support which Angular project scope?

A) Application workspaces first, with library/workspace variants treated as later extensions
B) Application and library workspaces equally from day one
C) Only library projects to keep the scanner narrow
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should the scanner treat files outside the main Angular source tree?

A) Ignore them unless they are explicit project config, routing, or template/style dependencies
B) Index every file in the workspace for maximum coverage
C) Only read files referenced by `angular.json` and nothing else
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
What parsing depth should the TypeScript analyzer use?

A) Parse AST, decorators, imports/exports, class members, and basic symbol references
B) Parse full type checking and semantic resolution against the entire workspace
C) Use regex-based heuristics only for speed
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
How should template and style analysis behave?

A) Parse Angular templates and associated styles enough to map component bindings and external references
B) Capture only file existence and raw text, leaving interpretation to later units
C) Fully evaluate templates as runtime HTML/CSS execution models
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
What should the source dependency graph represent?

A) Component/module/service/routing relationships plus file-level source dependencies
B) Only direct import edges between TypeScript files
C) Only high-level project package dependencies
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should diagnostics be emitted for unsupported or malformed source?

A) Emit structured diagnostics with severity, location, code, and safe message, then continue scanning where possible
B) Stop immediately on the first malformed file
C) Skip diagnostics and rely on downstream validation only
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
What should happen when a component or route cannot be fully resolved?

A) Record a partial model with diagnostics so downstream stages can decide how to proceed
B) Drop the item completely and pretend it was absent
C) Guess the missing relationship and continue without diagnostics
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
How should Angular source analysis hand off data to downstream units?

A) Produce a framework-neutral source model and graph artifacts for transformation units
B) Produce React-shaped drafts directly
C) Keep all data private inside the scanner module
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
Which recovery behavior should the analyzer prefer?

A) Fail-soft for per-file issues, fail-fast only for fatal workspace/config corruption
B) Fail-fast for every parse or resolution problem
C) Always continue regardless of workspace corruption
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
What property-based test focus best fits this unit?

A) Scanner/parsing round-trips, graph invariants, and diagnostics stability
B) UI component rendering properties
C) Provider retry behavior
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated artifacts will use Markdown tables and textual relationships.
