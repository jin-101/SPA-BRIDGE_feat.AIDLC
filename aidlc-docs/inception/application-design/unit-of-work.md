# SPA-Bridge Units of Work

## Decomposition Strategy

- **Axis**: Package/domain aligned units matching the multi-package monorepo.
- **Granularity**: Coarse units during INCEPTION, with further splitting allowed during Construction.
- **Sequence**: Foundation-first.
- **Story Mapping**: Each story has one primary unit and optional supporting units.
- **Ownership**: Each unit lists primary owner role and reviewer roles.

## Greenfield Code Organization Strategy

SPA-Bridge application code will live in the workspace root, not in `aidlc-docs/`.

Recommended package layout:

| Package | Purpose | Major Directories |
|---|---|---|
| `packages/core-model` | Core types, IR, diagnostics, traceability, report schemas, ports | `src/ir`, `src/source-model`, `src/diagnostics`, `src/report`, `src/ports`, `src/traceability` |
| `packages/core-application` | Conversion orchestration, config, run workspace, policy coordination | `src/config`, `src/run`, `src/workflow`, `src/policy`, `src/workspace` |
| `packages/source-angular` | Angular scanning, parsing, dependency graph, Angular source model | `src/scanner`, `src/parser`, `src/templates`, `src/graph`, `src/model` |
| `packages/transform-angular-react` | Rule registry, mapping engine, converters | `src/rules`, `src/pipeline`, `src/component`, `src/routing`, `src/state`, `src/service-di` |
| `packages/core-security` | Masking, token maps, audit/log policy, security utilities | `src/masking`, `src/audit`, `src/logging`, `src/policy` |
| `packages/adapters-ai` | LLM provider registry and provider adapters | `src/providers`, `src/local`, `src/external`, `src/mock` |
| `packages/target-react` | React project generation and target strategy selection | `src/generator`, `src/templates`, `src/state-strategy`, `src/config` |
| `packages/core-quality` | Quality gates, tool runners, self-correction, PBT hooks | `src/gates`, `src/tools`, `src/correction`, `src/pbt` |
| `packages/core-reporting` | Canonical JSON reports and Markdown/HTML exports | `src/schema`, `src/builder`, `src/exporters`, `src/view-models` |
| `packages/cli` | CLI commands and terminal output | `src/commands`, `src/output`, `src/config` |
| `packages/web` | Local Web UI and review workflow | `src/pages`, `src/components`, `src/review`, `src/state`, `src/access-control` |

Dependency rules:
- Core packages depend on `core-model` and ports, not concrete adapters.
- `cli` and `web` call `core-application`.
- `source-angular` and `target-react` communicate through core models and ports.
- `transform-angular-react` depends on core models, AI ports, and rule interfaces, not concrete AI adapters.
- `core-security` provides masking/audit utilities and is used by application/policy flows.
- `adapters-ai` implements AI provider ports and is gated by policy/masking.
- `core-quality` uses tool runner ports; concrete tool invocation details stay adapter-like.
- `core-reporting` owns canonical report JSON and export views.

## Units

### UOW-01: Core Model and Ports Foundation

- **Primary Package(s)**: `packages/core-model`
- **Primary Owner Role**: Architect
- **Reviewer Roles**: Migration Engineer, Application Developer, Security Reviewer
- **Purpose**: Define shared contracts that make the rest of the system independent, testable, and plugin-friendly.
- **Responsibilities**:
  - Define Angular source model boundaries where referenced by core.
  - Define framework-neutral IR.
  - Define diagnostics, traceability, report schema, quality result models, masking token types, and core ports.
  - Provide serialization contracts for IR/report artifacts.
- **Primary Stories**: US-004, US-014
- **Supporting Stories**: US-003, US-009, US-012, US-013
- **Construction Split Candidates**:
  - IR and traceability model.
  - Report/diagnostic schema.
  - Ports and shared type utilities.

### UOW-02: Core Application Orchestration and Run Workspace

