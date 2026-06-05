import type { TargetEcosystemMetadataEntry } from './target-ecosystem-metadata-catalog.js';

export class EcosystemMetadataPrivacyGuard {
  sanitize(metadata: TargetEcosystemMetadataEntry[]): TargetEcosystemMetadataEntry[] {
    return metadata.map((entry) => ({
      category: entry.category,
      description: entry.description,
      keywords: [...entry.keywords].filter((keyword) => !/customer|secret|token|password/i.test(keyword)),
    }));
  }
}
