# NFR Design Plan - UOW-02 Core Application Orchestration and Run Workspace

## Unit Context

- **Unit**: UOW-02 Core Application Orchestration and Run Workspace
- **Primary Package**: `packages/core-application`
- **NFR Requirements Status**: Complete
- **Key NFRs**: no new runtime dependencies, schema-first validation, safe path normalization, atomic writes, under-50ms run status lookup, runId isolation, deterministic resume, fail-closed provider policy, structured events, PBT/stateful PBT.

## Purpose

Translate UOW-02 NFR requirements into concrete design patterns and logical components for the shared application orchestration layer.

## Checklist

- [x] Load UOW-02 NFR requirements artifacts.
- [x] Identify NFR design decision areas.
- [x] Create NFR design plan with questions.
- [x] Wait for user answers to all `[Answer]:` tags.
- [x] Validate answers for completeness, contradictions, and ambiguity.
- [x] Resolve follow-up questions if needed.
- [x] Generate `nfr-design-patterns.md`.
- [x] Generate `logical-components.md`.
- [x] Validate Security Baseline compliance.
- [x] Validate PBT compliance.
- [x] Present NFR Design completion message for review.

## Answer Validation

- **Completeness**: All 10 answers are present.
- **Validity**: All answers use valid letter choices.
- **Contradictions**: None detected.
- **Ambiguities**: None detected.
- **Follow-up Questions**: Not required.

## Approved NFR Design Choices

- **Config Resolution**: Schema-first pipeline: load raw config, overlay overrides, normalize defaults, validate effective config.
- **Path Safety**: `PathGuard` component canonicalizes workspace/input/output paths and returns typed path refs.
- **Atomic Writes**: `AtomicArtifactWriter` component with temp artifact path, validate, promote, and cleanup semantics.
- **Manifest Lifecycle**: Explicit state machine with allowed transitions and checkpoint metadata.
- **Run Isolation**: Per-run context object and per-run workspace lock metadata; no process-global mutable run state.
- **Status Lookup**: Read by runId using manifest/status snapshot path; no directory-wide scans.
- **Provider Policy**: `PolicyGate` component returns explicit allow/deny/block decisions before provider-adjacent workflow steps.
- **Structured Events**: In-process event publisher using `LoggerPort`/`AuditPort` with safe event schemas.
- **Resume Plan**: `ResumePlanner` derives deterministic plan from validated manifest, checkpoints, and completed step list.
- **PBT Organization**: Dedicated test model/generator components for config merges, path refs, manifest commands, and resume plans.

## Questions

Please answer each question by filling in the letter choice after the `[Answer]:` tag. If none of the options match your needs, choose `X) Other` and describe your preference after the tag.

### Question 1
config resolution design pattern은 어떻게 구성할까요?

A) Schema-first config pipeline: load raw config, overlay overrides, normalize defaults, validate effective config
B) Simple merge function plus validation at caller boundary
C) Command-specific config resolvers for CLI and Web UI separately
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
path safety design은 어떤 패턴으로 둘까요?

A) PathGuard component that canonicalizes workspace/input/output paths and returns typed path refs
B) Inline path checks in each service method
C) Rely on FileSystemPort implementations for path containment
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
atomic write design은 어떻게 표현할까요?

A) AtomicArtifactWriter component with temp artifact path, validate, promote, and cleanup semantics
B) ManifestRepository overwrite with retry
C) Append-only event writer only; manifest derived later
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4
manifest lifecycle resilience pattern은 어떻게 설계할까요?

A) Explicit state machine with allowed transitions and checkpoint metadata
B) Status enum updates with validation only at write time
C) Event list only, no state machine
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5
concurrency/run isolation pattern은 어떻게 둘까요?

A) Per-run context object and per-run workspace lock metadata, no process-global mutable run state
B) In-memory active run registry only
C) Single-run execution assumption with later concurrency retrofit
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
run status lookup performance pattern은 어떻게 둘까요?

A) Read by runId using manifest/status snapshot path; no directory-wide scans
B) Maintain in-memory status cache only
C) Scan `.spa-bridge/runs` and sort recent runs for status lookup
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 7
provider policy fail-closed design은 어떻게 구성할까요?

A) PolicyGate component that returns explicit allow/deny/block decisions before provider-adjacent workflow steps
B) Workflow step checks provider mode directly
C) Defer all provider policy checks to UOW-05 concrete implementation
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 8
structured event/audit design은 어떻게 둘까요?

A) EventBus-like in-process publisher using LoggerPort/AuditPort with safe event schemas
B) Direct LoggerPort calls from each module
C) Store events only in manifest and skip logger/audit ports for now
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 9
resume plan design은 어떤 패턴이 적절할까요?

A) ResumePlanner derives deterministic plan from validated manifest, checkpoints, and completed step list
B) Resume directly reuses latest checkpoint without replay planning
C) Resume is a thin alias for restart with previous config
X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 10
PBT/stateful testing design은 어떻게 조직할까요?

A) Dedicated test model/generator components for config merges, path refs, manifest commands, and resume plans
B) Colocate generators inside each test file only
C) Use example-based tests now and add PBT in Build/Test later
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Content Validation Notes

- No Mermaid diagrams are included in this plan.
- No ASCII diagrams are included in this plan.
- Generated NFR design artifacts will use Markdown tables and text sections.
