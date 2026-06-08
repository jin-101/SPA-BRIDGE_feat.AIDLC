# Domain Entities - UOW-09 Reporting and Exports

## Entity Overview

UOW-09 entities model conversion evidence independently from CLI and Web UI concerns. The canonical report is the aggregate root; exports and view models are derived from it.

## Aggregate Root

### CanonicalConversionReport

| Field | Type | Required | Description |
|---|---|---|---|
| `reportId` | `string` | Yes | Stable report identifier derived from run ID and content version |
| `schemaVersion` | `string` | Yes | Canonical report schema version |
| `metadata` | `ReportMetadata` | Yes | Run and report metadata |
| `sourceInventory` | `SourceInventorySection` | Yes | Source artifact summary |
| `conversionOutput` | `ConversionOutputSection` | Yes | Generated output summary |
| `diagnostics` | `DiagnosticSection` | Yes | Safe diagnostics grouped for review |
| `aiDecisions` | `AiDecisionSection` | Yes | Provider-neutral AI decision summaries |
| `manualReview` | `ManualReviewSection` | Yes | Review items and remediation hints |
| `quality` | `QualityReportSection` | Yes | Quality gate and target evaluation |
| `traceability` | `TraceabilitySection` | Yes | Source/generated artifact links |
| `exports` | `ExportMetadataSection` | Yes | Export availability and hashes |

## Input Entities

### ReportInputBundle

| Field | Description |
|---|---|
| `run` | Run ID, correlation ID, configuration summary, source/target framework labels |
| `sourceAnalysis` | Inventory, graph summary, source diagnostics, safe source refs |
| `transformation` | Converted draft counts, unresolved mapping diagnostics, conversion decisions |
| `provider` | AI-assisted decision summaries, provider policy decisions, safe provenance |
| `targetGeneration` | Generated artifact refs, target project summary, target dependency summary |
| `quality` | Gate runs, PBT runs, correction attempts, evidence summaries |
| `security` | Masking/policy/audit summaries represented as safe refs and reason codes |
| `traceability` | Source-to-generated refs and synthetic origins |

### ReportBuildOptions

| Field | Description |
|---|---|
| `qualityTargetPercent` | Configured conversion target, defaulting to 85 |
| `includeHtmlExport` | Whether HTML rendering is requested |
| `includeMarkdownExport` | Whether Markdown rendering is requested |
| `rendererVersion` | Renderer version used for export metadata |
| `reportGeneratedAt` | Deterministic or runtime timestamp controlled by caller |

## Section Entities

### ReportMetadata

| Field | Description |
|---|---|
| `runId` | Conversion run identifier |
| `correlationId` | Shared correlation ID for logs and reports |
| `projectLabel` | Safe project display label |
| `sourceFramework` | Source framework label, such as Angular 15 |
| `targetFramework` | Target framework label, such as React 18 |
| `generatedAt` | Report generation timestamp |
| `partial` | Whether report contains partial evidence due to non-fatal issues |

### SourceInventorySection

| Field | Description |
|---|---|
| `artifactCounts` | Counts by source artifact category |
| `detectedCategories` | Component, service, routing, state, template, style, asset, and other categories |
| `sourceRefs` | Safe source-relative references |
| `diagnosticRefs` | Diagnostics associated with source discovery |

### ConversionOutputSection

| Field | Description |
|---|---|
| `generatedArtifactCounts` | Counts by generated artifact category |
| `generatedRefs` | Target-relative generated artifact refs |
| `targetProject` | Target project type and strategy summary |
| `convertedArtifactCount` | Count used for quality target evaluation |
| `totalCandidateArtifactCount` | Conversion denominator for quality target evaluation |

### DiagnosticSection

| Field | Description |
|---|---|
| `items` | Safe diagnostics |
| `groups` | Stable grouped diagnostics |
| `countsBySeverity` | Counts for critical, blocking, warning, and info severities |

### AiDecisionSection

| Field | Description |
|---|---|
| `decisions` | Provider-neutral AI-assisted summaries |
| `countsByProviderCategory` | Local/internal, mock, external-disabled, or external-opt-in categories |
| `policySummary` | Provider policy status counts |

### ManualReviewSection

