import fc from 'fast-check';
export declare const securityArbitraries: {
    safeString: fc.Arbitrary<string>;
    scopeArb: fc.Arbitrary<{
        runId: string;
        correlationId: string;
        purpose: string;
    }>;
    securityConfigArb: fc.Arbitrary<{
        runId: string;
        correlationId: string;
        schemaVersion: 1;
        projectRoot: string;
        detectSensitiveData: boolean;
        redactOutputs: boolean;
        allowExternalProviderUse: boolean;
        externalProviderOptIn: boolean;
        auditEnabled: boolean;
        manualReviewEnabled: boolean;
        preservePartialArtifacts: boolean;
        tokenTtlMs: number;
        rulePackIds: string[];
        defaultProviderMode: "local-first" | "external-only" | "auto";
        targetAwareRulePacks: boolean;
    }>;
    securityRulePackArb: fc.Arbitrary<{
        metadata: Record<string, string>;
        allowExternalProviderUse: boolean;
        id: string;
        version: number;
        precedence: number;
        target: string;
        categories: string[];
        redactionMode: "redacted" | "tokenized" | "mixed";
        tokenizationAllowed: boolean;
    }>;
    securityEvaluationRequestArb: fc.Arbitrary<{
        schemaVersion: 1;
        payload: string | string[] | {
            auth: string;
            cookies: string;
            email: string;
        };
        rawConfig: {} | undefined;
        overrides: {} | undefined;
        providerMode: string;
        externalProviderRequested: boolean;
        rulePacks: {
            metadata: Record<string, string>;
            allowExternalProviderUse: boolean;
            id: string;
            version: number;
            precedence: number;
            target: string;
            categories: string[];
            redactionMode: "redacted" | "tokenized" | "mixed";
            tokenizationAllowed: boolean;
        }[];
        sourceRefs: {
            kind: "source";
            path: string;
            location: string | undefined;
        }[];
        generatedRefs: {
            kind: "generated";
            path: string;
            segment: string | undefined;
        }[];
    }>;
    securityAuditEventArb: fc.Arbitrary<{
        eventType: string;
        severity: "info" | "warning" | "error" | "critical";
        safeMessage: string;
        safeRefs: ({
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        })[];
        counts: {
            findings: number;
            redactions: number;
            tokenizations: number;
            blockedDecisions: number;
        };
        reasonCodes: string[];
        metadata: Record<string, string>;
        runId?: string | undefined;
        correlationId?: string | undefined;
    }>;
};
export type TokenVaultCommand = {
    kind: 'issue';
    scope: {
        runId: string;
        correlationId: string;
        purpose: string;
    };
    category: string;
    secret: string;
} | {
    kind: 'restore';
    scope: {
        runId: string;
        correlationId: string;
        purpose: string;
    };
    token: string;
} | {
    kind: 'purge-expired';
    now: number;
};
export declare const tokenVaultCommandArb: fc.Arbitrary<TokenVaultCommand>;
//# sourceMappingURL=generators.d.ts.map