import { type Result } from '@spa-bridge/core-model';
import { createSecurityError, type MaskedPayload, type MaskingMode, type SensitiveFinding, type TokenScope } from '../types.js';
import { TokenVault } from '../token-vault/token-vault.js';
export declare class SafeOutputValidator {
    validate(input: unknown): Result<void, ReturnType<typeof createSecurityError>>;
}
export type MaskingRequest = {
    payloadId: string;
    payload: unknown;
    findings: SensitiveFinding[];
    mode: MaskingMode;
    scope: TokenScope;
    allowRestoration?: boolean;
};
export type MaskingPipelineDependencies = {
    tokenVault: TokenVault;
};
export declare class MaskingPipeline {
    private readonly dependencies;
    private readonly outputValidator;
    constructor(dependencies: MaskingPipelineDependencies);
    mask(input: MaskingRequest): Result<MaskedPayload, ReturnType<typeof createSecurityError>>;
}
//# sourceMappingURL=masking-pipeline.d.ts.map