| Field | Description |
|---|---|
| `items` | Manual review items |
| `groups` | Stable stakeholder review groups |
| `blockingCount` | Count of blocking review items |
| `remediationHints` | Safe remediation summaries |

### QualityReportSection

| Field | Description |
|---|---|
| `gateStatus` | Aggregated quality gate status |
| `gateRuns` | Bounded gate run summaries |
| `pbtRuns` | PBT outcome summaries and seeds |
| `correctionAttempts` | Bounded self-correction summary |
| `evidenceCounts` | Counts and refs for quality evidence |
| `conversionQualityScore` | Numeric score derived from conversion metrics |
| `targetPercent` | Configured target, default 85 |
| `targetMet` | Final quality target decision |

### TraceabilitySection

| Field | Description |
|---|---|
| `links` | Source-to-generated trace links |
| `syntheticOrigins` | Generated artifacts that have no direct source artifact |
| `coverageSummary` | Counts for covered and uncovered refs |

### ExportMetadataSection

| Field | Description |
|---|---|
| `formats` | JSON, Markdown, HTML |
| `contentHashes` | Stable hashes per export |
| `rendererVersion` | Renderer version |
| `exportedAt` | Export timestamp |

## Supporting Entities

### ReportDiagnostic

| Field | Description |
|---|---|
| `id` | Stable diagnostic ID |
| `severity` | Critical, blocking, warning, or info |
| `reasonCode` | Machine-readable reason |
| `safeMessage` | Redaction-safe message |
| `sourceRef` | Optional safe source ref |
| `generatedRef` | Optional safe generated ref |
| `storyArea` | Optional story/requirement area |

### ManualReviewItem

| Field | Description |
|---|---|
| `id` | Stable review item ID |
| `severity` | Review severity |
| `category` | Mapping, security, quality, provider, target generation, or reporting category |
| `reasonCode` | Machine-readable reason |
| `safeSummary` | Redaction-safe summary |
| `remediationHint` | Safe remediation guidance |
| `sourceRef` | Optional source artifact ref |
| `generatedRef` | Optional generated artifact ref |

### AiAssistedDecision

| Field | Description |
|---|---|
| `id` | Stable decision ID |
| `mappingRequestId` | Request or conversion mapping ID |
| `providerCategory` | Local/internal, mock, or external category |
| `policyStatus` | Allowed, blocked, disabled, or review-required |
| `confidence` | Bounded confidence value |
| `provenanceRef` | Safe provenance reference |
| `safeRationale` | Redaction-safe rationale |

### ReportExportSet

| Field | Description |
|---|---|
| `canonicalJson` | Canonical JSON string or object model |
| `markdown` | Optional Markdown export |
| `html` | Optional sanitized HTML export |
| `metadata` | Export metadata and hashes |
| `diagnostics` | Export diagnostics |

## Entity Relationships

| Relationship | Cardinality | Rule |
|---|---|---|
| `CanonicalConversionReport` to `ReportDiagnostic` | One-to-many | Diagnostics are grouped but preserved as individual items. |
| `CanonicalConversionReport` to `ManualReviewItem` | One-to-many | Manual review items can reference diagnostics and trace links. |
| `CanonicalConversionReport` to `AiAssistedDecision` | One-to-many | AI decisions never embed raw prompts or raw source. |
| `CanonicalConversionReport` to `TraceabilityLink` | One-to-many | Generated refs must be trace-covered or synthetic. |
| `CanonicalConversionReport` to `ReportExportSet` | One-to-one derived | Exports are derived from the canonical report. |

## Validation Rules

- Required report sections must be present.
- IDs must be unique within their section.
- Severity values must use the supported severity enum.
- Generated refs must be target-relative safe refs.
- Source refs must be source-relative safe refs.
- Raw prompt/source/response fields are forbidden.
- HTML and Markdown exports must be rendered from sanitized view models.
- Quality score must be bounded between 0 and 1.

## PBT Entity Generators

Code generation should provide reusable generators for:

- `CanonicalConversionReport`
- `ReportInputBundle`
- `ReportDiagnostic`
- `ManualReviewItem`
- `AiAssistedDecision`
- `QualityReportSection`
- `TraceabilitySection`
- `ReportExportSet`
- safe source/generated/artifact refs
