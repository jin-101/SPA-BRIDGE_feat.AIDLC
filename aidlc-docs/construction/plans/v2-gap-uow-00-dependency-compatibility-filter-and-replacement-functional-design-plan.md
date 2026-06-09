# V2-GAP-UOW-00 Dependency Compatibility Filter and Replacement Functional Design Plan

## Unit

V2-GAP-UOW-00 Dependency Compatibility Filter and Replacement

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-000 Dependency Compatibility Filter And Replacement

## Goal

Prevent generated React projects from failing `npm install` because Angular-only packages are copied from the source Angular project. Replace known Angular wrapper packages with React/framework-neutral equivalents when safe, and generate manual-review diagnostics when usage-site compatibility is uncertain.

## Current Brownfield Baseline

Current target dependency generation filters these source packages:

- `@angular/*`
- `@ngrx/*`
- `@angular-devkit/*`
- `@schematics/*`
- `zone.js`
- `typescript`
- `webpack`

Known gap:

- Angular wrapper packages outside those patterns can still be carried over.
- `ngx-*`, `angularx-*`, and custom Angular-only packages can cause install-time peer dependency conflicts.
- Known replacements are not represented in a dedicated replacement registry.
- Usage-site API differences are not reported with enough specificity.

## Proposed Functional Design

### 1. Dependency Compatibility Classifier

Classify source dependencies into:

- `carry`
- `replace`
- `remove`
- `review`

### 2. Replacement Rule Registry

Add explicit replacement rules for known Angular wrappers and custom packages.

Initial custom rule:

- `@wds/wc-angular-lib@0.1.43` -> `@wds/wc-react-lib@0.1.43`

This rule is dependency-manifest safe but usage-site uncertain. Generated reports must mark usage sites as review-required unless import and component API conversion rules verify compatibility.

### 3. Target Manifest Integration

Update target React dependency manifest generation so:

- removed packages are excluded.
- replacement packages are inserted with explicit rationale.
- React/core target dependencies remain authoritative.
- carried packages are sorted deterministically.

### 4. Usage-Site Diagnostics

Where source imports or template selectors suggest removed/replaced Angular wrapper package usage:

- emit manual-review diagnostics.
- include safe source refs.
- include package replacement rationale.
- avoid claiming API parity unless a rule exists.

### 5. Reporting

Generate a dependency compatibility report with:

- carried packages.
- removed packages.
- replaced packages.
- review-required packages.
- replacement rationale and usage-site warnings.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
How should Angular-only dependency filtering behave?

A) Remove known Angular-only packages by default and emit dependency compatibility diagnostics
B) Keep all source dependencies and let `npm install` reveal conflicts
C) Remove only `@angular/*` packages
X) Other (please describe after [Answer]: tag below)

[Answer]: X
Implement an AI-powered hybrid dependency filtering system that integrates with the project's existing shared Ollama client to dynamically evaluate, clean, and map packages.

#### Detailed Description:
1. **Rule-Based Mapping**: Pre-approve and replace core Angular packages with their React equivalents using a transparent, built-in database (e.g., `@angular/forms` ➡️ `react-hook-form`).
2. **Shared Ollama Integration**: For packages not covered by the built-in database, route them through the project's existing common `OllamaClient` / `LlmService`. This avoids bootstrapping a new AI module and directly reuses the shared local LLM infrastructure.
3. **AI-Driven Fallback**: The shared Ollama client will analyze the package context to infer whether it should be removed, replaced, or flagged. 
4. **Interactive CLI Safeguard**: Display the combined results (Built-in + Ollama inference) in an interactive CLI prompt for developer confirmation (Y/N) before editing files.

Recommendation: A. It directly addresses install failures while preserving traceability.

### Question 2
How should known package replacements be managed?

A) Use a deterministic replacement registry with package name, target package, version policy, rationale, and usage-site review policy
B) Hardcode replacements inside target package generation only
C) Do not replace packages automatically
X) Other (please describe after [Answer]: tag below)

[Answer]: A
We will adopt a deterministic replacement registry as the core architecture foundation, enriched by the shared project-wide Ollama service for contextual metadata generation and out-of-registry edge cases.

#### Detailed Implementation:
1. **Deterministic Registry**: Maintain an internal `config/mapping.json` file containing explicit fields: `sourcePackage`, `targetPackage`, `versionPolicy`, `rationale`, and `usageSiteReviewPolicy`.
2. **AI-Assisted Rationale Generation**: During internal database maintenance, the project's existing Ollama client will automatically generate the `rationale` and `usageSiteReviewPolicy` markdown texts, significantly reducing manual documentation overhead.
3. **Structured AI Fallback**: If an entry is missing during migration, the shared Ollama client is invoked with a strict JSON Schema prompt to dynamically output an on-the-fly registry entry matching our schema.

