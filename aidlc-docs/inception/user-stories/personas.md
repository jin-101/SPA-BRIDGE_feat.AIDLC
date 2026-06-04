# SPA-Bridge Personas

## Persona 1: Migration Engineer

- **Primary Goal**: Convert Angular applications to React with minimal manual rewrite.
- **Responsibilities**: Run conversions, inspect diagnostics, resolve manual review items, rerun quality gates, and package generated projects.
- **Motivations**: Reduce migration time, preserve behavior, and produce maintainable React code.
- **Pain Points**: Framework-specific edge cases, unclear conversion failures, manual mapping of bindings/services/routes, and repetitive validation work.
- **Primary Interfaces**: CLI and Web UI.
- **Success Criteria**:
  - Can configure and run a conversion without editing internal configuration files.
  - Receives actionable diagnostics for unsupported patterns.
  - Can rerun conversion/correction loops after remediation.
  - Can produce a buildable React project with a clear conversion report.
- **Relevant Stories**: US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013.

## Persona 2: Application Developer

- **Primary Goal**: Understand, review, and maintain the generated React code.
- **Responsibilities**: Validate generated components, inspect state and routing transformations, fix domain-specific issues, and add regression tests.
- **Motivations**: Keep business behavior intact while moving to idiomatic React.
- **Pain Points**: Generated code that is hard to trace, missing source context, non-idiomatic React patterns, and hidden behavior changes.
- **Primary Interfaces**: Web UI review workflow, generated code, conversion reports, and local test commands.
- **Success Criteria**:
  - Can trace generated files back to Angular source files.
  - Can understand why a mapping choice was made.
  - Can identify manual review areas without reading every generated file.
  - Can run quality checks and tests locally.
- **Relevant Stories**: US-003, US-004, US-005, US-006, US-007, US-008, US-010, US-011, US-012, US-013.

## Persona 3: Architect

- **Primary Goal**: Ensure SPA-Bridge supports a sustainable architecture for current and future framework migrations.
- **Responsibilities**: Review target project structure, transformation boundaries, provider abstractions, plugin-friendly interfaces, and quality strategy.
- **Motivations**: Avoid a one-off converter that cannot evolve beyond Angular to React.
- **Pain Points**: Tight coupling between parser, rules, LLM calls, target generation, and reporting.
- **Primary Interfaces**: Architecture documentation, reports, configuration, and generated project structure.
- **Success Criteria**:
  - Can see clear boundaries for source analyzers, IR, rule engine, LLM providers, target generators, and reporting.
  - Can verify Angular to React is implemented without blocking future framework pairs.
  - Can evaluate target stack choices and quality gates.
- **Relevant Stories**: US-002, US-003, US-004, US-005, US-006, US-009, US-010, US-011, US-012, US-014.

## Persona 4: Security Reviewer

- **Primary Goal**: Verify code, data, and provider usage remain secure during conversion.
- **Responsibilities**: Review local/internal LLM mode, external provider controls, masking, logging, dependency safety, access control, and audit evidence.
- **Motivations**: Prevent source disclosure, credential leakage, unsafe generated code, and insecure supply chain choices.
- **Pain Points**: LLM prompts containing sensitive data, opaque external calls, insufficient audit trail, and logs containing source secrets.
- **Primary Interfaces**: Security/Governance reports, configuration, Web UI review workflow, and build/test evidence.
- **Success Criteria**:
  - Can confirm external LLM calls are optional and masked.
  - Can confirm secrets and proprietary identifiers are not logged.
  - Can review audit records for provider choice and security-sensitive events.
  - Can verify dependency and build integrity controls are represented in plans.
- **Relevant Stories**: US-006, US-009, US-010, US-011, US-014.

## Persona 5: Project Manager

- **Primary Goal**: Track migration readiness, conversion progress, and risk across applications.
- **Responsibilities**: Review reports, understand conversion success/failure, coordinate remediation, and communicate milestones.
- **Motivations**: Reduce modernization cost and schedule risk while maintaining stakeholder confidence.
- **Pain Points**: Unclear success metrics, hidden manual effort, inconsistent reports, and inability to compare conversion readiness across projects.
- **Primary Interfaces**: Web UI dashboards, conversion reports, quality gate summaries, and exported artifacts.
- **Success Criteria**:
  - Can see conversion status, quality gate results, and manual review counts.
  - Can understand whether a project meets the 85% target criteria.
  - Can export evidence for stakeholder review.
  - Can distinguish automation success from required follow-up work.
- **Relevant Stories**: US-001, US-008, US-011, US-012, US-013.

## Persona to Requirement Map

| Persona | Primary Requirement Areas |
|---|---|
| Migration Engineer | FR-001 through FR-014, NFR-001, NFR-002 |
| Application Developer | FR-003 through FR-014, NFR-001, NFR-005 |
| Architect | FR-003, FR-006, FR-009, FR-012, NFR-003 |
| Security Reviewer | FR-009, FR-010, NFR-004, NFR-006, NFR-007, Security Requirements |
| Project Manager | FR-014, NFR-001, NFR-002, Milestones |

