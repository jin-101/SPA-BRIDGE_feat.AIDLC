# SPA-Bridge User Stories

## Story Method

- **Breakdown**: Hybrid journey-based epics plus feature-based stories.
- **Detail Level**: Comprehensive.
- **Priority Labels**: Must, Should, Could.
- **Acceptance Criteria Format**: Given/When/Then plus checklist.
- **Security Handling**: Dedicated Security/Governance epic and relevant acceptance criteria in affected stories.
- **PBT Handling**: Dedicated Quality/PBT story and relevant acceptance criteria in parser, masking, IR, mapping, and validation stories.

## Epic 1: Configure and Start a Conversion

### US-001: Start Conversion From CLI or Web UI

- **Priority**: Must
- **Personas**: Migration Engineer, Project Manager
- **Requirements**: FR-001, FR-012, FR-014, NFR-002
- **Story**: As a Migration Engineer, I want to start an Angular to React conversion from either the CLI or Web UI so that I can use SPA-Bridge in local, CI, and guided review workflows.

Acceptance criteria:
- Given a valid Angular project path, when the user starts conversion from the CLI, then SPA-Bridge creates a conversion run with the selected configuration.
- Given a valid Angular project path or upload, when the user starts conversion from the Web UI, then SPA-Bridge creates the same type of conversion run through the shared engine.
- Given no target project type is selected, when conversion starts, then Vite + React + TypeScript is used as the default target.
- The CLI and Web UI use the same core conversion configuration model.
- The run receives a correlation ID for logs and reports.

Technical notes:
- CLI and Web UI should call a shared application service rather than duplicating conversion logic.
- Validate project paths and request payloads per SECURITY-05.

Security/PBT notes:
- Security: validate all input paths and reject unsafe traversal or malformed payloads.
- PBT: path/config normalization can be tested for idempotence if implemented as pure transformations.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

### US-002: Choose Target Project and State Strategy

- **Priority**: Must
- **Personas**: Migration Engineer, Architect
- **Requirements**: FR-006, FR-012, NFR-003
- **Story**: As a Migration Engineer, I want SPA-Bridge to let me choose the target project type and automatically select state management when appropriate so that generated output matches project needs.

Acceptance criteria:
- Given a target project option is provided, when conversion runs, then SPA-Bridge generates output for that target.
- Given no target project option is provided, when conversion runs, then SPA-Bridge defaults to Vite + React + TypeScript.
- Given source state complexity is detected, when state conversion runs, then SPA-Bridge selects React Context API, Redux Toolkit, or Zustand and records the rationale.
- The selected target and state strategy appear in the conversion report.

Technical notes:
- Target generation and state strategy selection should be separate extension-friendly services.
- Initial implementation remains Angular to React focused while preserving plugin-friendly internal boundaries.

Security/PBT notes:
- Security: target selection must not allow arbitrary package scripts or unsafe templates.
- PBT: state strategy heuristics should have invariant tests around deterministic selection for equivalent source summaries.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

## Epic 2: Analyze Source and Build Intermediate Representation

### US-003: Scan Angular Project Structure

- **Priority**: Must
- **Personas**: Migration Engineer, Application Developer, Architect
- **Requirements**: FR-001, FR-014, NFR-001
- **Story**: As a Migration Engineer, I want SPA-Bridge to scan an Angular project and identify related files so that conversion starts from an accurate source model.

Acceptance criteria:
- Given an Angular project root, when scan runs, then modules, components, templates, styles, services, routes, and state files are detected.
- Given related files are found, when scan completes, then SPA-Bridge builds a dependency graph across TypeScript, HTML, SCSS/CSS, routing, module, and service files.
- Given unsupported or ambiguous files are found, when scan completes, then diagnostics identify the file and reason.
- Scan results are included in the conversion report.

Technical notes:
- Use structured filesystem traversal with ignore rules for build outputs and dependencies.
- Keep source locations for traceability.

Security/PBT notes:
- Security: reject unsafe paths and avoid logging sensitive path segments when configured.
- PBT: graph construction can test invariants such as preserving discovered node count and deterministic ordering.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

### US-004: Parse Angular Source Into Intermediate Representation

- **Priority**: Must
- **Personas**: Migration Engineer, Application Developer, Architect
- **Requirements**: FR-002, FR-003, NFR-003, NFR-005
- **Story**: As an Architect, I want SPA-Bridge to parse Angular source into a framework-aware intermediate representation so that conversion rules and target generation are decoupled.

