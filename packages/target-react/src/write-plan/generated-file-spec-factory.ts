import type { SourceRef } from '@spa-bridge/core-model';

import type { GeneratedFileSpec, TargetFileKind } from '../types.js';

export const createFileSpec = (input: {
  path: string;
  kind: TargetFileKind;
  content: string;
  sourceRefs?: SourceRef[];
  overwrite?: boolean;
  status?: GeneratedFileSpec['status'];
  traceRefs?: string[];
}): GeneratedFileSpec => ({
  path: input.path,
  kind: input.kind,
  content: input.content,
  sourceRefs: input.sourceRefs ?? [],
  generatedRefs: [{ kind: 'generated', path: input.path }],
  traceRefs: input.traceRefs ?? [],
  overwrite: input.overwrite ?? true,
  status: input.status ?? 'generated',
});
