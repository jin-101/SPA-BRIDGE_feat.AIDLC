# SPA-Bridge Components

## Architecture Style

SPA-Bridge will use a multi-package TypeScript monorepo with ports-and-adapters dependency rules. The core packages expose stable application services and ports. CLI and Web UI packages call the same shared application service in-process for the initial design.

## Component Summary

| Component | Package Area | Purpose |
|---|---|---|
| CLI Interface | `cli` | Command-line entry point for conversion, validation, and report export. |
| Web UI Interface | `web` | Local guided workflow for configuration, conversion review, reports, and remediation. |
| Conversion Application Service | `core/application` | Shared orchestration API used by CLI and Web UI. |
| Configuration Service | `core/application` | Loads, validates, normalizes, and persists conversion configuration. |
| Run Workspace Manager | `core/workspace` | Manages file-based run workspace, manifests, artifacts, and report paths. |
| Project Scanner | `source/angular` | Discovers Angular project files and builds source inventory. |
| Angular Parser | `source/angular` | Parses TypeScript, Angular metadata, templates, styles, routing, services, and state files. |
| Dependency Graph Builder | `source/angular` | Builds dependency graph across Angular project artifacts. |
| Angular Source Model | `source/angular` | Angular-specific parsed model before framework-neutral normalization. |
| Intermediate Representation Model | `core/model` | Framework-neutral conversion model for components, routes, services, state, diagnostics, and traceability. |
| IR Normalizer | `core/model` | Converts Angular source model into core IR. |
| Rule Pack Registry | `core/transform` | Registers plugin-friendly rule packs and ordered transformation pipelines. |
| Mapping Engine | `core/transform` | Applies deterministic conversion rules and coordinates converter strategies. |
| Component Converter | `core/transform` | Converts component metadata, class logic, templates, bindings, events, and lifecycle concepts. |
| Routing Converter | `core/transform` | Converts Angular routing into target React routing structures. |
| Service and DI Converter | `core/transform` | Converts Angular services and constructor injection patterns. |
| State Converter | `core/transform` | Converts NgRx/service state to selected React state strategy. |
| Target Strategy Selector | `core/generation` | Selects target React project type and state management strategy. |
| React Project Generator | `target/react` | Generates React project structure, source files, config files, and package metadata. |
| LLM Provider Registry | `core/ai` | Resolves local/internal and optional external LLM providers. |
| LLM Policy Service | `core/ai` | Enforces provider policy, masking requirements, and outbound restrictions. |
| Local/Internal LLM Adapter | `adapters/ai` | Calls local or internal LLM provider through the provider port. |
| External LLM Adapter | `adapters/ai` | Optional external provider adapter gated by policy and masking. |
| Masking Service | `core/security` | Masks and restores sensitive values before external LLM calls and in configured local mode. |
| Audit and Logging Service | `core/security` | Produces structured audit and operational logs without sensitive content. |
| Quality Gate Service | `core/quality` | Runs TypeScript compile, lint, format, build, and test checks. |
| Self-Correction Service | `core/quality` | Coordinates correction loops using quality results, converters, and LLM providers. |
| PBT Planning Hook | `core/quality` | Carries property-test requirements into functional design and code generation. |
| Report Builder | `core/reporting` | Builds canonical JSON conversion report. |
| Report Exporter | `core/reporting` | Generates Markdown and HTML views from canonical JSON report. |
| Web Review Data Provider | `web` | Supplies report and remediation data to the Web UI. |

## Component Responsibilities

### CLI Interface

- Parse CLI arguments.
- Validate command intent and project paths.
- Call Conversion Application Service.
- Stream progress and summarize results.
- Export report artifacts.

### Web UI Interface

- Provide local guided conversion setup.
- Show conversion progress, diagnostics, reports, and remediation items.
- Call Conversion Application Service in-process.
- Leave access-control hooks at the Web/API boundary for later NFR Design.

### Conversion Application Service

- Own the public application-level conversion API.
- Coordinate configuration, run workspace, scanning, parsing, transformation, generation, quality gates, correction, and reporting.
- Return stable run status and artifact references.

### Run Workspace Manager

- Create file-based conversion run workspace.
- Maintain `manifest.json` for run metadata, inputs, outputs, quality status, and report locations.
- Provide artifact read/write ports to core services.

### Source Analysis Components

- Discover Angular project files.
- Parse Angular-specific constructs.
- Build dependency graph.
- Produce Angular Source Model with source locations and diagnostics.

### Model Components

- Define Angular Source Model and framework-neutral IR separately.
- Preserve source-to-output traceability.
- Define diagnostics, masking tokens, report schema, and quality result models.

### Transformation Components

- Register rule packs with internal extension points.
- Execute ordered conversion pipelines.
- Convert components, templates, bindings, routes, services, DI, lifecycle, and state.
- Produce manual review diagnostics where conversion is uncertain.

### AI Components

- Resolve provider through registry.
- Enforce provider policy and masking requirements.
- Keep provider-specific details behind adapter ports.
- Prefer local/internal provider support while allowing optional external adapters.

### Security/Governance Components

- Mask sensitive source content before external provider calls.
- Restore masked placeholders where safe.
- Emit structured audit logs without secrets.
- Provide access-control hooks for Web UI/API boundaries.

### Generation and Quality Components

- Generate React project files.
- Run compile, lint, format, build, and test checks.
- Coordinate bounded self-correction loops.
- Carry PBT requirements forward.

### Reporting Components

- Build canonical JSON reports.
- Generate Markdown/HTML exports.
- Supply review data to Web UI.

## Design Compliance Summary

### Security Baseline

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Audit and Logging Service is a first-class component. |
| SECURITY-05 | Compliant | CLI/Web UI input validation is assigned to interface and configuration components. |
| SECURITY-08 | Compliant | Web UI access-control hooks are included for later NFR Design. |
| SECURITY-10 | Compliant | Supply chain controls are represented through quality/build planning components. |
| SECURITY-11 | Compliant | Security-critical masking, policy, and logging are isolated. |
| SECURITY-13 | Compliant | Provider/plugin boundaries are isolated behind registries and ports. |
| SECURITY-15 | Compliant | Policy and quality components are responsible for fail-closed behavior. |

### Property-Based Testing

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | N/A | Detailed property identification occurs during Functional Design. |
| PBT-02 | Compliant | IR, masking, and report components expose round-trip candidates. |
| PBT-03 | Compliant | Graph, mapping, and traceability components expose invariant candidates. |
| PBT-08 | Compliant | Quality components include seed/reproducibility planning hooks. |
| PBT-09 | N/A | Framework selection is finalized in NFR Requirements. |

