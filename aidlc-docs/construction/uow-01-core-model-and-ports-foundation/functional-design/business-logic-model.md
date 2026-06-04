# UOW-01 Business Logic Model

## Unit Purpose

UOW-01 defines the shared business contracts for SPA-Bridge. It does not perform parsing, transformation, generation, or provider calls. Instead, it defines stable models, ports, schema/version rules, diagnostics, traceability, and report contracts used by every later unit.

## Core Business Capabilities

| Capability | Description | Primary Outputs |
|---|---|---|
| Core IR Modeling | Represent framework-neutral application concepts for conversion. | `IntermediateRepresentation`, `IrComponent`, `IrTemplate`, `IrRoute`, `IrService`, `IrStateModel`, `IrDependency` |
| Source Model Boundary | Keep Angular-specific source model separate from Core IR. | `AngularSourceModelRef`, source model boundary contracts |
| Traceability | Link source files, symbols, template bindings, and generated artifact segments. | `TraceabilityMap`, `TraceLink`, `ArtifactSegmentRef` |
| Diagnostics | Represent warnings, errors, manual review items, and security blockers. | `Diagnostic`, `DiagnosticSeverity`, `DiagnosticTag` |
| Report Schema | Define canonical report content for conversion evidence. | `ConversionReport`, `RunSummary`, `ManualReviewItem`, `AiDecisionRecord` |
| Artifact Versioning | Version all persisted schema-bearing artifacts. | `SchemaVersion`, version fields on IR/report/manifest/traceability |
| Core Ports | Define domain-facing ports for external effects. | File/artifact, tool runner, LLM provider, report exporter, logger/audit, clock/randomness ports |
| Masking Token Contracts | Define token and token-map structures while keeping masking logic in `core-security`. | `MaskToken`, `MaskTokenMap`, `MaskedSpanRef` |
| Quality Result Modeling | Represent compile, lint, format, build, test, and PBT outcomes. | `QualityResult`, `QualityGateResult`, `PbtRunMetadata` |

## Business Workflow

### Source Model to IR Contract

1. Angular Source Analysis produces an Angular-specific source model.
2. A normalizer in a later unit converts that source model into Core IR.
3. Core IR stores framework-neutral conversion concepts.
4. Angular-specific details remain in source model references or extension slots only where needed for traceability.
5. Downstream transformation and generation units consume Core IR rather than raw parser output.

### Traceability Workflow

1. Source artifacts receive stable `SourceRef` identifiers.
2. Source symbols, template bindings, and relevant source segments receive more granular refs.
3. Generated files and generated artifact segments receive `GeneratedArtifactRef` identifiers.
4. `TraceLink` records source-to-IR, IR-to-target, and source-to-generated relationships.
5. Reports consume traceability data for manual review and audit evidence.

### Diagnostic Workflow

1. Any unit can emit diagnostics using the shared diagnostic model.
2. Diagnostics include severity, code, source refs, optional generated refs, tags, and remediation hints.
3. `manual-review` diagnostics become review workflow items.
4. `security-blocker` diagnostics block unsafe operations or require explicit resolution.
5. Reports aggregate diagnostics by severity, unit, source file, generated artifact, and story/requirement area where available.

### Report Workflow

1. Core report schema defines the canonical JSON report.
2. Reporting unit fills report content from run manifest, diagnostics, traceability, AI decisions, masking/security events, quality results, and manual review state.
3. Markdown and HTML exports are views generated from canonical JSON.
4. Reports must preserve evidence without exposing sensitive content.

## Persisted Artifact Model

All persisted artifacts below require JSON serialization, schema validation, and schema version fields:

| Artifact | Version Field | Validation |
|---|---|---|
| Intermediate Representation | `schemaVersion` | Structural schema validation plus semantic invariants |
| Conversion Report | `schemaVersion` | Structural schema validation plus reference consistency |
| Diagnostics Collection | `schemaVersion` | Severity/code/source reference validation |
| Run Manifest | `schemaVersion` | Run state and artifact reference validation |
| Traceability Map | `schemaVersion` | Link endpoint and referential integrity validation |

## PBT Property Candidates

| Property | Category | Candidate Scope |
|---|---|---|
| IR JSON round-trip preserves structure | Round-trip | `IntermediateRepresentation` serialization/deserialization |
| Report JSON round-trip preserves evidence | Round-trip | `ConversionReport` serialization/deserialization |
| Trace links reference known source/generated refs | Invariant | `TraceabilityMap` validation |
| Diagnostics with `security-blocker` cannot be downgraded by normalization | Invariant | Diagnostic normalization |
| Schema validation is deterministic | Idempotence | Validating same artifact repeatedly yields equivalent result |
| Versioned artifact migration is explicit | Invariant | Persisted artifact version handling |
| Mask token map preserves stable token identity | Round-trip / invariant | Token map serialization and reference consistency |

## Security Considerations

- UOW-01 defines models for sensitive references and masking tokens but does not perform masking.
- Diagnostic and report schemas must support redacted display fields.
- Logger/audit ports must support structured records without requiring sensitive payloads.
- Security blocker diagnostics must be representable in every report and quality summary.