- **Primary Package(s)**: `packages/core-application`
- **Primary Owner Role**: Migration Engineer
- **Reviewer Roles**: Architect, Security Reviewer, Project Manager
- **Purpose**: Provide the shared in-process application service used by CLI and Web UI.
- **Responsibilities**:
  - Implement conversion workflow coordination.
  - Load, normalize, and validate configuration.
  - Manage file-based run workspace and manifest.
  - Coordinate provider policy decisions without owning concrete adapters.
  - Expose run status and report export use cases.
- **Primary Stories**: US-001
- **Supporting Stories**: US-002, US-007, US-008, US-009, US-011, US-013
- **Construction Split Candidates**:
  - Configuration service.
  - Run workspace manager.
  - Conversion workflow service.

### UOW-03: Angular Source Analysis

- **Primary Package(s)**: `packages/source-angular`
- **Primary Owner Role**: Application Developer
- **Reviewer Roles**: Migration Engineer, Architect
- **Purpose**: Discover, parse, and model Angular input projects.
- **Responsibilities**:
  - Scan Angular project structure.
  - Parse TypeScript, decorators, templates, styles, routing, services, and state files.
  - Build dependency graph and related file sets.
  - Emit Angular source diagnostics.
- **Primary Stories**: US-003
- **Supporting Stories**: US-004, US-005, US-006, US-012
- **Construction Split Candidates**:
  - Project scanner.
  - TypeScript/decorator parser.
  - Template parser.
  - Dependency graph builder.

### UOW-04: Transformation Rule Engine and Angular-to-React Converters

- **Primary Package(s)**: `packages/transform-angular-react`
- **Primary Owner Role**: Application Developer
- **Reviewer Roles**: Migration Engineer, Architect, Security Reviewer
- **Purpose**: Convert framework-neutral IR into React-oriented target drafts through plugin-friendly rule packs.
- **Responsibilities**:
  - Implement rule registry and ordered pipeline.
  - Convert components, templates, bindings, events, forms, lifecycle, services, DI, routing, and state.
  - Select state strategy input for target generation.
  - Emit manual review diagnostics when mapping is uncertain.
- **Primary Stories**: US-005, US-006
- **Supporting Stories**: US-002, US-007, US-011, US-012, US-014
- **Construction Split Candidates**:
  - Component/template/binding converters.
  - Routing/service/DI/state converters.
  - Rule registry and pipeline.

### UOW-05: Security, Masking, and Provider Policy

- **Primary Package(s)**: `packages/core-security`, policy area in `packages/core-application`
- **Primary Owner Role**: Security Reviewer
- **Reviewer Roles**: Architect, Migration Engineer
- **Purpose**: Enforce fail-closed provider policy, sensitive information masking, audit logging, and access-control hooks.
- **Responsibilities**:
  - Detect, mask, and restore sensitive values.
  - Define provider policy rules used before LLM calls.
  - Centralize audit/logging rules.
  - Provide Web UI/API access-control hooks for later NFR design.
- **Primary Stories**: US-009, US-010
- **Supporting Stories**: US-001, US-003, US-006, US-007, US-011, US-013, US-014
- **Construction Split Candidates**:
  - Masking/restoration.
  - Provider policy.
  - Audit/logging and access-control hooks.

### UOW-06: AI Provider Adapters and Refinement

- **Primary Package(s)**: `packages/adapters-ai`
- **Primary Owner Role**: Architect
- **Reviewer Roles**: Security Reviewer, Migration Engineer, Application Developer
- **Purpose**: Implement provider registry and adapters behind core provider ports.
- **Responsibilities**:
  - Provide local/internal provider adapter.
  - Provide optional external provider adapter interface/implementation.
  - Support mock provider for tests.
  - Keep provider-specific behavior out of mapping rules.
- **Primary Stories**: US-007
- **Supporting Stories**: US-009, US-011, US-014
- **Construction Split Candidates**:
  - Provider registry and mock provider.
  - Local/internal provider adapter.
  - External provider adapter.

### UOW-07: React Target Generation

- **Primary Package(s)**: `packages/target-react`
- **Primary Owner Role**: Application Developer
- **Reviewer Roles**: Migration Engineer, Architect, Security Reviewer
- **Purpose**: Generate React project output from target drafts.
- **Responsibilities**:
  - Generate Vite + React + TypeScript default project.
  - Support target project selection hooks.
  - Generate React source, config, package metadata, and entry files.
  - Apply target strategy decisions for state and routing outputs.
