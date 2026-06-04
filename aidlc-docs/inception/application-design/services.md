# SPA-Bridge Services

## Service Layer Overview

The service layer coordinates high-level use cases while preserving ports-and-adapters boundaries. Core services depend on ports and domain models. Adapters implement file system, LLM, compiler, formatter, linter, and UI integration details.

## Primary Services

### Conversion Application Service

**Responsibility**: Public application service used by CLI and Web UI.

Orchestration flow:
1. Load and normalize configuration.
2. Create file-based run workspace and manifest.
3. Scan Angular project.
4. Parse Angular source and build dependency graph.
5. Normalize into IR.
6. Apply transformation pipeline and AI-assisted refinements where required.
7. Generate React target project.
8. Run quality gates.
9. Invoke self-correction if configured and needed.
10. Build canonical JSON report and exports.

Collaborators:
- Configuration Service
- Run Workspace Manager
- Project Scanner
- Angular Parser
- Dependency Graph Builder
- IR Normalizer
- Mapping Engine
- LLM Policy Service
- React Project Generator
- Quality Gate Service
- Self-Correction Service
- Report Builder

### Configuration Service

**Responsibility**: Resolve user configuration consistently across CLI and Web UI.

Key decisions:
- Defaults to Vite + React + TypeScript.
- Validates provider, target, state strategy, path, and policy settings.
- Supplies normalized config to the rest of the pipeline.

### Run Workspace Manager

**Responsibility**: Manage file-based run state.

Key decisions:
- Use run workspace and manifest as canonical run persistence for MVP.
- Store source inventory, IR snapshots when allowed, generated artifacts, quality results, reports, and manifest updates.
- Avoid storing unmasked external prompt payloads.

### Source Analysis Service Group

**Responsibility**: Build an accurate Angular source model.

Services:
- Project Scanner
- Angular Parser
- Dependency Graph Builder

Outputs:
- Project inventory
- Angular Source Model
- Dependency Graph
- Source diagnostics

### IR Service Group

**Responsibility**: Keep Angular-specific source model separate from framework-neutral IR.

Services:
- IR Normalizer
- IR Validator
- Traceability Attacher

Outputs:
- Framework-neutral IR
- Traceability map
- IR validation diagnostics

### Transformation Service Group

**Responsibility**: Convert IR to target React draft through plugin-friendly rule packs.

Services:
- Rule Pack Registry
- Mapping Engine
- Domain Converters
- Target Strategy Selector

Design rules:
- Rule packs are internal extension points.
- The mapping engine executes ordered pipelines.
- Domain converters handle component/template/binding/lifecycle/routing/service/state areas.
- Uncertain conversions emit diagnostics and manual review items.

### AI Provider Service Group

**Responsibility**: Encapsulate provider selection, policy enforcement, context preparation, and provider calls.

Services:
- LLM Provider Registry
- LLM Policy Service
- Local/Internal LLM Adapter
- External LLM Adapter

Design rules:
- Local/internal provider is preferred.
- External provider requires explicit policy authorization and masking.
- Mapping logic depends on provider ports, not provider implementation.

### Security and Governance Service Group

**Responsibility**: Centralize security-sensitive operations.

Services:
- Masking Service
- Audit and Logging Service
- Provider Policy Service
- Access Control Hook for Web UI/API boundary

Design rules:
- Masking fails closed before external provider calls.
- Logs include timestamp, correlation ID, level, and message without secrets.
- Access-control hooks are included now; concrete auth design is deferred to NFR Design.

### Generation and Quality Service Group

**Responsibility**: Produce buildable React output and validate quality.

Services:
- React Project Generator
- Quality Gate Service
- Self-Correction Service
- PBT Planning Hook

Design rules:
- Self-Correction Service is separate from Quality Gate Service.
- Quality Gate Service produces structured results.
- Self-Correction Service coordinates converters and LLM providers within bounded attempts.
- PBT requirements flow into later Functional Design and Code Generation.

### Reporting Service Group

**Responsibility**: Produce canonical and view/export reports.

Services:
- Report Builder
- Report Exporter
- Web Review Data Provider

Design rules:
- Canonical report format is JSON.
- Markdown and HTML are generated views/exports.
- Reports include traceability, diagnostics, AI-assisted decisions, manual review items, quality results, and artifact references.

## Service Interaction Patterns

| Pattern | Usage |
|---|---|
| In-process application service | CLI and Web UI call the same Conversion Application Service. |
| Ports and adapters | Core logic depends on ports for filesystem, tools, providers, and exports. |
| File-based run workspace | Run state is persisted via workspace and manifest. |
| Ordered rule pipeline | Mapping Engine resolves rule packs and applies deterministic/AI-assisted rules. |
| Fail-closed policy gate | LLM Policy Service blocks disallowed provider calls and masking failures. |
| Canonical report model | Report Builder emits JSON, exporters render Markdown/HTML. |

## Security and PBT Service Implications

Security:
- Input validation belongs at CLI/Web UI boundary and Configuration Service.
- Provider policy and masking are mandatory before external LLM calls.
- Structured logging and audit trail are centralized.
- Access-control hooks exist even if concrete authentication is deferred.

PBT:
- Run manifest read/write can be tested for schema invariants.
- Masking/restoration requires round-trip properties.
- IR serialization requires round-trip properties.
- Graph and traceability models require invariant properties.
- Report JSON/export can be tested for serialization and consistency properties.

