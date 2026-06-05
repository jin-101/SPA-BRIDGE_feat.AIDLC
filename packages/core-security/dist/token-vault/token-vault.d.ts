import { type Result } from '@spa-bridge/core-model';
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
export declare class TokenVault {
    private readonly ttlMs;
    private readonly entries;
    private sequence;
    constructor(ttlMs: number);
    issueToken(input: {
        scope: TokenScope;
        category: string;
        secret: string;
        restorationHint?: string;
        now?: number;
        restorable?: boolean;
    }): Result<IssuedToken, ReturnType<typeof createSecurityError>>;
    restoreToken(input: {
        scope: TokenScope;
        token: string;
        now?: number;
    }): Result<{
        secret: string;
        category: string;
        scope: TokenScope;
    }, ReturnType<typeof createSecurityError>>;
    revokeScope(scope: TokenScope): number;
    purgeExpired(now?: number): number;
}
//# sourceMappingURL=token-vault.d.ts.map