- **Primary Stories**: US-002
- **Supporting Stories**: US-005, US-006, US-011, US-013, US-014
- **Construction Split Candidates**:
  - Project boilerplate generator.
  - React source writer.
  - State/routing target adapters.

### UOW-08: Quality Gates, Self-Correction, and PBT Integration

- **Primary Package(s)**: `packages/core-quality`
- **Primary Owner Role**: Application Developer
- **Reviewer Roles**: Migration Engineer, Architect, Security Reviewer, Project Manager
- **Purpose**: Validate generated output and coordinate bounded correction loops.
- **Responsibilities**:
  - Run TypeScript compilation, linting, formatting, build, and tests.
  - Coordinate SelfCorrectionService with quality results and provider policy.
  - Carry PBT requirements into Functional Design and Code Generation.
  - Record seed/reproducibility requirements for PBT.
- **Primary Stories**: US-011, US-012
- **Supporting Stories**: US-005, US-006, US-007, US-009, US-013
- **Construction Split Candidates**:
  - Tool runner and quality gate service.
  - Self-correction service.
  - PBT integration and generators.

### UOW-09: Reporting and Exports

- **Primary Package(s)**: `packages/core-reporting`
- **Primary Owner Role**: Project Manager
- **Reviewer Roles**: Migration Engineer, Application Developer, Security Reviewer
- **Purpose**: Produce canonical conversion evidence and user-facing exports.
- **Responsibilities**:
  - Build canonical JSON conversion report.
  - Generate Markdown and HTML exports.
  - Include diagnostics, AI-assisted decisions, manual review items, quality results, and traceability.
  - Ensure report rendering does not leak sensitive data.
- **Primary Stories**: US-013
- **Supporting Stories**: US-001, US-003, US-007, US-008, US-009, US-011, US-012
- **Construction Split Candidates**:
  - Report schema/builder.
  - Markdown/HTML exporters.
  - Sanitized report rendering helpers.

### UOW-10: CLI Interface

- **Primary Package(s)**: `packages/cli`
- **Primary Owner Role**: Migration Engineer
- **Reviewer Roles**: Application Developer, Project Manager, Security Reviewer
- **Purpose**: Provide command-line automation for conversion, validation, and export.
- **Responsibilities**:
  - Parse commands and arguments.
  - Validate paths and options.
  - Call shared Conversion Application Service.
  - Render progress, status, and report output.
- **Primary Stories**: US-001
- **Supporting Stories**: US-002, US-008, US-011, US-013
- **Construction Split Candidates**:
  - Command parser.
  - Conversion command.
  - Report/export commands.

### UOW-11: Web UI Review Workflow

- **Primary Package(s)**: `packages/web`
- **Primary Owner Role**: Project Manager
- **Reviewer Roles**: Migration Engineer, Application Developer, Security Reviewer
- **Purpose**: Provide local guided conversion setup, report review, and remediation workflow.
- **Responsibilities**:
  - Start conversion through shared application service.
  - Display run status and reports.
  - Show manual review/remediation items.
  - Use access-control hooks for later auth design.
- **Primary Stories**: US-008
- **Supporting Stories**: US-001, US-010, US-013
- **Construction Split Candidates**:
  - Conversion setup UI.
  - Report/review UI.
  - Remediation item workflow.

## Boundary Validation

- All approved stories are assigned to at least one primary unit.
- CLI and Web UI are split as requested.
- Core model/IR and Angular source analysis are separated.
- Masking/security and AI provider adapters are separated while connected through policy and ports.
- Quality, self-correction, and PBT are grouped into one unit.
- Foundation-first dependencies are respected.

## Security and PBT Notes

- Security-sensitive responsibilities are concentrated in UOW-05 and supported across orchestration, AI, reporting, CLI, and Web UI units.
- PBT-heavy work appears in UOW-01, UOW-03, UOW-04, UOW-05, UOW-08, and UOW-09.
- Detailed property identification remains a Functional Design responsibility.

