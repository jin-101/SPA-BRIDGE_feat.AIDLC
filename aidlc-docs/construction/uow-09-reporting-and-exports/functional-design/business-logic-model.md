# Business Logic Model - UOW-09 Reporting and Exports

## Purpose

UOW-09 builds the canonical conversion evidence package for SPA-Bridge. It converts typed run, analysis, transformation, provider, target-generation, quality, diagnostic, and traceability inputs into a single canonical report model, then derives deterministic JSON, Markdown, and sanitized HTML exports from that model.

## Business Capabilities

| Capability | Description | Primary Output |
|---|---|---|
| Report input aggregation | Accept typed input bundles from prior units and normalize them into report-ready sections | `ReportInputBundle` |
| Canonical report building | Build one stable JSON report as the source of truth for CLI, Web UI, and exported artifacts | `CanonicalConversionReport` |
| Diagnostic grouping | Group diagnostics and manual review items by severity, source artifact, generated artifact, story area, and review category | `ReviewGroup[]` |
| Quality summary building | Summarize gate status, self-correction attempts, PBT outcomes, evidence counts, and conversion-quality target evaluation | `QualityReportSection` |
| AI decision summarization | Record provider-neutral AI-assisted decision summaries without raw prompts, raw responses, or raw source snippets | `AiDecisionSection` |
| Traceability indexing | Surface source refs, generated refs, artifact refs, and synthetic origins for generated output and review items | `TraceabilitySection` |
| Export rendering | Render canonical JSON, Markdown, and sanitized HTML from the canonical model | `ReportExportSet` |
| Sanitized view modeling | Create CLI/Web UI-ready view models with escaped text, safe refs, reason codes, and redacted values | `ReportViewModel` |

## End-to-End Flow

1. **Receive typed inputs**
   - The report builder receives a `ReportInputBundle`.
   - Inputs come from application run metadata, source analysis, transformation, provider refinement, target generation, quality gates, diagnostics, security/audit summaries, and traceability producers.

2. **Validate and normalize**
   - Required run metadata, correlation ID, report version, and target strategy are validated.
   - All arrays are normalized to stable ordering.
   - Unsafe raw content fields are rejected or converted into safe diagnostics.

3. **Build canonical report**
   - A `CanonicalConversionReport` is created with stable sections:
     - run metadata
     - source inventory
     - conversion output
     - diagnostics
     - AI-assisted decisions
     - manual review items
     - quality results
     - traceability
     - export metadata

4. **Group stakeholder review data**
   - Diagnostics and review items are grouped by severity first, then by source artifact, generated artifact, story area, and category.
   - Grouping is deterministic so repeated runs with equivalent input produce equivalent reports.

5. **Evaluate quality target**
   - The report evaluates the configured conversion-quality target.
   - The initial MVP target is represented as an 85 percent threshold unless configuration provides a stricter value.
   - The report records whether the target is met, not just the raw score.

6. **Render exports**
   - JSON export is the canonical model serialization.
   - Markdown and HTML are derived views.
   - HTML rendering escapes all text and uses only sanitized, allowlisted sections.

7. **Return export set**
   - The result includes the canonical report, rendered exports, export metadata, and report diagnostics.

## Functional Boundaries

| In Scope | Out of Scope |
|---|---|
| Canonical JSON report model | CLI command parsing |
| Markdown export rendering | Web UI interaction components |
| Sanitized HTML export rendering | External storage or deployment |
| Report validation and deterministic sorting | Running source conversion or quality gates |
| Report view model adapters | Raw prompt/source capture |

## Report Section Model

| Section | Required | Contents |
|---|---|---|
| `metadata` | Yes | Report ID, version, generated timestamp, correlation ID, run ID, project label, source framework, target framework |
| `sourceInventory` | Yes | Source artifact counts, detected categories, source diagnostics, safe source refs |
| `conversionOutput` | Yes | Generated file specs, target project summary, converted/unresolved counts |
| `diagnostics` | Yes | Safe diagnostics grouped by severity and category |
| `aiDecisions` | No | Provider-neutral AI-assisted decision summaries, policy status, confidence/provenance |
| `manualReview` | Yes | Review items, remediation hints, source/generated refs, requirement/story links |
| `quality` | Yes | Gate status, PBT outcomes, evidence counts, correction attempts, target evaluation |
| `traceability` | Yes | Source-to-output mappings, synthetic origins, artifact refs |
| `exports` | Yes | Available export formats, content hashes, renderer versions |

