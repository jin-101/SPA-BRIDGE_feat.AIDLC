# V2 Gap Brownfield Workflow Plan

## Context

This plan starts a brownfield AI-DLC development track based on `aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`.

The original greenfield workflow completed UOW-01 through UOW-11. The workspace now contains implementation packages, tests, generated `dist` outputs, and post-greenfield conversion quality improvements. V2 gap work must therefore change existing packages rather than create a new greenfield system.

## Brownfield Assessment

- Existing implementation packages are present under `packages/`.
- Existing AI-DLC state exists in `aidlc-docs/aidlc-state.md`.
- Existing requirements and V2 delta requirements exist under `aidlc-docs/inception/requirements/`.
- Security Baseline extension is enabled.
- Property-Based Testing extension is enabled.
- Full reverse-engineering documentation is not required before this track because the package boundaries and previous UOW artifacts already document the implementation architecture.

## Source Requirements

- `requirements.md`
- `requirements_v2.md`
- `requirements_v2_gap_implementation_spec.md`

## Proposed Execution Mode

Use a focused brownfield construction loop:

1. Confirm V2 gap units of work.
2. For each V2 gap unit:
   - Create focused functional design when converter behavior is non-trivial.
   - Create focused code generation plan.
   - Implement code, tests, and diagnostics.
   - Run package-level and workspace-level verification.
3. Refresh build/test documentation after completing all V2 gap units.

## V2 Gap Units of Work

### V2-GAP-UOW-01 Dependency Alias and Path Mapping

Requirement coverage:
- V2-GAP-FR-006

Primary packages:
- `packages/source-angular`
- `packages/transform-angular-react`
- `packages/target-react`
- `packages/cli`

Goal:
- Preserve `tsconfig` paths, `baseUrl`, workspace/library references, package aliases, and Vite aliases so generated React imports resolve.

### V2-GAP-UOW-02 Advanced Template Conversion

Requirement coverage:
- V2-GAP-FR-004
- Supports V2-GAP-FR-003 and V2-GAP-FR-010

Primary packages:
- `packages/source-angular`
- `packages/transform-angular-react`
- `packages/target-react`

Goal:
- Convert `*ngIf`, `*ngFor`, `ng-template`, `ng-container`, `ng-content`, pipes, `ngClass`, `ngStyle`, and nested component inputs/outputs into JSX-oriented output.

### V2-GAP-UOW-03 Reactive Forms Conversion

Requirement coverage:
- V2-GAP-FR-003

Primary packages:
- `packages/source-angular`
- `packages/transform-angular-react`
- `packages/target-react`

Goal:
- Convert `FormGroup`, `FormControl`, `FormArray`, `FormBuilder`, validators, `formControlName`, `ngSubmit`, and template-driven form bindings into React form state and validation logic.

### V2-GAP-UOW-04 RxJS Conversion

Requirement coverage:
- V2-GAP-FR-001

Primary packages:
- `packages/source-angular`
- `packages/transform-angular-react`
- `packages/target-react`

Goal:
- Convert common observable, subject, subscribe, pipe, async pipe, and cleanup patterns into React hooks and safe cleanup behavior.

### V2-GAP-UOW-05 NgRx Conversion

Requirement coverage:
- V2-GAP-FR-002

Primary packages:
- `packages/source-angular`
- `packages/transform-angular-react`
- `packages/target-react`

Goal:
- Convert NgRx actions, reducers, selectors, effects, store usage, and entity adapter patterns into Redux Toolkit-oriented target output where practical.

### V2-GAP-UOW-06 Animation Conversion

Requirement coverage:
- V2-GAP-FR-005

Primary packages:
- `packages/source-angular`
- `packages/transform-angular-react`
- `packages/target-react`

Goal:
- Convert Angular animations and common third-party animation usage into CSS transitions, React hook wrappers, or reviewable animation adapters.

### V2-GAP-UOW-07 Generated React Self-Correction Loop

Requirement coverage:
- V2-GAP-FR-007

Primary packages:
- `packages/core-quality`
- `packages/adapters-ai`
- `packages/cli`
- `packages/target-react`

Goal:
- Run install/typecheck/build/lint validation against generated React output, apply deterministic fixers, and optionally use policy-controlled AI refinement.

## Recommended Order

1. V2-GAP-UOW-01 Dependency Alias and Path Mapping
2. V2-GAP-UOW-02 Advanced Template Conversion
3. V2-GAP-UOW-03 Reactive Forms Conversion
4. V2-GAP-UOW-04 RxJS Conversion
5. V2-GAP-UOW-05 NgRx Conversion
6. V2-GAP-UOW-06 Animation Conversion
7. V2-GAP-UOW-07 Generated React Self-Correction Loop

## Verification Strategy

Each V2 gap unit should include:

- Example-based regression tests.
- Property-based invariants where practical.
- Workspace `npm run build`.
- Workspace `npm test`.
- Manual-review diagnostic checks for unsupported mappings.

## Plan Checklist

- [x] Load AI-DLC common workflow rules.
- [x] Load current state and V2 gap requirements.
- [x] Detect brownfield package structure.
- [x] Identify V2 gap units of work.
- [x] Create brownfield workflow plan.
- [x] Receive explicit approval to start V2-GAP-UOW-01.
- [x] Create V2-GAP-UOW-01 functional design and code generation plan.
- [x] Implement V2-GAP-UOW-01.
- [x] Verify V2-GAP-UOW-01 build/test.
- [x] Receive explicit approval to start V2-GAP-UOW-02.
- [x] Create V2-GAP-UOW-02 functional design plan.
- [ ] Collect V2-GAP-UOW-02 functional design answers.
- [ ] Generate V2-GAP-UOW-02 functional design artifacts.
- [ ] Create V2-GAP-UOW-02 code generation plan.
- [ ] Implement V2-GAP-UOW-02.
- [ ] Verify V2-GAP-UOW-02 build/test.

## Approval Gate

Status: V2-GAP-UOW-02 functional design questions created and awaiting answers.
