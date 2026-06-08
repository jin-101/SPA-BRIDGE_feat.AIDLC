# Tech Stack Decisions - UOW-10 CLI Interface

## Runtime and Tooling Decisions

| Area | Decision | Rationale |
|---|---|---|
| CLI parser | TypeScript-native command/subcommand parser with typed option validation | Supports deterministic dispatch and maintainable subcommands |
| Runtime package shape | Reusable CLI package with shared command handlers and adapters | Keeps the entry point testable and automation-friendly |
| Terminal output | Safe formatted console rendering with quiet/normal/verbose modes | Balances readability and privacy |
| Exit handling | Explicit exit code mapper with stable categories | Makes CI and scripting predictable |
| Reporting integration | Delegate to `core-reporting` for JSON/Markdown/HTML exports | Preserves canonical reporting behavior |
| Application integration | Delegate to `core-application` for workflow orchestration | Prevents duplicated conversion logic |
| Quality integration | Delegate to `core-quality` for validation and result surfaces | Keeps the CLI thin |
| Security integration | Delegate to `core-security` for masking/policy-aware concerns | Preserves fail-closed safety |

## Dependency Policy

- Prefer the workspace's existing packages for application, reporting, quality, and security behavior.
- Keep runtime dependencies minimal.
- Add exact-pinned dependencies only when typed parsing or command ergonomics clearly require them.
- Avoid browser-only, DOM-based, or remote command execution libraries.

## Validation and Testing Stack

| Area | Decision |
|---|---|
| Unit testing | Vitest |
| Property-based testing | fast-check |
| Fixture style | Typed command, config, and path fixtures |
| Output verification | Snapshot-style checks for help, summaries, and exit codes |

## Implementation Guidance

- Keep command parsing separate from execution logic.
- Keep path validation separate from command behavior.
- Keep output formatting separate from application-service orchestration.
- Keep reporting export handoff separate from CLI-local rendering.

## Operational Constraints

- The CLI must support non-interactive automation by default.
- The CLI must remain safe for CI and shell scripts.
- The CLI must preserve deterministic behavior for equivalent inputs.