Acceptance criteria:
- Given Angular TypeScript source, when parsing runs, then decorators, imports, class members, lifecycle methods, inputs, outputs, and providers are extracted.
- Given Angular templates, when parsing runs, then bindings, events, structural directives, and template references are represented.
- Given parsed artifacts, when IR is created, then components, services, routes, state stores, and dependencies are represented with source traceability.
- The IR is suitable for Angular to React conversion without coupling downstream code directly to raw Angular files.

Technical notes:
- Prefer TypeScript Compiler API and structured parsers over string manipulation.
- Define IR serialization for reporting, debugging, and tests.

Security/PBT notes:
- Security: treat source as untrusted input; avoid unsafe deserialization or execution.
- PBT: IR serialization/deserialization should have round-trip tests; parser normalization should preserve key invariants.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

## Epic 3: Convert Framework Concepts

### US-005: Convert Components, Templates, Bindings, and Lifecycle

- **Priority**: Must
- **Personas**: Migration Engineer, Application Developer, Architect
- **Requirements**: FR-004, FR-005, FR-007, NFR-001
- **Story**: As an Application Developer, I want Angular components and templates converted into idiomatic React functional components so that generated code is maintainable.

Acceptance criteria:
- Given an Angular component, when conversion runs, then `@Component` metadata maps to a React component structure.
- Given Angular class properties and methods, when conversion runs, then compatible React state, handlers, hooks, and helpers are generated.
- Given Angular template bindings and events, when conversion runs, then JSX props, React state changes, and event handlers are generated.
- Given lifecycle methods, when conversion runs, then equivalent `useEffect` patterns and cleanup behavior are generated where possible.
- Unsupported mappings produce manual review items rather than silent behavior changes.

Technical notes:
- Preserve source-to-output traceability for generated component code.
- Isolate deterministic mapping rules from AI-assisted refinement.

Security/PBT notes:
- Security: generated code must avoid injecting untrusted HTML without explicit review.
- PBT: mapping invariants can verify component identity, input/output traceability, and deterministic output for equivalent IR.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

### US-006: Convert Services, Dependency Injection, Routing, and State

- **Priority**: Must
- **Personas**: Migration Engineer, Application Developer, Architect, Security Reviewer
- **Requirements**: FR-006, FR-007, FR-008, FR-014, NFR-003
- **Story**: As a Migration Engineer, I want SPA-Bridge to convert Angular services, dependency injection, routing, and state patterns so that major application behavior is preserved.

Acceptance criteria:
- Given constructor-injected services, when conversion runs, then React-compatible imports, hooks, providers, or explicit dependency wiring are generated.
- Given Angular routes, when conversion runs, then equivalent React route configuration is generated for the selected target stack.
- Given route guards or lazy loading patterns, when conversion cannot safely map them, then manual review items are created.
- Given NgRx or service-based state, when conversion runs, then a selected React state strategy is generated with rationale.
- The report identifies preserved behavior, uncertain mappings, and manual review items.

Technical notes:
- Route conversion target library should be finalized in a later design stage.
- DI conversion may require adapter modules for source services.

Security/PBT notes:
- Security: route guard conversion must not silently weaken access control semantics.
- PBT: route parameter and state mapping should include invariant tests where conversion rules are deterministic.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

## Epic 4: AI-Assisted Refinement and Secure Provider Use

### US-007: Use Local/Internal LLM for Difficult Mappings

- **Priority**: Must
- **Personas**: Migration Engineer, Application Developer
- **Requirements**: FR-009, FR-011, NFR-004
- **Story**: As a Migration Engineer, I want SPA-Bridge to use a local/internal LLM for mappings that deterministic rules cannot handle so that sensitive projects can be converted in zero-outbound mode.

Acceptance criteria:
- Given a mapping is marked unsafe for deterministic conversion, when local/internal LLM mode is configured, then SPA-Bridge sends minimal structured context to the local/internal provider.
- Given the provider returns a suggestion, when refinement completes, then the suggestion is recorded as AI-assisted in the report.
- Given local/internal provider fails, when conversion continues, then the failure is captured with a manual review item.
- Provider-specific details do not leak into mapping logic.

Technical notes:
- Use an LLM provider interface with local/internal provider as the preferred baseline.
- Record prompts and responses only if they are sanitized and allowed by configuration.

Security/PBT notes:
- Security: do not log sensitive prompt content; fail closed on provider errors.
- PBT: provider selection and context minimization rules can be tested as deterministic transformations.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

### US-008: Review and Remediate Conversion Output

