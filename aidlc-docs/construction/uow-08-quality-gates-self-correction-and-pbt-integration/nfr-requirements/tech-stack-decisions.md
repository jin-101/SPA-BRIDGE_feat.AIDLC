# UOW-08 Tech Stack Decisions

## Decision Summary

| Area | Decision | Rationale |
|---|---|---|
| Package Scope | Create a dedicated `packages/core-quality` package | Keeps quality orchestration reusable and separate from transformation, target generation, provider, and UI concerns. |
| Test Runner | Vitest | Matches the existing TypeScript workspace style and supports fast, deterministic example-based testing. |
| PBT Framework | fast-check | Provides generator support, shrinking, and seed-based reproducibility for TypeScript. |
| Runner Abstraction | Explicit deterministic runner interfaces | Allows build, lint, format, unit, integration, and property commands to be orchestrated without shell-specific coupling. |
| Gate Registry | Shared gate registry with stable ordering | Ensures equivalent requests produce equivalent gate plans. |
| Evidence Model | Structured summaries, safe trace refs, and bounded evidence bundles | Preserves auditability without leaking raw sensitive artifacts. |
| Failure Policy | Fail closed for blocking gates with bounded self-correction | Prevents quality drift and unbounded retries. |
| Logging Model | Safe structured diagnostics only | Keeps quality output privacy-preserving and review-friendly. |

## Test and Runner Stack

| Concern | Decision |
|---|---|
| Example Tests | Vitest |
| Property-Based Tests | fast-check |
| Runner Layer | Shared abstraction for deterministic tool execution |
| Supported Tool Kinds | `build`, `lint`, `format`, `unit`, `integration`, `property` |
| Reproducibility | Logged seed and stable gate ordering |
| Regression Handling | Retain shrunk counterexamples as example-based tests |

## Dependency Policy

The quality package should remain dependency-light and exact-pinned.

| Dependency | Use | Included When |
|---|---|---|
| `@spa-bridge/core-model` | Shared refs, diagnostics, and result contracts | Always |
| `vitest` | Example-based tests | Always |
| `fast-check` | Property-based tests | Always |
| Node built-ins | Path and hashing helpers for deterministic summaries | Always |

No broad runtime dependency ranges should be introduced for quality orchestration. The package should not depend on production provider adapters or target-generation internals beyond stable shared contracts.

## Runner Design Decisions

| Area | Decision |
|---|---|
| Invocation | Use deterministic runner abstractions rather than direct shell coupling |
| Retry Policy | Bounded retries only for safe self-correction candidates |
| Failure Output | Structured summary, safe diagnostics, and trace refs |
| Seed Handling | Record seeds for every PBT failure and replay path |
| Optional Gates | Skip and record as skipped rather than failing the entire run when configured absent |

## Evidence and Traceability Decisions

| Area | Decision |
|---|---|
| Evidence Shape | Bounded bundles with summaries, refs, and failure metadata |
| Sensitive Data | Never store raw source snippets, secrets, or prompt-like content |
| Traceability | Every result must link back to the originating run and artifact refs |
| Manual Review | Emit safe review items with reason codes and trace refs |

## Maintainability Decisions

| Area | Decision |
|---|---|
| Gate Extension | Additive registry entries only |
| Shared Interfaces | Required for runner execution and gate definitions |
| Future Quality Workflows | Package remains reusable across later orchestration and reporting work |

## Security and Privacy Notes

- SECURITY-05 is addressed through schema validation of quality inputs and artifact refs.
- SECURITY-10 is addressed through exact-pinned allowlisted test and runner dependencies.
- SECURITY-13 is addressed through traceable, structured evidence with safe refs.
- Security-sensitive runtime concerns such as network, IAM, auth/session, and deployment are out of scope for this unit and remain N/A.

