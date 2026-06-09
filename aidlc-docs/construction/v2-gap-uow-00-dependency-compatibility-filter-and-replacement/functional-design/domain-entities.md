# V2-GAP-UOW-00 Domain Entities

## DependencyCompatibilityDecision

Represents the final classification for one source package.

Fields:
- `packageName`: source package name.
- `sourceVersion`: source version string.
- `decision`: `carry`, `replace`, `remove`, or `review`.
- `targetPackageName`: replacement package name when decision is `replace`.
- `targetVersion`: replacement version.
- `riskLevel`: `low`, `medium`, `high`, or `unknown`.
- `sourceCategory`: `angular-core`, `angular-wrapper`, `ngrx`, `build-tool`, `framework-neutral`, `custom`, or `unknown`.
- `rationale`: safe explanation for the decision.
- `usageSiteReviewRequired`: whether import/template usage must be reviewed.

## DependencyReplacementRule

Represents deterministic package replacement policy.

Fields:
- `sourcePackage`
- `targetPackage`
- `versionPolicy`: `preserve`, `fixed`, or `latest-compatible`.
- `fixedVersion`: optional version used when version policy is `fixed`.
- `rationale`
- `usageSiteReviewPolicy`: `always`, `when-unverified`, or `none`.
- `knownImportRewriteRules`: optional import rewrite rules.

Required custom rule:
- `@wds/wc-angular-lib@0.1.43` -> `@wds/wc-react-lib@0.1.43`
- Version policy: `preserve`.
- Usage-site review policy: `when-unverified`.

## DependencyClassificationRegistry

Contains deterministic rules used before any AI-assisted fallback.

Rule groups:
- removal patterns for Angular-only packages.
- replacement mappings for known wrappers/custom packages.
- carry allowlist for framework-neutral packages.
- review patterns for high-risk unknown packages.

## OllamaDependencyAdvisor

Represents the optional shared local LLM advisory path.

Responsibilities:
- classify unmapped packages using strict JSON schema output.
- generate rationale text for diagnostics.
- suggest React alternatives for removed wrappers.
- generate suggested code-change snippets for review artifacts.

Constraints:
- uses the existing project-wide Ollama client/service only.
- never fetches packages or executes package scripts.
- never directly overrides deterministic registry rules.
- non-schema or low-confidence output is downgraded to `review`.

## DependencyCompatibilityReport

Persistent artifact that explains generated package decisions.

Sections:
- Carried
- Replaced
- Removed
- Review Required
- WDS Custom Package Compatibility
- Suggested Code Changes

## UsageSiteCompatibilityFinding

Represents a source usage that may not be API-compatible after replacement.

Fields:
- `sourcePackage`
- `targetPackage`
- `sourceRef`
- `usageKind`: `import`, `template-selector`, `style`, `module-provider`, or `unknown`.
- `message`
- `suggestedCodeChange`
- `manualReviewRequired`
