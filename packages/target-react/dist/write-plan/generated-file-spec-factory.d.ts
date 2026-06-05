import type { SourceRef } from '@spa-bridge/core-model';
import type { GeneratedFileSpec, TargetFileKind } from '../types.js';
export declare const createFileSpec: (input: {
    path: string;
    kind: TargetFileKind;
    content: string;
    sourceRefs?: SourceRef[];
    overwrite?: boolean;
    status?: GeneratedFileSpec["status"];
    traceRefs?: string[];
}) => GeneratedFileSpec;
//# sourceMappingURL=generated-file-spec-factory.d.ts.map