# SPA-Bridge Application Design

## Overview

SPA-Bridge will be designed as a multi-package TypeScript monorepo using ports-and-adapters architecture. The core conversion engine is shared by CLI and Web UI through an in-process Conversion Application Service. Angular-specific source analysis is separated from a framework-neutral intermediate representation, and target React generation is isolated behind target generation components.

## Approved Design Decisions

| Decision Area | Decision |
|---|---|
| Architecture style | Multi-package monorepo |
| Dependency principle | Ports and adapters |
| CLI/Web UI integration | Both call shared application service in-process |
| IR model | Angular-specific input model plus framework-neutral core IR |
| Rule engine | Plugin-friendly rule packs with internal extension points |
| LLM abstraction | Provider registry, policy checks, masking integration, provider-specific adapters |
| Web UI auth design | Access-control hooks only; concrete auth deferred to NFR Design |
| Run state | File-based run workspace and manifest |
| Self-correction | Dedicated SelfCorrectionService |
| Reporting | Canonical JSON report; Markdown/HTML as exports/views |

## Design Artifacts

- `components.md`: Component definitions, responsibilities, interfaces, and compliance notes.
- `component-methods.md`: High-level TypeScript-like method signatures and component contracts.
- `services.md`: Service responsibilities and orchestration patterns.
- `component-dependency.md`: Dependency matrix, data flow, communication patterns, and dependency risks.

## Main Component Groups

1. Interface Layer: CLI and Web UI.
2. Application Orchestration Layer: Conversion Application Service, Configuration Service, Run Workspace Manager.
3. Source Analysis Layer: Project Scanner, Angular Parser, Dependency Graph Builder.
4. Model Layer: Angular Source Model, framework-neutral IR, diagnostics, traceability, report and masking token models.
5. Transformation Layer: Rule Pack Registry, Mapping Engine, domain converters.
6. AI Layer: LLM Provider Registry, LLM Policy Service, local/internal and external adapters.
7. Security/Governance Layer: Masking, audit/logging, provider policy, access-control hooks.
8. Generation and Quality Layer: React Project Generator, Quality Gate Service, Self-Correction Service, PBT Planning Hook.
9. Reporting Layer: Report Builder, Report Exporter, Web Review Data Provider.

## High-Level Runtime Flow

1. User starts conversion from CLI or Web UI.
2. Conversion Application Service normalizes config and creates a run workspace.
3. Source analysis scans, parses, and links Angular project artifacts.
4. IR Normalizer creates framework-neutral IR with traceability.
5. Mapping Engine applies rule packs and domain converters.
6. LLM Policy Service authorizes AI-assisted refinement only when policy and masking requirements are satisfied.
7. React Project Generator writes target project artifacts.
8. Quality Gate Service runs checks.
9. SelfCorrectionService performs bounded correction attempts if needed.
10. Report Builder creates canonical JSON report.
11. Report Exporter generates Markdown/HTML views for CLI and Web UI.

## Key Architectural Boundaries

| Boundary | Rationale |
|---|---|
| Angular Source Model vs Core IR | Keeps Angular-specific parsing separate from future framework-neutral transformation logic. |
| Core Ports vs Adapters | Prevents core logic from depending on filesystem, toolchain, provider, or UI implementations. |
| Mapping Engine vs LLM Provider | Prevents provider-specific behavior from leaking into conversion rules. |
| Quality Gate vs Self-Correction | Keeps check execution separate from correction orchestration. |
| Canonical JSON Report vs Views | Keeps CLI/Web UI/export formats consistent. |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | No persistence store is designed; run state is file-based workspace. Encryption is reviewed later if packaged storage is added. |
| SECURITY-02 | N/A | No network intermediary is designed in this stage. |
| SECURITY-03 | Compliant | Audit and Logging Service centralizes structured logging and sensitive-data exclusion. |
| SECURITY-04 | N/A | Web UI serving headers are deferred to NFR Design/implementation if applicable. |
| SECURITY-05 | Compliant | CLI/Web UI and Configuration Service own input validation boundaries. |
| SECURITY-06 | N/A | IAM/access policies are not in scope for this local/in-process design. |
| SECURITY-07 | N/A | Network configuration is not in scope. |
| SECURITY-08 | Compliant | Web UI/API access-control hooks are included for later concrete authorization. |
| SECURITY-09 | Compliant | Error handling and hardening responsibilities are assigned to quality/security services. |
| SECURITY-10 | Compliant | Supply chain checks are carried into Quality/Build planning. |
| SECURITY-11 | Compliant | Security-critical logic is isolated in masking, policy, logging, and access-control components. |
| SECURITY-12 | N/A | Concrete authentication is deferred; applies if Web UI auth is implemented. |
| SECURITY-13 | Compliant | Provider/plugin boundaries and safe source parsing are explicit. |
| SECURITY-14 | Compliant | Audit/logging and reporting hooks support later monitoring and retention design. |
| SECURITY-15 | Compliant | Provider policy and self-correction boundaries support fail-closed behavior. |

## Property-Based Testing Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | N/A | Detailed testable property inventory is produced during Functional Design. |
| PBT-02 | Compliant | Round-trip candidates include masking/restoration, IR serialization, and report export. |
| PBT-03 | Compliant | Invariant candidates include dependency graph, traceability, mapping counts, and deterministic selection. |
| PBT-04 | Compliant | Idempotence candidates include config normalization and formatting/normalization steps. |
| PBT-05 | Compliant | Oracle/model testing candidates are preserved for deterministic converters and fixtures. |
| PBT-06 | N/A | Stateful property testing is evaluated after run/correction state models are detailed. |
| PBT-07 | N/A | Generator quality is defined during Functional Design and Code Generation. |
| PBT-08 | Compliant | Quality design includes seed/reproducibility planning hooks. |
| PBT-09 | N/A | PBT framework selection is finalized during NFR Requirements. |
| PBT-10 | Compliant | Quality design keeps PBT complementary to example-based tests. |

## Design Completeness Check

- Components identified: Yes
- Component responsibilities defined: Yes
- Method contracts identified: Yes
- Service orchestration defined: Yes
- Dependency rules defined: Yes
- Security/PBT implications captured: Yes
- Detailed business rules deferred to Functional Design: Yes

