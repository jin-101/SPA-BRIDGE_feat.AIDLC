import type { CliExecutionMode } from '../types.js';
export declare class ConfirmationCoordinator {
    private readonly confirm?;
    constructor(confirm?: ((message: string) => Promise<boolean>) | undefined);
    shouldPrompt(mode: CliExecutionMode, destructive: boolean, ambiguous: boolean): boolean;
    requestConfirmation(mode: CliExecutionMode, message: string, destructive?: boolean, ambiguous?: boolean): Promise<boolean>;
}
//# sourceMappingURL=confirmation-coordinator.d.ts.map