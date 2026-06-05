# UOW-05 Artifact Index

## Created Artifacts

### Workspace Package

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
- `packages/core-security/tests/core-security.test.ts`

### Application Coordination

- `packages/core-application/src/policy/security-policy-coordinator.ts`
- `packages/core-application/src/index.ts`
- `packages/core-application/tests/core-application.test.ts`

### Workspace Updates

- `package.json`
- `aidlc-docs/aidlc-state.md`
- `aidlc-docs/audit.md`

## Validation Notes

- `core-security` and `core-application` build successfully.
- `core-security` and `core-application` test suites pass.