- **Priority**: Must
- **Personas**: Migration Engineer, Application Developer, Project Manager
- **Requirements**: FR-011, FR-014, NFR-001
- **Story**: As an Application Developer, I want a guided review and remediation workflow so that uncertain conversions can be corrected without losing traceability.

Acceptance criteria:
- Given conversion completes with manual review items, when the user opens the Web UI report, then items are grouped by severity, source file, generated file, and requirement area.
- Given a manual review item is selected, when details open, then the user sees source context, generated output reference, and suggested remediation.
- Given remediation is applied outside SPA-Bridge, when checks rerun, then the report updates quality gate status.
- Given CLI users need automation, when report output is requested, then machine-readable and human-readable reports are available.

Technical notes:
- Web UI should emphasize review/reporting equally with CLI automation.
- Report schema should support later dashboard views.

Security/PBT notes:
- Security: report rendering must avoid leaking masked values or unsafe HTML.
- PBT: report serialization can use round-trip tests and schema invariants.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

## Epic 5: Security and Governance

### US-009: Mask Sensitive Information Before External LLM Calls

- **Priority**: Must
- **Personas**: Migration Engineer, Security Reviewer, Architect
- **Requirements**: FR-010, NFR-004, NFR-007, Security Requirements
- **Story**: As a Security Reviewer, I want sensitive information masked before external LLM calls so that proprietary source details are not disclosed.

Acceptance criteria:
- Given external LLM provider mode is configured, when context is prepared, then IP addresses, URLs, secrets, proprietary names, and configured customer-specific patterns are masked before transmission.
- Given masked output is returned, when restoration is required, then SPA-Bridge restores masked values in generated output where safe.
- Given masking fails, when an external provider call is requested, then the system blocks the call and records a fail-closed event.
- Given local/internal LLM mode is configured, when masking is enabled, then the same masking pipeline can be applied by configuration.

Checklist:
- Masking rules are configurable.
- Masking/unmasking events are auditable without exposing raw secrets.
- External provider use requires explicit configuration.

Technical notes:
- Masking should produce stable placeholders for round-trip restoration.
- Avoid writing unmasked external prompt payloads to logs.

Security/PBT notes:
- Security: supports SECURITY-03, SECURITY-05, SECURITY-11, SECURITY-13, SECURITY-15.
- PBT: masking and unmasking require round-trip property tests, generator quality, and regression tests for discovered failures.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

### US-010: Enforce Secure Runtime and Supply Chain Expectations

- **Priority**: Must
- **Personas**: Security Reviewer, Architect, Migration Engineer
- **Requirements**: NFR-004, NFR-006, NFR-007, Security Requirements
- **Story**: As a Security Reviewer, I want SPA-Bridge to include secure design and supply chain controls so that conversion tooling can be used in production-grade modernization programs.

Acceptance criteria:
- Given dependencies are added, when build artifacts are prepared, then exact versions or lock files are used.
- Given build/test instructions are generated, when security checks are included, then vulnerability scanning and SBOM generation are represented.
- Given logs are emitted, when conversion runs, then logs include timestamp, correlation ID, level, and message without secrets or proprietary identifiers.
- Given Web UI/API endpoints are designed, when access control applies, then deny-by-default and object-level authorization are required.

Technical notes:
- Specific CI/CD and infrastructure controls are refined in later Construction and Build/Test stages.
- Authentication requirements for the Web UI remain an open item for later design.

Security/PBT notes:
- Security: supports SECURITY-03, SECURITY-05, SECURITY-08, SECURITY-10, SECURITY-11, SECURITY-12, SECURITY-14, SECURITY-15.
- PBT: supply chain checks are mostly example/integration tests; pure config validation may use generated config cases.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

## Epic 6: Quality Gates, Self-Correction, and Property Testing

### US-011: Run Self-Correction and Quality Gates

- **Priority**: Must
- **Personas**: Migration Engineer, Application Developer, Project Manager, Security Reviewer
- **Requirements**: FR-011, FR-013, FR-014, NFR-001, NFR-005
- **Story**: As a Migration Engineer, I want SPA-Bridge to run compile, lint, format, build, and correction loops so that generated React output is measurably usable.

Acceptance criteria:
- Given generated output exists, when quality gates run, then TypeScript compilation, linting, formatting, primary tests, and sample build checks run as configured.
- Given a quality gate fails, when self-correction is enabled, then SPA-Bridge attempts deterministic fixes or AI-assisted refinement within a configured iteration limit.
- Given unresolved errors remain, when reporting completes, then the report contains error details and manual remediation hints.
- Given quality gates pass, when the report is generated, then the project is marked as meeting the configured conversion quality criteria.

