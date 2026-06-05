# UOW-05 Security, Masking, and Provider Policy Summary

## Scope Delivered

- Created the `@spa-bridge/core-security` workspace package.
- Added deterministic security config resolution, sensitive data detection, masking, token vault, provider policy gating, safe audit events, access control hooks, and a security evaluation pipeline.
- Added a thin `SecurityPolicyCoordinator` in `@spa-bridge/core-application`.
- Updated workspace build and test scripts to include `@spa-bridge/core-security`.

## Application Files

- `packages/core-security/package.json`
- `packages/core-security/tsconfig.json`
- `packages/core-security/src/index.ts`
- `packages/core-security/src/types.ts`
- `packages/core-security/src/config/security-config.ts`
- `packages/core-security/src/detection/sensitive-data-detector.ts`
- `packages/core-security/src/masking/masking-pipeline.ts`
- `packages/core-security/src/token-vault/token-vault.ts`
- `packages/core-security/src/policy/provider-policy-gate.ts`
- `packages/core-security/src/audit/safe-audit-event-builder.ts`
- `packages/core-security/src/access/access-control-hook-evaluator.ts`
- `packages/core-security/src/pipeline/security-evaluation-pipeline.ts`
- `packages/core-security/src/rule-packs/default-security-rule-packs.ts`
- `packages/core-security/src/rule-packs/security-rule-pack-registry.ts`
- `packages/core-security/src/rule-packs/security-rule-pack-validator.ts`
- `packages/core-security/src/testing/generators.ts`
- `packages/core-application/src/policy/security-policy-coordinator.ts`
- `packages/core-application/src/index.ts`
- `package.json`

## Tests

- `packages/core-security/tests/core-security.test.ts`
- `packages/core-application/tests/core-application.test.ts`

## Verification

- `npm run build --workspace @spa-bridge/core-security`
- `npm run build --workspace @spa-bridge/core-application`
- `npm test --workspace @spa-bridge/core-security`
- `npm test --workspace @spa-bridge/core-application`

## Security and PBT Notes

- Security policy is fail-closed for unknown policy, missing opt-in, missing masking, missing audit, and missing provider readiness.
- Audit output is restricted to safe fields and safe references.
- Token vault is in-memory only with TTL and strict scope checks.
- Property-based tests cover config determinism, token round-trip behavior, and audit safety.

