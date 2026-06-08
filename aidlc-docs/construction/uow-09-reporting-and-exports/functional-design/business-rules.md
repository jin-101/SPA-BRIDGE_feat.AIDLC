# Business Rules - UOW-09 Reporting and Exports

## Report Construction Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| RPT-001 | A report must be built from a typed `ReportInputBundle`; arbitrary workspace file scraping is not allowed. | Reject invalid inputs with safe diagnostics. |
| RPT-002 | Canonical JSON is the source of truth for all exports. | Markdown and HTML renderers must consume the canonical model. |
| RPT-003 | Report IDs, section IDs, item IDs, and export refs must be stable for equivalent inputs. | Use deterministic sorting and stable hashing. |
| RPT-004 | Required sections must always be present, even when empty. | Emit empty stable sections rather than omitting them. |
| RPT-005 | Report generation must preserve partial evidence when non-blocking sections contain errors. | Return partial report plus diagnostics when safe. |

## Data Inclusion Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| RPT-101 | Reports must list converted files, generated files, unresolved mappings, AI-assisted decisions, manual review items, and quality results. | Validate section completeness before export. |
| RPT-102 | Every generated artifact report item must include a generated ref and either a source ref or a synthetic origin. | Fail report validation for missing trace coverage. |
| RPT-103 | Manual review items must include severity, category, reason code, remediation hint, and relevant artifact refs. | Reject malformed review items. |
| RPT-104 | AI-assisted decisions must be provider-neutral and include safe provenance metadata. | Strip provider-specific raw details from report sections. |
| RPT-105 | Quality summaries must include gate status, PBT outcome, correction attempt count, evidence count, and target evaluation. | Validate quality section fields. |

## Grouping and Ordering Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| RPT-201 | Diagnostics and manual review items must be grouped by severity, source artifact, generated artifact, story area, and review category. | Use shared grouping policy. |
| RPT-202 | Severity order is `critical`, `blocking`, `warning`, `info`. | Unknown severities become validation diagnostics. |
| RPT-203 | Within a group, items must be sorted by stable item ID. | Sort before rendering and serialization. |
| RPT-204 | Export section ordering must be deterministic across JSON, Markdown, and HTML. | Renderer tests must assert stable output. |

## Quality Target Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| RPT-301 | The default conversion quality target is 85 percent. | Use default when no stricter configured target is present. |
| RPT-302 | A quality target is met only when the score is at or above target and no blocking quality status remains. | Compute `targetMet` from score and blocking status. |
| RPT-303 | A numeric pass does not hide unresolved non-blocking review items. | Report remaining review counts separately. |
| RPT-304 | Quality evidence must be bounded and summarized; reports must not embed unbounded logs. | Store counts, refs, and safe summaries. |

## Security and Sanitization Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| RPT-401 | Reports must not include raw prompts, raw provider responses, raw source snippets, secrets, masked original values, passwords, or tokens. | Forbidden-field validation rejects unsafe values. |
| RPT-402 | The report builder must never unmask or restore sensitive values. | Only redacted display values are accepted. |
| RPT-403 | Markdown exports must escape unsafe table and inline content. | Use sanitized Markdown renderer helpers. |
| RPT-404 | HTML exports must escape all text and avoid direct raw HTML injection. | Use sanitized HTML renderer helpers. |
| RPT-405 | Filesystem paths in reports must be target/source relative safe refs, not arbitrary absolute paths. | Validate refs before rendering. |

## Export Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| RPT-501 | JSON export must be canonical and schema-valid. | Validate before returning export set. |
| RPT-502 | Markdown export must be human-readable and grouped for stakeholder review. | Render from report view model. |
| RPT-503 | HTML export must be sanitized and suitable for local review. | Render escaped HTML only. |
| RPT-504 | Each export must include format, renderer version, generated timestamp, and content hash metadata. | Build export metadata after rendering. |
| RPT-505 | Export failures must produce safe diagnostics without leaking source content. | Convert renderer failures to report diagnostics. |

## Error Handling Rules

| Rule ID | Rule | Enforcement |
|---|---|---|
| RPT-601 | Fatal schema errors prevent export generation. | Return failed result with safe diagnostics. |
| RPT-602 | Non-fatal section issues can produce a partial canonical report if unsafe content is not present. | Mark report as partial and include review items. |
| RPT-603 | Unsafe content detection fails closed for the affected section. | Do not render unsafe section content. |
| RPT-604 | Duplicate report item IDs are blocking validation errors. | Reject report until IDs are unique. |

## PBT Rules

| Rule ID | Rule | Property Category |
|---|---|---|
| RPT-PBT-001 | Canonical report JSON serialization must round-trip. | Round-trip |
| RPT-PBT-002 | Report normalization must be idempotent. | Idempotence |
| RPT-PBT-003 | Grouping must preserve the count of diagnostics and review items. | Invariant |
| RPT-PBT-004 | Equivalent report inputs must produce equivalent ordered sections and exports. | Determinism |
| RPT-PBT-005 | Sanitization must be idempotent for already safe values. | Idempotence |
| RPT-PBT-006 | Every generated artifact ref must have trace coverage or a synthetic origin. | Invariant |

## Review Completion Criteria

Functional design for UOW-09 is complete when:

- Canonical report sections and input bundles are defined.
- Report grouping and quality target logic are explicit.
- Security rules prevent raw sensitive content from entering reports.
- Export rendering is derived from the canonical report model.
- PBT properties are identified for reporting-sensitive logic.
