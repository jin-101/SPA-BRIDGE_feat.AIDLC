import { z } from 'zod';
export declare const SecurityPolicyModeSchema: z.ZodEnum<["local-first", "external-only", "auto"]>;
export type SecurityPolicyMode = z.infer<typeof SecurityPolicyModeSchema>;
export declare const SecuritySeveritySchema: z.ZodEnum<["low", "medium", "high", "critical"]>;
export type SecuritySeverity = z.infer<typeof SecuritySeveritySchema>;
export declare const SecurityErrorCodeSchema: z.ZodEnum<["INVALID_CONFIG", "INVALID_RULE_PACK", "DETECTION_FAILED", "MASKING_FAILED", "TOKEN_EXPIRED", "TOKEN_SCOPE_MISMATCH", "POLICY_BLOCKED", "POLICY_UNKNOWN", "AUDIT_REJECTED", "ACCESS_DENIED", "VALIDATION_FAILED", "UNKNOWN_PROVIDER", "DOWNGRADE_BLOCKED", "SAFE_OUTPUT_REJECTED"]>;
export type SecurityErrorCode = z.infer<typeof SecurityErrorCodeSchema>;
export declare const SecurityErrorSchema: z.ZodObject<{
    code: z.ZodEnum<["INVALID_CONFIG", "INVALID_RULE_PACK", "DETECTION_FAILED", "MASKING_FAILED", "TOKEN_EXPIRED", "TOKEN_SCOPE_MISMATCH", "POLICY_BLOCKED", "POLICY_UNKNOWN", "AUDIT_REJECTED", "ACCESS_DENIED", "VALIDATION_FAILED", "UNKNOWN_PROVIDER", "DOWNGRADE_BLOCKED", "SAFE_OUTPUT_REJECTED"]>;
    message: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    cause: z.ZodOptional<z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    code: "INVALID_CONFIG" | "INVALID_RULE_PACK" | "DETECTION_FAILED" | "MASKING_FAILED" | "TOKEN_EXPIRED" | "TOKEN_SCOPE_MISMATCH" | "POLICY_BLOCKED" | "POLICY_UNKNOWN" | "AUDIT_REJECTED" | "ACCESS_DENIED" | "VALIDATION_FAILED" | "UNKNOWN_PROVIDER" | "DOWNGRADE_BLOCKED" | "SAFE_OUTPUT_REJECTED";
    message: string;
    cause?: unknown;
}, {
    code: "INVALID_CONFIG" | "INVALID_RULE_PACK" | "DETECTION_FAILED" | "MASKING_FAILED" | "TOKEN_EXPIRED" | "TOKEN_SCOPE_MISMATCH" | "POLICY_BLOCKED" | "POLICY_UNKNOWN" | "AUDIT_REJECTED" | "ACCESS_DENIED" | "VALIDATION_FAILED" | "UNKNOWN_PROVIDER" | "DOWNGRADE_BLOCKED" | "SAFE_OUTPUT_REJECTED";
    message: string;
    cause?: unknown;
}>;
export type SecurityError = z.infer<typeof SecurityErrorSchema>;
export declare const PayloadRefSchema: z.ZodObject<{
    kind: z.ZodLiteral<"payload">;
    id: z.ZodString;
    category: z.ZodString;
    sourceRef: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        path: z.ZodString;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    kind: "payload";
    id: string;
    category: string;
    sourceRef?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | undefined;
}, {
    kind: "payload";
    id: string;
    category: string;
    sourceRef?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | undefined;
}>;
export type PayloadRef = z.infer<typeof PayloadRefSchema>;
export declare const SensitiveFindingSpanSchema: z.ZodObject<{
    start: z.ZodNumber;
    end: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    start: number;
    end: number;
}, {
    start: number;
    end: number;
}>;
export declare const SensitiveFindingSchema: z.ZodObject<{
    id: z.ZodString;
    category: z.ZodString;
    severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
    message: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        path: z.ZodString;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }>, "many">>;
    payloadRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"payload">;
        id: z.ZodString;
        category: z.ZodString;
        sourceRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            path: z.ZodString;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        kind: "payload";
        id: string;
        category: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
    }, {
        kind: "payload";
        id: string;
        category: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
    }>, "many">>;
    span: z.ZodOptional<z.ZodObject<{
        start: z.ZodNumber;
        end: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        start: number;
        end: number;
    }, {
        start: number;
        end: number;
    }>>;
    rulePackId: z.ZodOptional<z.ZodString>;
    reasonCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    id: string;
    category: string;
    severity: "low" | "medium" | "high" | "critical";
    sourceRefs: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[];
    payloadRefs: {
        kind: "payload";
        id: string;
        category: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
    }[];
    reasonCode: string;
    span?: {
        start: number;
        end: number;
    } | undefined;
    rulePackId?: string | undefined;
}, {
    message: string;
    id: string;
    category: string;
    severity: "low" | "medium" | "high" | "critical";
    reasonCode: string;
    sourceRefs?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[] | undefined;
    payloadRefs?: {
        kind: "payload";
        id: string;
        category: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
    }[] | undefined;
    span?: {
        start: number;
        end: number;
    } | undefined;
    rulePackId?: string | undefined;
}>;
export type SensitiveFinding = z.infer<typeof SensitiveFindingSchema>;
export declare const TokenScopeSchema: z.ZodObject<{
    runId: z.ZodString;
    correlationId: z.ZodString;
    purpose: z.ZodString;
}, "strip", z.ZodTypeAny, {
    runId: string;
    correlationId: string;
    purpose: string;
}, {
    runId: string;
    correlationId: string;
    purpose: string;
}>;
export type TokenScope = z.infer<typeof TokenScopeSchema>;
export declare const MaskingModeSchema: z.ZodEnum<["redacted", "tokenized", "mixed"]>;
export type MaskingMode = z.infer<typeof MaskingModeSchema>;
export declare const MaskedPayloadSchema: z.ZodObject<{
    id: z.ZodString;
    mode: z.ZodEnum<["redacted", "tokenized", "mixed"]>;
    redactedText: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    tokenRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        token: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        category: z.ZodString;
        originalLength: z.ZodNumber;
        restorable: z.ZodDefault<z.ZodBoolean>;
        restorationHint: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    }, "strip", z.ZodTypeAny, {
        token: string;
        category: string;
        originalLength: number;
        restorable: boolean;
        restorationHint?: string | undefined;
    }, {
        token: string;
        category: string;
        originalLength: number;
        restorable?: boolean | undefined;
        restorationHint?: string | undefined;
    }>, "many">>;
    findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        category: z.ZodString;
        severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
        message: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            path: z.ZodString;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }>, "many">>;
        payloadRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"payload">;
            id: z.ZodString;
            category: z.ZodString;
            sourceRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                path: z.ZodString;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }, {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }, {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }>, "many">>;
        span: z.ZodOptional<z.ZodObject<{
            start: z.ZodNumber;
            end: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            start: number;
            end: number;
        }, {
            start: number;
            end: number;
        }>>;
        rulePackId: z.ZodOptional<z.ZodString>;
        reasonCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        id: string;
        category: string;
        severity: "low" | "medium" | "high" | "critical";
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        payloadRefs: {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }[];
        reasonCode: string;
        span?: {
            start: number;
            end: number;
        } | undefined;
        rulePackId?: string | undefined;
    }, {
        message: string;
        id: string;
        category: string;
        severity: "low" | "medium" | "high" | "critical";
        reasonCode: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        payloadRefs?: {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }[] | undefined;
        span?: {
            start: number;
            end: number;
        } | undefined;
        rulePackId?: string | undefined;
    }>, "many">>;
    safe: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    mode: "redacted" | "tokenized" | "mixed";
    redactedText: string;
    tokenRefs: {
        token: string;
        category: string;
        originalLength: number;
        restorable: boolean;
        restorationHint?: string | undefined;
    }[];
    findings: {
        message: string;
        id: string;
        category: string;
        severity: "low" | "medium" | "high" | "critical";
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        payloadRefs: {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }[];
        reasonCode: string;
        span?: {
            start: number;
            end: number;
        } | undefined;
        rulePackId?: string | undefined;
    }[];
    safe: boolean;
}, {
    id: string;
    mode: "redacted" | "tokenized" | "mixed";
    redactedText: string;
    tokenRefs?: {
        token: string;
        category: string;
        originalLength: number;
        restorable?: boolean | undefined;
        restorationHint?: string | undefined;
    }[] | undefined;
    findings?: {
        message: string;
        id: string;
        category: string;
        severity: "low" | "medium" | "high" | "critical";
        reasonCode: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        payloadRefs?: {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }[] | undefined;
        span?: {
            start: number;
            end: number;
        } | undefined;
        rulePackId?: string | undefined;
    }[] | undefined;
    safe?: boolean | undefined;
}>;
export type MaskedPayload = z.infer<typeof MaskedPayloadSchema>;
export declare const ProviderPolicyDecisionSchema: z.ZodObject<{
    decision: z.ZodEnum<["allow", "block", "manual-review"]>;
    reasonCode: z.ZodString;
    reason: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    providerMode: z.ZodEnum<["local-first", "external-only", "auto"]>;
    externalProviderAllowed: z.ZodBoolean;
    maskingRequired: z.ZodBoolean;
    auditRequired: z.ZodBoolean;
    findingsPresent: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    reasonCode: string;
    decision: "allow" | "block" | "manual-review";
    reason: string;
    providerMode: "local-first" | "external-only" | "auto";
    externalProviderAllowed: boolean;
    maskingRequired: boolean;
    auditRequired: boolean;
    findingsPresent: boolean;
}, {
    reasonCode: string;
    decision: "allow" | "block" | "manual-review";
    reason: string;
    providerMode: "local-first" | "external-only" | "auto";
    externalProviderAllowed: boolean;
    maskingRequired: boolean;
    auditRequired: boolean;
    findingsPresent: boolean;
}>;
export type ProviderPolicyDecision = z.infer<typeof ProviderPolicyDecisionSchema>;
export declare const AccessControlDecisionSchema: z.ZodObject<{
    decision: z.ZodEnum<["allow", "deny", "manual-review"]>;
    reasonCode: z.ZodString;
    reason: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    renderSafe: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    reasonCode: string;
    decision: "allow" | "manual-review" | "deny";
    reason: string;
    renderSafe: boolean;
}, {
    reasonCode: string;
    decision: "allow" | "manual-review" | "deny";
    reason: string;
    renderSafe: boolean;
}>;
export type AccessControlDecision = z.infer<typeof AccessControlDecisionSchema>;
export declare const SecurityAuditEventCountsSchema: z.ZodObject<{
    findings: z.ZodDefault<z.ZodNumber>;
    redactions: z.ZodDefault<z.ZodNumber>;
    tokenizations: z.ZodDefault<z.ZodNumber>;
    blockedDecisions: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    findings: number;
    redactions: number;
    tokenizations: number;
    blockedDecisions: number;
}, {
    findings?: number | undefined;
    redactions?: number | undefined;
    tokenizations?: number | undefined;
    blockedDecisions?: number | undefined;
}>;
export declare const SecurityAuditEventSchema: z.ZodObject<{
    eventType: z.ZodString;
    severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
    runId: z.ZodOptional<z.ZodString>;
    correlationId: z.ZodOptional<z.ZodString>;
    safeMessage: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    safeRefs: z.ZodDefault<z.ZodArray<z.ZodUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        path: z.ZodString;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"generated">;
        path: z.ZodString;
        segment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>]>, "many">>;
    counts: z.ZodDefault<z.ZodObject<{
        findings: z.ZodDefault<z.ZodNumber>;
        redactions: z.ZodDefault<z.ZodNumber>;
        tokenizations: z.ZodDefault<z.ZodNumber>;
        blockedDecisions: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        findings: number;
        redactions: number;
        tokenizations: number;
        blockedDecisions: number;
    }, {
        findings?: number | undefined;
        redactions?: number | undefined;
        tokenizations?: number | undefined;
        blockedDecisions?: number | undefined;
    }>>;
    reasonCodes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    severity: "critical" | "info" | "warning" | "error";
    eventType: string;
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
}, {
    severity: "critical" | "info" | "warning" | "error";
    eventType: string;
    safeMessage: string;
    runId?: string | undefined;
    correlationId?: string | undefined;
    safeRefs?: ({
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    })[] | undefined;
    counts?: {
        findings?: number | undefined;
        redactions?: number | undefined;
        tokenizations?: number | undefined;
        blockedDecisions?: number | undefined;
    } | undefined;
    reasonCodes?: string[] | undefined;
    metadata?: Record<string, string> | undefined;
}>;
export type SecurityAuditEvent = z.infer<typeof SecurityAuditEventSchema>;
export declare const SecurityRulePackSchema: z.ZodObject<{
    id: z.ZodString;
    version: z.ZodNumber;
    precedence: z.ZodNumber;
    target: z.ZodString;
    categories: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    redactionMode: z.ZodDefault<z.ZodEnum<["redacted", "tokenized", "mixed"]>>;
    tokenizationAllowed: z.ZodDefault<z.ZodBoolean>;
    allowExternalProviderUse: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    metadata: Record<string, string>;
    version: number;
    precedence: number;
    target: string;
    categories: string[];
    redactionMode: "redacted" | "tokenized" | "mixed";
    tokenizationAllowed: boolean;
    allowExternalProviderUse: boolean;
}, {
    id: string;
    version: number;
    precedence: number;
    target: string;
    metadata?: Record<string, string> | undefined;
    categories?: string[] | undefined;
    redactionMode?: "redacted" | "tokenized" | "mixed" | undefined;
    tokenizationAllowed?: boolean | undefined;
    allowExternalProviderUse?: boolean | undefined;
}>;
export type SecurityRulePack = z.infer<typeof SecurityRulePackSchema>;
export declare const SecurityConfigSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    projectRoot: z.ZodString;
    runId: z.ZodString;
    correlationId: z.ZodString;
    detectSensitiveData: z.ZodDefault<z.ZodBoolean>;
    redactOutputs: z.ZodDefault<z.ZodBoolean>;
    allowExternalProviderUse: z.ZodDefault<z.ZodBoolean>;
    externalProviderOptIn: z.ZodDefault<z.ZodBoolean>;
    auditEnabled: z.ZodDefault<z.ZodBoolean>;
    manualReviewEnabled: z.ZodDefault<z.ZodBoolean>;
    preservePartialArtifacts: z.ZodDefault<z.ZodBoolean>;
    tokenTtlMs: z.ZodDefault<z.ZodNumber>;
    rulePackIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    defaultProviderMode: z.ZodDefault<z.ZodEnum<["local-first", "external-only", "auto"]>>;
    targetAwareRulePacks: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    runId: string;
    correlationId: string;
    allowExternalProviderUse: boolean;
    schemaVersion: 1;
    projectRoot: string;
    detectSensitiveData: boolean;
    redactOutputs: boolean;
    externalProviderOptIn: boolean;
    auditEnabled: boolean;
    manualReviewEnabled: boolean;
    preservePartialArtifacts: boolean;
    tokenTtlMs: number;
    rulePackIds: string[];
    defaultProviderMode: "local-first" | "external-only" | "auto";
    targetAwareRulePacks: boolean;
}, {
    runId: string;
    correlationId: string;
    schemaVersion: 1;
    projectRoot: string;
    allowExternalProviderUse?: boolean | undefined;
    detectSensitiveData?: boolean | undefined;
    redactOutputs?: boolean | undefined;
    externalProviderOptIn?: boolean | undefined;
    auditEnabled?: boolean | undefined;
    manualReviewEnabled?: boolean | undefined;
    preservePartialArtifacts?: boolean | undefined;
    tokenTtlMs?: number | undefined;
    rulePackIds?: string[] | undefined;
    defaultProviderMode?: "local-first" | "external-only" | "auto" | undefined;
    targetAwareRulePacks?: boolean | undefined;
}>;
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
export declare const SecurityConfigInputSchema: z.ZodObject<{
    runId: z.ZodOptional<z.ZodString>;
    correlationId: z.ZodOptional<z.ZodString>;
    allowExternalProviderUse: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    projectRoot: z.ZodOptional<z.ZodString>;
    detectSensitiveData: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    redactOutputs: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    externalProviderOptIn: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    auditEnabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    manualReviewEnabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    preservePartialArtifacts: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    tokenTtlMs: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    rulePackIds: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    defaultProviderMode: z.ZodOptional<z.ZodDefault<z.ZodEnum<["local-first", "external-only", "auto"]>>>;
    targetAwareRulePacks: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    runId: z.ZodOptional<z.ZodString>;
    correlationId: z.ZodOptional<z.ZodString>;
    allowExternalProviderUse: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    projectRoot: z.ZodOptional<z.ZodString>;
    detectSensitiveData: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    redactOutputs: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    externalProviderOptIn: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    auditEnabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    manualReviewEnabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    preservePartialArtifacts: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    tokenTtlMs: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    rulePackIds: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    defaultProviderMode: z.ZodOptional<z.ZodDefault<z.ZodEnum<["local-first", "external-only", "auto"]>>>;
    targetAwareRulePacks: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    runId: z.ZodOptional<z.ZodString>;
    correlationId: z.ZodOptional<z.ZodString>;
    allowExternalProviderUse: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    projectRoot: z.ZodOptional<z.ZodString>;
    detectSensitiveData: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    redactOutputs: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    externalProviderOptIn: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    auditEnabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    manualReviewEnabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    preservePartialArtifacts: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    tokenTtlMs: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    rulePackIds: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    defaultProviderMode: z.ZodOptional<z.ZodDefault<z.ZodEnum<["local-first", "external-only", "auto"]>>>;
    targetAwareRulePacks: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.ZodTypeAny, "passthrough">>;
export type SecurityConfigInput = z.infer<typeof SecurityConfigInputSchema>;
export declare const SecurityEvaluationRequestSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    payload: z.ZodUnion<[z.ZodString, z.ZodRecord<z.ZodString, z.ZodUnknown>, z.ZodArray<z.ZodUnknown, "many">]>;
    rawConfig: z.ZodOptional<z.ZodUnknown>;
    overrides: z.ZodOptional<z.ZodUnknown>;
    providerMode: z.ZodDefault<z.ZodEnum<["local-first", "external-only", "auto"]>>;
    externalProviderRequested: z.ZodDefault<z.ZodBoolean>;
    rulePacks: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        version: z.ZodNumber;
        precedence: z.ZodNumber;
        target: z.ZodString;
        categories: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        redactionMode: z.ZodDefault<z.ZodEnum<["redacted", "tokenized", "mixed"]>>;
        tokenizationAllowed: z.ZodDefault<z.ZodBoolean>;
        allowExternalProviderUse: z.ZodDefault<z.ZodBoolean>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        metadata: Record<string, string>;
        version: number;
        precedence: number;
        target: string;
        categories: string[];
        redactionMode: "redacted" | "tokenized" | "mixed";
        tokenizationAllowed: boolean;
        allowExternalProviderUse: boolean;
    }, {
        id: string;
        version: number;
        precedence: number;
        target: string;
        metadata?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        redactionMode?: "redacted" | "tokenized" | "mixed" | undefined;
        tokenizationAllowed?: boolean | undefined;
        allowExternalProviderUse?: boolean | undefined;
    }>, "many">>;
    sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        path: z.ZodString;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }>, "many">>;
    generatedRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"generated">;
        path: z.ZodString;
        segment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    payload: string | unknown[] | Record<string, unknown>;
    sourceRefs: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[];
    providerMode: "local-first" | "external-only" | "auto";
    schemaVersion: 1;
    externalProviderRequested: boolean;
    rulePacks: {
        id: string;
        metadata: Record<string, string>;
        version: number;
        precedence: number;
        target: string;
        categories: string[];
        redactionMode: "redacted" | "tokenized" | "mixed";
        tokenizationAllowed: boolean;
        allowExternalProviderUse: boolean;
    }[];
    generatedRefs: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[];
    rawConfig?: unknown;
    overrides?: unknown;
}, {
    payload: string | unknown[] | Record<string, unknown>;
    schemaVersion: 1;
    sourceRefs?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[] | undefined;
    providerMode?: "local-first" | "external-only" | "auto" | undefined;
    rawConfig?: unknown;
    overrides?: unknown;
    externalProviderRequested?: boolean | undefined;
    rulePacks?: {
        id: string;
        version: number;
        precedence: number;
        target: string;
        metadata?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        redactionMode?: "redacted" | "tokenized" | "mixed" | undefined;
        tokenizationAllowed?: boolean | undefined;
        allowExternalProviderUse?: boolean | undefined;
    }[] | undefined;
    generatedRefs?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[] | undefined;
}>;
export type SecurityEvaluationRequest = z.infer<typeof SecurityEvaluationRequestSchema>;
export declare const SecurityEvaluationResultSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    config: z.ZodObject<{
        schemaVersion: z.ZodLiteral<1>;
        projectRoot: z.ZodString;
        runId: z.ZodString;
        correlationId: z.ZodString;
        detectSensitiveData: z.ZodDefault<z.ZodBoolean>;
        redactOutputs: z.ZodDefault<z.ZodBoolean>;
        allowExternalProviderUse: z.ZodDefault<z.ZodBoolean>;
        externalProviderOptIn: z.ZodDefault<z.ZodBoolean>;
        auditEnabled: z.ZodDefault<z.ZodBoolean>;
        manualReviewEnabled: z.ZodDefault<z.ZodBoolean>;
        preservePartialArtifacts: z.ZodDefault<z.ZodBoolean>;
        tokenTtlMs: z.ZodDefault<z.ZodNumber>;
        rulePackIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        defaultProviderMode: z.ZodDefault<z.ZodEnum<["local-first", "external-only", "auto"]>>;
        targetAwareRulePacks: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        runId: string;
        correlationId: string;
        allowExternalProviderUse: boolean;
        schemaVersion: 1;
        projectRoot: string;
        detectSensitiveData: boolean;
        redactOutputs: boolean;
        externalProviderOptIn: boolean;
        auditEnabled: boolean;
        manualReviewEnabled: boolean;
        preservePartialArtifacts: boolean;
        tokenTtlMs: number;
        rulePackIds: string[];
        defaultProviderMode: "local-first" | "external-only" | "auto";
        targetAwareRulePacks: boolean;
    }, {
        runId: string;
        correlationId: string;
        schemaVersion: 1;
        projectRoot: string;
        allowExternalProviderUse?: boolean | undefined;
        detectSensitiveData?: boolean | undefined;
        redactOutputs?: boolean | undefined;
        externalProviderOptIn?: boolean | undefined;
        auditEnabled?: boolean | undefined;
        manualReviewEnabled?: boolean | undefined;
        preservePartialArtifacts?: boolean | undefined;
        tokenTtlMs?: number | undefined;
        rulePackIds?: string[] | undefined;
        defaultProviderMode?: "local-first" | "external-only" | "auto" | undefined;
        targetAwareRulePacks?: boolean | undefined;
    }>;
    findings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        category: z.ZodString;
        severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
        message: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            path: z.ZodString;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }>, "many">>;
        payloadRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"payload">;
            id: z.ZodString;
            category: z.ZodString;
            sourceRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                path: z.ZodString;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }, {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }, {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }>, "many">>;
        span: z.ZodOptional<z.ZodObject<{
            start: z.ZodNumber;
            end: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            start: number;
            end: number;
        }, {
            start: number;
            end: number;
        }>>;
        rulePackId: z.ZodOptional<z.ZodString>;
        reasonCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        id: string;
        category: string;
        severity: "low" | "medium" | "high" | "critical";
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        payloadRefs: {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }[];
        reasonCode: string;
        span?: {
            start: number;
            end: number;
        } | undefined;
        rulePackId?: string | undefined;
    }, {
        message: string;
        id: string;
        category: string;
        severity: "low" | "medium" | "high" | "critical";
        reasonCode: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        payloadRefs?: {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }[] | undefined;
        span?: {
            start: number;
            end: number;
        } | undefined;
        rulePackId?: string | undefined;
    }>, "many">;
    maskedPayload: z.ZodObject<{
        id: z.ZodString;
        mode: z.ZodEnum<["redacted", "tokenized", "mixed"]>;
        redactedText: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        tokenRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            token: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            category: z.ZodString;
            originalLength: z.ZodNumber;
            restorable: z.ZodDefault<z.ZodBoolean>;
            restorationHint: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        }, "strip", z.ZodTypeAny, {
            token: string;
            category: string;
            originalLength: number;
            restorable: boolean;
            restorationHint?: string | undefined;
        }, {
            token: string;
            category: string;
            originalLength: number;
            restorable?: boolean | undefined;
            restorationHint?: string | undefined;
        }>, "many">>;
        findings: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            category: z.ZodString;
            severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
            message: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                path: z.ZodString;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }, {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }>, "many">>;
            payloadRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
                kind: z.ZodLiteral<"payload">;
                id: z.ZodString;
                category: z.ZodString;
                sourceRef: z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"source">;
                    path: z.ZodString;
                    symbol: z.ZodOptional<z.ZodString>;
                    location: z.ZodOptional<z.ZodString>;
                }, "strip", z.ZodTypeAny, {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                }, {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                kind: "payload";
                id: string;
                category: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
            }, {
                kind: "payload";
                id: string;
                category: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
            }>, "many">>;
            span: z.ZodOptional<z.ZodObject<{
                start: z.ZodNumber;
                end: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                start: number;
                end: number;
            }, {
                start: number;
                end: number;
            }>>;
            rulePackId: z.ZodOptional<z.ZodString>;
            reasonCode: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            message: string;
            id: string;
            category: string;
            severity: "low" | "medium" | "high" | "critical";
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            payloadRefs: {
                kind: "payload";
                id: string;
                category: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
            }[];
            reasonCode: string;
            span?: {
                start: number;
                end: number;
            } | undefined;
            rulePackId?: string | undefined;
        }, {
            message: string;
            id: string;
            category: string;
            severity: "low" | "medium" | "high" | "critical";
            reasonCode: string;
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            payloadRefs?: {
                kind: "payload";
                id: string;
                category: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
            }[] | undefined;
            span?: {
                start: number;
                end: number;
            } | undefined;
            rulePackId?: string | undefined;
        }>, "many">>;
        safe: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        mode: "redacted" | "tokenized" | "mixed";
        redactedText: string;
        tokenRefs: {
            token: string;
            category: string;
            originalLength: number;
            restorable: boolean;
            restorationHint?: string | undefined;
        }[];
        findings: {
            message: string;
            id: string;
            category: string;
            severity: "low" | "medium" | "high" | "critical";
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            payloadRefs: {
                kind: "payload";
                id: string;
                category: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
            }[];
            reasonCode: string;
            span?: {
                start: number;
                end: number;
            } | undefined;
            rulePackId?: string | undefined;
        }[];
        safe: boolean;
    }, {
        id: string;
        mode: "redacted" | "tokenized" | "mixed";
        redactedText: string;
        tokenRefs?: {
            token: string;
            category: string;
            originalLength: number;
            restorable?: boolean | undefined;
            restorationHint?: string | undefined;
        }[] | undefined;
        findings?: {
            message: string;
            id: string;
            category: string;
            severity: "low" | "medium" | "high" | "critical";
            reasonCode: string;
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            payloadRefs?: {
                kind: "payload";
                id: string;
                category: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
            }[] | undefined;
            span?: {
                start: number;
                end: number;
            } | undefined;
            rulePackId?: string | undefined;
        }[] | undefined;
        safe?: boolean | undefined;
    }>;
    policyDecision: z.ZodObject<{
        decision: z.ZodEnum<["allow", "block", "manual-review"]>;
        reasonCode: z.ZodString;
        reason: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        providerMode: z.ZodEnum<["local-first", "external-only", "auto"]>;
        externalProviderAllowed: z.ZodBoolean;
        maskingRequired: z.ZodBoolean;
        auditRequired: z.ZodBoolean;
        findingsPresent: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        reasonCode: string;
        decision: "allow" | "block" | "manual-review";
        reason: string;
        providerMode: "local-first" | "external-only" | "auto";
        externalProviderAllowed: boolean;
        maskingRequired: boolean;
        auditRequired: boolean;
        findingsPresent: boolean;
    }, {
        reasonCode: string;
        decision: "allow" | "block" | "manual-review";
        reason: string;
        providerMode: "local-first" | "external-only" | "auto";
        externalProviderAllowed: boolean;
        maskingRequired: boolean;
        auditRequired: boolean;
        findingsPresent: boolean;
    }>;
    auditEvent: z.ZodObject<{
        eventType: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
        runId: z.ZodOptional<z.ZodString>;
        correlationId: z.ZodOptional<z.ZodString>;
        safeMessage: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        safeRefs: z.ZodDefault<z.ZodArray<z.ZodUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            path: z.ZodString;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            path: z.ZodString;
            segment: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>]>, "many">>;
        counts: z.ZodDefault<z.ZodObject<{
            findings: z.ZodDefault<z.ZodNumber>;
            redactions: z.ZodDefault<z.ZodNumber>;
            tokenizations: z.ZodDefault<z.ZodNumber>;
            blockedDecisions: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            findings: number;
            redactions: number;
            tokenizations: number;
            blockedDecisions: number;
        }, {
            findings?: number | undefined;
            redactions?: number | undefined;
            tokenizations?: number | undefined;
            blockedDecisions?: number | undefined;
        }>>;
        reasonCodes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        severity: "critical" | "info" | "warning" | "error";
        eventType: string;
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
    }, {
        severity: "critical" | "info" | "warning" | "error";
        eventType: string;
        safeMessage: string;
        runId?: string | undefined;
        correlationId?: string | undefined;
        safeRefs?: ({
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        })[] | undefined;
        counts?: {
            findings?: number | undefined;
            redactions?: number | undefined;
            tokenizations?: number | undefined;
            blockedDecisions?: number | undefined;
        } | undefined;
        reasonCodes?: string[] | undefined;
        metadata?: Record<string, string> | undefined;
    }>;
    accessDecision: z.ZodObject<{
        decision: z.ZodEnum<["allow", "deny", "manual-review"]>;
        reasonCode: z.ZodString;
        reason: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        renderSafe: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        reasonCode: string;
        decision: "allow" | "manual-review" | "deny";
        reason: string;
        renderSafe: boolean;
    }, {
        reasonCode: string;
        decision: "allow" | "manual-review" | "deny";
        reason: string;
        renderSafe: boolean;
    }>;
    rulePacks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        version: z.ZodNumber;
        precedence: z.ZodNumber;
        target: z.ZodString;
        categories: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        redactionMode: z.ZodDefault<z.ZodEnum<["redacted", "tokenized", "mixed"]>>;
        tokenizationAllowed: z.ZodDefault<z.ZodBoolean>;
        allowExternalProviderUse: z.ZodDefault<z.ZodBoolean>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        metadata: Record<string, string>;
        version: number;
        precedence: number;
        target: string;
        categories: string[];
        redactionMode: "redacted" | "tokenized" | "mixed";
        tokenizationAllowed: boolean;
        allowExternalProviderUse: boolean;
    }, {
        id: string;
        version: number;
        precedence: number;
        target: string;
        metadata?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        redactionMode?: "redacted" | "tokenized" | "mixed" | undefined;
        tokenizationAllowed?: boolean | undefined;
        allowExternalProviderUse?: boolean | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    findings: {
        message: string;
        id: string;
        category: string;
        severity: "low" | "medium" | "high" | "critical";
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        payloadRefs: {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }[];
        reasonCode: string;
        span?: {
            start: number;
            end: number;
        } | undefined;
        rulePackId?: string | undefined;
    }[];
    schemaVersion: 1;
    rulePacks: {
        id: string;
        metadata: Record<string, string>;
        version: number;
        precedence: number;
        target: string;
        categories: string[];
        redactionMode: "redacted" | "tokenized" | "mixed";
        tokenizationAllowed: boolean;
        allowExternalProviderUse: boolean;
    }[];
    config: {
        runId: string;
        correlationId: string;
        allowExternalProviderUse: boolean;
        schemaVersion: 1;
        projectRoot: string;
        detectSensitiveData: boolean;
        redactOutputs: boolean;
        externalProviderOptIn: boolean;
        auditEnabled: boolean;
        manualReviewEnabled: boolean;
        preservePartialArtifacts: boolean;
        tokenTtlMs: number;
        rulePackIds: string[];
        defaultProviderMode: "local-first" | "external-only" | "auto";
        targetAwareRulePacks: boolean;
    };
    maskedPayload: {
        id: string;
        mode: "redacted" | "tokenized" | "mixed";
        redactedText: string;
        tokenRefs: {
            token: string;
            category: string;
            originalLength: number;
            restorable: boolean;
            restorationHint?: string | undefined;
        }[];
        findings: {
            message: string;
            id: string;
            category: string;
            severity: "low" | "medium" | "high" | "critical";
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            payloadRefs: {
                kind: "payload";
                id: string;
                category: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
            }[];
            reasonCode: string;
            span?: {
                start: number;
                end: number;
            } | undefined;
            rulePackId?: string | undefined;
        }[];
        safe: boolean;
    };
    policyDecision: {
        reasonCode: string;
        decision: "allow" | "block" | "manual-review";
        reason: string;
        providerMode: "local-first" | "external-only" | "auto";
        externalProviderAllowed: boolean;
        maskingRequired: boolean;
        auditRequired: boolean;
        findingsPresent: boolean;
    };
    auditEvent: {
        severity: "critical" | "info" | "warning" | "error";
        eventType: string;
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
    };
    accessDecision: {
        reasonCode: string;
        decision: "allow" | "manual-review" | "deny";
        reason: string;
        renderSafe: boolean;
    };
}, {
    findings: {
        message: string;
        id: string;
        category: string;
        severity: "low" | "medium" | "high" | "critical";
        reasonCode: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        payloadRefs?: {
            kind: "payload";
            id: string;
            category: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
        }[] | undefined;
        span?: {
            start: number;
            end: number;
        } | undefined;
        rulePackId?: string | undefined;
    }[];
    schemaVersion: 1;
    rulePacks: {
        id: string;
        version: number;
        precedence: number;
        target: string;
        metadata?: Record<string, string> | undefined;
        categories?: string[] | undefined;
        redactionMode?: "redacted" | "tokenized" | "mixed" | undefined;
        tokenizationAllowed?: boolean | undefined;
        allowExternalProviderUse?: boolean | undefined;
    }[];
    config: {
        runId: string;
        correlationId: string;
        schemaVersion: 1;
        projectRoot: string;
        allowExternalProviderUse?: boolean | undefined;
        detectSensitiveData?: boolean | undefined;
        redactOutputs?: boolean | undefined;
        externalProviderOptIn?: boolean | undefined;
        auditEnabled?: boolean | undefined;
        manualReviewEnabled?: boolean | undefined;
        preservePartialArtifacts?: boolean | undefined;
        tokenTtlMs?: number | undefined;
        rulePackIds?: string[] | undefined;
        defaultProviderMode?: "local-first" | "external-only" | "auto" | undefined;
        targetAwareRulePacks?: boolean | undefined;
    };
    maskedPayload: {
        id: string;
        mode: "redacted" | "tokenized" | "mixed";
        redactedText: string;
        tokenRefs?: {
            token: string;
            category: string;
            originalLength: number;
            restorable?: boolean | undefined;
            restorationHint?: string | undefined;
        }[] | undefined;
        findings?: {
            message: string;
            id: string;
            category: string;
            severity: "low" | "medium" | "high" | "critical";
            reasonCode: string;
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            payloadRefs?: {
                kind: "payload";
                id: string;
                category: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
            }[] | undefined;
            span?: {
                start: number;
                end: number;
            } | undefined;
            rulePackId?: string | undefined;
        }[] | undefined;
        safe?: boolean | undefined;
    };
    policyDecision: {
        reasonCode: string;
        decision: "allow" | "block" | "manual-review";
        reason: string;
        providerMode: "local-first" | "external-only" | "auto";
        externalProviderAllowed: boolean;
        maskingRequired: boolean;
        auditRequired: boolean;
        findingsPresent: boolean;
    };
    auditEvent: {
        severity: "critical" | "info" | "warning" | "error";
        eventType: string;
        safeMessage: string;
        runId?: string | undefined;
        correlationId?: string | undefined;
        safeRefs?: ({
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        })[] | undefined;
        counts?: {
            findings?: number | undefined;
            redactions?: number | undefined;
            tokenizations?: number | undefined;
            blockedDecisions?: number | undefined;
        } | undefined;
        reasonCodes?: string[] | undefined;
        metadata?: Record<string, string> | undefined;
    };
    accessDecision: {
        reasonCode: string;
        decision: "allow" | "manual-review" | "deny";
        reason: string;
        renderSafe: boolean;
    };
}>;
export type SecurityEvaluationResult = z.infer<typeof SecurityEvaluationResultSchema>;
export declare const createSecurityError: (code: SecurityErrorCode, message: string, cause?: unknown) => SecurityError;
//# sourceMappingURL=types.d.ts.map