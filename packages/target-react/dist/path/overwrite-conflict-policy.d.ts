import type { TargetOverwritePolicy } from '../types.js';
export declare const resolveOverwriteConflict: (policy: TargetOverwritePolicy, existingContent: string | undefined, nextContent: string) => {
    action: "write" | "preserve" | "fail";
    reason: string;
};
//# sourceMappingURL=overwrite-conflict-policy.d.ts.map