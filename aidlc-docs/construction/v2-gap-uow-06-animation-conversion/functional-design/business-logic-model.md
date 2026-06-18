# V2-GAP-UOW-06 Animation Conversion Business Logic Model

## Overview

Animation conversion extends the existing Angular analysis, transformation, and Next.js target generation pipeline. The unit converts safe animation behavior automatically and makes uncertain behavior explicit through diagnostics and review artifacts.

## Processing Flow

1. Source analysis scans Angular component decorators, templates, style references, and package imports.
2. Animation extractor produces structured animation declarations, triggers, transitions, template bindings, third-party usages, and asset refs.
3. Transformation maps each animation source model to a target conversion plan:
   - CSS transition plan,
   - React helper hook plan,
   - third-party adapter plan,
   - manual-review plan.
4. Target generation writes CSS, helper modules, component client-boundary directives, copied assets, and review artifacts.
5. Runtime parity quality scoring counts unresolved animation risks and missing assets.

## Conversion Decisions

### CSS Transition Plan

Use when an Angular animation has deterministic state styles and simple transitions. The generator creates stable CSS class names and binds them from JSX based on the converted trigger expression.

Target outputs:
- CSS classes in `src/app/globals.css` or colocated CSS module files.
- JSX `className` wiring.
- Optional helper for state-to-class mapping.

### React Helper Hook Plan

Use when conversion needs refs, lifecycle effects, or browser APIs but can still be represented safely.

Target outputs:
- `"use client"` file boundary.
- `useEffect` and `useRef` based helper code.
- Cleanup behavior for imperative library instances.

### Third-Party Adapter Plan

Use for `lottie-web`, `gsap`, `animejs`, and known Angular wrappers.

Target outputs:
- Compatible dependency manifest entries.
- React helper wrappers for imperative initialization.
- Copied or rewritten asset refs.
- Diagnostics for wrapper API differences.

### Manual Review Plan

Use when runtime parity cannot be safely generated.

Target outputs:
- Manual review item with source traceability.
- Safe suggested target approach.
- Runtime parity impact classification.

## Error Handling

- Extraction failures for one component must not fail the entire conversion unless source parsing itself is fatal.
- Missing animation assets produce diagnostics and quality score penalties.
- Unsupported complex DSL constructs preserve partial target output and produce manual-review diagnostics.
- Unsafe external provider use remains governed by security policy and masking rules.

## Determinism Rules

- Sort triggers by source order and stable trigger name.
- Sort generated helper files by component path and trigger name.
- Use stable class names derived from component ID, trigger name, and state name.
- Use stable diagnostic codes for recurring unsupported patterns.

## Quality Gate Signals

The runtime parity quality gate should include animation fields in the generated quality artifact:
- `animationTriggerCount`
- `convertedAnimationTriggerCount`
- `unresolvedAnimationTriggerCount`
- `missingAnimationAssetCount`
- `animationManualReviewCount`
- `animationClientBoundaryCount`
