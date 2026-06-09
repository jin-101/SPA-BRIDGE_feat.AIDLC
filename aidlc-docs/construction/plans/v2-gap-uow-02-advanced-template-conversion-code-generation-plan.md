# V2-GAP-UOW-02 Advanced Template Conversion Code Generation Plan

## Unit

V2-GAP-UOW-02 Advanced Template Conversion

## Source Requirement

`aidlc-docs/inception/requirements/requirements_v2_gap_implementation_spec.md`

Covered requirement:
- V2-GAP-FR-004 Advanced Template Conversion

Supporting requirements:
- V2-GAP-FR-003 Reactive Forms Conversion handoff markers
- V2-GAP-FR-001 RxJS Conversion handoff markers for `async` pipe

## Goal

Implement deterministic Angular template to JSX conversion for common structural directives, bindings, events, pipes, containers, projection, and custom component input/output mappings.

The first implementation should improve real generated React output without pretending every Angular template construct is fully solved. Unsupported or lossy constructs must generate traceable manual-review diagnostics.

## Brownfield Code Locations

Application code must be modified in-place under the workspace root:

- `packages/source-angular/src/templates/`
- `packages/source-angular/src/types.ts`
- `packages/transform-angular-react/src/types.ts`
- `packages/transform-angular-react/src/converters/template-converter.ts`
- `packages/target-react/src/materializers/`
- `packages/target-react/src/testing/`
- affected package tests under `packages/*/tests/`

Documentation summaries may be added under:

- `aidlc-docs/construction/v2-gap-uow-02-advanced-template-conversion/code/`

## Dependencies

This unit builds on:

- Existing `AngularTemplateParserAdapter`.
- Existing `TemplateParseSummary.rawText`.
- Existing `TemplateConverter`.
- Existing `ComponentMaterializer`.
- Existing selector registry and custom component import generation.
- V2-GAP-UOW-01 path/alias safety patterns.

## Story And Requirement Traceability

- V2-GAP-FR-004: Advanced Template Conversion.
- V2-GAP-FR-003: form binding markers preserved for the forms unit.
- V2-GAP-FR-001: `async` pipe metadata preserved for RxJS conversion.
- Global V2 acceptance: deterministic output, target-root containment, traceability, and safe diagnostics.

## Implementation Plan

### Step 1. Template IR Types

- [x] Extend `packages/source-angular/src/types.ts` or add a focused module with structured template IR types:
  - `TemplateNode`
  - `TemplateElementNode`
  - `TemplateTextNode`
  - `TemplateInterpolationNode`
  - `TemplateDirective`
  - `TemplateBinding`
  - `TemplateEvent`
  - `TemplatePipeUsage`
  - `TemplateConversionDiagnostic`
- [x] Add optional structured template fields to `TemplateParseSummary` while preserving current compatibility.

### Step 2. Template IR Builder

- [x] Create `packages/source-angular/src/templates/template-ir-builder.ts`.
- [x] Convert raw template text into a lightweight ordered IR.
- [x] Detect `*ngIf`, `*ngFor`, `ng-container`, `ng-template`, `ng-content`, interpolation, bindings, events, `ngClass`, `ngStyle`, pipes, and template refs.
- [x] Preserve stable node IDs and source order.
- [x] Keep parsing safe and non-executing.

### Step 3. Source Parser Integration

- [x] Wire the IR builder into `AngularTemplateParserAdapter`.
- [x] Preserve existing heuristic binding arrays for compatibility.
- [x] Emit safe diagnostics for malformed or unsupported template constructs.

### Step 4. Transformation Carry-Through

- [x] Extend `packages/transform-angular-react/src/types.ts` so `NormalizedTemplate` and `ReactTemplateDraft` can carry structured template IR/render-intent metadata.
- [x] Update `ContextNormalizer` to preserve structured template data.
- [x] Update `TemplateConverter` to add manual-review diagnostics and mapping requests for unsupported template constructs.

### Step 5. JSX Renderer Module

- [x] Create `packages/target-react/src/materializers/template-jsx-renderer.ts`.
- [x] Convert simple `*ngIf` to conditional JSX.
- [x] Convert simple `*ngFor` to `.map(...)` JSX with stable best-effort keys.
- [x] Convert `ng-container` to fragments.
- [x] Convert simple `ng-template` and `ng-content` to safe render fragments or review placeholders.
- [x] Convert interpolation, property bindings, events, `ngClass`, `ngStyle`, and known display pipes.
- [x] Preserve form and async pipe handoff markers.

### Step 6. Component Materializer Integration

- [x] Refactor `ComponentMaterializer` so template conversion delegates to `TemplateJsxRenderer`.
- [x] Preserve selector registry custom component conversion.
- [x] Convert known custom component `[input]` and `(output)` bindings to React props.
- [x] Emit helper functions only when generated JSX requires them.

### Step 7. Tests

- [x] Add source-angular tests for structured template IR extraction.
- [x] Add target-react tests for `*ngIf`, `*ngFor`, custom component input/output, known pipes, `ngClass`, and `ngStyle`.
- [x] Add diagnostic tests for unknown pipes, unresolved custom selectors, and unsafe references.
- [x] Add or extend property-based tests for deterministic template output and stable diagnostics.

### Step 8. Documentation Summary

- [x] Create `aidlc-docs/construction/v2-gap-uow-02-advanced-template-conversion/code/summary.md`.
- [x] Create `aidlc-docs/construction/v2-gap-uow-02-advanced-template-conversion/code/artifact-index.md`.
- [x] Record implemented files, tests, diagnostics, helper strategy, and residual limitations.

### Step 9. Verification

- [x] Run package-level tests for affected packages:
  - `npm run test --workspace @spa-bridge/source-angular`
  - `npm run test --workspace @spa-bridge/transform-angular-react`
  - `npm run test --workspace @spa-bridge/target-react`
- [x] Run workspace build:
  - `npm run build`
- [x] Run workspace tests:
  - `npm test`
- [x] Update this plan checklist immediately as steps complete.

## Security Baseline Compliance

- Template parsing must not execute source expressions.
- Unsafe references such as `javascript:` remain diagnostic findings.
- Generated JSX must not use `dangerouslySetInnerHTML` by default.
- Reports and diagnostics must use safe source/generated refs.

## Property-Based Testing Compliance

Required properties:

- Equivalent template input produces stable JSX output.
- Unsupported constructs produce stable diagnostics.
- Generated component names and custom component imports remain valid identifiers.
- Generated JSX and helper files remain target-root contained.

## Approval Gate

Status: Code generation executed. Awaiting review approval to continue to V2-GAP-UOW-03.
