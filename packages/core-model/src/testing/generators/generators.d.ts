import fc from 'fast-check';
export declare const coreModelArbitraries: {
    safeString: fc.Arbitrary<string>;
    sourceRef: fc.Arbitrary<{
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }>;
    irRef: fc.Arbitrary<{
        id: string;
        kind: "ir";
    }>;
    generatedRef: fc.Arbitrary<{
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>;
    traceLink: fc.Arbitrary<{
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
    }>;
    diagnostic: fc.Arbitrary<{
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
    }>;
    component: fc.Arbitrary<{
        id: string;
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
        name: string;
        templateRefs: {
            id: string;
            kind: "ir";
        }[];
        inputs: string[];
        outputs: string[];
        lifecycleHooks: string[];
        dependencyRefs: {
            id: string;
            kind: "ir";
        }[];
        extensionSlots: Record<string, unknown>;
        selector?: string | undefined;
    }>;
    traceabilityMap: fc.Arbitrary<{
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
    }>;
    angularSourceModelRef: fc.Arbitrary<{
        projectPath: string;
        entryFile: string;
        projectKind: "application" | "library" | "workspace";
    }>;
    sourceModelBoundary: fc.Arbitrary<{
        schemaVersion: number;
        notes: string[];
        sourceModelRef: {
            projectPath: string;
            entryFile: string;
            projectKind: "application" | "library" | "workspace";
        };
        entryPoints: string[];
    }>;
    manifest: fc.Arbitrary<{
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
    }>;
    report: fc.Arbitrary<{
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
    }>;
};
//# sourceMappingURL=generators.d.ts.map