Recommendation: A. A registry is auditable and easier to expand safely.

### Question 3
How should `@wds/wc-angular-lib@0.1.43` be handled?

A) Replace with `@wds/wc-react-lib@0.1.43` in `package.json`, but mark all usage sites review-required unless explicit compatibility rules verify imports/props/events
B) Replace package name and assume all usage code is compatible
C) Do not replace it; remove it and require manual installation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

Recommendation: A. Package-level replacement is reasonable, but API parity should not be assumed.

### Question 4
How should wrapper packages such as `ngx-*` and `angularx-*` be treated?

A) Remove or replace by known rules; otherwise classify as review-required and exclude from generated install by default
B) Carry them over because they may still contain useful runtime code
C) Keep only packages with matching versions in npm
X) Other (please describe after [Answer]: tag below)

[Answer]: A
Enforce strict exclusion for unmapped framework-bound wrappers, while utilizing the project's existing Ollama setup to scout for non-angular alternatives.

#### Detailed Description:
1. **Safe Exclusion**: Unmapped `ngx-*` or `angularx-*` packages are excluded from the target installation list to prevent fatal React runtime crashes.
2. **Ollama Alternative Discovery**: The shared Ollama client scans the names and descriptions of excluded wrappers to query its knowledge base and suggest modern React alternatives (e.g., recommending `react-toastify` for `ngx-toastr`).
3. **Actionable Removal Logs**: Write a dedicated section in `compatibility-diagnostics.md` pairing the removed wrapper with Ollama's recommended React alternative and basic setup steps.

Recommendation: A. These commonly have Angular peer dependencies and can break React installs.

### Question 5
How should framework-neutral libraries be treated?

A) Carry them over when they are not Angular-only and are likely still referenced by generated code
B) Remove all source dependencies except React
C) Convert every source dependency to a React-specific replacement
X) Other (please describe after [Answer]: tag below)

[Answer]: A
Preserve all runtime-essential framework-neutral packages, using the project's common Ollama infrastructure to dynamically classify package neutrality.

### Detailed Description:
1. **Neutrality Verification via Ollama**: Pass unmapped packages to the existing project-wide Ollama service. The prompt will classify the package as `framework-neutral` (e.g., `lodash`, `axios`) or `framework-specific`.
2. **Automatic Carry-over**: Packages verified as neutral by Ollama are preserved in `package.json` without modifications, ensuring that core utility and business logic functions remain unbroken.
3. **Version Sanity Check**: Ollama checks the version string against known React environment constraints, printing warnings if a framework-neutral utility version is too outdated for the target environment.

Recommendation: A. Libraries such as `dayjs`, `mapbox-gl`, `lottie-web`, `uuid`, and `js-cookie` can remain useful.

### Question 6
How should unknown dependencies be handled?

A) Exclude high-risk unknowns with Angular-like naming and report manual review; carry low-risk unknowns with rationale
B) Carry every unknown package
C) Remove every unknown package
X) Other (please describe after [Answer]: tag below)

[Answer]: A
Utilize the existing project-wide Ollama infrastructure to dynamically assess the risk of unknown packages, isolating high-risk dependencies while preserving low-risk ones.

#### Detailed Description:
1. **Ollama Risk Assessment**: Pass any unknown package names and descriptions to the shared `OllamaClient`. The LLM will classify the package into a predefined risk tier: `High-Risk` (Angular-tied) or `Low-Risk` (General JS/TS util).
2. **Isolate High-Risk Unknowns**: Packages flagged as `High-Risk` (e.g., packages using internal Angular decoratives or naming conventions) are excluded from the target `package.json` and logged in `compatibility-diagnostics.md` for manual review.
3. **Carry Low-Risk with Rationale**: `Low-Risk` unknowns are safely carried over. The shared Ollama instance will automatically generate a short string explaining the `rationale` for keeping them, printing it during the conversion process.

Recommendation: A. It avoids install breakage while not over-removing private/runtime libraries.

### Question 7
How should source imports from replaced packages be handled?

A) Generate manual-review diagnostics unless a specific import rewrite rule exists
B) Rewrite all import paths to the replacement package automatically
C) Leave imports unchanged
X) Other (please describe after [Answer]: tag below)

[Answer]: A
Enforce deterministic rewrites for explicit core package imports, and leverage the shared project-wide Ollama client to generate smart code-conversion snippets for unknown imports.

### Detailed Description:
1. **Deterministic Rewrite Rules**: Apply static replacement maps for core packages where exact import matching is known (e.g., rewriting `@angular/core` specific structures or well-defined equivalents).
2. **Ollama Import Resolution**: For third-party or custom imports without a predefined rewrite rule, extract the import statement along with its usage site and feed it into the shared `OllamaClient`.
3. **AI-Generated Transition Code**: The shared Ollama instance will infer the React equivalent syntax and automatically append a "Suggested Code Change" snippet directly inside the `compatibility-diagnostics.md` file, making it easy for developers to copy-paste the fix.

