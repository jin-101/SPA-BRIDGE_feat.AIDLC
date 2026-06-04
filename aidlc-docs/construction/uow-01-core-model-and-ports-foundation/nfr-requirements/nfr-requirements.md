# UOW-01 NFR Requirements

## Unit

- **Unit**: UOW-01 Core Model and Ports Foundation
- **Package**: `packages/core-model`
- **Scope**: Core IR, schema-bearing artifacts, diagnostics, traceability, report contracts, masking token contracts, and core ports.

## NFR Summary

| Category | Requirement |
|---|---|
| Type Safety | Core entities and ports must be strongly typed in TypeScript. |
| Runtime Validation | Persisted artifacts must use Zod schemas and validation. |
| Serialization | Persisted artifacts must be JSON serializable and schema validated. |
| Versioning | IR, report, manifest, diagnostics, and traceability artifacts must carry schema versions and support explicit migrations. |
| Performance | Typical artifact validation should complete under 100ms per artifact under reference test conditions. |
| Scalability | Models must support projects with 500+ components and large traceability maps. |
| Security | Diagnostics and reports must forbid raw sensitive values; redacted/sanitized types are required. |
| Reliability | Port calls must use a Result type (`Ok`/`Err`) rather than unchecked exceptions as the contract. |
| Maintainability | Public model and port APIs require doc comments and examples. |
| Testability | Property-based testing must use fast-check with Vitest. |
| Dependency Control | `packages/core-model` must have zero runtime dependencies except the validation library. |

## Runtime Validation Requirements

- Use Zod for runtime/schema validation.
- Define Zod schemas for all persisted artifacts.
- Validate persisted artifacts at read/write boundaries.
- Validation failures must return typed errors that can become diagnostics or fail-fast results.
- Validation behavior must be deterministic for equivalent artifacts.

## Serialization and Versioning Requirements

Persisted artifacts:
- `IntermediateRepresentation`
- `ConversionReport`
- `DiagnosticsCollection`
- `RunManifest`
- `TraceabilityMap`
- `MaskTokenMap`

Requirements:
- Each persisted artifact must include `schemaVersion`.
- JSON serialization must round-trip schema-valid structure.
- Schema validation must run after deserialization.
- All persisted schema versions must have explicit migration support.
- Unsupported schema versions must return typed errors.

## Performance Requirements

| Requirement | Target |
|---|---|
| Typical artifact validation latency | Under 100ms per artifact |
| Large project design target | 500+ components |
| Large traceability map support | Required |
| Validation mode | Boundary validation required; internal revalidation allowed when safety-critical |

Performance notes:
- The 100ms target applies to typical artifacts, not worst-case pathological reports.
- Large artifacts may require later chunking or indexing if profiling shows validation/report operations exceed targets.
- NFR Design should define representative benchmark fixture sizes.

## Security Requirements

- Core schemas must forbid raw sensitive values in diagnostics and reports.
- Diagnostics and reports must use sanitized/redacted field types.
- Mask token metadata may be stored, but raw sensitive values must not appear in report or diagnostic schemas.
- Logger and audit ports must accept structured, redaction-aware records.
- `security-blocker` diagnostics must remain blocking in quality summaries and reports.
- LLM provider ports must represent policy-mediated requests and structured provider results, without requiring raw prompt payload persistence.

## Reliability and Error Handling Requirements

- Core ports must use a Result type (`Ok`/`Err`) for all port calls.
- Domain validation must use typed validation errors.
- Schema migration must return typed success/failure results.
- Consumers must not rely on thrown exceptions as the primary control flow for port failures.
- Unexpected exceptions may still be handled by adapter implementations, but the core port contract remains Result-based.

## Maintainability Requirements

- Public model APIs require doc comments.
- Public port APIs require doc comments and usage examples.
- Schema version and migration functions require examples.
- Redacted field types and sensitive-value constraints require documentation.
- Model docs should include at least one IR, report, diagnostic, and traceability example.

## PBT Requirements

Framework:
- Use `fast-check` with Vitest.

Required property categories:
- IR JSON round-trip.
- Report JSON round-trip.
- Mask token map JSON round-trip.
- Traceability referential integrity invariants.
- Diagnostic severity and blocker invariants.
- Schema validation determinism.
- Migration behavior for versioned artifacts.

PBT execution requirements:
- PBT must run in CI/build instructions for this package.
- PBT failures must expose seed and shrunk failing input.
- Generators must be domain-specific, not raw primitive-only generators.
- PBT must complement example-based fixture tests.

## Security Baseline Compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | UOW-01 does not define persistence infrastructure; it defines JSON artifact schemas only. |
| SECURITY-02 | N/A | No network intermediary in this unit. |
| SECURITY-03 | Compliant | Logger/audit ports require structured, redaction-aware records. |
| SECURITY-04 | N/A | No HTML-serving endpoint in this unit. |
| SECURITY-05 | N/A | API/input boundary validation is handled in later units; UOW-01 defines validation result models. |
| SECURITY-06 | N/A | No IAM/access policy in this unit. |
| SECURITY-07 | N/A | No network configuration in this unit. |
| SECURITY-08 | N/A | No application endpoint authorization in this unit. |
| SECURITY-09 | Compliant | Raw sensitive values are forbidden in diagnostics/reports, reducing misconfiguration leakage. |
| SECURITY-10 | Compliant | Dependency policy restricts runtime dependencies to the validation library only. |
| SECURITY-11 | Compliant | Security-critical diagnostic/token/redaction models are explicit and isolated. |
| SECURITY-12 | N/A | No authentication in this unit. |
| SECURITY-13 | Compliant | JSON schema validation, versioning, and migration support provide artifact integrity controls. |
| SECURITY-14 | N/A | Monitoring/alerting is outside this unit; audit port supports later logging flows. |
| SECURITY-15 | Compliant | Result-based ports and security-blocker diagnostics support fail-safe behavior. |

## PBT Compliance

| Rule | Status | Rationale |
|---|---|---|
| PBT-01 | Compliant | Testable properties are identified for this unit. |
| PBT-02 | Compliant | IR/report/token map round-trip properties are required. |
| PBT-03 | Compliant | Traceability and diagnostic invariants are required. |
| PBT-04 | Compliant | Validation determinism/idempotence properties are required. |
| PBT-05 | N/A | No oracle/reference implementation is required for UOW-01 model contracts. |
| PBT-06 | N/A | UOW-01 has no mutable stateful component. |
| PBT-07 | Compliant | Domain-specific generators are required. |
| PBT-08 | Compliant | Seed and shrunk failing input output is required. |
| PBT-09 | Compliant | fast-check with Vitest is selected. |
| PBT-10 | Compliant | PBT complements example-based fixture tests. |

