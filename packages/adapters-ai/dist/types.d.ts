import { z } from 'zod';
import { type ProviderPolicyDecision as CoreProviderPolicyDecision } from '@spa-bridge/core-security';
export declare const ProviderModeSchema: z.ZodEnum<["local-first", "external-only", "auto"]>;
export type ProviderMode = z.infer<typeof ProviderModeSchema>;
export declare const ProviderAdapterKindSchema: z.ZodEnum<["local-internal", "external", "mock"]>;
export type ProviderAdapterKind = z.infer<typeof ProviderAdapterKindSchema>;
export declare const ProviderCapabilityCategorySchema: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
export type ProviderCapabilityCategory = z.infer<typeof ProviderCapabilityCategorySchema>;
export declare const ProviderSafeContextValueSchema: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>;
export type ProviderSafeContextValue = z.infer<typeof ProviderSafeContextValueSchema>;
export declare const ProviderSafeContextSchema: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
export type ProviderSafeContext = Record<string, ProviderSafeContextValue>;
export declare const ProviderErrorCodeSchema: z.ZodEnum<["INVALID_PROVIDER_DESCRIPTOR", "DUPLICATE_PROVIDER_ID", "INVALID_TARGET_CAPABILITY_PACK", "UNSAFE_PROVIDER_CONTEXT", "MISSING_POLICY_DECISION", "POLICY_BLOCKED", "NO_MATCHING_PROVIDER", "TIMEOUT", "INVALID_RESPONSE", "UNSAFE_RESPONSE", "EXTERNAL_PROVIDER_DISABLED", "ADAPTER_FAILED", "UNKNOWN_PROVIDER", "VALIDATION_FAILED", "UNSUPPORTED_PROVIDER_MODE"]>;
export type ProviderErrorCode = z.infer<typeof ProviderErrorCodeSchema>;
export declare const ProviderErrorSchema: z.ZodObject<{
    code: z.ZodEnum<["INVALID_PROVIDER_DESCRIPTOR", "DUPLICATE_PROVIDER_ID", "INVALID_TARGET_CAPABILITY_PACK", "UNSAFE_PROVIDER_CONTEXT", "MISSING_POLICY_DECISION", "POLICY_BLOCKED", "NO_MATCHING_PROVIDER", "TIMEOUT", "INVALID_RESPONSE", "UNSAFE_RESPONSE", "EXTERNAL_PROVIDER_DISABLED", "ADAPTER_FAILED", "UNKNOWN_PROVIDER", "VALIDATION_FAILED", "UNSUPPORTED_PROVIDER_MODE"]>;
    message: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    providerId: z.ZodOptional<z.ZodString>;
    retryable: z.ZodDefault<z.ZodBoolean>;
    causeCategory: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: "INVALID_PROVIDER_DESCRIPTOR" | "DUPLICATE_PROVIDER_ID" | "INVALID_TARGET_CAPABILITY_PACK" | "UNSAFE_PROVIDER_CONTEXT" | "MISSING_POLICY_DECISION" | "POLICY_BLOCKED" | "NO_MATCHING_PROVIDER" | "TIMEOUT" | "INVALID_RESPONSE" | "UNSAFE_RESPONSE" | "EXTERNAL_PROVIDER_DISABLED" | "ADAPTER_FAILED" | "UNKNOWN_PROVIDER" | "VALIDATION_FAILED" | "UNSUPPORTED_PROVIDER_MODE";
    message: string;
    retryable: boolean;
    providerId?: string | undefined;
    causeCategory?: string | undefined;
}, {
    code: "INVALID_PROVIDER_DESCRIPTOR" | "DUPLICATE_PROVIDER_ID" | "INVALID_TARGET_CAPABILITY_PACK" | "UNSAFE_PROVIDER_CONTEXT" | "MISSING_POLICY_DECISION" | "POLICY_BLOCKED" | "NO_MATCHING_PROVIDER" | "TIMEOUT" | "INVALID_RESPONSE" | "UNSAFE_RESPONSE" | "EXTERNAL_PROVIDER_DISABLED" | "ADAPTER_FAILED" | "UNKNOWN_PROVIDER" | "VALIDATION_FAILED" | "UNSUPPORTED_PROVIDER_MODE";
    message: string;
    providerId?: string | undefined;
    retryable?: boolean | undefined;
    causeCategory?: string | undefined;
}>;
export type ProviderError = z.infer<typeof ProviderErrorSchema>;
export declare const ProviderCapabilitySchema: z.ZodObject<{
    category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    supportsStructuredResponse: z.ZodDefault<z.ZodBoolean>;
    supportsSafeRationale: z.ZodDefault<z.ZodBoolean>;
    maxContextItems: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
    tags: string[];
    supportsStructuredResponse: boolean;
    supportsSafeRationale: boolean;
    maxContextItems: number;
}, {
    category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
    tags?: string[] | undefined;
    supportsStructuredResponse?: boolean | undefined;
    supportsSafeRationale?: boolean | undefined;
    maxContextItems?: number | undefined;
}>;
export type ProviderCapability = z.infer<typeof ProviderCapabilitySchema>;
export declare const TargetCapabilityPackSchema: z.ZodObject<{
    packId: z.ZodString;
    version: z.ZodNumber;
    capabilityTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    supportedFrameworks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    forbiddenMetadataFields: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    packId: string;
    version: number;
    capabilityTags: string[];
    supportedFrameworks: string[];
    forbiddenMetadataFields: string[];
}, {
    packId: string;
    version: number;
    capabilityTags?: string[] | undefined;
    supportedFrameworks?: string[] | undefined;
    forbiddenMetadataFields?: string[] | undefined;
}>;
export type TargetCapabilityPack = z.infer<typeof TargetCapabilityPackSchema>;
export declare const ProviderDescriptorSchema: z.ZodObject<{
    providerId: z.ZodString;
    adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
    displayName: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    capabilities: z.ZodDefault<z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        supportsStructuredResponse: z.ZodDefault<z.ZodBoolean>;
        supportsSafeRationale: z.ZodDefault<z.ZodBoolean>;
        maxContextItems: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        tags: string[];
        supportsStructuredResponse: boolean;
        supportsSafeRationale: boolean;
        maxContextItems: number;
    }, {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        tags?: string[] | undefined;
        supportsStructuredResponse?: boolean | undefined;
        supportsSafeRationale?: boolean | undefined;
        maxContextItems?: number | undefined;
    }>, "many">>;
    priority: z.ZodDefault<z.ZodNumber>;
    enabled: z.ZodDefault<z.ZodBoolean>;
    requiresExternalPolicy: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    providerId: string;
    adapterKind: "local-internal" | "external" | "mock";
    displayName: string;
    capabilities: {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        tags: string[];
        supportsStructuredResponse: boolean;
        supportsSafeRationale: boolean;
        maxContextItems: number;
    }[];
    priority: number;
    enabled: boolean;
    requiresExternalPolicy: boolean;
    metadata: Record<string, string>;
}, {
    providerId: string;
    adapterKind: "local-internal" | "external" | "mock";
    displayName: string;
    capabilities?: {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        tags?: string[] | undefined;
        supportsStructuredResponse?: boolean | undefined;
        supportsSafeRationale?: boolean | undefined;
        maxContextItems?: number | undefined;
    }[] | undefined;
    priority?: number | undefined;
    enabled?: boolean | undefined;
    requiresExternalPolicy?: boolean | undefined;
    metadata?: Record<string, string> | undefined;
}>;
export type ProviderDescriptor = z.infer<typeof ProviderDescriptorSchema>;
export declare const ProviderSelectionRequestSchema: z.ZodObject<{
    runId: z.ZodString;
    correlationId: z.ZodString;
    mappingRequestId: z.ZodString;
    providerMode: z.ZodEnum<["local-first", "external-only", "auto"]>;
    category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
    capabilityTags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
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
}, "strip", z.ZodTypeAny, {
    category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
    capabilityTags: string[];
    runId: string;
    correlationId: string;
    mappingRequestId: string;
    providerMode: "local-first" | "external-only" | "auto";
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
}, {
    category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
    runId: string;
    correlationId: string;
    mappingRequestId: string;
    providerMode: "local-first" | "external-only" | "auto";
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
    capabilityTags?: string[] | undefined;
}>;
export type ProviderSelectionRequest = z.infer<typeof ProviderSelectionRequestSchema>;
export declare const ProviderSelectionResultSchema: z.ZodObject<{
    status: z.ZodEnum<["selected", "blocked", "manual-review"]>;
    provider: z.ZodOptional<z.ZodObject<{
        providerId: z.ZodString;
        adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
        displayName: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        capabilities: z.ZodDefault<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
            tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            supportsStructuredResponse: z.ZodDefault<z.ZodBoolean>;
            supportsSafeRationale: z.ZodDefault<z.ZodBoolean>;
            maxContextItems: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags: string[];
            supportsStructuredResponse: boolean;
            supportsSafeRationale: boolean;
            maxContextItems: number;
        }, {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags?: string[] | undefined;
            supportsStructuredResponse?: boolean | undefined;
            supportsSafeRationale?: boolean | undefined;
            maxContextItems?: number | undefined;
        }>, "many">>;
        priority: z.ZodDefault<z.ZodNumber>;
        enabled: z.ZodDefault<z.ZodBoolean>;
        requiresExternalPolicy: z.ZodDefault<z.ZodBoolean>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags: string[];
            supportsStructuredResponse: boolean;
            supportsSafeRationale: boolean;
            maxContextItems: number;
        }[];
        priority: number;
        enabled: boolean;
        requiresExternalPolicy: boolean;
        metadata: Record<string, string>;
    }, {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities?: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags?: string[] | undefined;
            supportsStructuredResponse?: boolean | undefined;
            supportsSafeRationale?: boolean | undefined;
            maxContextItems?: number | undefined;
        }[] | undefined;
        priority?: number | undefined;
        enabled?: boolean | undefined;
        requiresExternalPolicy?: boolean | undefined;
        metadata?: Record<string, string> | undefined;
    }>>;
    reasonCode: z.ZodString;
    diagnostics: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "manual-review" | "selected" | "blocked";
    reasonCode: string;
    diagnostics: string[];
    provider?: {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags: string[];
            supportsStructuredResponse: boolean;
            supportsSafeRationale: boolean;
            maxContextItems: number;
        }[];
        priority: number;
        enabled: boolean;
        requiresExternalPolicy: boolean;
        metadata: Record<string, string>;
    } | undefined;
}, {
    status: "manual-review" | "selected" | "blocked";
    reasonCode: string;
    provider?: {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities?: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags?: string[] | undefined;
            supportsStructuredResponse?: boolean | undefined;
            supportsSafeRationale?: boolean | undefined;
            maxContextItems?: number | undefined;
        }[] | undefined;
        priority?: number | undefined;
        enabled?: boolean | undefined;
        requiresExternalPolicy?: boolean | undefined;
        metadata?: Record<string, string> | undefined;
    } | undefined;
    diagnostics?: string[] | undefined;
}>;
export type ProviderSelectionResult = z.infer<typeof ProviderSelectionResultSchema>;
export declare const ProviderNeutralRefinementRequestSchema: z.ZodObject<{
    mappingRequestId: z.ZodString;
    category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
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
    draftRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
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
    ruleIds: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    safeContext: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>>;
}, "strip", z.ZodTypeAny, {
    category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
    mappingRequestId: string;
    sourceRefs: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[];
    draftRefs: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[];
    ruleIds: string[];
    diagnosticRefs: string[];
    safeContext: Record<string, string | number | boolean | string[]>;
}, {
    category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
    mappingRequestId: string;
    sourceRefs?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[] | undefined;
    draftRefs?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[] | undefined;
    ruleIds?: string[] | undefined;
    diagnosticRefs?: string[] | undefined;
    safeContext?: Record<string, string | number | boolean | string[]> | undefined;
}>;
export type ProviderNeutralRefinementRequest = z.infer<typeof ProviderNeutralRefinementRequestSchema>;
export declare const MinimizedProviderContextSchema: z.ZodObject<{
    contextId: z.ZodString;
    mappingRequestId: z.ZodString;
    category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
    safeContext: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
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
    policyEvidenceRef: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    masked: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
    mappingRequestId: string;
    safeContext: Record<string, string | number | boolean | string[]>;
    contextId: string;
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
    policyEvidenceRef: string;
    masked: boolean;
}, {
    category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
    mappingRequestId: string;
    safeContext: Record<string, string | number | boolean | string[]>;
    contextId: string;
    policyEvidenceRef: string;
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
    masked?: boolean | undefined;
}>;
export type MinimizedProviderContext = z.infer<typeof MinimizedProviderContextSchema>;
export declare const ProviderInvocationRequestSchema: z.ZodObject<{
    providerId: z.ZodString;
    adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
    context: z.ZodObject<{
        contextId: z.ZodString;
        mappingRequestId: z.ZodString;
        category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
        safeContext: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
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
        policyEvidenceRef: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        masked: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        safeContext: Record<string, string | number | boolean | string[]>;
        contextId: string;
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
        policyEvidenceRef: string;
        masked: boolean;
    }, {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        safeContext: Record<string, string | number | boolean | string[]>;
        contextId: string;
        policyEvidenceRef: string;
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
        masked?: boolean | undefined;
    }>;
    timeoutMs: z.ZodNumber;
    requestMetadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    providerId: string;
    adapterKind: "local-internal" | "external" | "mock";
    context: {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        safeContext: Record<string, string | number | boolean | string[]>;
        contextId: string;
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
        policyEvidenceRef: string;
        masked: boolean;
    };
    timeoutMs: number;
    requestMetadata: Record<string, string>;
}, {
    providerId: string;
    adapterKind: "local-internal" | "external" | "mock";
    context: {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        safeContext: Record<string, string | number | boolean | string[]>;
        contextId: string;
        policyEvidenceRef: string;
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
        masked?: boolean | undefined;
    };
    timeoutMs: number;
    requestMetadata?: Record<string, string> | undefined;
}>;
export type ProviderInvocationRequest = z.infer<typeof ProviderInvocationRequestSchema>;
export declare const ProviderProvenanceSchema: z.ZodObject<{
    providerId: z.ZodString;
    adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
    modelLabel: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    invokedAt: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    policyDecisionRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    auditEventRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
}, "strip", z.ZodTypeAny, {
    providerId: string;
    adapterKind: "local-internal" | "external" | "mock";
    modelLabel?: string | undefined;
    invokedAt?: string | undefined;
    policyDecisionRef?: string | undefined;
    auditEventRef?: string | undefined;
}, {
    providerId: string;
    adapterKind: "local-internal" | "external" | "mock";
    modelLabel?: string | undefined;
    invokedAt?: string | undefined;
    policyDecisionRef?: string | undefined;
    auditEventRef?: string | undefined;
}>;
export type ProviderProvenance = z.infer<typeof ProviderProvenanceSchema>;
export declare const RefinementSuggestionSchema: z.ZodObject<{
    suggestionId: z.ZodString;
    mappingRequestId: z.ZodString;
    category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
    safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    safeRationale: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    confidence: z.ZodNumber;
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
    provenance: z.ZodObject<{
        providerId: z.ZodString;
        adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
        modelLabel: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        invokedAt: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        policyDecisionRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        auditEventRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    }, "strip", z.ZodTypeAny, {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        modelLabel?: string | undefined;
        invokedAt?: string | undefined;
        policyDecisionRef?: string | undefined;
        auditEventRef?: string | undefined;
    }, {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        modelLabel?: string | undefined;
        invokedAt?: string | undefined;
        policyDecisionRef?: string | undefined;
        auditEventRef?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
    mappingRequestId: string;
    sourceRefs: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[];
    suggestionId: string;
    safeSummary: string;
    safeRationale: string;
    confidence: number;
    generatedRefs: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[];
    provenance: {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        modelLabel?: string | undefined;
        invokedAt?: string | undefined;
        policyDecisionRef?: string | undefined;
        auditEventRef?: string | undefined;
    };
}, {
    category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
    mappingRequestId: string;
    suggestionId: string;
    safeSummary: string;
    safeRationale: string;
    confidence: number;
    provenance: {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        modelLabel?: string | undefined;
        invokedAt?: string | undefined;
        policyDecisionRef?: string | undefined;
        auditEventRef?: string | undefined;
    };
    sourceRefs?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[] | undefined;
    generatedRefs?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[] | undefined;
}>;
export type RefinementSuggestion = z.infer<typeof RefinementSuggestionSchema>;
export declare const ProviderResponseSchema: z.ZodObject<{
    mappingRequestId: z.ZodString;
    suggestions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        suggestionId: z.ZodString;
        mappingRequestId: z.ZodString;
        category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
        safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        safeRationale: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        confidence: z.ZodNumber;
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
        provenance: z.ZodObject<{
            providerId: z.ZodString;
            adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
            modelLabel: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            invokedAt: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            policyDecisionRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            auditEventRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        }, "strip", z.ZodTypeAny, {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        }, {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        suggestionId: string;
        safeSummary: string;
        safeRationale: string;
        confidence: number;
        generatedRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        provenance: {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        };
    }, {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        suggestionId: string;
        safeSummary: string;
        safeRationale: string;
        confidence: number;
        provenance: {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        };
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        generatedRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    }>, "many">>;
    modelLabel: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
}, "strip", z.ZodTypeAny, {
    mappingRequestId: string;
    suggestions: {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        suggestionId: string;
        safeSummary: string;
        safeRationale: string;
        confidence: number;
        generatedRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        provenance: {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        };
    }[];
    modelLabel?: string | undefined;
}, {
    mappingRequestId: string;
    modelLabel?: string | undefined;
    suggestions?: {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        suggestionId: string;
        safeSummary: string;
        safeRationale: string;
        confidence: number;
        provenance: {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        };
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        generatedRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    }[] | undefined;
}>;
export type ProviderResponse = z.infer<typeof ProviderResponseSchema>;
export declare const ProviderAuditEventCountsSchema: z.ZodObject<{
    suggestions: z.ZodDefault<z.ZodNumber>;
    blockedDecisions: z.ZodDefault<z.ZodNumber>;
    manualReviewItems: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    suggestions: number;
    blockedDecisions: number;
    manualReviewItems: number;
}, {
    suggestions?: number | undefined;
    blockedDecisions?: number | undefined;
    manualReviewItems?: number | undefined;
}>;
export declare const ProviderAuditEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    eventType: z.ZodString;
    severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
    runId: z.ZodString;
    correlationId: z.ZodString;
    mappingRequestId: z.ZodString;
    providerId: z.ZodOptional<z.ZodString>;
    adapterKind: z.ZodOptional<z.ZodEnum<["local-internal", "external", "mock"]>>;
    reasonCodes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
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
        suggestions: z.ZodDefault<z.ZodNumber>;
        blockedDecisions: z.ZodDefault<z.ZodNumber>;
        manualReviewItems: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        suggestions: number;
        blockedDecisions: number;
        manualReviewItems: number;
    }, {
        suggestions?: number | undefined;
        blockedDecisions?: number | undefined;
        manualReviewItems?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    runId: string;
    correlationId: string;
    mappingRequestId: string;
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
    eventId: string;
    eventType: string;
    severity: "info" | "warning" | "error" | "critical";
    reasonCodes: string[];
    safeMessage: string;
    counts: {
        suggestions: number;
        blockedDecisions: number;
        manualReviewItems: number;
    };
    providerId?: string | undefined;
    adapterKind?: "local-internal" | "external" | "mock" | undefined;
}, {
    runId: string;
    correlationId: string;
    mappingRequestId: string;
    eventId: string;
    eventType: string;
    severity: "info" | "warning" | "error" | "critical";
    safeMessage: string;
    providerId?: string | undefined;
    adapterKind?: "local-internal" | "external" | "mock" | undefined;
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
    reasonCodes?: string[] | undefined;
    counts?: {
        suggestions?: number | undefined;
        blockedDecisions?: number | undefined;
        manualReviewItems?: number | undefined;
    } | undefined;
}>;
export type ProviderAuditEvent = z.infer<typeof ProviderAuditEventSchema>;
export declare const ManualReviewItemSchema: z.ZodObject<{
    itemId: z.ZodString;
    mappingRequestId: z.ZodString;
    reviewCategory: z.ZodString;
    reasonCode: z.ZodString;
    severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
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
    safeMessage: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
}, "strip", z.ZodTypeAny, {
    mappingRequestId: string;
    reasonCode: string;
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
    severity: "critical" | "low" | "medium" | "high";
    safeMessage: string;
    itemId: string;
    reviewCategory: string;
}, {
    mappingRequestId: string;
    reasonCode: string;
    severity: "critical" | "low" | "medium" | "high";
    safeMessage: string;
    itemId: string;
    reviewCategory: string;
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
}>;
export type ManualReviewItem = z.infer<typeof ManualReviewItemSchema>;
export declare const ProviderInvocationResultSchema: z.ZodObject<{
    status: z.ZodEnum<["succeeded", "failed", "timed-out", "blocked"]>;
    providerId: z.ZodString;
    adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
    response: z.ZodOptional<z.ZodObject<{
        mappingRequestId: z.ZodString;
        suggestions: z.ZodDefault<z.ZodArray<z.ZodObject<{
            suggestionId: z.ZodString;
            mappingRequestId: z.ZodString;
            category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
            safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            safeRationale: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            confidence: z.ZodNumber;
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
            provenance: z.ZodObject<{
                providerId: z.ZodString;
                adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
                modelLabel: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
                invokedAt: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
                policyDecisionRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
                auditEventRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            }, "strip", z.ZodTypeAny, {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            }, {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
        }, {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        }>, "many">>;
        modelLabel: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    }, "strip", z.ZodTypeAny, {
        mappingRequestId: string;
        suggestions: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
        }[];
        modelLabel?: string | undefined;
    }, {
        mappingRequestId: string;
        modelLabel?: string | undefined;
        suggestions?: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        }[] | undefined;
    }>>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodEnum<["INVALID_PROVIDER_DESCRIPTOR", "DUPLICATE_PROVIDER_ID", "INVALID_TARGET_CAPABILITY_PACK", "UNSAFE_PROVIDER_CONTEXT", "MISSING_POLICY_DECISION", "POLICY_BLOCKED", "NO_MATCHING_PROVIDER", "TIMEOUT", "INVALID_RESPONSE", "UNSAFE_RESPONSE", "EXTERNAL_PROVIDER_DISABLED", "ADAPTER_FAILED", "UNKNOWN_PROVIDER", "VALIDATION_FAILED", "UNSUPPORTED_PROVIDER_MODE"]>;
        message: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        providerId: z.ZodOptional<z.ZodString>;
        retryable: z.ZodDefault<z.ZodBoolean>;
        causeCategory: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: "INVALID_PROVIDER_DESCRIPTOR" | "DUPLICATE_PROVIDER_ID" | "INVALID_TARGET_CAPABILITY_PACK" | "UNSAFE_PROVIDER_CONTEXT" | "MISSING_POLICY_DECISION" | "POLICY_BLOCKED" | "NO_MATCHING_PROVIDER" | "TIMEOUT" | "INVALID_RESPONSE" | "UNSAFE_RESPONSE" | "EXTERNAL_PROVIDER_DISABLED" | "ADAPTER_FAILED" | "UNKNOWN_PROVIDER" | "VALIDATION_FAILED" | "UNSUPPORTED_PROVIDER_MODE";
        message: string;
        retryable: boolean;
        providerId?: string | undefined;
        causeCategory?: string | undefined;
    }, {
        code: "INVALID_PROVIDER_DESCRIPTOR" | "DUPLICATE_PROVIDER_ID" | "INVALID_TARGET_CAPABILITY_PACK" | "UNSAFE_PROVIDER_CONTEXT" | "MISSING_POLICY_DECISION" | "POLICY_BLOCKED" | "NO_MATCHING_PROVIDER" | "TIMEOUT" | "INVALID_RESPONSE" | "UNSAFE_RESPONSE" | "EXTERNAL_PROVIDER_DISABLED" | "ADAPTER_FAILED" | "UNKNOWN_PROVIDER" | "VALIDATION_FAILED" | "UNSUPPORTED_PROVIDER_MODE";
        message: string;
        providerId?: string | undefined;
        retryable?: boolean | undefined;
        causeCategory?: string | undefined;
    }>>;
    auditEvidence: z.ZodOptional<z.ZodObject<{
        eventId: z.ZodString;
        eventType: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
        runId: z.ZodString;
        correlationId: z.ZodString;
        mappingRequestId: z.ZodString;
        providerId: z.ZodOptional<z.ZodString>;
        adapterKind: z.ZodOptional<z.ZodEnum<["local-internal", "external", "mock"]>>;
        reasonCodes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
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
            suggestions: z.ZodDefault<z.ZodNumber>;
            blockedDecisions: z.ZodDefault<z.ZodNumber>;
            manualReviewItems: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            suggestions: number;
            blockedDecisions: number;
            manualReviewItems: number;
        }, {
            suggestions?: number | undefined;
            blockedDecisions?: number | undefined;
            manualReviewItems?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        runId: string;
        correlationId: string;
        mappingRequestId: string;
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
        eventId: string;
        eventType: string;
        severity: "info" | "warning" | "error" | "critical";
        reasonCodes: string[];
        safeMessage: string;
        counts: {
            suggestions: number;
            blockedDecisions: number;
            manualReviewItems: number;
        };
        providerId?: string | undefined;
        adapterKind?: "local-internal" | "external" | "mock" | undefined;
    }, {
        runId: string;
        correlationId: string;
        mappingRequestId: string;
        eventId: string;
        eventType: string;
        severity: "info" | "warning" | "error" | "critical";
        safeMessage: string;
        providerId?: string | undefined;
        adapterKind?: "local-internal" | "external" | "mock" | undefined;
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
        reasonCodes?: string[] | undefined;
        counts?: {
            suggestions?: number | undefined;
            blockedDecisions?: number | undefined;
            manualReviewItems?: number | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "blocked" | "succeeded" | "failed" | "timed-out";
    providerId: string;
    adapterKind: "local-internal" | "external" | "mock";
    error?: {
        code: "INVALID_PROVIDER_DESCRIPTOR" | "DUPLICATE_PROVIDER_ID" | "INVALID_TARGET_CAPABILITY_PACK" | "UNSAFE_PROVIDER_CONTEXT" | "MISSING_POLICY_DECISION" | "POLICY_BLOCKED" | "NO_MATCHING_PROVIDER" | "TIMEOUT" | "INVALID_RESPONSE" | "UNSAFE_RESPONSE" | "EXTERNAL_PROVIDER_DISABLED" | "ADAPTER_FAILED" | "UNKNOWN_PROVIDER" | "VALIDATION_FAILED" | "UNSUPPORTED_PROVIDER_MODE";
        message: string;
        retryable: boolean;
        providerId?: string | undefined;
        causeCategory?: string | undefined;
    } | undefined;
    response?: {
        mappingRequestId: string;
        suggestions: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
        }[];
        modelLabel?: string | undefined;
    } | undefined;
    auditEvidence?: {
        runId: string;
        correlationId: string;
        mappingRequestId: string;
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
        eventId: string;
        eventType: string;
        severity: "info" | "warning" | "error" | "critical";
        reasonCodes: string[];
        safeMessage: string;
        counts: {
            suggestions: number;
            blockedDecisions: number;
            manualReviewItems: number;
        };
        providerId?: string | undefined;
        adapterKind?: "local-internal" | "external" | "mock" | undefined;
    } | undefined;
}, {
    status: "blocked" | "succeeded" | "failed" | "timed-out";
    providerId: string;
    adapterKind: "local-internal" | "external" | "mock";
    error?: {
        code: "INVALID_PROVIDER_DESCRIPTOR" | "DUPLICATE_PROVIDER_ID" | "INVALID_TARGET_CAPABILITY_PACK" | "UNSAFE_PROVIDER_CONTEXT" | "MISSING_POLICY_DECISION" | "POLICY_BLOCKED" | "NO_MATCHING_PROVIDER" | "TIMEOUT" | "INVALID_RESPONSE" | "UNSAFE_RESPONSE" | "EXTERNAL_PROVIDER_DISABLED" | "ADAPTER_FAILED" | "UNKNOWN_PROVIDER" | "VALIDATION_FAILED" | "UNSUPPORTED_PROVIDER_MODE";
        message: string;
        providerId?: string | undefined;
        retryable?: boolean | undefined;
        causeCategory?: string | undefined;
    } | undefined;
    response?: {
        mappingRequestId: string;
        modelLabel?: string | undefined;
        suggestions?: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        }[] | undefined;
    } | undefined;
    auditEvidence?: {
        runId: string;
        correlationId: string;
        mappingRequestId: string;
        eventId: string;
        eventType: string;
        severity: "info" | "warning" | "error" | "critical";
        safeMessage: string;
        providerId?: string | undefined;
        adapterKind?: "local-internal" | "external" | "mock" | undefined;
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
        reasonCodes?: string[] | undefined;
        counts?: {
            suggestions?: number | undefined;
            blockedDecisions?: number | undefined;
            manualReviewItems?: number | undefined;
        } | undefined;
    } | undefined;
}>;
export type ProviderInvocationResult = z.infer<typeof ProviderInvocationResultSchema>;
export declare const RefinementResultSchema: z.ZodObject<{
    status: z.ZodEnum<["succeeded", "partial", "blocked", "manual-review"]>;
    suggestions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        suggestionId: z.ZodString;
        mappingRequestId: z.ZodString;
        category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
        safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        safeRationale: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        confidence: z.ZodNumber;
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
        provenance: z.ZodObject<{
            providerId: z.ZodString;
            adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
            modelLabel: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            invokedAt: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            policyDecisionRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            auditEventRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        }, "strip", z.ZodTypeAny, {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        }, {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        suggestionId: string;
        safeSummary: string;
        safeRationale: string;
        confidence: number;
        generatedRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        provenance: {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        };
    }, {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        suggestionId: string;
        safeSummary: string;
        safeRationale: string;
        confidence: number;
        provenance: {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        };
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        generatedRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    }>, "many">>;
    diagnostics: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    manualReviewItems: z.ZodDefault<z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        mappingRequestId: z.ZodString;
        reviewCategory: z.ZodString;
        reasonCode: z.ZodString;
        severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
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
        safeMessage: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    }, "strip", z.ZodTypeAny, {
        mappingRequestId: string;
        reasonCode: string;
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
        severity: "critical" | "low" | "medium" | "high";
        safeMessage: string;
        itemId: string;
        reviewCategory: string;
    }, {
        mappingRequestId: string;
        reasonCode: string;
        severity: "critical" | "low" | "medium" | "high";
        safeMessage: string;
        itemId: string;
        reviewCategory: string;
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
    }>, "many">>;
    auditEvents: z.ZodDefault<z.ZodArray<z.ZodObject<{
        eventId: z.ZodString;
        eventType: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
        runId: z.ZodString;
        correlationId: z.ZodString;
        mappingRequestId: z.ZodString;
        providerId: z.ZodOptional<z.ZodString>;
        adapterKind: z.ZodOptional<z.ZodEnum<["local-internal", "external", "mock"]>>;
        reasonCodes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
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
            suggestions: z.ZodDefault<z.ZodNumber>;
            blockedDecisions: z.ZodDefault<z.ZodNumber>;
            manualReviewItems: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            suggestions: number;
            blockedDecisions: number;
            manualReviewItems: number;
        }, {
            suggestions?: number | undefined;
            blockedDecisions?: number | undefined;
            manualReviewItems?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        runId: string;
        correlationId: string;
        mappingRequestId: string;
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
        eventId: string;
        eventType: string;
        severity: "info" | "warning" | "error" | "critical";
        reasonCodes: string[];
        safeMessage: string;
        counts: {
            suggestions: number;
            blockedDecisions: number;
            manualReviewItems: number;
        };
        providerId?: string | undefined;
        adapterKind?: "local-internal" | "external" | "mock" | undefined;
    }, {
        runId: string;
        correlationId: string;
        mappingRequestId: string;
        eventId: string;
        eventType: string;
        severity: "info" | "warning" | "error" | "critical";
        safeMessage: string;
        providerId?: string | undefined;
        adapterKind?: "local-internal" | "external" | "mock" | undefined;
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
        reasonCodes?: string[] | undefined;
        counts?: {
            suggestions?: number | undefined;
            blockedDecisions?: number | undefined;
            manualReviewItems?: number | undefined;
        } | undefined;
    }>, "many">>;
    provenance: z.ZodDefault<z.ZodArray<z.ZodObject<{
        providerId: z.ZodString;
        adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
        modelLabel: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        invokedAt: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        policyDecisionRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        auditEventRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    }, "strip", z.ZodTypeAny, {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        modelLabel?: string | undefined;
        invokedAt?: string | undefined;
        policyDecisionRef?: string | undefined;
        auditEventRef?: string | undefined;
    }, {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        modelLabel?: string | undefined;
        invokedAt?: string | undefined;
        policyDecisionRef?: string | undefined;
        auditEventRef?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "manual-review" | "blocked" | "succeeded" | "partial";
    diagnostics: string[];
    provenance: {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        modelLabel?: string | undefined;
        invokedAt?: string | undefined;
        policyDecisionRef?: string | undefined;
        auditEventRef?: string | undefined;
    }[];
    suggestions: {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        suggestionId: string;
        safeSummary: string;
        safeRationale: string;
        confidence: number;
        generatedRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        provenance: {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        };
    }[];
    manualReviewItems: {
        mappingRequestId: string;
        reasonCode: string;
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
        severity: "critical" | "low" | "medium" | "high";
        safeMessage: string;
        itemId: string;
        reviewCategory: string;
    }[];
    auditEvents: {
        runId: string;
        correlationId: string;
        mappingRequestId: string;
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
        eventId: string;
        eventType: string;
        severity: "info" | "warning" | "error" | "critical";
        reasonCodes: string[];
        safeMessage: string;
        counts: {
            suggestions: number;
            blockedDecisions: number;
            manualReviewItems: number;
        };
        providerId?: string | undefined;
        adapterKind?: "local-internal" | "external" | "mock" | undefined;
    }[];
}, {
    status: "manual-review" | "blocked" | "succeeded" | "partial";
    diagnostics?: string[] | undefined;
    provenance?: {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        modelLabel?: string | undefined;
        invokedAt?: string | undefined;
        policyDecisionRef?: string | undefined;
        auditEventRef?: string | undefined;
    }[] | undefined;
    suggestions?: {
        category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
        mappingRequestId: string;
        suggestionId: string;
        safeSummary: string;
        safeRationale: string;
        confidence: number;
        provenance: {
            providerId: string;
            adapterKind: "local-internal" | "external" | "mock";
            modelLabel?: string | undefined;
            invokedAt?: string | undefined;
            policyDecisionRef?: string | undefined;
            auditEventRef?: string | undefined;
        };
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        generatedRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    }[] | undefined;
    manualReviewItems?: {
        mappingRequestId: string;
        reasonCode: string;
        severity: "critical" | "low" | "medium" | "high";
        safeMessage: string;
        itemId: string;
        reviewCategory: string;
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
    }[] | undefined;
    auditEvents?: {
        runId: string;
        correlationId: string;
        mappingRequestId: string;
        eventId: string;
        eventType: string;
        severity: "info" | "warning" | "error" | "critical";
        safeMessage: string;
        providerId?: string | undefined;
        adapterKind?: "local-internal" | "external" | "mock" | undefined;
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
        reasonCodes?: string[] | undefined;
        counts?: {
            suggestions?: number | undefined;
            blockedDecisions?: number | undefined;
            manualReviewItems?: number | undefined;
        } | undefined;
    }[] | undefined;
}>;
export type RefinementResult = z.infer<typeof RefinementResultSchema>;
export declare const MockProviderMatchSchema: z.ZodObject<{
    scriptId: z.ZodOptional<z.ZodString>;
    mappingRequestId: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>>;
    capabilityTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    category?: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown" | undefined;
    capabilityTags?: string[] | undefined;
    mappingRequestId?: string | undefined;
    scriptId?: string | undefined;
}, {
    category?: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown" | undefined;
    capabilityTags?: string[] | undefined;
    mappingRequestId?: string | undefined;
    scriptId?: string | undefined;
}>;
export type MockProviderMatch = z.infer<typeof MockProviderMatchSchema>;
export declare const MockProviderScriptSchema: z.ZodObject<{
    scriptId: z.ZodString;
    match: z.ZodObject<{
        scriptId: z.ZodOptional<z.ZodString>;
        mappingRequestId: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>>;
        capabilityTags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        category?: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown" | undefined;
        capabilityTags?: string[] | undefined;
        mappingRequestId?: string | undefined;
        scriptId?: string | undefined;
    }, {
        category?: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown" | undefined;
        capabilityTags?: string[] | undefined;
        mappingRequestId?: string | undefined;
        scriptId?: string | undefined;
    }>;
    response: z.ZodOptional<z.ZodObject<{
        mappingRequestId: z.ZodString;
        suggestions: z.ZodDefault<z.ZodArray<z.ZodObject<{
            suggestionId: z.ZodString;
            mappingRequestId: z.ZodString;
            category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
            safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            safeRationale: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            confidence: z.ZodNumber;
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
            provenance: z.ZodObject<{
                providerId: z.ZodString;
                adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
                modelLabel: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
                invokedAt: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
                policyDecisionRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
                auditEventRef: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            }, "strip", z.ZodTypeAny, {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            }, {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
        }, {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        }>, "many">>;
        modelLabel: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    }, "strip", z.ZodTypeAny, {
        mappingRequestId: string;
        suggestions: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
        }[];
        modelLabel?: string | undefined;
    }, {
        mappingRequestId: string;
        modelLabel?: string | undefined;
        suggestions?: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        }[] | undefined;
    }>>;
    failure: z.ZodOptional<z.ZodObject<{
        code: z.ZodEnum<["INVALID_PROVIDER_DESCRIPTOR", "DUPLICATE_PROVIDER_ID", "INVALID_TARGET_CAPABILITY_PACK", "UNSAFE_PROVIDER_CONTEXT", "MISSING_POLICY_DECISION", "POLICY_BLOCKED", "NO_MATCHING_PROVIDER", "TIMEOUT", "INVALID_RESPONSE", "UNSAFE_RESPONSE", "EXTERNAL_PROVIDER_DISABLED", "ADAPTER_FAILED", "UNKNOWN_PROVIDER", "VALIDATION_FAILED", "UNSUPPORTED_PROVIDER_MODE"]>;
        message: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        providerId: z.ZodOptional<z.ZodString>;
        retryable: z.ZodDefault<z.ZodBoolean>;
        causeCategory: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: "INVALID_PROVIDER_DESCRIPTOR" | "DUPLICATE_PROVIDER_ID" | "INVALID_TARGET_CAPABILITY_PACK" | "UNSAFE_PROVIDER_CONTEXT" | "MISSING_POLICY_DECISION" | "POLICY_BLOCKED" | "NO_MATCHING_PROVIDER" | "TIMEOUT" | "INVALID_RESPONSE" | "UNSAFE_RESPONSE" | "EXTERNAL_PROVIDER_DISABLED" | "ADAPTER_FAILED" | "UNKNOWN_PROVIDER" | "VALIDATION_FAILED" | "UNSUPPORTED_PROVIDER_MODE";
        message: string;
        retryable: boolean;
        providerId?: string | undefined;
        causeCategory?: string | undefined;
    }, {
        code: "INVALID_PROVIDER_DESCRIPTOR" | "DUPLICATE_PROVIDER_ID" | "INVALID_TARGET_CAPABILITY_PACK" | "UNSAFE_PROVIDER_CONTEXT" | "MISSING_POLICY_DECISION" | "POLICY_BLOCKED" | "NO_MATCHING_PROVIDER" | "TIMEOUT" | "INVALID_RESPONSE" | "UNSAFE_RESPONSE" | "EXTERNAL_PROVIDER_DISABLED" | "ADAPTER_FAILED" | "UNKNOWN_PROVIDER" | "VALIDATION_FAILED" | "UNSUPPORTED_PROVIDER_MODE";
        message: string;
        providerId?: string | undefined;
        retryable?: boolean | undefined;
        causeCategory?: string | undefined;
    }>>;
    seed: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    scriptId: string;
    match: {
        category?: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown" | undefined;
        capabilityTags?: string[] | undefined;
        mappingRequestId?: string | undefined;
        scriptId?: string | undefined;
    };
    response?: {
        mappingRequestId: string;
        suggestions: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
        }[];
        modelLabel?: string | undefined;
    } | undefined;
    failure?: {
        code: "INVALID_PROVIDER_DESCRIPTOR" | "DUPLICATE_PROVIDER_ID" | "INVALID_TARGET_CAPABILITY_PACK" | "UNSAFE_PROVIDER_CONTEXT" | "MISSING_POLICY_DECISION" | "POLICY_BLOCKED" | "NO_MATCHING_PROVIDER" | "TIMEOUT" | "INVALID_RESPONSE" | "UNSAFE_RESPONSE" | "EXTERNAL_PROVIDER_DISABLED" | "ADAPTER_FAILED" | "UNKNOWN_PROVIDER" | "VALIDATION_FAILED" | "UNSUPPORTED_PROVIDER_MODE";
        message: string;
        retryable: boolean;
        providerId?: string | undefined;
        causeCategory?: string | undefined;
    } | undefined;
    seed?: number | undefined;
}, {
    scriptId: string;
    match: {
        category?: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown" | undefined;
        capabilityTags?: string[] | undefined;
        mappingRequestId?: string | undefined;
        scriptId?: string | undefined;
    };
    response?: {
        mappingRequestId: string;
        modelLabel?: string | undefined;
        suggestions?: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            mappingRequestId: string;
            suggestionId: string;
            safeSummary: string;
            safeRationale: string;
            confidence: number;
            provenance: {
                providerId: string;
                adapterKind: "local-internal" | "external" | "mock";
                modelLabel?: string | undefined;
                invokedAt?: string | undefined;
                policyDecisionRef?: string | undefined;
                auditEventRef?: string | undefined;
            };
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        }[] | undefined;
    } | undefined;
    failure?: {
        code: "INVALID_PROVIDER_DESCRIPTOR" | "DUPLICATE_PROVIDER_ID" | "INVALID_TARGET_CAPABILITY_PACK" | "UNSAFE_PROVIDER_CONTEXT" | "MISSING_POLICY_DECISION" | "POLICY_BLOCKED" | "NO_MATCHING_PROVIDER" | "TIMEOUT" | "INVALID_RESPONSE" | "UNSAFE_RESPONSE" | "EXTERNAL_PROVIDER_DISABLED" | "ADAPTER_FAILED" | "UNKNOWN_PROVIDER" | "VALIDATION_FAILED" | "UNSUPPORTED_PROVIDER_MODE";
        message: string;
        providerId?: string | undefined;
        retryable?: boolean | undefined;
        causeCategory?: string | undefined;
    } | undefined;
    seed?: number | undefined;
}>;
export type MockProviderScript = z.infer<typeof MockProviderScriptSchema>;
export declare const ProviderAdapterRecordSchema: z.ZodObject<{
    providerId: z.ZodString;
    adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
    enabled: z.ZodDefault<z.ZodBoolean>;
    descriptor: z.ZodObject<{
        providerId: z.ZodString;
        adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
        displayName: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        capabilities: z.ZodDefault<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
            tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            supportsStructuredResponse: z.ZodDefault<z.ZodBoolean>;
            supportsSafeRationale: z.ZodDefault<z.ZodBoolean>;
            maxContextItems: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags: string[];
            supportsStructuredResponse: boolean;
            supportsSafeRationale: boolean;
            maxContextItems: number;
        }, {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags?: string[] | undefined;
            supportsStructuredResponse?: boolean | undefined;
            supportsSafeRationale?: boolean | undefined;
            maxContextItems?: number | undefined;
        }>, "many">>;
        priority: z.ZodDefault<z.ZodNumber>;
        enabled: z.ZodDefault<z.ZodBoolean>;
        requiresExternalPolicy: z.ZodDefault<z.ZodBoolean>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags: string[];
            supportsStructuredResponse: boolean;
            supportsSafeRationale: boolean;
            maxContextItems: number;
        }[];
        priority: number;
        enabled: boolean;
        requiresExternalPolicy: boolean;
        metadata: Record<string, string>;
    }, {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities?: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags?: string[] | undefined;
            supportsStructuredResponse?: boolean | undefined;
            supportsSafeRationale?: boolean | undefined;
            maxContextItems?: number | undefined;
        }[] | undefined;
        priority?: number | undefined;
        enabled?: boolean | undefined;
        requiresExternalPolicy?: boolean | undefined;
        metadata?: Record<string, string> | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    providerId: string;
    adapterKind: "local-internal" | "external" | "mock";
    enabled: boolean;
    descriptor: {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags: string[];
            supportsStructuredResponse: boolean;
            supportsSafeRationale: boolean;
            maxContextItems: number;
        }[];
        priority: number;
        enabled: boolean;
        requiresExternalPolicy: boolean;
        metadata: Record<string, string>;
    };
}, {
    providerId: string;
    adapterKind: "local-internal" | "external" | "mock";
    descriptor: {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities?: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags?: string[] | undefined;
            supportsStructuredResponse?: boolean | undefined;
            supportsSafeRationale?: boolean | undefined;
            maxContextItems?: number | undefined;
        }[] | undefined;
        priority?: number | undefined;
        enabled?: boolean | undefined;
        requiresExternalPolicy?: boolean | undefined;
        metadata?: Record<string, string> | undefined;
    };
    enabled?: boolean | undefined;
}>;
export type ProviderAdapterRecord = z.infer<typeof ProviderAdapterRecordSchema>;
export declare const ProviderRegistrySchema: z.ZodObject<{
    registryId: z.ZodString;
    providers: z.ZodDefault<z.ZodArray<z.ZodObject<{
        providerId: z.ZodString;
        adapterKind: z.ZodEnum<["local-internal", "external", "mock"]>;
        displayName: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        capabilities: z.ZodDefault<z.ZodArray<z.ZodObject<{
            category: z.ZodEnum<["template", "lifecycle", "di", "route", "state", "form", "i18n", "animation", "map", "media", "qr", "barcode", "service-worker", "unknown"]>;
            tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            supportsStructuredResponse: z.ZodDefault<z.ZodBoolean>;
            supportsSafeRationale: z.ZodDefault<z.ZodBoolean>;
            maxContextItems: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags: string[];
            supportsStructuredResponse: boolean;
            supportsSafeRationale: boolean;
            maxContextItems: number;
        }, {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags?: string[] | undefined;
            supportsStructuredResponse?: boolean | undefined;
            supportsSafeRationale?: boolean | undefined;
            maxContextItems?: number | undefined;
        }>, "many">>;
        priority: z.ZodDefault<z.ZodNumber>;
        enabled: z.ZodDefault<z.ZodBoolean>;
        requiresExternalPolicy: z.ZodDefault<z.ZodBoolean>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags: string[];
            supportsStructuredResponse: boolean;
            supportsSafeRationale: boolean;
            maxContextItems: number;
        }[];
        priority: number;
        enabled: boolean;
        requiresExternalPolicy: boolean;
        metadata: Record<string, string>;
    }, {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities?: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags?: string[] | undefined;
            supportsStructuredResponse?: boolean | undefined;
            supportsSafeRationale?: boolean | undefined;
            maxContextItems?: number | undefined;
        }[] | undefined;
        priority?: number | undefined;
        enabled?: boolean | undefined;
        requiresExternalPolicy?: boolean | undefined;
        metadata?: Record<string, string> | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    registryId: string;
    providers: {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags: string[];
            supportsStructuredResponse: boolean;
            supportsSafeRationale: boolean;
            maxContextItems: number;
        }[];
        priority: number;
        enabled: boolean;
        requiresExternalPolicy: boolean;
        metadata: Record<string, string>;
    }[];
}, {
    registryId: string;
    providers?: {
        providerId: string;
        adapterKind: "local-internal" | "external" | "mock";
        displayName: string;
        capabilities?: {
            category: "template" | "lifecycle" | "di" | "route" | "state" | "form" | "i18n" | "animation" | "map" | "media" | "qr" | "barcode" | "service-worker" | "unknown";
            tags?: string[] | undefined;
            supportsStructuredResponse?: boolean | undefined;
            supportsSafeRationale?: boolean | undefined;
            maxContextItems?: number | undefined;
        }[] | undefined;
        priority?: number | undefined;
        enabled?: boolean | undefined;
        requiresExternalPolicy?: boolean | undefined;
        metadata?: Record<string, string> | undefined;
    }[] | undefined;
}>;
export type ProviderRegistry = z.infer<typeof ProviderRegistrySchema>;
export declare const createProviderNeutralRequest: (input: Omit<ProviderNeutralRefinementRequest, "mappingRequestId"> & {
    mappingRequestId?: string;
}) => ProviderNeutralRefinementRequest;
export type ProviderPolicyDecision = CoreProviderPolicyDecision;
//# sourceMappingURL=types.d.ts.map