Technical notes:
- Self-correction loops must be bounded.
- Error information sent to any LLM provider must be minimized and masked when external.

Security/PBT notes:
- Security: fail closed on unsafe tool execution or provider errors.
- PBT: correction loop state transitions can be model-tested if represented as pure state updates.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

### US-012: Apply Property-Based Testing to Conversion-Sensitive Logic

- **Priority**: Must
- **Personas**: Application Developer, Architect, Project Manager
- **Requirements**: NFR-005, FR-003, FR-010, FR-014, Property-Based Testing Requirements
- **Story**: As an Application Developer, I want property-based tests for conversion-sensitive logic so that edge cases are found beyond fixed fixtures.

Acceptance criteria:
- Given parser/formatter pairs exist, when tests are generated, then round-trip properties are defined where transformations are invertible.
- Given masking/unmasking exists, when tests are generated, then valid generated sensitive inputs round-trip through masking and restoration.
- Given IR serialization exists, when tests are generated, then serialization/deserialization round-trips preserve expected structure.
- Given mapping invariants are documented, when tests run, then generated input cases verify traceability, count preservation, and deterministic behavior where applicable.
- Given PBT failures occur in CI, when output is logged, then seed and shrunk failing input are available for reproduction.

Technical notes:
- TypeScript implementation should use `fast-check` unless later tech-stack design chooses otherwise.
- PBT must complement example-based tests and regression fixtures.

Security/PBT notes:
- PBT: supports PBT-01 through PBT-10 across later design, code generation, and build/test stages.
- Security: generated PBT data should avoid accidentally emitting real secrets.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

## Epic 7: Reporting and Project Evidence

### US-013: Generate Conversion Reports and Exports

- **Priority**: Must
- **Personas**: Migration Engineer, Application Developer, Project Manager
- **Requirements**: FR-014, NFR-001, NFR-002, NFR-007
- **Story**: As a Project Manager, I want conversion reports and exports so that stakeholders can understand migration readiness, quality, and remaining manual work.

Acceptance criteria:
- Given conversion completes, when the report is generated, then it lists converted files, generated files, unresolved mappings, AI-assisted decisions, manual review items, and quality gate results.
- Given source-to-output traceability exists, when a report item is opened, then source and generated artifact references are available.
- Given a project is evaluated, when the quality summary is shown, then it indicates whether the configured 85% target criteria are met.
- Given stakeholders need evidence, when exports are requested, then human-readable and machine-readable report formats are available.

Technical notes:
- Report schema should support Web UI, CLI output, and future dashboards.
- Include correlation IDs and timestamps for conversion runs.

Security/PBT notes:
- Security: reports must not expose secrets, masked values, or unsafe rendered source content.
- PBT: report schema serialization should use round-trip and invariant tests.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

### US-014: Preserve Extensible Architecture Evidence

- **Priority**: Should
- **Personas**: Architect, Security Reviewer
- **Requirements**: FR-003, FR-009, FR-012, NFR-003, Security Requirements
- **Story**: As an Architect, I want SPA-Bridge to document its extension boundaries so that future framework pairs and providers can be added without rewriting the core.

Acceptance criteria:
- Given source analysis is implemented, when architecture artifacts are reviewed, then source analyzer boundaries are explicit.
- Given target generation is implemented, when architecture artifacts are reviewed, then target generator boundaries are explicit.
- Given LLM providers are implemented, when provider configuration is reviewed, then local/internal and external provider adapters share a common interface.
- Given security controls are reviewed, when extension boundaries are inspected, then plugin or provider loading cannot bypass masking, logging, validation, or integrity checks.

Technical notes:
- This story informs Application Design and Units Generation.
- Actual plugin loading may remain internal/interface-oriented for MVP.

Security/PBT notes:
- Security: plugin/provider integrity supports SECURITY-13.
- PBT: interface contract tests can use generated provider/config cases where practical.

INVEST check:
- Independent: Yes
- Negotiable: Yes
- Valuable: Yes
- Estimable: Yes
- Small: Yes
- Testable: Yes

## Story to Persona Matrix