## Quality Target Logic

The report calculates quality target status from report input metrics:

| Metric | Meaning |
|---|---|
| `convertedArtifactCount` | Number of artifacts converted or generated successfully |
| `totalCandidateArtifactCount` | Number of source artifacts considered in conversion scope |
| `blockingReviewItemCount` | Number of unresolved items that block acceptance |
| `qualityGateStatus` | Aggregated quality status from UOW-08 |
| `conversionQualityScore` | `convertedArtifactCount / totalCandidateArtifactCount`, with zero-safe handling |
| `targetMet` | `conversionQualityScore >= configuredTarget` and no blocking quality status |

The default target is 85 percent. A run can pass the numeric target while still requiring manual review if non-blocking review items remain.

## Diagnostic and Review Grouping Rules

Diagnostics and review items are grouped using this stable precedence:

1. Severity: `critical`, `blocking`, `warning`, `info`
2. Source artifact ref
3. Generated artifact ref
4. Story or requirement area
5. Review category
6. Stable item ID

The grouping output is intended for both human review and machine automation.

## AI-Assisted Decision Rules

AI-assisted decisions are reported as safe summaries only:

- Include provider ID, provider category, policy decision, confidence range, provenance ref, mapping request ID, and safe rationale.
- Exclude raw prompts, raw provider responses, raw source snippets, secrets, and masked original values.
- Reference related manual review items when confidence is low or mapping is lossy.

## Sanitized Export Rules

All human-readable exports are rendered from sanitized view models:

- Markdown escapes table delimiters and unsafe inline HTML.
- HTML escapes all text content and does not render raw source.
- Links are represented as safe artifact refs, not arbitrary filesystem paths.
- Redacted values remain redacted; the report never performs unmasking.

## Testable Properties

| Component | Property Category | Property |
|---|---|---|
| Canonical report serializer | Round-trip | JSON serialization and deserialization preserve the canonical report structure |
| Report section normalizer | Idempotence | Normalizing an already normalized report input yields the same normalized result |
| Diagnostic grouper | Invariant | Grouping preserves diagnostic and review item counts |
| Diagnostic grouper | Determinism | Equivalent inputs produce the same group order and stable IDs |
| Sanitized renderer | Idempotence | Sanitizing safe text twice yields the same rendered value |
| Markdown/HTML renderers | Export stability | Equivalent reports render byte-stable exports |
| Traceability validator | Invariant | Every generated output reference has source or synthetic origin coverage |

## Example-Based Scenarios

- Build a report for a successful conversion with no manual review items.
- Build a report for a partial conversion with blocking review items.
- Build a report with AI-assisted decisions and verify raw prompts are absent.
- Render Markdown and HTML exports with unsafe characters and verify escaping.
- Evaluate the 85 percent quality target for passing and failing conversion scores.

## Security Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-03 | Compliant | Reports consume safe structured events and must not log or render sensitive raw content. |
| SECURITY-05 | Compliant | Report input bundles are typed and validated before report generation. |
| SECURITY-10 | N/A | Dependency pinning is handled during NFR/code generation; no package dependencies are added in this design artifact. |
| SECURITY-11 | Compliant | Sensitive rendering is isolated in sanitized helpers and report builders never unmask values. |
| SECURITY-13 | Compliant | Canonical JSON validation and export hashes support report artifact integrity. |

## PBT Compliance Summary

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Testable properties are identified for report serialization, grouping, sanitization, export, and traceability. |
| PBT-02 | Compliant | Canonical JSON serialization/deserialization requires round-trip testing. |
| PBT-03 | Compliant | Grouping and traceability invariants are identified. |
| PBT-04 | Compliant | Normalization and sanitization idempotence are identified. |
| PBT-07 | Compliant | Code generation must provide domain generators for reports, diagnostics, review items, and traces. |
| PBT-08 | Compliant | PBT replay and seed handling will use the existing fast-check strategy. |
| PBT-09 | Compliant | TypeScript uses fast-check, already established in the workspace. |
| PBT-10 | Compliant | Example-based reporting scenarios are listed alongside property tests. |
