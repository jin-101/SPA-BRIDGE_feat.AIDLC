# V2-GAP-UOW-00 Business Rules

## Classification Rules

- Every source dependency must be classified into exactly one final decision: `carry`, `replace`, `remove`, or `review`.
- Deterministic registry rules take precedence over Ollama-assisted suggestions.
- Angular-only packages must not appear in generated React target dependencies.
- High-risk Angular wrapper packages such as `ngx-*` and `angularx-*` are excluded by default unless a deterministic replacement rule exists.
- Framework-neutral runtime packages may be carried over when they are likely still referenced by generated code.
- Unknown low-risk packages may be carried over with rationale.
- Unknown high-risk packages must be excluded or marked review-required with diagnostics.

## Replacement Rules

- Known replacements must be declared in a deterministic registry.
- Replacement output must not contain duplicate package keys.
- React/core target dependencies remain authoritative over source dependency carry-over.
- Replacement rules must include rationale and usage-site review policy.

## WDS Package Rule

- `@wds/wc-angular-lib@0.1.43` is replaced with `@wds/wc-react-lib@0.1.43` in generated `package.json`.
- The version is preserved when the source version is `0.1.43`.
- The converter must not assume API parity between the Angular and React WDS packages.
- Any import/template usage from `@wds/wc-angular-lib` must produce a usage-site review diagnostic unless an explicit compatibility rewrite rule verifies the import, props, events, and initialization shape.

## Ollama Advisory Rules

- Shared Ollama integration is advisory unless the user confirms the generated decision through CLI or a persisted policy.
- Ollama output must be parsed through strict schema validation.
- Invalid, partial, or non-deterministic Ollama output must degrade to `review`.
- Ollama-generated rationale may enrich reports, but deterministic rules decide known package outcomes.
- Ollama must not receive registry credentials, tokens, or sensitive package configuration.

## Reporting Rules

- Generate a durable compatibility report for carried, removed, replaced, and review-required packages.
- Report package names and safe rationale, but do not include private registry auth details.
- Removed packages should include suggested React alternatives when available.
- Usage-site findings must include source refs and manual review status.

## Verification Rules

- Unit tests must assert Angular-only packages are excluded.
- Unit tests must assert WDS replacement is included.
- Unit tests must assert unknown high-risk package diagnostics are stable.
- Full network `npm install` validation remains delegated to the self-correction UOW.
