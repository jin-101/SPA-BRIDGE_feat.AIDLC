# UOW-02 Business Rules

## Configuration Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW02-CONFIG-01 | The effective config is created from project config plus CLI/Web UI overrides. | Preserves repeatable project defaults while allowing caller-specific choices. |
| UOW02-CONFIG-02 | CLI/Web UI overrides take precedence over project config for overlapping fields. | Matches approved precedence choice. |
| UOW02-CONFIG-03 | Config validation must happen before workflow execution. | Prevents unsafe or impossible runs from mutating workspace state. |
| UOW02-CONFIG-04 | Normalized config must include input path, output path, target strategy, provider mode, and quality options. | Downstream units require stable inputs. |
| UOW02-CONFIG-05 | Invalid config emits diagnostics and prevents run start unless the error is explicitly non-blocking. | Keeps CLI/Web UI behavior consistent. |

## Run Workspace Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW02-WORKSPACE-01 | Run workspace path is `.spa-bridge/runs/<runId>` under the workspace root. | Keeps run artifacts isolated and discoverable. |
| UOW02-WORKSPACE-02 | Run ID must be stable, unique within the workspace, and filesystem-safe. | Prevents accidental overwrite and path ambiguity. |
| UOW02-WORKSPACE-03 | Standard run subdirectories are created before step execution. | Gives downstream units predictable artifact targets. |
| UOW02-WORKSPACE-04 | Application code output path and run workspace path are distinct concepts. | Prevents internal metadata from mixing with generated React output. |
| UOW02-WORKSPACE-05 | Workspace path derivation must reject traversal outside the workspace root. | Blocks path traversal and accidental writes outside the project. |

## Manifest Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW02-MANIFEST-01 | Manifest is created when the run starts. | Enables status inspection and recovery from the beginning. |
| UOW02-MANIFEST-02 | Manifest is updated after every completed or failed workflow step. | Preserves auditability and resume metadata. |
| UOW02-MANIFEST-03 | Terminal statuses are `completed`, `failed`, or `cancelled`. | Clarifies lifecycle end states. |
| UOW02-MANIFEST-04 | Failed runs preserve diagnostics, partial artifacts, and last safe checkpoint. | Supports review, debugging, and resume. |
| UOW02-MANIFEST-05 | Resume is allowed only for a manifest that validates and has a recoverable checkpoint. | Avoids corrupt or ambiguous recovery. |

## Orchestration Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW02-WORKFLOW-01 | Core application coordinates workflow steps but does not implement parsing, transformation, AI provider, target generation, quality, or report rendering internals. | Preserves unit boundaries. |
| UOW02-WORKFLOW-02 | Workflow steps communicate through UOW-01 models, ports, diagnostics, and artifact refs. | Keeps downstream contracts stable. |
| UOW02-WORKFLOW-03 | Fail-fast is the default behavior for blocking diagnostics or failed required steps. | Prevents unsafe partial conversion from being treated as success. |
| UOW02-WORKFLOW-04 | Non-blocking diagnostics may accumulate while the workflow continues. | Enables useful progress without hiding review needs. |
| UOW02-WORKFLOW-05 | Caller-facing status must be readable by both CLI and Web UI through the same service API. | Avoids duplicate interface logic. |

## Provider Policy Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW02-POLICY-01 | Provider calls must be policy-gated by core application coordination. | Prevents provider bypass from CLI/Web UI workflows. |
| UOW02-POLICY-02 | External provider use must fail closed if policy or masking requirements are not satisfied. | Protects sensitive data. |
| UOW02-POLICY-03 | Provider policy decisions are recorded as report-facing events without raw sensitive payloads. | Supports audit and review without leakage. |
| UOW02-POLICY-04 | Core application depends on policy interfaces, not concrete security/provider implementations. | Keeps UOW-05/UOW-06 independently implementable. |

## Report and Manual Review Rules

| Rule ID | Rule | Rationale |
|---|---|---|
| UOW02-REPORT-01 | Canonical report state is updated throughout the run, not only at completion. | Enables Web UI status and partial review. |
| UOW02-REPORT-02 | Markdown/HTML report generation is requested through exporter ports. | Keeps rendering logic out of orchestration. |
| UOW02-REPORT-03 | Manual review items are persisted in manifest/report-facing state. | Allows CLI/Web UI to display the same review queue. |
| UOW02-REPORT-04 | Report state must use safe display fields and redacted values where appropriate. | Avoids sensitive data leakage. |

## Validation Rules

| Rule ID | Rule | Validation |
|---|---|---|
| UOW02-VALIDATION-01 | Input and output paths must be validated before use. | Reject empty paths, traversal, and unsupported root relationships. |
| UOW02-VALIDATION-02 | Run IDs must match a filesystem-safe allowlist. | Reject separators, traversal markers, and control characters. |
| UOW02-VALIDATION-03 | Config options must match known strategy and provider values. | Emit blocking diagnostics for unsupported values. |
| UOW02-VALIDATION-04 | Resume requests must validate manifest schema and checkpoint consistency. | Reject invalid or incomplete manifests. |

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Logging/audit behavior is represented through structured ports and report-facing events. |
| SECURITY-05 | Compliant | CLI/Web UI inputs and config/path parameters are validated by the shared application layer. |
| SECURITY-08 | N/A | UOW-02 is an in-process library service; concrete Web UI endpoint access control belongs to UOW-11. |
| SECURITY-10 | N/A | Dependency and scanning details are handled in NFR Requirements, Code Generation, and Build/Test. |
| SECURITY-11 | Compliant | Security-critical policy enforcement is coordinated through dedicated policy boundaries. |
| SECURITY-13 | Compliant | Provider calls are allowed only through policy-gated ports and validated artifacts. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Testable properties are identified for config merge, manifest transitions, workspace paths, and resume behavior. |
| PBT-02 | N/A | No inverse serialization operation is defined in this functional design beyond UOW-01 schemas. |
| PBT-03 | Compliant | Manifest lifecycle, override precedence, and workspace path invariants are identified. |
| PBT-04 | Compliant | Config normalization and workspace path derivation include idempotence candidates. |
| PBT-06 | Compliant | Manifest lifecycle and resume behavior are stateful PBT candidates. |
| PBT-07 | N/A | Generator organization is finalized during Code Generation. |
| PBT-08 | N/A | Seed/reproducibility belongs to NFR Requirements/Code Generation. |
| PBT-10 | Compliant | Critical scenarios need both example-based tests and property-based tests in Code Generation. |
