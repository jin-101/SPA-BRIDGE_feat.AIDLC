# SPA-Bridge Requirements

## Intent Analysis

- **Source Request**: Start the AIDLC three-phase workflow based on the project root `requirements.md`.
- **Project**: SPA-Bridge
- **Request Type**: New Project
- **Scope Estimate**: System-wide
- **Complexity Estimate**: Complex
- **Requirements Depth**: Comprehensive
- **Workspace Type**: Greenfield

## Product Summary

SPA-Bridge is an AI-assisted source-to-source transpiler that converts Angular 15+ single-page applications into React 18+ projects. The system combines deterministic AST-based rules with LLM-assisted refinement to preserve application behavior, reduce framework migration cost, and produce buildable React output.

## MVP Scope

The initial release must target the full Angular 15+ to React 18+ conversion workflow:

- Component conversion from Angular class/decorator patterns to React functional components.
- Template, style, and logic consolidation or relocation into React conventions.
- Angular binding conversion to React state and event handling.
- Angular service, dependency injection, and lifecycle conversion.
- Routing conversion.
- NgRx and other state management conversion to a selected React-side strategy.
- Target project boilerplate generation.
- AI-assisted refinement for difficult mappings.
- Self-correction loop for TypeScript, lint, formatting, and build failures.

## User Interfaces

SPA-Bridge must provide both:

- **CLI**: Primary automation interface for local, CI, and batch conversion workflows.
- **Web UI**: Visual workflow for project upload/selection, conversion review, reports, and guided remediation.

The CLI and Web UI should share the same core conversion engine and configuration model.

## Functional Requirements

### FR-001 Project Input and File Discovery

The system must accept an Angular project root and scan its file tree.

Acceptance criteria:
- Detect Angular project structure, including modules, components, templates, styles, services, routing, and state management files.
- Build a dependency graph across TypeScript, HTML, SCSS/CSS, routing, module, and service files.
- Report unsupported or ambiguous files with actionable diagnostics.

### FR-002 Static Analysis and AST Extraction

The system must parse Angular/TypeScript source into structured intermediate representations.

Acceptance criteria:
- Use TypeScript Compiler API, Babel, or equivalent structured parsers.
- Extract decorators, class members, imports, providers, lifecycle methods, inputs, outputs, bindings, and template references.
- Preserve source locations for diagnostics and traceability.

### FR-003 Intermediate Representation

The system must normalize source project information into a framework-aware intermediate representation.

Acceptance criteria:
- Represent components, templates, styles, services, routes, dependency injection relationships, state stores, and external dependencies.
- Support future source/target framework pairs by isolating Angular-specific and React-specific logic behind internal interfaces.
- Maintain traceability from generated artifacts back to original source files.

### FR-004 Component Conversion

The system must convert Angular components to React functional components.

Acceptance criteria:
- Convert `@Component` metadata into React component structure.
- Convert class properties and methods into function scope, hooks, handlers, and helper functions.
- Convert Angular templates into JSX/TSX.
- Reconcile separate template/style/logic files into the chosen React output structure.

### FR-005 Binding, Event, and Form Conversion

The system must convert Angular template binding semantics into React semantics.

Acceptance criteria:
- Convert two-way bindings such as `[(ngModel)]` into React state and change handlers.
- Convert property bindings such as `[value]` into JSX props.
- Convert event bindings such as `(click)` into React event handlers.
- Preserve form validation intent where it can be inferred.

### FR-006 State Management Conversion

The system must convert Angular service and NgRx state patterns into React-side state management.

Acceptance criteria:
- Select target state management automatically based on source project complexity.
- Support React Context API, Redux Toolkit, or Zustand as candidate targets.
- Document the selected target and rationale in conversion reports.
- Preserve action, reducer, selector, effect, and service semantics where practical.

### FR-007 Dependency Injection and Lifecycle Conversion

The system must convert Angular dependency injection and lifecycle patterns.

Acceptance criteria:
- Convert constructor injection to hook-based access, module imports, provider adapters, or explicit dependency wiring.
- Convert `ngOnInit`, `ngOnChanges`, and `ngOnDestroy` to appropriate `useEffect` patterns.
- Preserve cleanup behavior and subscription lifecycle semantics.

### FR-008 Routing Conversion

The system must convert Angular routing configuration to React routing conventions.

Acceptance criteria:
- Parse Angular route definitions, nested routes, guards, lazy-loaded modules, and route parameters where possible.
- Generate equivalent React route configuration for the selected target stack.
- Report route guard or lazy-loading patterns requiring manual review.

### FR-009 AI-Assisted Mapping and Refinement

The system must use LLM assistance for transformations that deterministic rules cannot safely handle.

