# SPA-Bridge Component Dependencies

## Dependency Principle

SPA-Bridge uses ports and adapters:

- Core packages know domain models, ports, and application services.
- Interface packages call core application services.
- Adapter packages implement filesystem, tool runner, LLM provider, and export ports.
- Source and target packages provide framework-specific implementations behind core-facing interfaces.
- Dependencies should point inward toward core contracts and should avoid cycles.

## Package-Level Dependency Matrix

| Package Area | May Depend On | Must Not Depend On |
|---|---|---|
| `cli` | `core/application`, `core/model` | `web`, provider implementations directly |
| `web` | `core/application`, `core/reporting`, `core/model` | `cli`, provider implementations directly |
| `core/application` | `core/model`, core ports | concrete adapters, `cli`, `web` |
| `core/model` | shared type utilities only | application services, adapters |
| `core/transform` | `core/model`, rule ports, AI ports | concrete provider adapters, UI packages |
| `core/ai` | `core/model`, security ports | UI packages, target adapters |
| `core/security` | `core/model`, policy config | UI packages, concrete provider adapters |
| `core/quality` | `core/model`, tool runner ports, report ports | concrete tool implementations |
| `core/reporting` | `core/model` | UI packages except view-model adapters |
| `source/angular` | `core/model`, source analyzer ports | `target/react`, UI packages |
| `target/react` | `core/model`, target generator ports | `source/angular`, UI packages |
| `adapters/*` | core ports and relevant external libraries | other adapters unless explicitly composed |

## Component Dependency Matrix

| Component | Depends On | Direction |
|---|---|---|
| CLI Interface | Conversion Application Service | Interface to application |
| Web UI Interface | Conversion Application Service, Web Review Data Provider | Interface to application/reporting |
| Conversion Application Service | Configuration, Run Workspace, Source Analysis, IR, Mapping, Generation, Quality, Reporting | Orchestrates services |
| Configuration Service | Validation utilities, Provider Policy types | Application support |
| Run Workspace Manager | File System Port, Manifest Model | Application support to adapter |
| Project Scanner | File System Port, Source Inventory Model | Source adapter to core models |
| Angular Parser | Parser libraries, Angular Source Model | Source adapter |
| Dependency Graph Builder | Project Inventory, Angular Source Model | Source model processing |
| IR Normalizer | Angular Source Model, Dependency Graph, IR Model | Source model to core model |
| Mapping Engine | Rule Pack Registry, Domain Converters, LLM Policy Service | Transformation orchestration |
| Domain Converters | IR Model, Target Draft Model | Transformation |
| LLM Policy Service | Masking Service, Provider Policy, LLM Provider Registry | AI/security coordination |
| LLM Provider Registry | LLM Provider Ports | AI adapter resolution |
| Masking Service | Masking Policy, Token Map Model | Security |
| React Project Generator | Target Draft, Target Config, File System Port | Target generation |
| Quality Gate Service | Tool Runner Port, Generated Project Model | Quality adapter |
| Self-Correction Service | Quality Gate Service, Mapping Engine, LLM Policy Service | Correction orchestration |
| Report Builder | Run Manifest, Diagnostics, Quality Results, Traceability Map | Reporting |
| Report Exporter | Canonical JSON Report | Reporting views |

## Primary Data Flow

1. CLI or Web UI sends a conversion request to Conversion Application Service.
2. Configuration Service normalizes and validates request settings.
3. Run Workspace Manager creates run workspace and manifest.
4. Project Scanner discovers source files.
5. Angular Parser and Dependency Graph Builder produce Angular Source Model and graph.
6. IR Normalizer creates framework-neutral IR and traceability map.
7. Mapping Engine resolves rule packs and applies domain converters.
8. LLM Policy Service authorizes any AI-assisted refinement and applies masking when needed.
9. React Project Generator writes generated project artifacts.
10. Quality Gate Service runs checks.
11. Self-Correction Service coordinates bounded correction attempts if checks fail.
12. Report Builder creates canonical JSON report.
13. Report Exporter creates Markdown/HTML views.
14. CLI/Web UI present results and remediation items.

## Communication Patterns

| Interaction | Pattern | Notes |
|---|---|---|
| CLI/Web UI to core | Direct in-process application service call | Initial design avoids network/service split. |
| Core to filesystem | Port interface | File-based run workspace is adapter-backed. |
| Core to toolchain | Tool runner port | TypeScript, ESLint, Prettier, and build tools are external adapters. |
| Core to LLM | Provider port with policy gate | External calls require masking and explicit policy. |
| Core to reports | Canonical JSON model | Markdown/HTML are export views. |
| Web UI review | Report view data provider | Uses report model and artifact refs. |

## Dependency Risks and Controls

| Risk | Control |
|---|---|
| UI packages depending on concrete provider/tool adapters | Enforce imports through core application services and ports. |
| Source analyzer coupled to React generator | Route all conversion through IR and mapping engine. |
| LLM provider logic leaking into converters | Use LLM Provider Registry and LLM Policy Service. |
| Masking bypass for external providers | Policy service must fail closed before provider call. |
| Report schema divergence between CLI and Web UI | JSON report is canonical; views are generated. |
| Circular dependencies across conversion domains | Rule packs declare ordered dependencies; core model remains central. |

## Compliance Summary

Security:
- Provider and masking dependencies enforce SECURITY-03, SECURITY-05, SECURITY-11, SECURITY-13, and SECURITY-15 design intent.
- Web access-control hooks support later SECURITY-08 and SECURITY-12 decisions.

PBT:
- Dependency graph, IR, masking, and report dependencies create clear property-test boundaries for later Functional Design.

