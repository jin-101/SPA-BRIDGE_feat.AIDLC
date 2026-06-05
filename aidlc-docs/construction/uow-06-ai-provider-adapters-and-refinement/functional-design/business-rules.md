# UOW-06 Business Rules

## Provider Registration Rules

- Every provider must have a stable provider ID.
- Provider IDs must be unique within a registry.
- Providers must declare adapter kind: `local-internal`, `external`, or `mock`.
- Providers must declare capability tags such as `template`, `lifecycle`, `di`, `route`, `state`, `form`, or `unknown`.
- Providers must declare priority as a deterministic integer.
- Unknown or duplicate providers are rejected before invocation.
- External providers are registered as disabled unless explicit configuration enables them.

## Provider Selection Rules

- Local/internal providers are preferred when capabilities and policy readiness are equivalent.
- Provider selection is deterministic by provider mode, capability match, policy readiness, priority, provider ID, and adapter kind.
- If no provider matches the requested capability, the result is manual review.
- If multiple providers are equally valid after deterministic ordering, the first sorted provider is selected and the decision is auditable.
- Random selection is forbidden.

## Context Minimization Rules

- Provider adapters receive only provider-neutral minimized context.
- Raw source snippets, full project files, unmasked prompts, cookies, secrets, proprietary identifiers, and unrestricted draft objects are forbidden.
- Safe context fields are limited to strings, numbers, booleans, string arrays, safe refs, rule IDs, diagnostic refs, category, and mapping request ID.
- Context minimization must run before provider selection is invoked.
- External provider context must pass UOW-05 policy and masking evaluation before adapter invocation.

## Policy-Gated Invocation Rules

- Every provider call must be checked by UOW-05 policy.
- External provider calls require explicit opt-in, masking success, audit readiness, and provider readiness.
- Local/internal provider calls still require policy evaluation and safe logging.
- Unknown policy state blocks the call.
- Policy blocks produce structured blocked results, not uncaught exceptions.

## Provider Invocation Rules

- Provider adapters return structured results.
- Provider adapters do not apply final source patches.
- Provider adapters do not mutate transformation drafts.
- Provider adapters do not own retry loops beyond configured single-attempt behavior in this functional design.
- Timeouts, malformed responses, or unsafe content produce manual-review diagnostics.

## Response Validation Rules

- Provider response confidence must be between 0 and 1.
- Response rationale must be safe display text.
- Responses must include mapping request ID and suggestion category.
- Suggestions must include AI-assisted provenance.
- Raw text may be stored only as rejected evidence if sanitized and allowed; otherwise it is dropped.
- Invalid responses are never passed downstream as suggestions.

## Manual Review Rules

- Policy blocks produce manual-review diagnostics with reason codes.
- Provider failures preserve partial conversion output.
- Low-confidence provider suggestions require manual review.
- Malformed or unsafe provider responses require manual review.
- Manual-review diagnostics must reference safe source/generated refs only.

## Mock Provider Rules

- Mock provider behavior must be deterministic.
- Scripted responses must be selected by request ID, category, capability, or explicit script key.
- Failure injection must produce typed provider errors.
- Mock provider audit evidence must not include raw prompt text.

## Audit and Provenance Rules

- Every provider decision has safe provider ID, adapter kind, mode, reason code, run ID, correlation ID, and mapping request ID.
- Audit evidence stores counts, categories, and safe refs only.
- AI-assisted suggestions carry provenance but do not expose raw prompts or raw provider responses.
- Provider-specific internals do not leak into transformation rules.

## Error Handling Rules

| Condition | Result |
|---|---|
| Policy blocked | Blocked result with manual-review diagnostic |
| No provider available | Manual-review result |
| Provider timeout | Partial result with timeout diagnostic |
| Malformed response | Partial result with validation diagnostic |
| Unsafe response content | Blocked or manual-review result depending on severity |
| External provider not opted in | Blocked result |
| Mock failure injection | Typed failure result for tests |

## Out-of-Scope Rules

- UOW-06 does not implement React target generation.
- UOW-06 does not implement transformation rule execution.
- UOW-06 does not persist credentials.
- UOW-06 does not hardcode a commercial external provider as the default.
- UOW-06 does not bypass UOW-05 security or masking decisions.