| Story | Migration Engineer | Application Developer | Architect | Security Reviewer | Project Manager |
|---|---|---|---|---|---|
| US-001 | Yes |  |  |  | Yes |
| US-002 | Yes |  | Yes |  |  |
| US-003 | Yes | Yes | Yes |  |  |
| US-004 | Yes | Yes | Yes |  |  |
| US-005 | Yes | Yes | Yes |  |  |
| US-006 | Yes | Yes | Yes | Yes |  |
| US-007 | Yes | Yes |  |  |  |
| US-008 | Yes | Yes |  |  | Yes |
| US-009 | Yes |  | Yes | Yes |  |
| US-010 | Yes |  | Yes | Yes |  |
| US-011 | Yes | Yes |  | Yes | Yes |
| US-012 |  | Yes | Yes |  | Yes |
| US-013 | Yes | Yes |  |  | Yes |
| US-014 |  |  | Yes | Yes |  |

## Story to Requirement Traceability

| Story | Requirement IDs |
|---|---|
| US-001 | FR-001, FR-012, FR-014, NFR-002 |
| US-002 | FR-006, FR-012, NFR-003 |
| US-003 | FR-001, FR-014, NFR-001 |
| US-004 | FR-002, FR-003, NFR-003, NFR-005 |
| US-005 | FR-004, FR-005, FR-007, NFR-001 |
| US-006 | FR-006, FR-007, FR-008, FR-014, NFR-003 |
| US-007 | FR-009, FR-011, NFR-004 |
| US-008 | FR-011, FR-014, NFR-001 |
| US-009 | FR-010, NFR-004, NFR-007, Security Requirements |
| US-010 | NFR-004, NFR-006, NFR-007, Security Requirements |
| US-011 | FR-011, FR-013, FR-014, NFR-001, NFR-005 |
| US-012 | FR-003, FR-010, FR-014, NFR-005, Property-Based Testing Requirements |
| US-013 | FR-014, NFR-001, NFR-002, NFR-007 |
| US-014 | FR-003, FR-009, FR-012, NFR-003, Security Requirements |

## Extension Compliance Summary

### Security Baseline

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | Stories do not define persistence stores or infrastructure resources. |
| SECURITY-02 | N/A | Stories do not define load balancers, API gateways, or CDN resources. |
| SECURITY-03 | Compliant | US-010, US-011, and US-013 include structured logging and sensitive-data exclusion. |
| SECURITY-04 | N/A | Web UI headers apply in later Web UI design and implementation. |
| SECURITY-05 | Compliant | US-001, US-003, US-009, and US-010 include input validation expectations. |
| SECURITY-06 | N/A | IAM/access policies are not yet designed. |
| SECURITY-07 | N/A | Network configuration is not yet designed. |
| SECURITY-08 | Compliant | US-010 captures Web UI/API access control expectations where applicable. |
| SECURITY-09 | Compliant | US-010 and US-011 include hardening and safe error handling expectations. |
| SECURITY-10 | Compliant | US-010 captures dependency pinning, vulnerability scanning, SBOM, and CI/CD integrity. |
| SECURITY-11 | Compliant | US-009, US-010, and US-014 capture secure design and abuse prevention concerns. |
| SECURITY-12 | N/A | Authentication remains an open design item; applies if implemented. |
| SECURITY-13 | Compliant | US-004, US-010, and US-014 include safe deserialization and plugin/provider integrity. |
| SECURITY-14 | Compliant | US-010 captures monitoring, alerting, log retention, and log integrity for deployed modes. |
| SECURITY-15 | Compliant | US-007, US-009, and US-011 include fail-closed provider and error handling behavior. |

### Property-Based Testing

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | N/A | Detailed property identification applies during Functional Design. |
| PBT-02 | Compliant | US-004, US-009, US-012, and US-013 identify round-trip properties. |
| PBT-03 | Compliant | US-002, US-003, US-005, US-006, and US-012 include invariant candidates. |
| PBT-04 | Compliant | US-001 and US-012 identify idempotent normalization/config behavior. |
| PBT-05 | Compliant | US-012 includes oracle/model-based testing where applicable. |
| PBT-06 | N/A | Stateful components are not yet designed. |
| PBT-07 | N/A | Generator quality applies during test design and code generation. |
| PBT-08 | Compliant | US-012 includes seed logging and shrunk failing input expectations. |
| PBT-09 | Compliant | US-012 references `fast-check` as the expected TypeScript PBT framework pending tech-stack finalization. |
| PBT-10 | Compliant | US-012 states PBT complements example-based tests and regression fixtures. |

## INVEST Summary

All stories were written to be independently reviewable, negotiable in implementation detail, valuable to at least one persona, estimable for planning, small enough for decomposition in later Units Generation, and testable through acceptance criteria.

