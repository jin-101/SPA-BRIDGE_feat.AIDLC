# V2-GAP-UOW-00 Business Logic Model

## Dependency Decision Flow

1. Load source `dependencies` and `devDependencies`.
2. Normalize package names and versions.
3. Apply deterministic removal patterns.
4. Apply deterministic replacement rules.
5. Apply framework-neutral carry allowlist.
6. Send remaining unknown packages to the shared Ollama advisor only when enabled and policy-safe.
7. Validate any Ollama response against the dependency advisor schema.
8. Convert invalid or low-confidence advisory responses to `review`.
9. Build the target dependency manifest from carried and replacement packages.
10. Generate compatibility diagnostics and report artifacts.

## Deterministic Registry Precedence

Ordering:

1. Explicit replacement rule.
2. Explicit removal rule.
3. Explicit carry allowlist.
4. High-risk pattern rule.
5. Ollama advisory fallback.
6. Default review decision.

## WDS Replacement Logic

Input:
- `@wds/wc-angular-lib`: `0.1.43`

Output:
- remove `@wds/wc-angular-lib`.
- add `@wds/wc-react-lib`: `0.1.43`.
- add rationale: custom WDS Angular wrapper has React-specific companion package at same version.
- add usage-site review requirement: true.
- scan source import/template evidence for package usage.
- emit usage-site review findings for imports/selectors unless explicit conversion rules exist.

## Interactive CLI Safeguard

When running interactively:

- show dependency decisions before writing target files.
- allow developer confirmation for replace/remove/review decisions.
- record confirmed decisions in the compatibility report.

When running non-interactively:

- apply deterministic registry decisions.
- apply policy-safe defaults for unknowns.
- record all review-required decisions in the report.

## Ollama Advisory Schema

The shared Ollama advisor should return schema-shaped data:

Fields:
- `decision`
- `riskLevel`
- `targetPackageName`
- `targetVersion`
- `rationale`
- `usageSiteReviewRequired`
- `suggestedCodeChange`
- `confidence`

Schema failure behavior:
- classify as `review`.
- preserve package out of install if high-risk.
- emit diagnostic explaining advisory parsing failure.

## Testable Properties

- Invariant: every input dependency appears in exactly one classification bucket.
- Invariant: target dependency manifest has no duplicate package names.
- Invariant: removed Angular-only packages do not appear in target dependencies.
- Determinism: identical source dependency manifests produce identical decisions.
- Determinism: malformed advisory outputs produce stable review diagnostics.