Recommendation: A. Import/export APIs may differ even when replacement packages are version-aligned.

### Question 8
How should this unit report dependency decisions?

A) Generate a dependency compatibility artifact listing carried, removed, replaced, and review-required packages with rationale
B) Only write the final `package.json`
C) Print dependency decisions only to CLI stdout
X) Other (please describe after [Answer]: tag below)

[Answer]: A
Generate a comprehensive Markdown artifact compiling all package transitions, seamlessly embedding the rationales and code hints generated by the shared Ollama client.

### Detailed Description:
1. **Unified Compatibility Artifact**: Generate a persistent file (e.g., `compatibility-diagnostics.md`) in the project root containing explicit sections for `Carried`, `Removed`, `Replaced`, and `Review-Required` dependencies.
2. **AI-Driven Report Enrichment**: Embed the contextual explanations (rationales) and React-equivalent code snippets fetched from the project's shared `OllamaClient` directly into the relevant sections of this document.
3. **Structured & Trackable Format**: Design the artifact using clean Markdown tables and task lists so that developers can use it as an actionable checklist during manual code review, ensuring no skipped steps.

Recommendation: A. The user needs a durable explanation when generated installs fail or require manual package work.

### Question 9
How should `npm install` compatibility be verified?

A) Add tests that assert Angular-only packages are excluded and replacement packages are included; final generated project install validation remains in self-correction UOW
B) Run real `npm install` for every generated target inside this unit
C) Skip install-related tests
X) Other (please describe after [Answer]: tag below)

[Answer]: A
Perform fast, deterministic package list assertions within this unit, while offloading actual heavy network install validation to the Self-Correction UOW utilizing the shared Ollama client.

### Detailed Description:
1. **Lightweight Unit Assertions**: Within this conversion unit, run fast unit tests that check if `package.json` correctly excludes Angular dependencies and includes the required React replacements. Do not trigger actual network requests here.
2. **Self-Correction UOW Hand-off**: Delegate the heavy validation (running actual `npm install`) to the downstream Self-Correction Unit of Work (UOW) pipeline.
3. **Shared Ollama Self-Healing**: If the actual `npm install` fails during the UOW phase due to peer dependency or version mismatches, invoke the existing project-wide `OllamaClient`. The LLM will parse the npm npm error log, infer the correct version alignment, and self-correct the `package.json` automatically.

Recommendation: A. It gives fast deterministic coverage now and leaves full install execution to the later quality loop.

### Question 10
What should be the blocking PBT focus?

A) Deterministic classification, stable replacement output, target package uniqueness, and stable diagnostics for unknown packages
B) PBT is not useful for dependency decisions
C) Only example-based dependency tests are needed
X) Other (please describe after [Answer]: tag below)

[Answer]: A
Establish rigorous Property-Based Testing (PBT) boundaries to ensure that even with dynamic inferences from the shared Ollama client, the system's output remains structurally stable and deterministic.

### Detailed Description:
1. **Classification & Uniqueness Invariants**: Run PBT using randomized hundreds of mock dependencies to assert that every package is sorted into exactly one of the four categories (carry/replace/remove/review) and that the generated `package.json` contains no duplicate package keys.
2. **AI Structural Stability Tests**: Since the project-wide `OllamaClient` handles unmapped dependencies, use PBT to mock various LLM response edge cases (e.g., unexpected markdown wraps or slightly altered text layouts) to verify that our parser always safely extracts stable JSON configurations without throwing runtime exceptions.
3. **Diagnostic Report Consistency**: Assert that the schema of the generated `compatibility-diagnostics.md` artifact remains unbroken and well-formed under any randomized combinatorics of unknown third-party packages.

Recommendation: A. Dependency classification has strong deterministic invariants.

## Plan Checklist

- [x] Identify source requirement and affected packages.
- [x] Define functional design scope.
- [x] Define proposed dependency compatibility model.
- [x] Generate functional design questions.
- [x] Collect user answers.
- [x] Analyze answers for ambiguity.
- [x] Generate functional design artifacts.
- [x] Present functional design completion for approval.

## Security Baseline Compliance

- Dependency decisions must not fetch packages or execute package scripts.
- Reports must not include sensitive private registry tokens or credentials.
- Unknown private package names may be shown as package names only, with safe rationale.
- Replacement rules must be deterministic and auditable.

## Property-Based Testing Compliance

Required properties:

- Same dependency manifest input produces the same classification output.
- Replacement output contains no duplicate package names.
- Removed Angular-only packages do not appear in target dependencies.
- Review diagnostics for unknown high-risk packages are stable.

## Approval Gate

Status: Functional design artifacts generated. Awaiting approval to continue to code generation planning.
