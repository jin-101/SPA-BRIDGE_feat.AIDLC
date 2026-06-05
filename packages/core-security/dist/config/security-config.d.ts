import { type Result } from '@spa-bridge/core-model';
import { createSecurityError, type SecurityConfig } from '../types.js';
export declare class SecurityConfigResolver {
    resolve(input: {
        projectRoot: string;
        runId: string;
        correlationId: string;
        rawConfig?: unknown;
        overrides?: unknown;
    }): Result<SecurityConfig, ReturnType<typeof createSecurityError>>;
}
//# sourceMappingURL=security-config.d.ts.map