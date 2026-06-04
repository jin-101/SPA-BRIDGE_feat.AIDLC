# UOW-01 Domain Entities

## Entity Overview

| Entity | Purpose | Persisted |
|---|---|---|
| `SchemaVersionedArtifact` | Base concept for persisted artifacts with schema version. | Yes |
| `IntermediateRepresentation` | Framework-neutral model of the source application for transformation. | Yes |
| `IrComponent` | Framework-neutral component representation. | Yes |
| `IrTemplate` | Template structure, bindings, events, and template refs. | Yes |
| `IrRoute` | Route tree, route params, guard references, lazy-loading hints. | Yes |
| `IrService` | Service and injectable-like behavior. | Yes |
| `IrStateModel` | State store, actions, reducers/selectors/effects-like concepts. | Yes |
| `IrDependency` | Internal and external dependency relation. | Yes |
| `TraceabilityMap` | Collection of trace links across source, IR, and generated artifacts. | Yes |
| `TraceLink` | Relationship between source, IR, and generated artifact refs. | Yes |
| `Diagnostic` | Conversion issue, warning, manual review item, or security blocker. | Yes |
| `ConversionReport` | Canonical JSON report for conversion evidence. | Yes |
| `RunManifest` | Run metadata and artifact references. | Yes |
| `QualityResult` | Quality gate summary and details. | Yes |
| `AiDecisionRecord` | Record of AI-assisted decisions without sensitive payloads. | Yes |
| `MaskToken` | Stable placeholder token metadata. | Yes |
| `MaskTokenMap` | Mapping between masked placeholders and controlled restoration metadata. | Yes |

## Core Types

### SchemaVersionedArtifact

| Field | Type | Notes |
|---|---|---|
| `schemaVersion` | `string` | Required for IR, report, manifest, diagnostics, and traceability artifacts. |
| `createdAt` | `IsoTimestamp` | Optional for runtime-generated artifacts. |
| `producer` | `ProducerRef` | Unit/package that created the artifact. |

### IntermediateRepresentation

| Field | Type | Notes |
|---|---|---|
| `schemaVersion` | `string` | Required. |
| `application` | `IrApplication` | Application-level metadata. |
| `components` | `IrComponent[]` | Components discovered from source model. |
| `templates` | `IrTemplate[]` | Template structures and binding models. |
| `routes` | `IrRoute[]` | Route tree and route metadata. |
| `services` | `IrService[]` | Service/injectable-like concepts. |
| `stateModels` | `IrStateModel[]` | State management concepts. |
| `dependencies` | `IrDependency[]` | Internal/external dependency edges. |
| `traceability` | `TraceabilityMapRef` | Reference to trace map artifact. |
| `extensions` | `Record<string, unknown>` | Explicit extension slot for source/target-specific metadata. |

### IrComponent

| Field | Type | Notes |
|---|---|---|
| `id` | `IrComponentId` | Stable identifier. |
| `name` | `string` | Framework-neutral display/name. |
| `sourceRefs` | `SourceRef[]` | Source file/symbol refs. |
| `templateRef` | `IrTemplateId` | Optional template link. |
| `styleRefs` | `SourceRef[]` | Style source references. |
| `inputs` | `IrInput[]` | Input-like properties. |
| `outputs` | `IrOutput[]` | Output/event-like properties. |
| `lifecycle` | `IrLifecycleHook[]` | Lifecycle semantics. |
| `dependencies` | `IrDependencyRef[]` | Referenced services/modules. |

### IrTemplate

| Field | Type | Notes |
|---|---|---|
| `id` | `IrTemplateId` | Stable identifier. |
| `sourceRefs` | `SourceRef[]` | Template file and segment refs. |
| `bindings` | `IrBinding[]` | Property, event, two-way, structural bindings. |
| `nodes` | `IrTemplateNode[]` | Framework-neutral template structure. |
| `diagnostics` | `DiagnosticRef[]` | Template-specific issues. |

### TraceabilityMap

| Field | Type | Notes |
|---|---|---|
| `schemaVersion` | `string` | Required. |
| `sourceRefs` | `SourceRef[]` | Files, symbols, bindings, segments. |
| `irRefs` | `IrRef[]` | IR element references. |
| `generatedRefs` | `GeneratedArtifactRef[]` | Files and artifact segments. |
| `links` | `TraceLink[]` | Source-to-IR and IR-to-generated links. |

### Diagnostic

