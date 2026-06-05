import type { TargetDependencyManifest } from '../types.js';

export class DependencyRationaleBuilder {
  build(manifest: TargetDependencyManifest): Record<string, string> {
    return { ...manifest.rationale };
  }
}