Acceptance criteria:
- Prefer local/internal LLM providers by default.
- Provide optional adapters for external commercial LLM APIs.
- Maintain provider abstraction so LLM provider choice does not leak into core conversion logic.
- Send minimal, structured context to the LLM.
- Record AI-assisted decisions in conversion reports.

### FR-010 Sensitive Information Masking

The system must include a masking pipeline before any external LLM call.

Acceptance criteria:
- Detect and mask IP addresses, URLs, secrets, proprietary names, and configurable customer-specific patterns.
- Restore masked values after code generation where required.
- Treat masking as mandatory before external LLM calls.
- Keep local/internal LLM mode compatible with the same masking pipeline when configured.

### FR-011 Self-Correction Loop

The system must automatically inspect and correct generated output.

Acceptance criteria:
- Run TypeScript compilation, linting, formatting checks, and build checks as configured.
- Feed structured error information back into deterministic fixers or AI-assisted refinement.
- Limit correction iterations with configurable maximum attempts.
- Produce a final report with unresolved errors and manual remediation hints.

### FR-012 Target Project Generation

The system must generate a React target project.

Acceptance criteria:
- Let users choose the target project type per conversion.
- Default to Vite + React + TypeScript when no choice is provided.
- Generate `package.json`, `tsconfig.json`, build configuration, lint configuration, formatter configuration, and entry points as needed.
- Support future target generators through internal abstraction.

### FR-013 Formatting and Static Quality

Generated code must follow target framework conventions.

Acceptance criteria:
- Apply Prettier formatting.
- Apply ESLint or equivalent static checks.
- Keep generated code deterministic where possible.
- Separate generated files, reports, and manual-review stubs clearly.

### FR-014 Conversion Reporting

The system must produce conversion reports.

Acceptance criteria:
- Summarize converted files, generated files, unresolved mappings, AI-assisted decisions, errors, and manual review items.
- Include source-to-output traceability.
- Include quality gate results.

## Non-Functional Requirements

### NFR-001 Conversion Accuracy

The first release must target at least 85% automated conversion success for supported sample projects.

Measurement:
- Use a combined quality gate: TypeScript compilation, lint/format checks, primary tests, and sample project build success.

### NFR-002 Performance

The system should complete conversion for projects with 100+ components within 10 minutes, including AI processing time, under documented reference conditions.

### NFR-003 Extensibility

The initial implementation should focus on Angular to React while keeping internal interfaces plugin-friendly.

Required extensibility boundaries:
- Source analyzer interface.
- Intermediate representation.
- Mapping/rule engine interface.
- LLM provider interface.
- Target generator interface.
- Reporting interface.

### NFR-004 Security and Privacy

The system must support zero-outbound operation and secure external-provider operation.

Requirements:
- Local/internal LLM mode is the preferred design baseline.
- External LLM providers must be optional adapters.
- External provider use must require masking and enterprise data opt-out configuration.
- Secrets and sensitive code content must not be logged.

### NFR-005 Testability

The system must support both example-based tests and property-based tests.

Requirements:
- Property-based testing is enabled as a blocking extension for applicable implementation stages.
- TypeScript code should use `fast-check` or another approved PBT framework unless a later tech-stack decision selects a different primary language or framework.
- PBT must complement, not replace, example-based regression tests.

### NFR-006 Supply Chain and Build Integrity

Dependencies and build tooling must be controlled and auditable.

Requirements:
- Use exact dependency versions or lock files.
- Include vulnerability scanning in build/test instructions or CI.
- Avoid unpinned production images and `latest` tags.
- Generate SBOM for production packaging.

### NFR-007 Observability

Operational and conversion activities must be observable without exposing sensitive data.

Requirements:
- Use structured logging.
- Include correlation IDs for conversion runs.
- Avoid logging source secrets, tokens, PII, or proprietary identifiers.
- Capture security-relevant events and conversion failures for review.

## Security Requirements

Security Baseline is enabled as a blocking extension. The following rules are applicable to the product requirements:

- **SECURITY-03**: Structured application logging without sensitive data.
- **SECURITY-05**: Input validation for CLI arguments, Web UI inputs, API payloads, and project paths.
- **SECURITY-08**: Application access control for Web UI/API endpoints if multi-user or authenticated usage is implemented.
- **SECURITY-09**: Secure error handling and production hardening.
- **SECURITY-10**: Dependency pinning, vulnerability scanning, trusted sources, SBOM, and CI/CD integrity.
- **SECURITY-11**: Secure design, rate limiting for public endpoints, and abuse-case analysis.
- **SECURITY-12**: Credential management if authentication is implemented.
- **SECURITY-13**: Safe deserialization, plugin/artifact integrity, and auditability.
- **SECURITY-14**: Alerting, monitoring, log integrity, and log retention for deployed modes.
- **SECURITY-15**: Fail-safe exception handling for file I/O, external tools, LLM calls, and generated-code validation.

