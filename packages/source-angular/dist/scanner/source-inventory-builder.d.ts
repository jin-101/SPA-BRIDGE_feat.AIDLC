import { type Result } from '@spa-bridge/core-model';
import type { AnalysisError, AngularWorkspaceProfile, FileRole, FileKind, SourceInventory } from '../types.js';
declare const classifyFile: (filePath: string) => {
    role: FileRole;
    kind: FileKind;
    evidence: string[];
};
export declare class SourceInventoryBuilder {
    private readonly pathGuard;
    private readonly ids;
    build(profile: AngularWorkspaceProfile): Promise<Result<SourceInventory, AnalysisError>>;
}
export { classifyFile };
//# sourceMappingURL=source-inventory-builder.d.ts.map