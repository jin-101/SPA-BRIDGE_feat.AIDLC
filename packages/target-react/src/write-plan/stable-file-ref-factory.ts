import type { GeneratedArtifactRef } from '@spa-bridge/core-model';

export class StableFileRefFactory {
  create(pathValue: string, hash: string): GeneratedArtifactRef {
    return {
      kind: 'generated',
      path: `generated:${pathValue}:${hash.slice(0, 16)}`,
    };
  }
}
