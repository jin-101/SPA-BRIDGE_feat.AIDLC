import { z } from 'zod';
import type { GeneratedArtifactRef, SourceRef, TraceLink } from '@spa-bridge/core-model';
export declare const ReportSeveritySchema: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
export type ReportSeverity = z.infer<typeof ReportSeveritySchema>;
export declare const ReportCategorySchema: z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>;
export type ReportCategory = z.infer<typeof ReportCategorySchema>;
export declare const ReportStatusSchema: z.ZodEnum<["passed", "partial", "blocked"]>;
export type ReportStatus = z.infer<typeof ReportStatusSchema>;
export declare const ReportFormatSchema: z.ZodEnum<["json", "markdown", "html"]>;
export type ReportOutputFormat = z.infer<typeof ReportFormatSchema>;
export declare const isSafeRelativePath: (value: string) => boolean;
export declare const SafeReportTextSchema: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
export declare const SafeRelativePathSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const SafeSourceRefSchema: z.ZodObject<{
    kind: z.ZodLiteral<"source">;
    symbol: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
} & {
    path: z.ZodEffects<z.ZodString, string, string>;
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
}>;
export declare const SafeGeneratedArtifactRefSchema: z.ZodObject<{
    kind: z.ZodLiteral<"generated">;
    segment: z.ZodOptional<z.ZodString>;
} & {
    path: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    path: string;
    kind: "generated";
    segment?: string | undefined;
}, {
    path: string;
    kind: "generated";
    segment?: string | undefined;
}>;
export declare const SafeTraceLinkSchema: z.ZodObject<{
    id: z.ZodString;
    relation: z.ZodEnum<["maps-to", "derived-from", "emits", "references"]>;
    confidence: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
} & {
    source: z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
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
    }>;
    target: z.ZodUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"ir">;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "ir";
        id: string;
    }, {
        kind: "ir";
        id: string;
    }>, z.ZodObject<{
        kind: z.ZodLiteral<"generated">;
        segment: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>]>;
}, "strip", z.ZodTypeAny, {
    source: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    };
    target: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    } | {
        kind: "ir";
        id: string;
    };
    id: string;
    relation: "maps-to" | "derived-from" | "emits" | "references";
    confidence: number;
    notes?: string | undefined;
}, {
    source: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    };
    target: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    } | {
        kind: "ir";
        id: string;
    };
    id: string;
    relation: "maps-to" | "derived-from" | "emits" | "references";
    confidence?: number | undefined;
    notes?: string | undefined;
}>;
export declare const ReportDiagnosticSchema: z.ZodObject<{
    id: z.ZodString;
    severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
    reasonCode: z.ZodString;
    safeMessage: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    sourceRef: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
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
    generatedRef: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"generated">;
        segment: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>>;
    storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    reviewCategory: z.ZodOptional<z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    severity: "critical" | "blocking" | "warning" | "info";
    reasonCode: string;
    safeMessage: string;
    sourceRef?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | undefined;
    generatedRef?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    } | undefined;
    storyArea?: string | undefined;
    reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
}, {
    id: string;
    severity: "critical" | "blocking" | "warning" | "info";
    reasonCode: string;
    safeMessage: string;
    sourceRef?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | undefined;
    generatedRef?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    } | undefined;
    storyArea?: string | undefined;
    reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
}>;
export type ReportDiagnostic = z.infer<typeof ReportDiagnosticSchema>;
export declare const ManualReviewItemSchema: z.ZodObject<{
    id: z.ZodString;
    severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
    category: z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>;
    reasonCode: z.ZodString;
    safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    remediationHint: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    sourceRef: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
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
    generatedRef: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"generated">;
        segment: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>>;
    storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    severity: "critical" | "blocking" | "warning" | "info";
    reasonCode: string;
    category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
    safeSummary: string;
    sourceRef?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | undefined;
    generatedRef?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    } | undefined;
    storyArea?: string | undefined;
    remediationHint?: string | undefined;
}, {
    id: string;
    severity: "critical" | "blocking" | "warning" | "info";
    reasonCode: string;
    category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
    safeSummary: string;
    sourceRef?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | undefined;
    generatedRef?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    } | undefined;
    storyArea?: string | undefined;
    remediationHint?: string | undefined;
}>;
export type ManualReviewItem = z.infer<typeof ManualReviewItemSchema>;
export declare const AiDecisionSchema: z.ZodObject<{
    id: z.ZodString;
    mappingRequestId: z.ZodString;
    providerCategory: z.ZodEnum<["local", "internal", "mock", "external-disabled", "external-opt-in"]>;
    policyStatus: z.ZodEnum<["allowed", "blocked", "disabled", "review-required"]>;
    confidence: z.ZodNumber;
    provenanceRef: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    safeRationale: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
}, "strip", z.ZodTypeAny, {
    id: string;
    confidence: number;
    mappingRequestId: string;
    providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
    policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
    provenanceRef: string;
    safeRationale: string;
}, {
    id: string;
    confidence: number;
    mappingRequestId: string;
    providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
    policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
    provenanceRef: string;
    safeRationale: string;
}>;
export type AiDecision = z.infer<typeof AiDecisionSchema>;
export declare const ReportGroupSchema: z.ZodObject<{
    id: z.ZodString;
    severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
    sourceRef: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
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
    generatedRef: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"generated">;
        segment: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>>;
    storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    reviewCategory: z.ZodOptional<z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>>;
    itemIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    severity: "critical" | "blocking" | "warning" | "info";
    itemIds: string[];
    sourceRef?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | undefined;
    generatedRef?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    } | undefined;
    storyArea?: string | undefined;
    reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
}, {
    id: string;
    severity: "critical" | "blocking" | "warning" | "info";
    itemIds: string[];
    sourceRef?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    } | undefined;
    generatedRef?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    } | undefined;
    storyArea?: string | undefined;
    reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
}>;
export type ReportGroup = z.infer<typeof ReportGroupSchema>;
export declare const ReportSourceInventorySchema: z.ZodObject<{
    artifactCounts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    detectedCategories: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
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
    diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    artifactCounts: Record<string, number>;
    detectedCategories: string[];
    sourceRefs: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[];
    diagnosticRefs: string[];
}, {
    artifactCounts?: Record<string, number> | undefined;
    detectedCategories?: string[] | undefined;
    sourceRefs?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[] | undefined;
    diagnosticRefs?: string[] | undefined;
}>;
export type ReportSourceInventory = z.infer<typeof ReportSourceInventorySchema>;
export declare const ReportConversionTargetSchema: z.ZodObject<{
    targetStrategy: z.ZodString;
    targetFramework: z.ZodString;
}, "strip", z.ZodTypeAny, {
    targetStrategy: string;
    targetFramework: string;
}, {
    targetStrategy: string;
    targetFramework: string;
}>;
export type ReportConversionTarget = z.infer<typeof ReportConversionTargetSchema>;
export declare const ReportConversionOutputSchema: z.ZodObject<{
    generatedArtifactCounts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    generatedRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"generated">;
        segment: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>, "many">>;
    targetProject: z.ZodObject<{
        targetStrategy: z.ZodString;
        targetFramework: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        targetStrategy: string;
        targetFramework: string;
    }, {
        targetStrategy: string;
        targetFramework: string;
    }>;
    convertedArtifactCount: z.ZodNumber;
    totalCandidateArtifactCount: z.ZodNumber;
    unresolvedCount: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    generatedArtifactCounts: Record<string, number>;
    generatedRefs: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[];
    targetProject: {
        targetStrategy: string;
        targetFramework: string;
    };
    convertedArtifactCount: number;
    totalCandidateArtifactCount: number;
    unresolvedCount: number;
}, {
    targetProject: {
        targetStrategy: string;
        targetFramework: string;
    };
    convertedArtifactCount: number;
    totalCandidateArtifactCount: number;
    generatedArtifactCounts?: Record<string, number> | undefined;
    generatedRefs?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[] | undefined;
    unresolvedCount?: number | undefined;
}>;
export type ReportConversionOutput = z.infer<typeof ReportConversionOutputSchema>;
export declare const QualityGateStatusSchema: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
export type QualityGateStatus = z.infer<typeof QualityGateStatusSchema>;
export declare const QualityGateRunSchema: z.ZodObject<{
    gateId: z.ZodString;
    status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
    durationMs: z.ZodNumber;
    safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "passed" | "blocked" | "failed" | "skipped";
    safeSummary: string;
    diagnosticRefs: string[];
    gateId: string;
    durationMs: number;
    traceRefs: string[];
}, {
    status: "passed" | "blocked" | "failed" | "skipped";
    safeSummary: string;
    gateId: string;
    durationMs: number;
    diagnosticRefs?: string[] | undefined;
    traceRefs?: string[] | undefined;
}>;
export type QualityGateRun = z.infer<typeof QualityGateRunSchema>;
export declare const PbtOutcomeSchema: z.ZodObject<{
    planId: z.ZodString;
    subject: z.ZodString;
    generatorFamily: z.ZodString;
    propertyName: z.ZodString;
    seed: z.ZodOptional<z.ZodNumber>;
    status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
    shrunk: z.ZodDefault<z.ZodBoolean>;
    safeSummary: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "passed" | "blocked" | "failed" | "skipped";
    diagnosticRefs: string[];
    traceRefs: string[];
    planId: string;
    subject: string;
    generatorFamily: string;
    propertyName: string;
    shrunk: boolean;
    safeSummary?: string | undefined;
    seed?: number | undefined;
}, {
    status: "passed" | "blocked" | "failed" | "skipped";
    planId: string;
    subject: string;
    generatorFamily: string;
    propertyName: string;
    safeSummary?: string | undefined;
    diagnosticRefs?: string[] | undefined;
    traceRefs?: string[] | undefined;
    seed?: number | undefined;
    shrunk?: boolean | undefined;
}>;
export type PbtOutcome = z.infer<typeof PbtOutcomeSchema>;
export declare const QualityEvidenceSummarySchema: z.ZodObject<{
    evidenceId: z.ZodString;
    summaryRef: z.ZodString;
    gateRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    diagnosticRefs: string[];
    traceRefs: string[];
    evidenceId: string;
    summaryRef: string;
    gateRefs: string[];
}, {
    evidenceId: string;
    summaryRef: string;
    diagnosticRefs?: string[] | undefined;
    traceRefs?: string[] | undefined;
    gateRefs?: string[] | undefined;
}>;
export type QualityEvidenceSummary = z.infer<typeof QualityEvidenceSummarySchema>;
export declare const ReportQualitySectionSchema: z.ZodObject<{
    gateStatus: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
    gateRuns: z.ZodDefault<z.ZodArray<z.ZodObject<{
        gateId: z.ZodString;
        status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
        durationMs: z.ZodNumber;
        safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "passed" | "blocked" | "failed" | "skipped";
        safeSummary: string;
        diagnosticRefs: string[];
        gateId: string;
        durationMs: number;
        traceRefs: string[];
    }, {
        status: "passed" | "blocked" | "failed" | "skipped";
        safeSummary: string;
        gateId: string;
        durationMs: number;
        diagnosticRefs?: string[] | undefined;
        traceRefs?: string[] | undefined;
    }>, "many">>;
    pbtRuns: z.ZodDefault<z.ZodArray<z.ZodObject<{
        planId: z.ZodString;
        subject: z.ZodString;
        generatorFamily: z.ZodString;
        propertyName: z.ZodString;
        seed: z.ZodOptional<z.ZodNumber>;
        status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
        shrunk: z.ZodDefault<z.ZodBoolean>;
        safeSummary: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        status: "passed" | "blocked" | "failed" | "skipped";
        diagnosticRefs: string[];
        traceRefs: string[];
        planId: string;
        subject: string;
        generatorFamily: string;
        propertyName: string;
        shrunk: boolean;
        safeSummary?: string | undefined;
        seed?: number | undefined;
    }, {
        status: "passed" | "blocked" | "failed" | "skipped";
        planId: string;
        subject: string;
        generatorFamily: string;
        propertyName: string;
        safeSummary?: string | undefined;
        diagnosticRefs?: string[] | undefined;
        traceRefs?: string[] | undefined;
        seed?: number | undefined;
        shrunk?: boolean | undefined;
    }>, "many">>;
    correctionAttempts: z.ZodDefault<z.ZodNumber>;
    evidenceCounts: z.ZodObject<{
        total: z.ZodDefault<z.ZodNumber>;
        blocked: z.ZodDefault<z.ZodNumber>;
        safe: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        blocked: number;
        safe: number;
        total: number;
    }, {
        blocked?: number | undefined;
        safe?: number | undefined;
        total?: number | undefined;
    }>;
    conversionQualityScore: z.ZodNumber;
    targetPercent: z.ZodNumber;
    targetMet: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    gateStatus: "passed" | "blocked" | "failed" | "skipped";
    gateRuns: {
        status: "passed" | "blocked" | "failed" | "skipped";
        safeSummary: string;
        diagnosticRefs: string[];
        gateId: string;
        durationMs: number;
        traceRefs: string[];
    }[];
    pbtRuns: {
        status: "passed" | "blocked" | "failed" | "skipped";
        diagnosticRefs: string[];
        traceRefs: string[];
        planId: string;
        subject: string;
        generatorFamily: string;
        propertyName: string;
        shrunk: boolean;
        safeSummary?: string | undefined;
        seed?: number | undefined;
    }[];
    correctionAttempts: number;
    evidenceCounts: {
        blocked: number;
        safe: number;
        total: number;
    };
    conversionQualityScore: number;
    targetPercent: number;
    targetMet: boolean;
}, {
    gateStatus: "passed" | "blocked" | "failed" | "skipped";
    evidenceCounts: {
        blocked?: number | undefined;
        safe?: number | undefined;
        total?: number | undefined;
    };
    conversionQualityScore: number;
    targetPercent: number;
    targetMet: boolean;
    gateRuns?: {
        status: "passed" | "blocked" | "failed" | "skipped";
        safeSummary: string;
        gateId: string;
        durationMs: number;
        diagnosticRefs?: string[] | undefined;
        traceRefs?: string[] | undefined;
    }[] | undefined;
    pbtRuns?: {
        status: "passed" | "blocked" | "failed" | "skipped";
        planId: string;
        subject: string;
        generatorFamily: string;
        propertyName: string;
        safeSummary?: string | undefined;
        diagnosticRefs?: string[] | undefined;
        traceRefs?: string[] | undefined;
        seed?: number | undefined;
        shrunk?: boolean | undefined;
    }[] | undefined;
    correctionAttempts?: number | undefined;
}>;
export type ReportQualitySection = z.infer<typeof ReportQualitySectionSchema>;
export declare const TraceCoverageSummarySchema: z.ZodObject<{
    covered: z.ZodNumber;
    uncovered: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    covered: number;
    uncovered: number;
}, {
    covered: number;
    uncovered: number;
}>;
export type TraceCoverageSummary = z.infer<typeof TraceCoverageSummarySchema>;
export declare const ReportTraceabilitySectionSchema: z.ZodObject<{
    links: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        relation: z.ZodEnum<["maps-to", "derived-from", "emits", "references"]>;
        confidence: z.ZodDefault<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    } & {
        source: z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
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
        }>;
        target: z.ZodUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"ir">;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "ir";
            id: string;
        }, {
            kind: "ir";
            id: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            segment: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>]>;
    }, "strip", z.ZodTypeAny, {
        source: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        };
        target: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | {
            kind: "ir";
            id: string;
        };
        id: string;
        relation: "maps-to" | "derived-from" | "emits" | "references";
        confidence: number;
        notes?: string | undefined;
    }, {
        source: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        };
        target: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | {
            kind: "ir";
            id: string;
        };
        id: string;
        relation: "maps-to" | "derived-from" | "emits" | "references";
        confidence?: number | undefined;
        notes?: string | undefined;
    }>, "many">>;
    syntheticOrigins: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"generated">;
        segment: z.ZodOptional<z.ZodString>;
    } & {
        path: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>, "many">>;
    coverageSummary: z.ZodObject<{
        covered: z.ZodNumber;
        uncovered: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        covered: number;
        uncovered: number;
    }, {
        covered: number;
        uncovered: number;
    }>;
}, "strip", z.ZodTypeAny, {
    links: {
        source: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        };
        target: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | {
            kind: "ir";
            id: string;
        };
        id: string;
        relation: "maps-to" | "derived-from" | "emits" | "references";
        confidence: number;
        notes?: string | undefined;
    }[];
    syntheticOrigins: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[];
    coverageSummary: {
        covered: number;
        uncovered: number;
    };
}, {
    coverageSummary: {
        covered: number;
        uncovered: number;
    };
    links?: {
        source: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        };
        target: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | {
            kind: "ir";
            id: string;
        };
        id: string;
        relation: "maps-to" | "derived-from" | "emits" | "references";
        confidence?: number | undefined;
        notes?: string | undefined;
    }[] | undefined;
    syntheticOrigins?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[] | undefined;
}>;
export type ReportTraceabilitySection = z.infer<typeof ReportTraceabilitySectionSchema>;
export declare const ReportMetadataSchema: z.ZodObject<{
    runId: z.ZodString;
    correlationId: z.ZodString;
    projectLabel: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    sourceFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    targetFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    generatedAt: z.ZodString;
    partial: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    partial: boolean;
    targetFramework: string;
    runId: string;
    correlationId: string;
    projectLabel: string;
    sourceFramework: string;
    generatedAt: string;
}, {
    targetFramework: string;
    runId: string;
    correlationId: string;
    projectLabel: string;
    sourceFramework: string;
    generatedAt: string;
    partial?: boolean | undefined;
}>;
export type ReportMetadata = z.infer<typeof ReportMetadataSchema>;
export declare const ReportExportMetadataSchema: z.ZodObject<{
    formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">>;
    contentHashes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        format: z.ZodEnum<["json", "markdown", "html"]>;
        hash: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        format: "json" | "markdown" | "html";
        hash: string;
    }, {
        format: "json" | "markdown" | "html";
        hash: string;
    }>, "many">>;
    rendererVersion: z.ZodString;
    exportedAt: z.ZodString;
    canonicalReportRef: z.ZodString;
    partial: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    partial: boolean;
    formats: ("json" | "markdown" | "html")[];
    contentHashes: {
        format: "json" | "markdown" | "html";
        hash: string;
    }[];
    rendererVersion: string;
    exportedAt: string;
    canonicalReportRef: string;
}, {
    rendererVersion: string;
    exportedAt: string;
    canonicalReportRef: string;
    partial?: boolean | undefined;
    formats?: ("json" | "markdown" | "html")[] | undefined;
    contentHashes?: {
        format: "json" | "markdown" | "html";
        hash: string;
    }[] | undefined;
}>;
export type ReportExportMetadata = z.infer<typeof ReportExportMetadataSchema>;
export declare const CanonicalConversionReportSchema: z.ZodObject<{
    reportId: z.ZodString;
    schemaVersion: z.ZodNumber;
    metadata: z.ZodObject<{
        runId: z.ZodString;
        correlationId: z.ZodString;
        projectLabel: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        sourceFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        targetFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        generatedAt: z.ZodString;
        partial: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        partial: boolean;
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
    }, {
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
        partial?: boolean | undefined;
    }>;
    sourceInventory: z.ZodObject<{
        artifactCounts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        detectedCategories: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
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
        diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        artifactCounts: Record<string, number>;
        detectedCategories: string[];
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        diagnosticRefs: string[];
    }, {
        artifactCounts?: Record<string, number> | undefined;
        detectedCategories?: string[] | undefined;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        diagnosticRefs?: string[] | undefined;
    }>;
    conversionOutput: z.ZodObject<{
        generatedArtifactCounts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        generatedRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            segment: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>, "many">>;
        targetProject: z.ZodObject<{
            targetStrategy: z.ZodString;
            targetFramework: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            targetStrategy: string;
            targetFramework: string;
        }, {
            targetStrategy: string;
            targetFramework: string;
        }>;
        convertedArtifactCount: z.ZodNumber;
        totalCandidateArtifactCount: z.ZodNumber;
        unresolvedCount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        generatedArtifactCounts: Record<string, number>;
        generatedRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        targetProject: {
            targetStrategy: string;
            targetFramework: string;
        };
        convertedArtifactCount: number;
        totalCandidateArtifactCount: number;
        unresolvedCount: number;
    }, {
        targetProject: {
            targetStrategy: string;
            targetFramework: string;
        };
        convertedArtifactCount: number;
        totalCandidateArtifactCount: number;
        generatedArtifactCounts?: Record<string, number> | undefined;
        generatedRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
        unresolvedCount?: number | undefined;
    }>;
    diagnostics: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
        reasonCode: z.ZodString;
        safeMessage: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        sourceRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
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
        generatedRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            segment: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>>;
        storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        reviewCategory: z.ZodOptional<z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }, {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }>, "many">>;
    aiDecisions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        mappingRequestId: z.ZodString;
        providerCategory: z.ZodEnum<["local", "internal", "mock", "external-disabled", "external-opt-in"]>;
        policyStatus: z.ZodEnum<["allowed", "blocked", "disabled", "review-required"]>;
        confidence: z.ZodNumber;
        provenanceRef: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        safeRationale: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        confidence: number;
        mappingRequestId: string;
        providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
        policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
        provenanceRef: string;
        safeRationale: string;
    }, {
        id: string;
        confidence: number;
        mappingRequestId: string;
        providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
        policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
        provenanceRef: string;
        safeRationale: string;
    }>, "many">>;
    manualReview: z.ZodObject<{
        items: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
            category: z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>;
            reasonCode: z.ZodString;
            safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            remediationHint: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            sourceRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
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
            generatedRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>>;
            storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }, {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }>, "many">>;
        groups: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
            sourceRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
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
            generatedRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>>;
            storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            reviewCategory: z.ZodOptional<z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>>;
            itemIds: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            itemIds: string[];
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }, {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            itemIds: string[];
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }>, "many">>;
        blockingCount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        items: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }[];
        groups: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            itemIds: string[];
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[];
        blockingCount: number;
    }, {
        items?: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }[] | undefined;
        groups?: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            itemIds: string[];
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[] | undefined;
        blockingCount?: number | undefined;
    }>;
    quality: z.ZodObject<{
        gateStatus: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
        gateRuns: z.ZodDefault<z.ZodArray<z.ZodObject<{
            gateId: z.ZodString;
            status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
            durationMs: z.ZodNumber;
            safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            diagnosticRefs: string[];
            gateId: string;
            durationMs: number;
            traceRefs: string[];
        }, {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            gateId: string;
            durationMs: number;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
        }>, "many">>;
        pbtRuns: z.ZodDefault<z.ZodArray<z.ZodObject<{
            planId: z.ZodString;
            subject: z.ZodString;
            generatorFamily: z.ZodString;
            propertyName: z.ZodString;
            seed: z.ZodOptional<z.ZodNumber>;
            status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
            shrunk: z.ZodDefault<z.ZodBoolean>;
            safeSummary: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "passed" | "blocked" | "failed" | "skipped";
            diagnosticRefs: string[];
            traceRefs: string[];
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            shrunk: boolean;
            safeSummary?: string | undefined;
            seed?: number | undefined;
        }, {
            status: "passed" | "blocked" | "failed" | "skipped";
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            safeSummary?: string | undefined;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
            seed?: number | undefined;
            shrunk?: boolean | undefined;
        }>, "many">>;
        correctionAttempts: z.ZodDefault<z.ZodNumber>;
        evidenceCounts: z.ZodObject<{
            total: z.ZodDefault<z.ZodNumber>;
            blocked: z.ZodDefault<z.ZodNumber>;
            safe: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            blocked: number;
            safe: number;
            total: number;
        }, {
            blocked?: number | undefined;
            safe?: number | undefined;
            total?: number | undefined;
        }>;
        conversionQualityScore: z.ZodNumber;
        targetPercent: z.ZodNumber;
        targetMet: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        gateStatus: "passed" | "blocked" | "failed" | "skipped";
        gateRuns: {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            diagnosticRefs: string[];
            gateId: string;
            durationMs: number;
            traceRefs: string[];
        }[];
        pbtRuns: {
            status: "passed" | "blocked" | "failed" | "skipped";
            diagnosticRefs: string[];
            traceRefs: string[];
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            shrunk: boolean;
            safeSummary?: string | undefined;
            seed?: number | undefined;
        }[];
        correctionAttempts: number;
        evidenceCounts: {
            blocked: number;
            safe: number;
            total: number;
        };
        conversionQualityScore: number;
        targetPercent: number;
        targetMet: boolean;
    }, {
        gateStatus: "passed" | "blocked" | "failed" | "skipped";
        evidenceCounts: {
            blocked?: number | undefined;
            safe?: number | undefined;
            total?: number | undefined;
        };
        conversionQualityScore: number;
        targetPercent: number;
        targetMet: boolean;
        gateRuns?: {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            gateId: string;
            durationMs: number;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
        }[] | undefined;
        pbtRuns?: {
            status: "passed" | "blocked" | "failed" | "skipped";
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            safeSummary?: string | undefined;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
            seed?: number | undefined;
            shrunk?: boolean | undefined;
        }[] | undefined;
        correctionAttempts?: number | undefined;
    }>;
    traceability: z.ZodObject<{
        links: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            relation: z.ZodEnum<["maps-to", "derived-from", "emits", "references"]>;
            confidence: z.ZodDefault<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        } & {
            source: z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
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
            }>;
            target: z.ZodUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"ir">;
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                kind: "ir";
                id: string;
            }, {
                kind: "ir";
                id: string;
            }>, z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>]>;
        }, "strip", z.ZodTypeAny, {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence: number;
            notes?: string | undefined;
        }, {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence?: number | undefined;
            notes?: string | undefined;
        }>, "many">>;
        syntheticOrigins: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            segment: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>, "many">>;
        coverageSummary: z.ZodObject<{
            covered: z.ZodNumber;
            uncovered: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            covered: number;
            uncovered: number;
        }, {
            covered: number;
            uncovered: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        links: {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence: number;
            notes?: string | undefined;
        }[];
        syntheticOrigins: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        coverageSummary: {
            covered: number;
            uncovered: number;
        };
    }, {
        coverageSummary: {
            covered: number;
            uncovered: number;
        };
        links?: {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence?: number | undefined;
            notes?: string | undefined;
        }[] | undefined;
        syntheticOrigins?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    }>;
    exportMetadata: z.ZodObject<{
        formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">>;
        contentHashes: z.ZodDefault<z.ZodArray<z.ZodObject<{
            format: z.ZodEnum<["json", "markdown", "html"]>;
            hash: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            format: "json" | "markdown" | "html";
            hash: string;
        }, {
            format: "json" | "markdown" | "html";
            hash: string;
        }>, "many">>;
        rendererVersion: z.ZodString;
        exportedAt: z.ZodString;
        canonicalReportRef: z.ZodString;
        partial: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        partial: boolean;
        formats: ("json" | "markdown" | "html")[];
        contentHashes: {
            format: "json" | "markdown" | "html";
            hash: string;
        }[];
        rendererVersion: string;
        exportedAt: string;
        canonicalReportRef: string;
    }, {
        rendererVersion: string;
        exportedAt: string;
        canonicalReportRef: string;
        partial?: boolean | undefined;
        formats?: ("json" | "markdown" | "html")[] | undefined;
        contentHashes?: {
            format: "json" | "markdown" | "html";
            hash: string;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    quality: {
        gateStatus: "passed" | "blocked" | "failed" | "skipped";
        gateRuns: {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            diagnosticRefs: string[];
            gateId: string;
            durationMs: number;
            traceRefs: string[];
        }[];
        pbtRuns: {
            status: "passed" | "blocked" | "failed" | "skipped";
            diagnosticRefs: string[];
            traceRefs: string[];
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            shrunk: boolean;
            safeSummary?: string | undefined;
            seed?: number | undefined;
        }[];
        correctionAttempts: number;
        evidenceCounts: {
            blocked: number;
            safe: number;
            total: number;
        };
        conversionQualityScore: number;
        targetPercent: number;
        targetMet: boolean;
    };
    reportId: string;
    schemaVersion: number;
    metadata: {
        partial: boolean;
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
    };
    sourceInventory: {
        artifactCounts: Record<string, number>;
        detectedCategories: string[];
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        diagnosticRefs: string[];
    };
    conversionOutput: {
        generatedArtifactCounts: Record<string, number>;
        generatedRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        targetProject: {
            targetStrategy: string;
            targetFramework: string;
        };
        convertedArtifactCount: number;
        totalCandidateArtifactCount: number;
        unresolvedCount: number;
    };
    diagnostics: {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }[];
    aiDecisions: {
        id: string;
        confidence: number;
        mappingRequestId: string;
        providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
        policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
        provenanceRef: string;
        safeRationale: string;
    }[];
    manualReview: {
        items: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }[];
        groups: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            itemIds: string[];
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[];
        blockingCount: number;
    };
    traceability: {
        links: {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence: number;
            notes?: string | undefined;
        }[];
        syntheticOrigins: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        coverageSummary: {
            covered: number;
            uncovered: number;
        };
    };
    exportMetadata: {
        partial: boolean;
        formats: ("json" | "markdown" | "html")[];
        contentHashes: {
            format: "json" | "markdown" | "html";
            hash: string;
        }[];
        rendererVersion: string;
        exportedAt: string;
        canonicalReportRef: string;
    };
}, {
    quality: {
        gateStatus: "passed" | "blocked" | "failed" | "skipped";
        evidenceCounts: {
            blocked?: number | undefined;
            safe?: number | undefined;
            total?: number | undefined;
        };
        conversionQualityScore: number;
        targetPercent: number;
        targetMet: boolean;
        gateRuns?: {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            gateId: string;
            durationMs: number;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
        }[] | undefined;
        pbtRuns?: {
            status: "passed" | "blocked" | "failed" | "skipped";
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            safeSummary?: string | undefined;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
            seed?: number | undefined;
            shrunk?: boolean | undefined;
        }[] | undefined;
        correctionAttempts?: number | undefined;
    };
    reportId: string;
    schemaVersion: number;
    metadata: {
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
        partial?: boolean | undefined;
    };
    sourceInventory: {
        artifactCounts?: Record<string, number> | undefined;
        detectedCategories?: string[] | undefined;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        diagnosticRefs?: string[] | undefined;
    };
    conversionOutput: {
        targetProject: {
            targetStrategy: string;
            targetFramework: string;
        };
        convertedArtifactCount: number;
        totalCandidateArtifactCount: number;
        generatedArtifactCounts?: Record<string, number> | undefined;
        generatedRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
        unresolvedCount?: number | undefined;
    };
    manualReview: {
        items?: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }[] | undefined;
        groups?: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            itemIds: string[];
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[] | undefined;
        blockingCount?: number | undefined;
    };
    traceability: {
        coverageSummary: {
            covered: number;
            uncovered: number;
        };
        links?: {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence?: number | undefined;
            notes?: string | undefined;
        }[] | undefined;
        syntheticOrigins?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    };
    exportMetadata: {
        rendererVersion: string;
        exportedAt: string;
        canonicalReportRef: string;
        partial?: boolean | undefined;
        formats?: ("json" | "markdown" | "html")[] | undefined;
        contentHashes?: {
            format: "json" | "markdown" | "html";
            hash: string;
        }[] | undefined;
    };
    diagnostics?: {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }[] | undefined;
    aiDecisions?: {
        id: string;
        confidence: number;
        mappingRequestId: string;
        providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
        policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
        provenanceRef: string;
        safeRationale: string;
    }[] | undefined;
}>;
export type CanonicalConversionReport = z.infer<typeof CanonicalConversionReportSchema>;
export declare const ReportViewModelSchema: z.ZodObject<{
    reportId: z.ZodString;
    metadata: z.ZodObject<{
        runId: z.ZodString;
        correlationId: z.ZodString;
        projectLabel: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        sourceFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        targetFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        generatedAt: z.ZodString;
        partial: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        partial: boolean;
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
    }, {
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
        partial?: boolean | undefined;
    }>;
    sections: z.ZodObject<{
        sourceInventory: z.ZodDefault<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodString>, "many">>;
        conversionOutput: z.ZodDefault<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodString>, "many">>;
        diagnostics: z.ZodDefault<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodString>, "many">>;
        aiDecisions: z.ZodDefault<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodString>, "many">>;
        manualReview: z.ZodDefault<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodString>, "many">>;
        quality: z.ZodDefault<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodString>, "many">>;
        traceability: z.ZodDefault<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodString>, "many">>;
    }, "strip", z.ZodTypeAny, {
        quality: Record<string, string>[];
        sourceInventory: Record<string, string>[];
        conversionOutput: Record<string, string>[];
        diagnostics: Record<string, string>[];
        aiDecisions: Record<string, string>[];
        manualReview: Record<string, string>[];
        traceability: Record<string, string>[];
    }, {
        quality?: Record<string, string>[] | undefined;
        sourceInventory?: Record<string, string>[] | undefined;
        conversionOutput?: Record<string, string>[] | undefined;
        diagnostics?: Record<string, string>[] | undefined;
        aiDecisions?: Record<string, string>[] | undefined;
        manualReview?: Record<string, string>[] | undefined;
        traceability?: Record<string, string>[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    reportId: string;
    metadata: {
        partial: boolean;
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
    };
    sections: {
        quality: Record<string, string>[];
        sourceInventory: Record<string, string>[];
        conversionOutput: Record<string, string>[];
        diagnostics: Record<string, string>[];
        aiDecisions: Record<string, string>[];
        manualReview: Record<string, string>[];
        traceability: Record<string, string>[];
    };
}, {
    reportId: string;
    metadata: {
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
        partial?: boolean | undefined;
    };
    sections: {
        quality?: Record<string, string>[] | undefined;
        sourceInventory?: Record<string, string>[] | undefined;
        conversionOutput?: Record<string, string>[] | undefined;
        diagnostics?: Record<string, string>[] | undefined;
        aiDecisions?: Record<string, string>[] | undefined;
        manualReview?: Record<string, string>[] | undefined;
        traceability?: Record<string, string>[] | undefined;
    };
}>;
export type ReportViewModel = z.infer<typeof ReportViewModelSchema>;
export declare const ReportGenerationRequestSchema: z.ZodObject<{
    inputBundle: z.ZodObject<{
        metadata: z.ZodObject<Omit<{
            runId: z.ZodString;
            correlationId: z.ZodString;
            projectLabel: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            sourceFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            targetFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            generatedAt: z.ZodString;
            partial: z.ZodDefault<z.ZodBoolean>;
        }, "partial">, "strip", z.ZodTypeAny, {
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
        }, {
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
        }>;
        sourceInventory: z.ZodObject<{
            artifactCounts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
            detectedCategories: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
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
            diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            artifactCounts: Record<string, number>;
            detectedCategories: string[];
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            diagnosticRefs: string[];
        }, {
            artifactCounts?: Record<string, number> | undefined;
            detectedCategories?: string[] | undefined;
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            diagnosticRefs?: string[] | undefined;
        }>;
        conversionOutput: z.ZodObject<{
            generatedArtifactCounts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
            generatedRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>, "many">>;
            targetProject: z.ZodObject<{
                targetStrategy: z.ZodString;
                targetFramework: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                targetStrategy: string;
                targetFramework: string;
            }, {
                targetStrategy: string;
                targetFramework: string;
            }>;
            convertedArtifactCount: z.ZodNumber;
            totalCandidateArtifactCount: z.ZodNumber;
            unresolvedCount: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            generatedArtifactCounts: Record<string, number>;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            unresolvedCount: number;
        }, {
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            generatedArtifactCounts?: Record<string, number> | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
            unresolvedCount?: number | undefined;
        }>;
        diagnostics: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
            reasonCode: z.ZodString;
            safeMessage: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            sourceRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
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
            generatedRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>>;
            storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            reviewCategory: z.ZodOptional<z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }, {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }>, "many">>;
        aiDecisions: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            mappingRequestId: z.ZodString;
            providerCategory: z.ZodEnum<["local", "internal", "mock", "external-disabled", "external-opt-in"]>;
            policyStatus: z.ZodEnum<["allowed", "blocked", "disabled", "review-required"]>;
            confidence: z.ZodNumber;
            provenanceRef: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            safeRationale: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }, {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }>, "many">>;
        manualReview: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
            category: z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>;
            reasonCode: z.ZodString;
            safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            remediationHint: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            sourceRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
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
            generatedRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>>;
            storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }, {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }>, "many">>;
        quality: z.ZodObject<{
            gateStatus: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
            gateRuns: z.ZodDefault<z.ZodArray<z.ZodObject<{
                gateId: z.ZodString;
                status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
                durationMs: z.ZodNumber;
                safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
                diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                diagnosticRefs: string[];
                gateId: string;
                durationMs: number;
                traceRefs: string[];
            }, {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                gateId: string;
                durationMs: number;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
            }>, "many">>;
            pbtRuns: z.ZodDefault<z.ZodArray<z.ZodObject<{
                planId: z.ZodString;
                subject: z.ZodString;
                generatorFamily: z.ZodString;
                propertyName: z.ZodString;
                seed: z.ZodOptional<z.ZodNumber>;
                status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
                shrunk: z.ZodDefault<z.ZodBoolean>;
                safeSummary: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
                diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                status: "passed" | "blocked" | "failed" | "skipped";
                diagnosticRefs: string[];
                traceRefs: string[];
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                shrunk: boolean;
                safeSummary?: string | undefined;
                seed?: number | undefined;
            }, {
                status: "passed" | "blocked" | "failed" | "skipped";
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                safeSummary?: string | undefined;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
                seed?: number | undefined;
                shrunk?: boolean | undefined;
            }>, "many">>;
            correctionAttempts: z.ZodDefault<z.ZodNumber>;
            evidenceCounts: z.ZodObject<{
                total: z.ZodDefault<z.ZodNumber>;
                blocked: z.ZodDefault<z.ZodNumber>;
                safe: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                blocked: number;
                safe: number;
                total: number;
            }, {
                blocked?: number | undefined;
                safe?: number | undefined;
                total?: number | undefined;
            }>;
            conversionQualityScore: z.ZodNumber;
            targetPercent: z.ZodNumber;
            targetMet: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            gateRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                diagnosticRefs: string[];
                gateId: string;
                durationMs: number;
                traceRefs: string[];
            }[];
            pbtRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                diagnosticRefs: string[];
                traceRefs: string[];
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                shrunk: boolean;
                safeSummary?: string | undefined;
                seed?: number | undefined;
            }[];
            correctionAttempts: number;
            evidenceCounts: {
                blocked: number;
                safe: number;
                total: number;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
        }, {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            evidenceCounts: {
                blocked?: number | undefined;
                safe?: number | undefined;
                total?: number | undefined;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
            gateRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                gateId: string;
                durationMs: number;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
            }[] | undefined;
            pbtRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                safeSummary?: string | undefined;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
                seed?: number | undefined;
                shrunk?: boolean | undefined;
            }[] | undefined;
            correctionAttempts?: number | undefined;
        }>;
        traceability: z.ZodObject<{
            links: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                relation: z.ZodEnum<["maps-to", "derived-from", "emits", "references"]>;
                confidence: z.ZodDefault<z.ZodNumber>;
                notes: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            } & {
                source: z.ZodObject<{
                    kind: z.ZodLiteral<"source">;
                    symbol: z.ZodOptional<z.ZodString>;
                    location: z.ZodOptional<z.ZodString>;
                } & {
                    path: z.ZodEffects<z.ZodString, string, string>;
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
                }>;
                target: z.ZodUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"ir">;
                    id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    kind: "ir";
                    id: string;
                }, {
                    kind: "ir";
                    id: string;
                }>, z.ZodObject<{
                    kind: z.ZodLiteral<"generated">;
                    segment: z.ZodOptional<z.ZodString>;
                } & {
                    path: z.ZodEffects<z.ZodString, string, string>;
                }, "strip", z.ZodTypeAny, {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                }, {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                }>]>;
            }, "strip", z.ZodTypeAny, {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence: number;
                notes?: string | undefined;
            }, {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence?: number | undefined;
                notes?: string | undefined;
            }>, "many">>;
            syntheticOrigins: z.ZodDefault<z.ZodArray<z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>, "many">>;
            coverageSummary: z.ZodObject<{
                covered: z.ZodNumber;
                uncovered: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                covered: number;
                uncovered: number;
            }, {
                covered: number;
                uncovered: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            links: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence: number;
                notes?: string | undefined;
            }[];
            syntheticOrigins: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
        }, {
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
            links?: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence?: number | undefined;
                notes?: string | undefined;
            }[] | undefined;
            syntheticOrigins?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        quality: {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            gateRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                diagnosticRefs: string[];
                gateId: string;
                durationMs: number;
                traceRefs: string[];
            }[];
            pbtRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                diagnosticRefs: string[];
                traceRefs: string[];
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                shrunk: boolean;
                safeSummary?: string | undefined;
                seed?: number | undefined;
            }[];
            correctionAttempts: number;
            evidenceCounts: {
                blocked: number;
                safe: number;
                total: number;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
        };
        metadata: {
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
        };
        sourceInventory: {
            artifactCounts: Record<string, number>;
            detectedCategories: string[];
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            diagnosticRefs: string[];
        };
        conversionOutput: {
            generatedArtifactCounts: Record<string, number>;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            unresolvedCount: number;
        };
        diagnostics: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[];
        aiDecisions: {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }[];
        manualReview: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }[];
        traceability: {
            links: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence: number;
                notes?: string | undefined;
            }[];
            syntheticOrigins: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
        };
    }, {
        quality: {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            evidenceCounts: {
                blocked?: number | undefined;
                safe?: number | undefined;
                total?: number | undefined;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
            gateRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                gateId: string;
                durationMs: number;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
            }[] | undefined;
            pbtRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                safeSummary?: string | undefined;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
                seed?: number | undefined;
                shrunk?: boolean | undefined;
            }[] | undefined;
            correctionAttempts?: number | undefined;
        };
        metadata: {
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
        };
        sourceInventory: {
            artifactCounts?: Record<string, number> | undefined;
            detectedCategories?: string[] | undefined;
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            diagnosticRefs?: string[] | undefined;
        };
        conversionOutput: {
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            generatedArtifactCounts?: Record<string, number> | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
            unresolvedCount?: number | undefined;
        };
        traceability: {
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
            links?: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence?: number | undefined;
                notes?: string | undefined;
            }[] | undefined;
            syntheticOrigins?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        };
        diagnostics?: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[] | undefined;
        aiDecisions?: {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }[] | undefined;
        manualReview?: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }[] | undefined;
    }>;
    requestedFormats: z.ZodDefault<z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">>;
    rendererVersion: z.ZodString;
    generatedAt: z.ZodString;
    qualityTargetPercent: z.ZodDefault<z.ZodNumber>;
    partial: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    partial: boolean;
    generatedAt: string;
    rendererVersion: string;
    inputBundle: {
        quality: {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            gateRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                diagnosticRefs: string[];
                gateId: string;
                durationMs: number;
                traceRefs: string[];
            }[];
            pbtRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                diagnosticRefs: string[];
                traceRefs: string[];
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                shrunk: boolean;
                safeSummary?: string | undefined;
                seed?: number | undefined;
            }[];
            correctionAttempts: number;
            evidenceCounts: {
                blocked: number;
                safe: number;
                total: number;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
        };
        metadata: {
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
        };
        sourceInventory: {
            artifactCounts: Record<string, number>;
            detectedCategories: string[];
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            diagnosticRefs: string[];
        };
        conversionOutput: {
            generatedArtifactCounts: Record<string, number>;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            unresolvedCount: number;
        };
        diagnostics: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[];
        aiDecisions: {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }[];
        manualReview: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }[];
        traceability: {
            links: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence: number;
                notes?: string | undefined;
            }[];
            syntheticOrigins: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
        };
    };
    requestedFormats: ("json" | "markdown" | "html")[];
    qualityTargetPercent: number;
}, {
    generatedAt: string;
    rendererVersion: string;
    inputBundle: {
        quality: {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            evidenceCounts: {
                blocked?: number | undefined;
                safe?: number | undefined;
                total?: number | undefined;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
            gateRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                gateId: string;
                durationMs: number;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
            }[] | undefined;
            pbtRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                safeSummary?: string | undefined;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
                seed?: number | undefined;
                shrunk?: boolean | undefined;
            }[] | undefined;
            correctionAttempts?: number | undefined;
        };
        metadata: {
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
        };
        sourceInventory: {
            artifactCounts?: Record<string, number> | undefined;
            detectedCategories?: string[] | undefined;
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            diagnosticRefs?: string[] | undefined;
        };
        conversionOutput: {
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            generatedArtifactCounts?: Record<string, number> | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
            unresolvedCount?: number | undefined;
        };
        traceability: {
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
            links?: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence?: number | undefined;
                notes?: string | undefined;
            }[] | undefined;
            syntheticOrigins?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        };
        diagnostics?: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[] | undefined;
        aiDecisions?: {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }[] | undefined;
        manualReview?: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
            safeSummary: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            remediationHint?: string | undefined;
        }[] | undefined;
    };
    partial?: boolean | undefined;
    requestedFormats?: ("json" | "markdown" | "html")[] | undefined;
    qualityTargetPercent?: number | undefined;
}>;
export type ReportGenerationRequest = z.infer<typeof ReportGenerationRequestSchema>;
export declare const ReportInputBundleSchema: z.ZodObject<{
    metadata: z.ZodObject<Omit<{
        runId: z.ZodString;
        correlationId: z.ZodString;
        projectLabel: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        sourceFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        targetFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        generatedAt: z.ZodString;
        partial: z.ZodDefault<z.ZodBoolean>;
    }, "partial">, "strip", z.ZodTypeAny, {
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
    }, {
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
    }>;
    sourceInventory: z.ZodObject<{
        artifactCounts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        detectedCategories: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
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
        diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        artifactCounts: Record<string, number>;
        detectedCategories: string[];
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        diagnosticRefs: string[];
    }, {
        artifactCounts?: Record<string, number> | undefined;
        detectedCategories?: string[] | undefined;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        diagnosticRefs?: string[] | undefined;
    }>;
    conversionOutput: z.ZodObject<{
        generatedArtifactCounts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        generatedRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            segment: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>, "many">>;
        targetProject: z.ZodObject<{
            targetStrategy: z.ZodString;
            targetFramework: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            targetStrategy: string;
            targetFramework: string;
        }, {
            targetStrategy: string;
            targetFramework: string;
        }>;
        convertedArtifactCount: z.ZodNumber;
        totalCandidateArtifactCount: z.ZodNumber;
        unresolvedCount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        generatedArtifactCounts: Record<string, number>;
        generatedRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        targetProject: {
            targetStrategy: string;
            targetFramework: string;
        };
        convertedArtifactCount: number;
        totalCandidateArtifactCount: number;
        unresolvedCount: number;
    }, {
        targetProject: {
            targetStrategy: string;
            targetFramework: string;
        };
        convertedArtifactCount: number;
        totalCandidateArtifactCount: number;
        generatedArtifactCounts?: Record<string, number> | undefined;
        generatedRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
        unresolvedCount?: number | undefined;
    }>;
    diagnostics: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
        reasonCode: z.ZodString;
        safeMessage: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        sourceRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
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
        generatedRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            segment: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>>;
        storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        reviewCategory: z.ZodOptional<z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }, {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }>, "many">>;
    aiDecisions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        mappingRequestId: z.ZodString;
        providerCategory: z.ZodEnum<["local", "internal", "mock", "external-disabled", "external-opt-in"]>;
        policyStatus: z.ZodEnum<["allowed", "blocked", "disabled", "review-required"]>;
        confidence: z.ZodNumber;
        provenanceRef: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        safeRationale: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        confidence: number;
        mappingRequestId: string;
        providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
        policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
        provenanceRef: string;
        safeRationale: string;
    }, {
        id: string;
        confidence: number;
        mappingRequestId: string;
        providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
        policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
        provenanceRef: string;
        safeRationale: string;
    }>, "many">>;
    manualReview: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
        category: z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>;
        reasonCode: z.ZodString;
        safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        remediationHint: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        sourceRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
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
        generatedRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            segment: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>>;
        storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
        safeSummary: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        remediationHint?: string | undefined;
    }, {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
        safeSummary: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        remediationHint?: string | undefined;
    }>, "many">>;
    quality: z.ZodObject<{
        gateStatus: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
        gateRuns: z.ZodDefault<z.ZodArray<z.ZodObject<{
            gateId: z.ZodString;
            status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
            durationMs: z.ZodNumber;
            safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            diagnosticRefs: string[];
            gateId: string;
            durationMs: number;
            traceRefs: string[];
        }, {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            gateId: string;
            durationMs: number;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
        }>, "many">>;
        pbtRuns: z.ZodDefault<z.ZodArray<z.ZodObject<{
            planId: z.ZodString;
            subject: z.ZodString;
            generatorFamily: z.ZodString;
            propertyName: z.ZodString;
            seed: z.ZodOptional<z.ZodNumber>;
            status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
            shrunk: z.ZodDefault<z.ZodBoolean>;
            safeSummary: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            status: "passed" | "blocked" | "failed" | "skipped";
            diagnosticRefs: string[];
            traceRefs: string[];
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            shrunk: boolean;
            safeSummary?: string | undefined;
            seed?: number | undefined;
        }, {
            status: "passed" | "blocked" | "failed" | "skipped";
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            safeSummary?: string | undefined;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
            seed?: number | undefined;
            shrunk?: boolean | undefined;
        }>, "many">>;
        correctionAttempts: z.ZodDefault<z.ZodNumber>;
        evidenceCounts: z.ZodObject<{
            total: z.ZodDefault<z.ZodNumber>;
            blocked: z.ZodDefault<z.ZodNumber>;
            safe: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            blocked: number;
            safe: number;
            total: number;
        }, {
            blocked?: number | undefined;
            safe?: number | undefined;
            total?: number | undefined;
        }>;
        conversionQualityScore: z.ZodNumber;
        targetPercent: z.ZodNumber;
        targetMet: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        gateStatus: "passed" | "blocked" | "failed" | "skipped";
        gateRuns: {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            diagnosticRefs: string[];
            gateId: string;
            durationMs: number;
            traceRefs: string[];
        }[];
        pbtRuns: {
            status: "passed" | "blocked" | "failed" | "skipped";
            diagnosticRefs: string[];
            traceRefs: string[];
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            shrunk: boolean;
            safeSummary?: string | undefined;
            seed?: number | undefined;
        }[];
        correctionAttempts: number;
        evidenceCounts: {
            blocked: number;
            safe: number;
            total: number;
        };
        conversionQualityScore: number;
        targetPercent: number;
        targetMet: boolean;
    }, {
        gateStatus: "passed" | "blocked" | "failed" | "skipped";
        evidenceCounts: {
            blocked?: number | undefined;
            safe?: number | undefined;
            total?: number | undefined;
        };
        conversionQualityScore: number;
        targetPercent: number;
        targetMet: boolean;
        gateRuns?: {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            gateId: string;
            durationMs: number;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
        }[] | undefined;
        pbtRuns?: {
            status: "passed" | "blocked" | "failed" | "skipped";
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            safeSummary?: string | undefined;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
            seed?: number | undefined;
            shrunk?: boolean | undefined;
        }[] | undefined;
        correctionAttempts?: number | undefined;
    }>;
    traceability: z.ZodObject<{
        links: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            relation: z.ZodEnum<["maps-to", "derived-from", "emits", "references"]>;
            confidence: z.ZodDefault<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        } & {
            source: z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
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
            }>;
            target: z.ZodUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"ir">;
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                kind: "ir";
                id: string;
            }, {
                kind: "ir";
                id: string;
            }>, z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>]>;
        }, "strip", z.ZodTypeAny, {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence: number;
            notes?: string | undefined;
        }, {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence?: number | undefined;
            notes?: string | undefined;
        }>, "many">>;
        syntheticOrigins: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            segment: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>, "many">>;
        coverageSummary: z.ZodObject<{
            covered: z.ZodNumber;
            uncovered: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            covered: number;
            uncovered: number;
        }, {
            covered: number;
            uncovered: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        links: {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence: number;
            notes?: string | undefined;
        }[];
        syntheticOrigins: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        coverageSummary: {
            covered: number;
            uncovered: number;
        };
    }, {
        coverageSummary: {
            covered: number;
            uncovered: number;
        };
        links?: {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence?: number | undefined;
            notes?: string | undefined;
        }[] | undefined;
        syntheticOrigins?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    quality: {
        gateStatus: "passed" | "blocked" | "failed" | "skipped";
        gateRuns: {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            diagnosticRefs: string[];
            gateId: string;
            durationMs: number;
            traceRefs: string[];
        }[];
        pbtRuns: {
            status: "passed" | "blocked" | "failed" | "skipped";
            diagnosticRefs: string[];
            traceRefs: string[];
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            shrunk: boolean;
            safeSummary?: string | undefined;
            seed?: number | undefined;
        }[];
        correctionAttempts: number;
        evidenceCounts: {
            blocked: number;
            safe: number;
            total: number;
        };
        conversionQualityScore: number;
        targetPercent: number;
        targetMet: boolean;
    };
    metadata: {
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
    };
    sourceInventory: {
        artifactCounts: Record<string, number>;
        detectedCategories: string[];
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        diagnosticRefs: string[];
    };
    conversionOutput: {
        generatedArtifactCounts: Record<string, number>;
        generatedRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        targetProject: {
            targetStrategy: string;
            targetFramework: string;
        };
        convertedArtifactCount: number;
        totalCandidateArtifactCount: number;
        unresolvedCount: number;
    };
    diagnostics: {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }[];
    aiDecisions: {
        id: string;
        confidence: number;
        mappingRequestId: string;
        providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
        policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
        provenanceRef: string;
        safeRationale: string;
    }[];
    manualReview: {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
        safeSummary: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        remediationHint?: string | undefined;
    }[];
    traceability: {
        links: {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence: number;
            notes?: string | undefined;
        }[];
        syntheticOrigins: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        coverageSummary: {
            covered: number;
            uncovered: number;
        };
    };
}, {
    quality: {
        gateStatus: "passed" | "blocked" | "failed" | "skipped";
        evidenceCounts: {
            blocked?: number | undefined;
            safe?: number | undefined;
            total?: number | undefined;
        };
        conversionQualityScore: number;
        targetPercent: number;
        targetMet: boolean;
        gateRuns?: {
            status: "passed" | "blocked" | "failed" | "skipped";
            safeSummary: string;
            gateId: string;
            durationMs: number;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
        }[] | undefined;
        pbtRuns?: {
            status: "passed" | "blocked" | "failed" | "skipped";
            planId: string;
            subject: string;
            generatorFamily: string;
            propertyName: string;
            safeSummary?: string | undefined;
            diagnosticRefs?: string[] | undefined;
            traceRefs?: string[] | undefined;
            seed?: number | undefined;
            shrunk?: boolean | undefined;
        }[] | undefined;
        correctionAttempts?: number | undefined;
    };
    metadata: {
        targetFramework: string;
        runId: string;
        correlationId: string;
        projectLabel: string;
        sourceFramework: string;
        generatedAt: string;
    };
    sourceInventory: {
        artifactCounts?: Record<string, number> | undefined;
        detectedCategories?: string[] | undefined;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        diagnosticRefs?: string[] | undefined;
    };
    conversionOutput: {
        targetProject: {
            targetStrategy: string;
            targetFramework: string;
        };
        convertedArtifactCount: number;
        totalCandidateArtifactCount: number;
        generatedArtifactCounts?: Record<string, number> | undefined;
        generatedRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
        unresolvedCount?: number | undefined;
    };
    traceability: {
        coverageSummary: {
            covered: number;
            uncovered: number;
        };
        links?: {
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | {
                kind: "ir";
                id: string;
            };
            id: string;
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence?: number | undefined;
            notes?: string | undefined;
        }[] | undefined;
        syntheticOrigins?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    };
    diagnostics?: {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }[] | undefined;
    aiDecisions?: {
        id: string;
        confidence: number;
        mappingRequestId: string;
        providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
        policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
        provenanceRef: string;
        safeRationale: string;
    }[] | undefined;
    manualReview?: {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
        safeSummary: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        remediationHint?: string | undefined;
    }[] | undefined;
}>;
export type ReportInputBundle = z.infer<typeof ReportInputBundleSchema>;
export declare const ReportExportSetSchema: z.ZodObject<{
    json: z.ZodString;
    markdown: z.ZodOptional<z.ZodString>;
    html: z.ZodOptional<z.ZodString>;
    metadata: z.ZodObject<{
        formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">>;
        contentHashes: z.ZodDefault<z.ZodArray<z.ZodObject<{
            format: z.ZodEnum<["json", "markdown", "html"]>;
            hash: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            format: "json" | "markdown" | "html";
            hash: string;
        }, {
            format: "json" | "markdown" | "html";
            hash: string;
        }>, "many">>;
        rendererVersion: z.ZodString;
        exportedAt: z.ZodString;
        canonicalReportRef: z.ZodString;
        partial: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        partial: boolean;
        formats: ("json" | "markdown" | "html")[];
        contentHashes: {
            format: "json" | "markdown" | "html";
            hash: string;
        }[];
        rendererVersion: string;
        exportedAt: string;
        canonicalReportRef: string;
    }, {
        rendererVersion: string;
        exportedAt: string;
        canonicalReportRef: string;
        partial?: boolean | undefined;
        formats?: ("json" | "markdown" | "html")[] | undefined;
        contentHashes?: {
            format: "json" | "markdown" | "html";
            hash: string;
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    json: string;
    metadata: {
        partial: boolean;
        formats: ("json" | "markdown" | "html")[];
        contentHashes: {
            format: "json" | "markdown" | "html";
            hash: string;
        }[];
        rendererVersion: string;
        exportedAt: string;
        canonicalReportRef: string;
    };
    markdown?: string | undefined;
    html?: string | undefined;
}, {
    json: string;
    metadata: {
        rendererVersion: string;
        exportedAt: string;
        canonicalReportRef: string;
        partial?: boolean | undefined;
        formats?: ("json" | "markdown" | "html")[] | undefined;
        contentHashes?: {
            format: "json" | "markdown" | "html";
            hash: string;
        }[] | undefined;
    };
    markdown?: string | undefined;
    html?: string | undefined;
}>;
export type ReportExportSet = z.infer<typeof ReportExportSetSchema>;
export declare const ReportGenerationResultSchema: z.ZodObject<{
    report: z.ZodObject<{
        reportId: z.ZodString;
        schemaVersion: z.ZodNumber;
        metadata: z.ZodObject<{
            runId: z.ZodString;
            correlationId: z.ZodString;
            projectLabel: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            sourceFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            targetFramework: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            generatedAt: z.ZodString;
            partial: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            partial: boolean;
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
        }, {
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
            partial?: boolean | undefined;
        }>;
        sourceInventory: z.ZodObject<{
            artifactCounts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
            detectedCategories: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
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
            diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            artifactCounts: Record<string, number>;
            detectedCategories: string[];
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            diagnosticRefs: string[];
        }, {
            artifactCounts?: Record<string, number> | undefined;
            detectedCategories?: string[] | undefined;
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            diagnosticRefs?: string[] | undefined;
        }>;
        conversionOutput: z.ZodObject<{
            generatedArtifactCounts: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodNumber>>;
            generatedRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>, "many">>;
            targetProject: z.ZodObject<{
                targetStrategy: z.ZodString;
                targetFramework: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                targetStrategy: string;
                targetFramework: string;
            }, {
                targetStrategy: string;
                targetFramework: string;
            }>;
            convertedArtifactCount: z.ZodNumber;
            totalCandidateArtifactCount: z.ZodNumber;
            unresolvedCount: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            generatedArtifactCounts: Record<string, number>;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            unresolvedCount: number;
        }, {
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            generatedArtifactCounts?: Record<string, number> | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
            unresolvedCount?: number | undefined;
        }>;
        diagnostics: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
            reasonCode: z.ZodString;
            safeMessage: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            sourceRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"source">;
                symbol: z.ZodOptional<z.ZodString>;
                location: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
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
            generatedRef: z.ZodOptional<z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>>;
            storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            reviewCategory: z.ZodOptional<z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }, {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }>, "many">>;
        aiDecisions: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            mappingRequestId: z.ZodString;
            providerCategory: z.ZodEnum<["local", "internal", "mock", "external-disabled", "external-opt-in"]>;
            policyStatus: z.ZodEnum<["allowed", "blocked", "disabled", "review-required"]>;
            confidence: z.ZodNumber;
            provenanceRef: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
            safeRationale: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }, {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }>, "many">>;
        manualReview: z.ZodObject<{
            items: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
                category: z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>;
                reasonCode: z.ZodString;
                safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
                remediationHint: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
                sourceRef: z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"source">;
                    symbol: z.ZodOptional<z.ZodString>;
                    location: z.ZodOptional<z.ZodString>;
                } & {
                    path: z.ZodEffects<z.ZodString, string, string>;
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
                generatedRef: z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"generated">;
                    segment: z.ZodOptional<z.ZodString>;
                } & {
                    path: z.ZodEffects<z.ZodString, string, string>;
                }, "strip", z.ZodTypeAny, {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                }, {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                }>>;
                storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                reasonCode: string;
                category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
                safeSummary: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                remediationHint?: string | undefined;
            }, {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                reasonCode: string;
                category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
                safeSummary: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                remediationHint?: string | undefined;
            }>, "many">>;
            groups: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
                sourceRef: z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"source">;
                    symbol: z.ZodOptional<z.ZodString>;
                    location: z.ZodOptional<z.ZodString>;
                } & {
                    path: z.ZodEffects<z.ZodString, string, string>;
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
                generatedRef: z.ZodOptional<z.ZodObject<{
                    kind: z.ZodLiteral<"generated">;
                    segment: z.ZodOptional<z.ZodString>;
                } & {
                    path: z.ZodEffects<z.ZodString, string, string>;
                }, "strip", z.ZodTypeAny, {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                }, {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                }>>;
                storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
                reviewCategory: z.ZodOptional<z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>>;
                itemIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                itemIds: string[];
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
            }, {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                itemIds: string[];
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
            }>, "many">>;
            blockingCount: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            items: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                reasonCode: string;
                category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
                safeSummary: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                remediationHint?: string | undefined;
            }[];
            groups: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                itemIds: string[];
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
            }[];
            blockingCount: number;
        }, {
            items?: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                reasonCode: string;
                category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
                safeSummary: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                remediationHint?: string | undefined;
            }[] | undefined;
            groups?: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                itemIds: string[];
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
            }[] | undefined;
            blockingCount?: number | undefined;
        }>;
        quality: z.ZodObject<{
            gateStatus: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
            gateRuns: z.ZodDefault<z.ZodArray<z.ZodObject<{
                gateId: z.ZodString;
                status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
                durationMs: z.ZodNumber;
                safeSummary: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
                diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                diagnosticRefs: string[];
                gateId: string;
                durationMs: number;
                traceRefs: string[];
            }, {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                gateId: string;
                durationMs: number;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
            }>, "many">>;
            pbtRuns: z.ZodDefault<z.ZodArray<z.ZodObject<{
                planId: z.ZodString;
                subject: z.ZodString;
                generatorFamily: z.ZodString;
                propertyName: z.ZodString;
                seed: z.ZodOptional<z.ZodNumber>;
                status: z.ZodEnum<["passed", "failed", "skipped", "blocked"]>;
                shrunk: z.ZodDefault<z.ZodBoolean>;
                safeSummary: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
                diagnosticRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                traceRefs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                status: "passed" | "blocked" | "failed" | "skipped";
                diagnosticRefs: string[];
                traceRefs: string[];
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                shrunk: boolean;
                safeSummary?: string | undefined;
                seed?: number | undefined;
            }, {
                status: "passed" | "blocked" | "failed" | "skipped";
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                safeSummary?: string | undefined;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
                seed?: number | undefined;
                shrunk?: boolean | undefined;
            }>, "many">>;
            correctionAttempts: z.ZodDefault<z.ZodNumber>;
            evidenceCounts: z.ZodObject<{
                total: z.ZodDefault<z.ZodNumber>;
                blocked: z.ZodDefault<z.ZodNumber>;
                safe: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                blocked: number;
                safe: number;
                total: number;
            }, {
                blocked?: number | undefined;
                safe?: number | undefined;
                total?: number | undefined;
            }>;
            conversionQualityScore: z.ZodNumber;
            targetPercent: z.ZodNumber;
            targetMet: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            gateRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                diagnosticRefs: string[];
                gateId: string;
                durationMs: number;
                traceRefs: string[];
            }[];
            pbtRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                diagnosticRefs: string[];
                traceRefs: string[];
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                shrunk: boolean;
                safeSummary?: string | undefined;
                seed?: number | undefined;
            }[];
            correctionAttempts: number;
            evidenceCounts: {
                blocked: number;
                safe: number;
                total: number;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
        }, {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            evidenceCounts: {
                blocked?: number | undefined;
                safe?: number | undefined;
                total?: number | undefined;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
            gateRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                gateId: string;
                durationMs: number;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
            }[] | undefined;
            pbtRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                safeSummary?: string | undefined;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
                seed?: number | undefined;
                shrunk?: boolean | undefined;
            }[] | undefined;
            correctionAttempts?: number | undefined;
        }>;
        traceability: z.ZodObject<{
            links: z.ZodDefault<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                relation: z.ZodEnum<["maps-to", "derived-from", "emits", "references"]>;
                confidence: z.ZodDefault<z.ZodNumber>;
                notes: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
            } & {
                source: z.ZodObject<{
                    kind: z.ZodLiteral<"source">;
                    symbol: z.ZodOptional<z.ZodString>;
                    location: z.ZodOptional<z.ZodString>;
                } & {
                    path: z.ZodEffects<z.ZodString, string, string>;
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
                }>;
                target: z.ZodUnion<[z.ZodObject<{
                    kind: z.ZodLiteral<"ir">;
                    id: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    kind: "ir";
                    id: string;
                }, {
                    kind: "ir";
                    id: string;
                }>, z.ZodObject<{
                    kind: z.ZodLiteral<"generated">;
                    segment: z.ZodOptional<z.ZodString>;
                } & {
                    path: z.ZodEffects<z.ZodString, string, string>;
                }, "strip", z.ZodTypeAny, {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                }, {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                }>]>;
            }, "strip", z.ZodTypeAny, {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence: number;
                notes?: string | undefined;
            }, {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence?: number | undefined;
                notes?: string | undefined;
            }>, "many">>;
            syntheticOrigins: z.ZodDefault<z.ZodArray<z.ZodObject<{
                kind: z.ZodLiteral<"generated">;
                segment: z.ZodOptional<z.ZodString>;
            } & {
                path: z.ZodEffects<z.ZodString, string, string>;
            }, "strip", z.ZodTypeAny, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }, {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }>, "many">>;
            coverageSummary: z.ZodObject<{
                covered: z.ZodNumber;
                uncovered: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                covered: number;
                uncovered: number;
            }, {
                covered: number;
                uncovered: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            links: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence: number;
                notes?: string | undefined;
            }[];
            syntheticOrigins: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
        }, {
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
            links?: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence?: number | undefined;
                notes?: string | undefined;
            }[] | undefined;
            syntheticOrigins?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        }>;
        exportMetadata: z.ZodObject<{
            formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">>;
            contentHashes: z.ZodDefault<z.ZodArray<z.ZodObject<{
                format: z.ZodEnum<["json", "markdown", "html"]>;
                hash: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                format: "json" | "markdown" | "html";
                hash: string;
            }, {
                format: "json" | "markdown" | "html";
                hash: string;
            }>, "many">>;
            rendererVersion: z.ZodString;
            exportedAt: z.ZodString;
            canonicalReportRef: z.ZodString;
            partial: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            partial: boolean;
            formats: ("json" | "markdown" | "html")[];
            contentHashes: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[];
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
        }, {
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
            partial?: boolean | undefined;
            formats?: ("json" | "markdown" | "html")[] | undefined;
            contentHashes?: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        quality: {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            gateRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                diagnosticRefs: string[];
                gateId: string;
                durationMs: number;
                traceRefs: string[];
            }[];
            pbtRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                diagnosticRefs: string[];
                traceRefs: string[];
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                shrunk: boolean;
                safeSummary?: string | undefined;
                seed?: number | undefined;
            }[];
            correctionAttempts: number;
            evidenceCounts: {
                blocked: number;
                safe: number;
                total: number;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
        };
        reportId: string;
        schemaVersion: number;
        metadata: {
            partial: boolean;
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
        };
        sourceInventory: {
            artifactCounts: Record<string, number>;
            detectedCategories: string[];
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            diagnosticRefs: string[];
        };
        conversionOutput: {
            generatedArtifactCounts: Record<string, number>;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            unresolvedCount: number;
        };
        diagnostics: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[];
        aiDecisions: {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }[];
        manualReview: {
            items: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                reasonCode: string;
                category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
                safeSummary: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                remediationHint?: string | undefined;
            }[];
            groups: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                itemIds: string[];
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
            }[];
            blockingCount: number;
        };
        traceability: {
            links: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence: number;
                notes?: string | undefined;
            }[];
            syntheticOrigins: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
        };
        exportMetadata: {
            partial: boolean;
            formats: ("json" | "markdown" | "html")[];
            contentHashes: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[];
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
        };
    }, {
        quality: {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            evidenceCounts: {
                blocked?: number | undefined;
                safe?: number | undefined;
                total?: number | undefined;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
            gateRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                gateId: string;
                durationMs: number;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
            }[] | undefined;
            pbtRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                safeSummary?: string | undefined;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
                seed?: number | undefined;
                shrunk?: boolean | undefined;
            }[] | undefined;
            correctionAttempts?: number | undefined;
        };
        reportId: string;
        schemaVersion: number;
        metadata: {
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
            partial?: boolean | undefined;
        };
        sourceInventory: {
            artifactCounts?: Record<string, number> | undefined;
            detectedCategories?: string[] | undefined;
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            diagnosticRefs?: string[] | undefined;
        };
        conversionOutput: {
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            generatedArtifactCounts?: Record<string, number> | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
            unresolvedCount?: number | undefined;
        };
        manualReview: {
            items?: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                reasonCode: string;
                category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
                safeSummary: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                remediationHint?: string | undefined;
            }[] | undefined;
            groups?: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                itemIds: string[];
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
            }[] | undefined;
            blockingCount?: number | undefined;
        };
        traceability: {
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
            links?: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence?: number | undefined;
                notes?: string | undefined;
            }[] | undefined;
            syntheticOrigins?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        };
        exportMetadata: {
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
            partial?: boolean | undefined;
            formats?: ("json" | "markdown" | "html")[] | undefined;
            contentHashes?: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[] | undefined;
        };
        diagnostics?: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[] | undefined;
        aiDecisions?: {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }[] | undefined;
    }>;
    exports: z.ZodObject<{
        json: z.ZodString;
        markdown: z.ZodOptional<z.ZodString>;
        html: z.ZodOptional<z.ZodString>;
        metadata: z.ZodObject<{
            formats: z.ZodDefault<z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">>;
            contentHashes: z.ZodDefault<z.ZodArray<z.ZodObject<{
                format: z.ZodEnum<["json", "markdown", "html"]>;
                hash: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                format: "json" | "markdown" | "html";
                hash: string;
            }, {
                format: "json" | "markdown" | "html";
                hash: string;
            }>, "many">>;
            rendererVersion: z.ZodString;
            exportedAt: z.ZodString;
            canonicalReportRef: z.ZodString;
            partial: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            partial: boolean;
            formats: ("json" | "markdown" | "html")[];
            contentHashes: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[];
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
        }, {
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
            partial?: boolean | undefined;
            formats?: ("json" | "markdown" | "html")[] | undefined;
            contentHashes?: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        json: string;
        metadata: {
            partial: boolean;
            formats: ("json" | "markdown" | "html")[];
            contentHashes: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[];
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
        };
        markdown?: string | undefined;
        html?: string | undefined;
    }, {
        json: string;
        metadata: {
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
            partial?: boolean | undefined;
            formats?: ("json" | "markdown" | "html")[] | undefined;
            contentHashes?: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[] | undefined;
        };
        markdown?: string | undefined;
        html?: string | undefined;
    }>;
    diagnostics: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        severity: z.ZodEnum<["critical", "blocking", "warning", "info"]>;
        reasonCode: z.ZodString;
        safeMessage: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        sourceRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
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
        generatedRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            segment: z.ZodOptional<z.ZodString>;
        } & {
            path: z.ZodEffects<z.ZodString, string, string>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>>;
        storyArea: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        reviewCategory: z.ZodOptional<z.ZodEnum<["mapping", "security", "quality", "provider", "target-generation", "reporting", "source-analysis", "transformation", "unknown"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }, {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    diagnostics: {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }[];
    report: {
        quality: {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            gateRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                diagnosticRefs: string[];
                gateId: string;
                durationMs: number;
                traceRefs: string[];
            }[];
            pbtRuns: {
                status: "passed" | "blocked" | "failed" | "skipped";
                diagnosticRefs: string[];
                traceRefs: string[];
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                shrunk: boolean;
                safeSummary?: string | undefined;
                seed?: number | undefined;
            }[];
            correctionAttempts: number;
            evidenceCounts: {
                blocked: number;
                safe: number;
                total: number;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
        };
        reportId: string;
        schemaVersion: number;
        metadata: {
            partial: boolean;
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
        };
        sourceInventory: {
            artifactCounts: Record<string, number>;
            detectedCategories: string[];
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            diagnosticRefs: string[];
        };
        conversionOutput: {
            generatedArtifactCounts: Record<string, number>;
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            unresolvedCount: number;
        };
        diagnostics: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[];
        aiDecisions: {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }[];
        manualReview: {
            items: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                reasonCode: string;
                category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
                safeSummary: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                remediationHint?: string | undefined;
            }[];
            groups: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                itemIds: string[];
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
            }[];
            blockingCount: number;
        };
        traceability: {
            links: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence: number;
                notes?: string | undefined;
            }[];
            syntheticOrigins: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
        };
        exportMetadata: {
            partial: boolean;
            formats: ("json" | "markdown" | "html")[];
            contentHashes: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[];
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
        };
    };
    exports: {
        json: string;
        metadata: {
            partial: boolean;
            formats: ("json" | "markdown" | "html")[];
            contentHashes: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[];
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
        };
        markdown?: string | undefined;
        html?: string | undefined;
    };
}, {
    report: {
        quality: {
            gateStatus: "passed" | "blocked" | "failed" | "skipped";
            evidenceCounts: {
                blocked?: number | undefined;
                safe?: number | undefined;
                total?: number | undefined;
            };
            conversionQualityScore: number;
            targetPercent: number;
            targetMet: boolean;
            gateRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                safeSummary: string;
                gateId: string;
                durationMs: number;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
            }[] | undefined;
            pbtRuns?: {
                status: "passed" | "blocked" | "failed" | "skipped";
                planId: string;
                subject: string;
                generatorFamily: string;
                propertyName: string;
                safeSummary?: string | undefined;
                diagnosticRefs?: string[] | undefined;
                traceRefs?: string[] | undefined;
                seed?: number | undefined;
                shrunk?: boolean | undefined;
            }[] | undefined;
            correctionAttempts?: number | undefined;
        };
        reportId: string;
        schemaVersion: number;
        metadata: {
            targetFramework: string;
            runId: string;
            correlationId: string;
            projectLabel: string;
            sourceFramework: string;
            generatedAt: string;
            partial?: boolean | undefined;
        };
        sourceInventory: {
            artifactCounts?: Record<string, number> | undefined;
            detectedCategories?: string[] | undefined;
            sourceRefs?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[] | undefined;
            diagnosticRefs?: string[] | undefined;
        };
        conversionOutput: {
            targetProject: {
                targetStrategy: string;
                targetFramework: string;
            };
            convertedArtifactCount: number;
            totalCandidateArtifactCount: number;
            generatedArtifactCounts?: Record<string, number> | undefined;
            generatedRefs?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
            unresolvedCount?: number | undefined;
        };
        manualReview: {
            items?: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                reasonCode: string;
                category: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown";
                safeSummary: string;
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                remediationHint?: string | undefined;
            }[] | undefined;
            groups?: {
                id: string;
                severity: "critical" | "blocking" | "warning" | "info";
                itemIds: string[];
                sourceRef?: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                } | undefined;
                generatedRef?: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | undefined;
                storyArea?: string | undefined;
                reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
            }[] | undefined;
            blockingCount?: number | undefined;
        };
        traceability: {
            coverageSummary: {
                covered: number;
                uncovered: number;
            };
            links?: {
                source: {
                    path: string;
                    kind: "source";
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                target: {
                    path: string;
                    kind: "generated";
                    segment?: string | undefined;
                } | {
                    kind: "ir";
                    id: string;
                };
                id: string;
                relation: "maps-to" | "derived-from" | "emits" | "references";
                confidence?: number | undefined;
                notes?: string | undefined;
            }[] | undefined;
            syntheticOrigins?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[] | undefined;
        };
        exportMetadata: {
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
            partial?: boolean | undefined;
            formats?: ("json" | "markdown" | "html")[] | undefined;
            contentHashes?: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[] | undefined;
        };
        diagnostics?: {
            id: string;
            severity: "critical" | "blocking" | "warning" | "info";
            reasonCode: string;
            safeMessage: string;
            sourceRef?: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            } | undefined;
            generatedRef?: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            } | undefined;
            storyArea?: string | undefined;
            reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
        }[] | undefined;
        aiDecisions?: {
            id: string;
            confidence: number;
            mappingRequestId: string;
            providerCategory: "local" | "internal" | "mock" | "external-disabled" | "external-opt-in";
            policyStatus: "blocked" | "allowed" | "disabled" | "review-required";
            provenanceRef: string;
            safeRationale: string;
        }[] | undefined;
    };
    exports: {
        json: string;
        metadata: {
            rendererVersion: string;
            exportedAt: string;
            canonicalReportRef: string;
            partial?: boolean | undefined;
            formats?: ("json" | "markdown" | "html")[] | undefined;
            contentHashes?: {
                format: "json" | "markdown" | "html";
                hash: string;
            }[] | undefined;
        };
        markdown?: string | undefined;
        html?: string | undefined;
    };
    diagnostics?: {
        id: string;
        severity: "critical" | "blocking" | "warning" | "info";
        reasonCode: string;
        safeMessage: string;
        sourceRef?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        } | undefined;
        generatedRef?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        } | undefined;
        storyArea?: string | undefined;
        reviewCategory?: "mapping" | "security" | "quality" | "provider" | "target-generation" | "reporting" | "source-analysis" | "transformation" | "unknown" | undefined;
    }[] | undefined;
}>;
export type ReportGenerationResult = z.infer<typeof ReportGenerationResultSchema>;
export declare const ReportSchemaVersion = 1;
export type SafeSourceRef = z.infer<typeof SafeSourceRefSchema>;
export type SafeGeneratedArtifactRef = z.infer<typeof SafeGeneratedArtifactRefSchema>;
export type SafeTraceLink = z.infer<typeof SafeTraceLinkSchema>;
export type ReportArtifactRef = SourceRef | GeneratedArtifactRef;
export type ReportSourceRef = SourceRef;
export type ReportTraceLink = TraceLink;
//# sourceMappingURL=types.d.ts.map