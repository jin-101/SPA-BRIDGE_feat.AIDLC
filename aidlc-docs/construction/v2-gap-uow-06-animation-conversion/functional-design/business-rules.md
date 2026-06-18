# V2-GAP-UOW-06 Animation Conversion Business Rules

## Core Rules

### ANIM-RULE-001 Structured Extraction

The analyzer must extract Angular animation metadata into structured models instead of storing only raw source text. Trigger names, state names, transition expressions, construct kinds, and safe source refs must be preserved.

### ANIM-RULE-002 Simple Transition Conversion

Simple `state` and `transition` definitions should be converted to deterministic CSS classes or small React helper hooks when:
- The trigger has finite named states.
- Styles are statically representable.
- Timing and easing can be parsed deterministically.
- No unsupported sequencing construct is required.

### ANIM-RULE-003 Template Binding Preservation

Template bindings such as `[@trigger]`, `@trigger.start`, and `@trigger.done` must not be silently dropped. They must be converted into JSX props/classes/hooks or produce explicit diagnostics.

### ANIM-RULE-004 Complex DSL Safety

Complex Angular DSL constructs such as `query`, `stagger`, `group`, wildcard state expressions, and dynamic timing expressions must preserve traceability and emit review diagnostics when semantic parity is uncertain.

### ANIM-RULE-005 Third-Party Library Compatibility

Framework-neutral animation libraries such as `lottie-web`, `gsap`, and `animejs` can be carried when compatible with Next.js client components. Angular wrapper packages such as `ngx-lottie` must be replaced with React-compatible adapters where known or flagged for manual review.

### ANIM-RULE-006 Asset Preservation

Lottie JSON files, images, sprites, and animation-related style assets must be copied or mapped into the generated target when referenced. Missing or unresolved assets must produce diagnostics.

### ANIM-RULE-007 Next.js Client Boundary

Generated components or helper wrappers that use `useEffect`, browser APIs, refs, or imperative animation libraries must include `"use client"` at the target file boundary.

### ANIM-RULE-008 Safe Diagnostics

Animation diagnostics must include safe refs, categories, trigger names, severity, suggested target approach, and runtime parity impact. Diagnostics must not include raw sensitive source snippets.

### ANIM-RULE-009 Determinism

Generated CSS class names, helper names, target paths, diagnostics, and quality signals must use stable ordering and stable IDs for identical input.

### ANIM-RULE-010 Runtime Parity Quality Integration

Runtime parity quality scoring must include animation-specific signals:
- unresolved triggers,
- missing animation assets,
- wrapper replacement review counts,
- client-boundary requirements,
- animation manual-review counts.

## Manual Review Rules

Manual review is required when:
- A trigger uses complex Angular timeline behavior that cannot be safely represented in CSS or a simple helper.
- A third-party wrapper has no verified React-compatible replacement.
- A referenced animation asset cannot be resolved within the source workspace.
- Generated code requires browser APIs but the target boundary cannot safely be marked as a client component.
- Event callback semantics differ between Angular animation events and target React handler behavior.
