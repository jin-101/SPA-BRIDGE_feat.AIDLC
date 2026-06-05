export const createGenericSecurityRulePack = (customCategories = []) => ({
    id: 'generic-security-core',
    version: 1,
    precedence: 10,
    target: 'generic',
    categories: ['email', 'bearer-token', 'jwt', 'api-key', 'session-cookie', 'credit-card', ...customCategories],
    redactionMode: 'redacted',
    tokenizationAllowed: false,
    allowExternalProviderUse: false,
    metadata: {},
});
export const createTargetAwareSecurityRulePack = () => ({
    id: 'target-app-security-review',
    version: 1,
    precedence: 20,
    target: 'korean-air',
    categories: ['business-sensitive', 'source-sensitive'],
    redactionMode: 'mixed',
    tokenizationAllowed: true,
    allowExternalProviderUse: false,
    metadata: {
        note: 'Target-aware review pack for high-signal Angular/NgRx/library combinations.',
    },
});
export const createDefaultSecurityRulePacks = (customCategories = []) => [
    createGenericSecurityRulePack(customCategories),
    createTargetAwareSecurityRulePack(),
];
//# sourceMappingURL=default-security-rule-packs.js.map