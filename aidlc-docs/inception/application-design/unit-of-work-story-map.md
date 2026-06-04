# SPA-Bridge Unit of Work Story Map

## Mapping Rules

- Each story has one primary unit.
- Supporting units are listed for cross-cutting implementation or review involvement.
- All stories from `stories.md` are assigned.

## Story to Unit Map

| Story | Primary Unit | Supporting Units | Notes |
|---|---|---|---|
| US-001 Start Conversion From CLI or Web UI | UOW-02 Core Application Orchestration and Run Workspace | UOW-10 CLI Interface, UOW-11 Web UI Review Workflow, UOW-05 Security | Shared application service owns conversion start; interfaces expose it. |
| US-002 Choose Target Project and State Strategy | UOW-07 React Target Generation | UOW-04 Transformation Rule Engine, UOW-02 Core Application, UOW-01 Core Model | Target and state strategy selection affects generator and mapping. |
| US-003 Scan Angular Project Structure | UOW-03 Angular Source Analysis | UOW-01 Core Model, UOW-09 Reporting, UOW-05 Security | Scanner emits inventory, diagnostics, and report inputs. |
| US-004 Parse Angular Source Into Intermediate Representation | UOW-01 Core Model and Ports Foundation | UOW-03 Angular Source Analysis, UOW-04 Transformation, UOW-08 Quality | IR contracts are primary; parser/normalizer feeds them. |
| US-005 Convert Components, Templates, Bindings, and Lifecycle | UOW-04 Transformation Rule Engine and Converters | UOW-01 Core Model, UOW-06 AI Provider, UOW-08 Quality, UOW-07 Target Generation | Mapping unit owns deterministic conversion. |
| US-006 Convert Services, Dependency Injection, Routing, and State | UOW-04 Transformation Rule Engine and Converters | UOW-01 Core Model, UOW-05 Security, UOW-07 Target Generation, UOW-08 Quality | Route guard/state mapping security and quality concerns are supporting. |
| US-007 Use Local/Internal LLM for Difficult Mappings | UOW-06 AI Provider Adapters and Refinement | UOW-05 Security, UOW-04 Transformation, UOW-08 Quality | Provider adapters are primary; policy and mapping coordinate. |
| US-008 Review and Remediate Conversion Output | UOW-11 Web UI Review Workflow | UOW-09 Reporting, UOW-08 Quality, UOW-10 CLI Interface | Web UI owns guided review; reports and CLI exports support. |
| US-009 Mask Sensitive Information Before External LLM Calls | UOW-05 Security, Masking, and Provider Policy | UOW-06 AI Provider, UOW-04 Transformation, UOW-09 Reporting | Security unit owns masking and fail-closed policy. |
| US-010 Enforce Secure Runtime and Supply Chain Expectations | UOW-05 Security, Masking, and Provider Policy | UOW-08 Quality, UOW-11 Web UI, UOW-09 Reporting | Security owns governance; quality/build later handle scanning/SBOM. |
| US-011 Run Self-Correction and Quality Gates | UOW-08 Quality Gates, Self-Correction, and PBT Integration | UOW-04 Transformation, UOW-06 AI Provider, UOW-07 Target Generation, UOW-09 Reporting | Quality unit owns checks and correction loop. |
| US-012 Apply Property-Based Testing to Conversion-Sensitive Logic | UOW-08 Quality Gates, Self-Correction, and PBT Integration | UOW-01 Core Model, UOW-03 Angular Source, UOW-04 Transformation, UOW-05 Security, UOW-09 Reporting | PBT unit coordinates; property candidates live across units. |
| US-013 Generate Conversion Reports and Exports | UOW-09 Reporting and Exports | UOW-02 Core Application, UOW-08 Quality, UOW-10 CLI, UOW-11 Web UI | Reporting owns canonical JSON and views. |
| US-014 Preserve Extensible Architecture Evidence | UOW-01 Core Model and Ports Foundation | UOW-04 Transformation, UOW-06 AI Provider, UOW-07 Target Generation, UOW-05 Security | Core contracts and extension boundaries are primary. |

## Unit to Story Map

| Unit | Primary Stories | Supporting Stories |
|---|---|---|
| UOW-01 Core Model and Ports Foundation | US-004, US-014 | US-003, US-005, US-006, US-012, US-013 |
| UOW-02 Core Application Orchestration and Run Workspace | US-001 | US-002, US-007, US-008, US-009, US-011, US-013 |
| UOW-03 Angular Source Analysis | US-003 | US-004, US-005, US-006, US-012 |
| UOW-04 Transformation Rule Engine and Converters | US-005, US-006 | US-002, US-007, US-011, US-012, US-014 |
| UOW-05 Security, Masking, and Provider Policy | US-009, US-010 | US-001, US-003, US-006, US-007, US-011, US-013, US-014 |
| UOW-06 AI Provider Adapters and Refinement | US-007 | US-005, US-009, US-011, US-014 |
| UOW-07 React Target Generation | US-002 | US-005, US-006, US-011, US-013, US-014 |
| UOW-08 Quality Gates, Self-Correction, and PBT Integration | US-011, US-012 | US-005, US-006, US-007, US-009, US-013 |
| UOW-09 Reporting and Exports | US-013 | US-001, US-003, US-007, US-008, US-009, US-011, US-012 |
| UOW-10 CLI Interface | None | US-001, US-008, US-011, US-013 |
| UOW-11 Web UI Review Workflow | US-008 | US-001, US-010, US-013 |

## Coverage Validation

| Story | Assigned |
|---|---|
| US-001 | Yes |
| US-002 | Yes |
| US-003 | Yes |
| US-004 | Yes |
| US-005 | Yes |
| US-006 | Yes |
| US-007 | Yes |
| US-008 | Yes |
| US-009 | Yes |
| US-010 | Yes |
| US-011 | Yes |
| US-012 | Yes |
| US-013 | Yes |
| US-014 | Yes |

## Notes for Construction

- UOW-10 currently has no primary story because CLI behavior is part of US-001 and report/export stories; it remains a distinct implementation unit due to the user's decomposition preference.
- UOW-11 owns US-008 because manual review/remediation is a core Web UI journey.
- Cross-cutting security and PBT stories use supporting unit assignments rather than duplication.

