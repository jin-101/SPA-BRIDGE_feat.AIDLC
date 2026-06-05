import { createHash } from 'node:crypto';

import { err, ok, type Result } from '@spa-bridge/core-model';

import { createSecurityError, type TokenScope } from '../types.js';

export type IssuedToken = {
  token: string;
  category: string;
  originalLength: number;
  restorable: boolean;
  restorationHint?: string;
  scope: TokenScope;
  secret: string;
  expiresAt: number;
};

type VaultEntry = {
  token: IssuedToken;
};

const scopeKey = (scope: TokenScope): string => `${scope.runId}::${scope.correlationId}::${scope.purpose}`;

export class TokenVault {
  private readonly entries = new Map<string, VaultEntry>();
  private sequence = 0;

  constructor(private readonly ttlMs: number) {}

  issueToken(input: {
    scope: TokenScope;
    category: string;
    secret: string;
    restorationHint?: string;
    now?: number;
    restorable?: boolean;
  }): Result<IssuedToken, ReturnType<typeof createSecurityError>> {
    if (!input.secret) {
      return err(createSecurityError('VALIDATION_FAILED', 'Token vault cannot issue an empty secret.'));
    }

    const now = input.now ?? Date.now();
    const sequence = ++this.sequence;
    const digest = createHash('sha256')
      .update(`${scopeKey(input.scope)}::${input.category}::${input.secret}::${sequence}`)
      .digest('hex')
      .slice(0, 24);
    const token = `sec_${digest}`;
    const issued: IssuedToken = {
      token,
      category: input.category,
      originalLength: input.secret.length,
      restorable: input.restorable ?? true,
      restorationHint: input.restorationHint,
      scope: input.scope,
      secret: input.secret,
      expiresAt: now + this.ttlMs,
    };

    this.entries.set(token, { token: issued });
    return ok(issued);
  }

  restoreToken(input: {
    scope: TokenScope;
    token: string;
    now?: number;
  }): Result<{ secret: string; category: string; scope: TokenScope }, ReturnType<typeof createSecurityError>> {
    const entry = this.entries.get(input.token);
    if (!entry) {
      return err(createSecurityError('TOKEN_EXPIRED', `Token '${input.token}' was not found or has expired.`));
    }

    const now = input.now ?? Date.now();
    if (entry.token.expiresAt <= now) {
      this.entries.delete(input.token);
      return err(createSecurityError('TOKEN_EXPIRED', `Token '${input.token}' has expired.`));
    }

    const expectedScope = scopeKey(input.scope);
    const actualScope = scopeKey(entry.token.scope);
    if (expectedScope !== actualScope) {
      return err(createSecurityError('TOKEN_SCOPE_MISMATCH', `Token '${input.token}' does not belong to the requested scope.`));
    }

    return ok({
      secret: entry.token.secret,
      category: entry.token.category,
      scope: entry.token.scope,
    });
  }

  revokeScope(scope: TokenScope): number {
    const currentKey = scopeKey(scope);
    let removed = 0;
    for (const [token, entry] of this.entries.entries()) {
      if (scopeKey(entry.token.scope) === currentKey) {
        this.entries.delete(token);
        removed += 1;
      }
    }
    return removed;
  }

  purgeExpired(now: number = Date.now()): number {
    let removed = 0;
    for (const [token, entry] of this.entries.entries()) {
      if (entry.token.expiresAt <= now) {
        this.entries.delete(token);
        removed += 1;
      }
    }
    return removed;
  }
}
