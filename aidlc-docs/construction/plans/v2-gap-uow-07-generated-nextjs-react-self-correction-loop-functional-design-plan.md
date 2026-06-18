# V2-GAP-UOW-07 Generated Next.js/React Self-Correction Loop Functional Design Plan

## Unit Context

V2-GAP-UOW-07 closes the runtime-parity gap between "files were generated" and "the generated Next.js project can actually be installed, checked, built, and started." The unit adds a bounded validation and correction loop around generated output so an Angular repository conversion produces a Next.js repository with the best possible install/dev readiness.

## Recommended Defaults

For the current product goal, the recommended answer for every question is A. The A options prioritize generated Next.js project usability, deterministic correction first, local-first Ollama AI refinement when safe, explicit external LLM policy gates, and clear manual-review diagnostics for unresolved issues.

## Functional Design Tasks

- [x] Confirm generated target validation command scope and safety boundary.
- [x] Confirm deterministic fixer categories and retry limits.
- [x] Confirm local-first AI refinement role and external provider policy.
- [x] Confirm quality artifact/reporting integration.
- [x] Confirm tests and property-based invariants.
- [x] Generate functional design artifacts after answers are approved.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
What should the generated target validation loop run by default?

A) Run dependency install planning/validation, typecheck, build, lint when configured, and optional smoke-start checks inside the generated Next.js output root
B) Only check that files were written successfully
C) Only run TypeScript typecheck without dependency or build validation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
How should command execution boundaries be enforced?

A) Use a strict command allowlist, generated-output-root path containment, timeout guards, safe environment variables, and non-interactive execution
B) Let the generated project run any package script defined by converted dependencies
C) Skip command execution and leave validation to the user
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
What should be the correction strategy when validation fails?

A) Apply deterministic fixers first, rerun bounded validation, then use policy-controlled AI refinement only for safe unresolved issues
B) Send the entire generated project to an AI provider immediately
C) Stop at the first failure and provide only the raw command output
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
Which deterministic fixer categories should be included first?

A) Next.js client boundaries, missing helper imports, package manifest gaps, dependency replacement issues, path aliases, TypeScript config, import paths, style/module references, and generated file naming
B) Only formatting fixes
C) Only package.json dependency fixes
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
How should AI refinement be applied?

A) Use local Ollama EXAONE 3.5 by default with minimized safe context, and allow external LLM calls only after UOW-05 policy approval and context masking
B) Always call an external LLM provider for build errors
C) Disable AI refinement completely
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
How should failed validation output be represented?

A) Produce structured diagnostics with command kind, sanitized error category, affected safe refs, applied fixes, remaining blockers, and manual-review actions
B) Store full raw stdout/stderr including source snippets and environment details
C) Only print a single generic failure message
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
What generated quality artifacts should this unit produce?

A) Generate `.spa-bridge/quality-gate-results.json`, update `src/review/runtime-parity-quality.json`, and include correction-loop results in CLI/reporting exports
B) Do not write quality artifacts
C) Only write a plain text log file
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
How should package manager behavior be selected?

A) Default to npm for generated Next.js projects, detect package-manager hints when safe, and keep lockfile generation deterministic or explicitly reported
B) Always force yarn
C) Copy the Angular repository's package manager behavior without compatibility filtering
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
What should happen when the loop cannot safely fix a problem?

A) Preserve the generated project, emit precise manual-review diagnostics, mark the quality gate as blocked or degraded, and avoid unsafe guesses
B) Delete the generated output and fail the whole conversion
C) Hide the issue if most files were generated
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
What should be the blocking test focus for this unit?

A) Command planning safety, path containment, deterministic fixer idempotence, bounded retries, sanitized diagnostics, policy enforcement, quality artifact stability, and generated Next.js sample validation
B) Only example tests for happy-path file generation
C) No automated tests because validation depends on external package installs
X) Other (please describe after [Answer]: tag below)

[Answer]: A
