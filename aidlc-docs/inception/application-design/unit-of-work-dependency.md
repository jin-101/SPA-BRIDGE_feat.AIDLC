# SPA-Bridge Unit Dependencies

## Dependency Strategy

The unit sequence is foundation-first:

1. Core model and ports.
2. Application orchestration and run workspace.
3. Source analysis.
4. Transformation.
5. Security/policy and AI provider integration.
6. Target generation.
7. Quality and reporting.
8. Interfaces.

## Unit Dependency Matrix

| Unit | Depends On | Dependency Type | Notes |
|---|---|---|---|
| UOW-01 Core Model and Ports Foundation | None | Foundation | Must be first because all units consume shared models and ports. |
| UOW-02 Core Application Orchestration and Run Workspace | UOW-01 | Core | Uses models, ports, diagnostics, run metadata, and policy types. |
| UOW-03 Angular Source Analysis | UOW-01 | Core | Produces Angular source model and graph compatible with core IR contracts. |
| UOW-04 Transformation Rule Engine and Converters | UOW-01, UOW-03, UOW-05, UOW-06 | Core, Security, AI | Converts IR/source outputs and may request AI-assisted refinement through policy/provider ports. |
| UOW-05 Security, Masking, and Provider Policy | UOW-01, UOW-02 | Core, Policy | Uses core types and is coordinated by orchestration policy flow. |
| UOW-06 AI Provider Adapters and Refinement | UOW-01, UOW-05 | Port/Adapter | Implements provider ports; must be gated by security/policy. |
| UOW-07 React Target Generation | UOW-01, UOW-04 | Core | Consumes target drafts and produces project artifacts. |
| UOW-08 Quality Gates, Self-Correction, and PBT Integration | UOW-01, UOW-04, UOW-05, UOW-06, UOW-07 | Quality | Validates generated output and coordinates correction loops. |
| UOW-09 Reporting and Exports | UOW-01, UOW-02, UOW-08 | Reporting | Builds canonical report from run manifest, diagnostics, quality results, and artifacts. |
| UOW-10 CLI Interface | UOW-02, UOW-09 | Interface | Calls shared application service and renders reports. |
| UOW-11 Web UI Review Workflow | UOW-02, UOW-05, UOW-09 | Interface | Calls shared application service and displays review/remediation flows. |

## Recommended Build Sequence

| Sequence | Unit | Rationale |
|---|---|---|
| 1 | UOW-01 Core Model and Ports Foundation | Establish shared contracts and avoid rework. |
| 2 | UOW-02 Core Application Orchestration and Run Workspace | Creates the central use-case API and run manifest model. |
| 3 | UOW-05 Security, Masking, and Provider Policy | Security policy must gate AI/provider and logging behavior early. |
| 4 | UOW-03 Angular Source Analysis | Source analysis depends on core models and feeds transformation. |
| 5 | UOW-06 AI Provider Adapters and Refinement | Provider adapters can be built against policy and provider ports. |
| 6 | UOW-04 Transformation Rule Engine and Converters | Uses source analysis, core IR, policy, and provider ports. |
| 7 | UOW-07 React Target Generation | Consumes converted target drafts. |
| 8 | UOW-08 Quality Gates, Self-Correction, and PBT Integration | Needs generated output and transformation hooks. |
| 9 | UOW-09 Reporting and Exports | Aggregates run, diagnostics, quality, and artifact data. |
| 10 | UOW-10 CLI Interface | Thin interface over core application and reporting. |
| 11 | UOW-11 Web UI Review Workflow | Thin local UI over core application/reporting/review data. |

## Dependency Controls

| Concern | Control |
|---|---|
| Circular dependencies | Core models and ports stay in UOW-01; adapters do not import UI packages. |
| Security bypass | UOW-04 and UOW-06 must access providers through UOW-05 policy/masking gates. |
| Report divergence | UOW-09 canonical JSON report feeds both CLI and Web UI. |
| Parser/generator coupling | UOW-03 and UOW-07 communicate through UOW-01 IR and UOW-04 target drafts. |
| Interface duplication | UOW-10 and UOW-11 both call UOW-02 shared application service. |
| PBT drift | UOW-08 owns PBT integration while UOW-01/03/04/05/09 define property candidates. |

## Cross-Unit Integration Checkpoints

| Checkpoint | Units | Validation |
|---|---|---|
| Model contract checkpoint | UOW-01, UOW-03, UOW-04, UOW-07, UOW-09 | IR/report schemas compile and serialize as expected. |
| Source-to-IR checkpoint | UOW-01, UOW-03 | Sample Angular source produces valid source model and IR. |
| IR-to-target checkpoint | UOW-01, UOW-04, UOW-07 | Sample IR produces target React draft and generated files. |
| Secure AI checkpoint | UOW-04, UOW-05, UOW-06 | External provider calls fail closed unless policy and masking pass. |
| Quality checkpoint | UOW-07, UOW-08 | Generated project can run configured compile/lint/format checks. |
| Reporting checkpoint | UOW-02, UOW-08, UOW-09, UOW-10, UOW-11 | CLI and Web UI read the same canonical report. |

## Security Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | UOW-05 owns logging/audit; UOW-09 consumes sanitized event/report data. |
| SECURITY-05 | Compliant | UOW-02, UOW-10, and UOW-11 own boundary validation. |
| SECURITY-08 | Compliant | UOW-11 includes access-control hooks; concrete auth design is later. |
| SECURITY-10 | Compliant | UOW-08 and Build/Test will handle dependency and scanning instructions. |
| SECURITY-11 | Compliant | UOW-05 isolates security-critical masking and policy logic. |
| SECURITY-13 | Compliant | UOW-06 provider adapters and UOW-04 rule packs remain behind controlled ports. |
| SECURITY-15 | Compliant | UOW-05 gates provider calls and UOW-08 bounds correction loops. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | N/A | Detailed properties are identified per unit in Functional Design. |
| PBT-02 | Compliant | UOW-01, UOW-05, and UOW-09 include round-trip candidates. |
| PBT-03 | Compliant | UOW-03 and UOW-04 include graph, traceability, and mapping invariant candidates. |
| PBT-04 | Compliant | UOW-02 and UOW-08 include normalization/idempotence candidates. |
| PBT-05 | Compliant | UOW-04 can use fixture/oracle comparisons for deterministic converters. |
| PBT-06 | N/A | Stateful PBT evaluated when run/correction state is detailed. |
| PBT-07 | N/A | Generator design belongs to Functional Design and Code Generation. |
| PBT-08 | Compliant | UOW-08 owns seed logging and reproducibility. |
| PBT-09 | N/A | Framework selection is finalized during NFR Requirements. |
| PBT-10 | Compliant | UOW-08 owns complementary example-based and property-based strategy. |

