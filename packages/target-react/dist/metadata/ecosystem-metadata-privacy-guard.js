export class EcosystemMetadataPrivacyGuard {
    sanitize(metadata) {
        return metadata.map((entry) => ({
            category: entry.category,
            description: entry.description,
            keywords: [...entry.keywords].filter((keyword) => !/customer|secret|token|password/i.test(keyword)),
        }));
    }
}
//# sourceMappingURL=ecosystem-metadata-privacy-guard.js.map