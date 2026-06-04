import { z } from 'zod';
import { type ValidationError } from '../validation/validation.js';
import type { Result } from '../result/result.js';
export declare const QualityGateNameSchema: z.ZodEnum<["typecheck", "lint", "format", "build", "unit-tests", "property-tests"]>;
export declare const QualityResultSchema: z.ZodObject<{
    gate: z.ZodEnum<["typecheck", "lint", "format", "build", "unit-tests", "property-tests"]>;
    status: z.ZodEnum<["passed", "failed", "skipped"]>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    summary: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
}, "strip", z.ZodTypeAny, {
    status: "failed" | "skipped" | "passed";
    gate: "typecheck" | "lint" | "format" | "build" | "unit-tests" | "property-tests";
    durationMs?: number | undefined;
    summary?: string | undefined;
}, {
    status: "failed" | "skipped" | "passed";
    gate: "typecheck" | "lint" | "format" | "build" | "unit-tests" | "property-tests";
    durationMs?: number | undefined;
    summary?: string | undefined;
}>;
export declare const AiDecisionRecordSchema: z.ZodObject<{
    provider: z.ZodString;
    model: z.ZodOptional<z.ZodString>;
    decision: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    rationale: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
}, "strip", z.ZodTypeAny, {
    provider: string;
    decision: string;
    model?: string | undefined;
    rationale?: string | undefined;
}, {
    provider: string;
    decision: string;
    model?: string | undefined;
    rationale?: string | undefined;
}>;
export declare const ManualReviewItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    description: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    status: z.ZodEnum<["open", "resolved", "deferred"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    status: "open" | "resolved" | "deferred";
    title: string;
    description?: string | undefined;
}, {
    id: string;
    status: "open" | "resolved" | "deferred";
    title: string;
    description?: string | undefined;
}>;
export declare const SecurityEventRecordSchema: z.ZodObject<{
    eventType: z.ZodString;
    severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
    detail: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
}, "strip", z.ZodTypeAny, {
    severity: "info" | "warning" | "error" | "critical";
    eventType: string;
    detail: string;
}, {
    severity: "info" | "warning" | "error" | "critical";
    eventType: string;
    detail: string;
}>;
export declare const ConvertedFileRecordSchema: z.ZodObject<{
    sourcePath: z.ZodString;
    outputPath: z.ZodString;
    status: z.ZodEnum<["generated", "updated", "unchanged", "skipped"]>;
}, "strip", z.ZodTypeAny, {
    status: "generated" | "updated" | "unchanged" | "skipped";
    outputPath: string;
    sourcePath: string;
}, {
    status: "generated" | "updated" | "unchanged" | "skipped";
    outputPath: string;
    sourcePath: string;
}>;
export declare const RunSummarySchema: z.ZodObject<{
    startedAt: z.ZodString;
    finishedAt: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["pending", "running", "completed", "failed"]>;
    totalConvertedFiles: z.ZodNumber;
    totalDiagnostics: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "running" | "completed" | "failed";
    startedAt: string;
    totalConvertedFiles: number;
    totalDiagnostics: number;
    finishedAt?: string | undefined;
}, {
    status: "pending" | "running" | "completed" | "failed";
    startedAt: string;
    totalConvertedFiles: number;
    totalDiagnostics: number;
    finishedAt?: string | undefined;
}>;
export declare const ConversionReportSchema: z.ZodObject<{
    schemaVersion: z.ZodNumber;
    runManifest: z.ZodObject<{
        schemaVersion: z.ZodNumber;
        runId: z.ZodString;
        projectRoot: z.ZodString;
        inputPath: z.ZodString;
        outputPath: z.ZodString;
        status: z.ZodEnum<["pending", "running", "completed", "failed"]>;
        startedAt: z.ZodString;
        updatedAt: z.ZodString;
        artifactRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
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
        status: "pending" | "running" | "completed" | "failed";
        artifactRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        schemaVersion: number;
        runId: string;
        projectRoot: string;
        inputPath: string;
        outputPath: string;
        startedAt: string;
        updatedAt: string;
    }, {
        status: "pending" | "running" | "completed" | "failed";
        schemaVersion: number;
        runId: string;
        projectRoot: string;
        inputPath: string;
        outputPath: string;
        startedAt: string;
        updatedAt: string;
        artifactRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    }>;
    runSummary: z.ZodObject<{
        startedAt: z.ZodString;
        finishedAt: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<["pending", "running", "completed", "failed"]>;
        totalConvertedFiles: z.ZodNumber;
        totalDiagnostics: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "running" | "completed" | "failed";
        startedAt: string;
        totalConvertedFiles: number;
        totalDiagnostics: number;
        finishedAt?: string | undefined;
    }, {
        status: "pending" | "running" | "completed" | "failed";
        startedAt: string;
        totalConvertedFiles: number;
        totalDiagnostics: number;
        finishedAt?: string | undefined;
    }>;
    convertedFiles: z.ZodDefault<z.ZodArray<z.ZodObject<{
        sourcePath: z.ZodString;
        outputPath: z.ZodString;
        status: z.ZodEnum<["generated", "updated", "unchanged", "skipped"]>;
    }, "strip", z.ZodTypeAny, {
        status: "generated" | "updated" | "unchanged" | "skipped";
        outputPath: string;
        sourcePath: string;
    }, {
        status: "generated" | "updated" | "unchanged" | "skipped";
        outputPath: string;
        sourcePath: string;
    }>, "many">>;
    diagnostics: z.ZodObject<{
        schemaVersion: z.ZodNumber;
        diagnostics: z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            severity: z.ZodEnum<["info", "warning", "error", "manual-review", "security-blocker"]>;
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
            tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            remediationHint: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        }, "strip", z.ZodTypeAny, {
            code: string;
            message: string;
            severity: "info" | "warning" | "error" | "manual-review" | "security-blocker";
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            tags: string[];
            remediationHint?: string | undefined;
        }, {
            code: string;
            message: string;
            severity: "info" | "warning" | "error" | "manual-review" | "security-blocker";
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
            tags?: string[] | undefined;
            remediationHint?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        schemaVersion: number;
        diagnostics: {
            code: string;
            message: string;
            severity: "info" | "warning" | "error" | "manual-review" | "security-blocker";
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            tags: string[];
            remediationHint?: string | undefined;
        }[];
    }, {
        schemaVersion: number;
        diagnostics: {
            code: string;
            message: string;
            severity: "info" | "warning" | "error" | "manual-review" | "security-blocker";
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
            tags?: string[] | undefined;
            remediationHint?: string | undefined;
        }[];
    }>;
    qualityResults: z.ZodDefault<z.ZodArray<z.ZodObject<{
        gate: z.ZodEnum<["typecheck", "lint", "format", "build", "unit-tests", "property-tests"]>;
        status: z.ZodEnum<["passed", "failed", "skipped"]>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        summary: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    }, "strip", z.ZodTypeAny, {
        status: "failed" | "skipped" | "passed";
        gate: "typecheck" | "lint" | "format" | "build" | "unit-tests" | "property-tests";
        durationMs?: number | undefined;
        summary?: string | undefined;
    }, {
        status: "failed" | "skipped" | "passed";
        gate: "typecheck" | "lint" | "format" | "build" | "unit-tests" | "property-tests";
        durationMs?: number | undefined;
        summary?: string | undefined;
    }>, "many">>;
    traceabilityMap: z.ZodObject<{
        schemaVersion: z.ZodNumber;
        traceLinks: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            source: z.ZodObject<{
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
            }>;
            target: z.ZodUnion<[z.ZodObject<{
                kind: z.ZodLiteral<"ir">;
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                kind: "ir";
            }, {
                id: string;
                kind: "ir";
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
            }>]>;
            relation: z.ZodEnum<["maps-to", "derived-from", "emits", "references"]>;
            confidence: z.ZodDefault<z.ZodNumber>;
            notes: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                id: string;
                kind: "ir";
            } | {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            };
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence: number;
            notes?: string | undefined;
        }, {
            id: string;
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                id: string;
                kind: "ir";
            } | {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            };
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence?: number | undefined;
            notes?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        schemaVersion: number;
        traceLinks: {
            id: string;
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                id: string;
                kind: "ir";
            } | {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            };
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence: number;
            notes?: string | undefined;
        }[];
    }, {
        schemaVersion: number;
        traceLinks: {
            id: string;
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                id: string;
                kind: "ir";
            } | {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            };
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence?: number | undefined;
            notes?: string | undefined;
        }[];
    }>;
    aiDecisionRecords: z.ZodDefault<z.ZodArray<z.ZodObject<{
        provider: z.ZodString;
        model: z.ZodOptional<z.ZodString>;
        decision: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        rationale: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    }, "strip", z.ZodTypeAny, {
        provider: string;
        decision: string;
        model?: string | undefined;
        rationale?: string | undefined;
    }, {
        provider: string;
        decision: string;
        model?: string | undefined;
        rationale?: string | undefined;
    }>, "many">>;
    securityEvents: z.ZodDefault<z.ZodArray<z.ZodObject<{
        eventType: z.ZodString;
        severity: z.ZodEnum<["info", "warning", "error", "critical"]>;
        detail: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
    }, "strip", z.ZodTypeAny, {
        severity: "info" | "warning" | "error" | "critical";
        eventType: string;
        detail: string;
    }, {
        severity: "info" | "warning" | "error" | "critical";
        eventType: string;
        detail: string;
    }>, "many">>;
    manualReviewItems: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>;
        description: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
        status: z.ZodEnum<["open", "resolved", "deferred"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        status: "open" | "resolved" | "deferred";
        title: string;
        description?: string | undefined;
    }, {
        id: string;
        status: "open" | "resolved" | "deferred";
        title: string;
        description?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    schemaVersion: number;
    manualReviewItems: {
        id: string;
        status: "open" | "resolved" | "deferred";
        title: string;
        description?: string | undefined;
    }[];
    diagnostics: {
        schemaVersion: number;
        diagnostics: {
            code: string;
            message: string;
            severity: "info" | "warning" | "error" | "manual-review" | "security-blocker";
            sourceRefs: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            generatedRefs: {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            }[];
            tags: string[];
            remediationHint?: string | undefined;
        }[];
    };
    runManifest: {
        status: "pending" | "running" | "completed" | "failed";
        artifactRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        schemaVersion: number;
        runId: string;
        projectRoot: string;
        inputPath: string;
        outputPath: string;
        startedAt: string;
        updatedAt: string;
    };
    runSummary: {
        status: "pending" | "running" | "completed" | "failed";
        startedAt: string;
        totalConvertedFiles: number;
        totalDiagnostics: number;
        finishedAt?: string | undefined;
    };
    convertedFiles: {
        status: "generated" | "updated" | "unchanged" | "skipped";
        outputPath: string;
        sourcePath: string;
    }[];
    qualityResults: {
        status: "failed" | "skipped" | "passed";
        gate: "typecheck" | "lint" | "format" | "build" | "unit-tests" | "property-tests";
        durationMs?: number | undefined;
        summary?: string | undefined;
    }[];
    traceabilityMap: {
        schemaVersion: number;
        traceLinks: {
            id: string;
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                id: string;
                kind: "ir";
            } | {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            };
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence: number;
            notes?: string | undefined;
        }[];
    };
    aiDecisionRecords: {
        provider: string;
        decision: string;
        model?: string | undefined;
        rationale?: string | undefined;
    }[];
    securityEvents: {
        severity: "info" | "warning" | "error" | "critical";
        eventType: string;
        detail: string;
    }[];
}, {
    schemaVersion: number;
    diagnostics: {
        schemaVersion: number;
        diagnostics: {
            code: string;
            message: string;
            severity: "info" | "warning" | "error" | "manual-review" | "security-blocker";
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
            tags?: string[] | undefined;
            remediationHint?: string | undefined;
        }[];
    };
    runManifest: {
        status: "pending" | "running" | "completed" | "failed";
        schemaVersion: number;
        runId: string;
        projectRoot: string;
        inputPath: string;
        outputPath: string;
        startedAt: string;
        updatedAt: string;
        artifactRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
    };
    runSummary: {
        status: "pending" | "running" | "completed" | "failed";
        startedAt: string;
        totalConvertedFiles: number;
        totalDiagnostics: number;
        finishedAt?: string | undefined;
    };
    traceabilityMap: {
        schemaVersion: number;
        traceLinks: {
            id: string;
            source: {
                path: string;
                kind: "source";
                symbol?: string | undefined;
                location?: string | undefined;
            };
            target: {
                id: string;
                kind: "ir";
            } | {
                path: string;
                kind: "generated";
                segment?: string | undefined;
            };
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence?: number | undefined;
            notes?: string | undefined;
        }[];
    };
    manualReviewItems?: {
        id: string;
        status: "open" | "resolved" | "deferred";
        title: string;
        description?: string | undefined;
    }[] | undefined;
    convertedFiles?: {
        status: "generated" | "updated" | "unchanged" | "skipped";
        outputPath: string;
        sourcePath: string;
    }[] | undefined;
    qualityResults?: {
        status: "failed" | "skipped" | "passed";
        gate: "typecheck" | "lint" | "format" | "build" | "unit-tests" | "property-tests";
        durationMs?: number | undefined;
        summary?: string | undefined;
    }[] | undefined;
    aiDecisionRecords?: {
        provider: string;
        decision: string;
        model?: string | undefined;
        rationale?: string | undefined;
    }[] | undefined;
    securityEvents?: {
        severity: "info" | "warning" | "error" | "critical";
        eventType: string;
        detail: string;
    }[] | undefined;
}>;
export type QualityResult = z.infer<typeof QualityResultSchema>;
export type AiDecisionRecord = z.infer<typeof AiDecisionRecordSchema>;
export type ManualReviewItem = z.infer<typeof ManualReviewItemSchema>;
export type SecurityEventRecord = z.infer<typeof SecurityEventRecordSchema>;
export type ConvertedFileRecord = z.infer<typeof ConvertedFileRecordSchema>;
export type RunSummary = z.infer<typeof RunSummarySchema>;
export type ConversionReport = z.infer<typeof ConversionReportSchema>;
export declare const validateConversionReport: (input: unknown) => Result<any, ValidationError>;
//# sourceMappingURL=report.d.ts.map