Rules that depend on deployment architecture, network intermediaries, persistent stores, or infrastructure resources will be evaluated in later design and infrastructure stages.

## Property-Based Testing Requirements

Property-Based Testing is enabled as a blocking extension.

Applicable requirement areas:
- Parser and formatter round-trips where invertible transformations exist.
- Masking and unmasking round-trips.
- Intermediate representation serialization/deserialization.
- Mapping invariants such as preserving component count, route identity, dependency references, and source traceability.
- Idempotent normalization and formatting operations.
- Oracle/model-based tests where deterministic rule output can be compared with reference fixtures or simplified models.

PBT requirements must be refined during Functional Design and Code Generation planning for each unit.

## Constraints

- Third-party Angular libraries such as Angular Material and NgRx may not map perfectly to React equivalents.
- LLM token/cost usage must be minimized through AST-first deterministic processing.
- Local/internal LLM mode must be prioritized.
- The project starts from a requirements-only greenfield workspace.
- Documentation must live under `aidlc-docs/`; application code must live in the workspace root.

## Milestones

1. Architecture Design and Prompt Engineering.
2. Core AST Parser and Rule Engine Development.
3. AI Hybrid Translation Engine Development.
4. Self-Correction and Linting QA.
5. E2E Testing and Evaluation.

## Requirements Traceability

| Source | Requirement IDs |
|---|---|
| Root requirements.md section 3.1 | FR-001, FR-002, FR-003 |
| Root requirements.md section 3.2 | FR-004, FR-005, FR-006, FR-007 |
| Root requirements.md section 3.3 | FR-009, FR-011 |
| Root requirements.md section 3.4 | FR-012, FR-013 |
| Root requirements.md section 4 | NFR-001, NFR-002, NFR-003, NFR-004 |
| Root requirements.md section 4.2 | FR-010, NFR-004, Security Requirements |
| User verification answers | MVP Scope, User Interfaces, FR-006, FR-009, FR-010, FR-012, NFR-005 |

## Extension Compliance Summary

### Security Baseline

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | No persistence store or infrastructure selected in Requirements Analysis. |
| SECURITY-02 | N/A | No network intermediary selected in Requirements Analysis. |
| SECURITY-03 | Compliant | Structured logging and sensitive-data exclusion are captured as requirements. |
| SECURITY-04 | N/A | HTML-serving endpoints are not yet designed. Applies if Web UI is implemented. |
| SECURITY-05 | Compliant | Input validation is captured for CLI, Web UI, API, and project path inputs. |
| SECURITY-06 | N/A | IAM and access policies are not yet designed. |
| SECURITY-07 | N/A | Network architecture is not yet designed. |
| SECURITY-08 | Compliant | Access control is captured for Web UI/API endpoints where applicable. |
| SECURITY-09 | Compliant | Hardening and safe error handling are captured as requirements. |
| SECURITY-10 | Compliant | Dependency pinning, scanning, SBOM, and CI/CD integrity are captured as requirements. |
| SECURITY-11 | Compliant | Secure design and abuse-case analysis are captured as requirements. |
| SECURITY-12 | N/A | Authentication is not confirmed as a required feature yet. Applies if implemented. |
| SECURITY-13 | Compliant | Safe deserialization, plugin/artifact integrity, and auditability are captured. |
| SECURITY-14 | Compliant | Monitoring, alerting, retention, and log integrity are captured for deployed modes. |
| SECURITY-15 | Compliant | Fail-safe exception handling is captured for I/O, LLM, tooling, and validation paths. |

### Property-Based Testing

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | N/A | Applies during Functional Design. |
| PBT-02 | Compliant | Round-trip candidates are identified at requirements level. |
| PBT-03 | Compliant | Mapping invariant candidates are identified at requirements level. |
| PBT-04 | Compliant | Idempotent normalization/formatting candidates are identified at requirements level. |
| PBT-05 | Compliant | Oracle/model-based test candidates are identified at requirements level. |
| PBT-06 | N/A | Stateful components are not yet designed. |
| PBT-07 | N/A | Generator design applies during Functional Design and Code Generation. |
| PBT-08 | N/A | Reproducibility and CI details apply during Code Generation and Build/Test. |
| PBT-09 | Compliant | TypeScript PBT framework expectation is captured, pending tech-stack finalization. |
| PBT-10 | Compliant | PBT is explicitly complementary to example-based tests. |

## Open Items For Later Stages

- Decide exact implementation language and package structure.
- Decide Web UI authentication requirements.
- Select route conversion target library.
- Define detailed plugin boundary interfaces.
- Define sample Angular projects and benchmark conditions.
- Define exact PBT generators and properties per unit during Functional Design.

