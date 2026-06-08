import type { GeneratedArtifactRef, SourceRef, TraceLink } from '@spa-bridge/core-model';
import { type ReportError } from '../shared-errors.js';
export declare const validateSourceRef: (ref: SourceRef, fieldPath: string) => SourceRef | ReportError;
export declare const validateGeneratedArtifactRef: (ref: GeneratedArtifactRef, fieldPath: string) => GeneratedArtifactRef | ReportError;
export declare const validateTraceLink: (link: TraceLink, fieldPath: string) => TraceLink | ReportError;
export declare const ensureUniqueKeys: <T>(items: T[], keySelector: (item: T) => string, fieldName: string) => ReportError | undefined;
//# sourceMappingURL=report-ref-validator.d.ts.map