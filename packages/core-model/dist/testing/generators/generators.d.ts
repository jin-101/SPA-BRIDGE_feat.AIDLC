import fc from 'fast-check';
export declare const coreModelArbitraries: {
    safeString: fc.Arbitrary<string>;
    sourceRef: fc.Arbitrary<{
        kind: "source";
        path: string;
        symbol?: string | undefined;
        location?: string | undefined;
    }>;
    irRef: fc.Arbitrary<{
        kind: "ir";
        id: string;
    }>;
    generatedRef: fc.Arbitrary<{
        kind: "generated";
        path: string;
        segment?: string | undefined;
    }>;
    traceLink: fc.Arbitrary<{
        source: {
            kind: "source";
            path: string;
            symbol?: string | undefined;
            location?: string | undefined;
        };
        id: string;
        target: {
            kind: "ir";
            id: string;
        } | {
            kind: "generated";
            path: string;
            segment?: string | undefined;
        };
        relation: "maps-to" | "derived-from" | "emits" | "references";
        confidence: number;
        notes?: string | undefined;
    }>;
    diagnostic: fc.Arbitrary<{
        code: string;
        message: string;
        severity: "info" | "warning" | "error" | "manual-review" | "security-blocker";
        sourceRefs: {
            kind: "source";
            path: string;
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        generatedRefs: {
            kind: "generated";
            path: string;
            segment?: string | undefined;
        }[];
        tags: string[];
        remediationHint?: string | undefined;
    }>;
    component: fc.Arbitrary<{
        id: string;
        sourceRefs: {
            kind: "source";
            path: string;
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        generatedRefs: {
            kind: "generated";
            path: string;
            segment?: string | undefined;
        }[];
        name: string;
        templateRefs: {
            kind: "ir";
            id: string;
        }[];
        inputs: string[];
        outputs: string[];
        lifecycleHooks: string[];
        dependencyRefs: {
            kind: "ir";
            id: string;
        }[];
        extensionSlots: Record<string, unknown>;
        selector?: string | undefined;
    }>;
    traceabilityMap: fc.Arbitrary<{
        schemaVersion: number;
        traceLinks: {
            source: {
                kind: "source";
                path: string;
                symbol?: string | undefined;
                location?: string | undefined;
            };
            id: string;
            target: {
                kind: "ir";
                id: string;
            } | {
                kind: "generated";
                path: string;
                segment?: string | undefined;
            };
            relation: "maps-to" | "derived-from" | "emits" | "references";
            confidence: number;
            notes?: string | undefined;
        }[];
    }>;
    angularSourceModelRef: fc.Arbitrary<{
        projectPath: string;
        entryFile: string;
        projectKind: "application" | "library" | "workspace";
    }>;
    sourceModelBoundary: fc.Arbitrary<{
        notes: string[];
        schemaVersion: number;
        sourceModelRef: {
            projectPath: string;
            entryFile: string;
            projectKind: "application" | "library" | "workspace";
        };
        entryPoints: string[];
    }>;
    manifest: fc.Arbitrary<{
        status: "pending" | "running" | "completed" | "failed";
        schemaVersion: number;
        runId: string;
        projectRoot: string;
        inputPath: string;
        outputPath: string;
        startedAt: string;
        updatedAt: string;
        artifactRefs: {
            kind: "generated";
            path: string;
            segment?: string | undefined;
        }[];
    }>;
    runSummary: fc.Arbitrary<{
        status: "pending" | "running" | "completed" | "failed";
        startedAt: string;
        totalConvertedFiles: number;
        totalDiagnostics: number;
        finishedAt?: string | undefined;
    }>;
    maskToken: fc.Arbitrary<{
        token: string;
        category: string;
        originalLength: number;
        restorable: boolean;
        restorationHint?: string | undefined;
    }>;
    maskTokenMap: fc.Arbitrary<{
        schemaVersion: number;
        tokens: {
            token: string;
            category: string;
            originalLength: number;
            restorable: boolean;
            restorationHint?: string | undefined;
        }[];
    }>;
    diagnosticsCollection: fc.Arbitrary<{
        schemaVersion: number;
        diagnostics: {
            code: string;
            message: string;
            severity: "info" | "warning" | "error" | "manual-review" | "security-blocker";
            sourceRefs: {
                kind: "source";
                path: string;
                symbol?: string | undefined;
                location?: string | undefined;
            }[];
            generatedRefs: {
                kind: "generated";
                path: string;
                segment?: string | undefined;
            }[];
            tags: string[];
            remediationHint?: string | undefined;
        }[];
    }>;
    report: fc.Arbitrary<{
        schemaVersion: number;
        diagnostics: {
            schemaVersion: number;
            diagnostics: {
                code: string;
                message: string;
                severity: "info" | "warning" | "error" | "manual-review" | "security-blocker";
                sourceRefs: {
                    kind: "source";
                    path: string;
                    symbol?: string | undefined;
                    location?: string | undefined;
                }[];
                generatedRefs: {
                    kind: "generated";
                    path: string;
                    segment?: string | undefined;
                }[];
                tags: string[];
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
            artifactRefs: {
                kind: "generated";
                path: string;
                segment?: string | undefined;
            }[];
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
                source: {
                    kind: "source";
                    path: string;
                    symbol?: string | undefined;
                    location?: string | undefined;
                };
                id: string;
                target: {
                    kind: "ir";
                    id: string;
                } | {
                    kind: "generated";
                    path: string;
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
        manualReviewItems: {
            status: "open" | "resolved" | "deferred";
            id: string;
            title: string;
            description?: string | undefined;
        }[];
    }>;
};
//# sourceMappingURL=generators.d.ts.map