| Field | Type | Notes |
|---|---|---|
| `id` | `DiagnosticId` | Stable diagnostic identifier. |
| `severity` | `DiagnosticSeverity` | `info`, `warning`, `error`, `manual-review`, `security-blocker`. |
| `code` | `DiagnosticCode` | Machine-readable code. |
| `message` | `string` | Human-readable message. |
| `sourceRefs` | `SourceRef[]` | Optional source references. |
| `generatedRefs` | `GeneratedArtifactRef[]` | Optional generated artifact refs. |
| `tags` | `DiagnosticTag[]` | Category, unit, story, remediation tags. |
| `remediationHint` | `string` | Optional remediation guidance. |
| `redaction` | `RedactionMetadata` | Indicates whether display text is redacted. |

### ConversionReport

| Field | Type | Notes |
|---|---|---|
| `schemaVersion` | `string` | Required. |
| `runSummary` | `RunSummary` | Run metadata, status, timing summary if available. |
| `convertedFiles` | `ConvertedFileRecord[]` | Source-to-generated file records. |
| `diagnostics` | `Diagnostic[]` | Aggregated diagnostics. |
| `qualityResults` | `QualityResult` | Compile/lint/format/build/test/PBT summaries. |
| `traceabilityMapRef` | `ArtifactRef` | Canonical trace map reference. |
| `aiDecisions` | `AiDecisionRecord[]` | AI-assisted decisions with sanitized context refs. |
| `securityEvents` | `SecurityEventRecord[]` | Masking/policy/security events without raw secrets. |
| `manualReview` | `ManualReviewState` | Review items and workflow state. |

### MaskToken and MaskTokenMap

| Entity | Field | Type | Notes |
|---|---|---|---|
| `MaskToken` | `id` | `MaskTokenId` | Stable token identifier. |
| `MaskToken` | `placeholder` | `string` | Placeholder used in masked payloads. |
| `MaskToken` | `category` | `MaskCategory` | Secret, URL, IP, proprietary term, configured pattern. |
| `MaskToken` | `sourceRefs` | `SourceRef[]` | Optional source locations. |
| `MaskTokenMap` | `schemaVersion` | `string` | Required. |
| `MaskTokenMap` | `tokens` | `MaskToken[]` | Serialized token metadata. |
| `MaskTokenMap` | `restorationPolicyRef` | `PolicyRef` | Opaque reference to restoration policy outside UOW-01. |

## Core Port Interfaces

| Port | Purpose | Example Methods |
|---|---|---|
| `ArtifactStoragePort` | Store and retrieve persisted artifacts. | `writeArtifact`, `readArtifact`, `exists` |
| `FileSystemPort` | Abstract filesystem reads/writes/listing. | `readFile`, `writeFile`, `listFiles` |
| `ToolRunnerPort` | Run external tools through controlled interface. | `runCommand`, `captureOutput` |
| `LlmProviderPort` | Provider-facing AI completion/refinement boundary. | `complete`, `healthCheck` |
| `ReportExporterPort` | Export canonical report to derived formats. | `exportReport` |
| `LoggerPort` | Structured operational logging. | `info`, `warn`, `error` |
| `AuditPort` | Security/audit event recording. | `recordEvent` |
| `ClockPort` | Deterministic time source. | `now` |
| `RandomnessPort` | Deterministic randomness/seed source. | `seed`, `nextId` |

## Relationships

| Source Entity | Relationship | Target Entity |
|---|---|---|
| `AngularSourceModelRef` | normalized into | `IntermediateRepresentation` |
| `IntermediateRepresentation` | references | `TraceabilityMap` |
| `IrComponent` | may reference | `IrTemplate` |
| `IrComponent` | may reference | `IrService` |
| `IrRoute` | may reference | `IrComponent` |
| `IrStateModel` | may reference | `IrService` |
| `Diagnostic` | may reference | `SourceRef`, `IrRef`, `GeneratedArtifactRef` |
| `ConversionReport` | aggregates | `Diagnostic`, `QualityResult`, `AiDecisionRecord`, `ManualReviewState` |
| `MaskTokenMap` | supports | `AiDecisionRecord`, `SecurityEventRecord`, redacted reports |

## Validation Requirements

- Every persisted artifact must validate against its schema.
- Every persisted artifact must carry `schemaVersion`.
- Every trace link endpoint must resolve.
- Every diagnostic severity must be an allowed enum value.
- Every `security-blocker` must remain blocking in report and quality summaries.
- Every report must be generated from canonical report JSON, not from independent Markdown/HTML-only state.

