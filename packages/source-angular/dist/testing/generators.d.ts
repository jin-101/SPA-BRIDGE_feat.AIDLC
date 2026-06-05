import fc from 'fast-check';
export declare const fileRecordArbitrary: fc.Arbitrary<{
    id: string;
    path: string;
    relativePath: string;
    role: string;
    kind: string;
    evidence: string[];
    relatedPaths: string[];
    parseStatus: string;
}>;
export declare const diagnosticArbitrary: fc.Arbitrary<{
    code: string;
    severity: string;
    message: string;
    sourceRefs: {
        kind: string;
        path: string;
        symbol: string | undefined;
        location: string | undefined;
    }[];
    generatedRefs: never[];
    tags: string[];
    remediationHint: string | undefined;
}>;
export declare const graphNodeArbitrary: fc.Arbitrary<{
    id: string;
    kind: string;
    label: string;
    sourceRef: {
        kind: string;
        path: string;
        symbol: string | undefined;
        location: string | undefined;
    } | undefined;
}>;
export declare const graphEdgeArbitrary: fc.Arbitrary<{
    id: string;
    kind: string;
    from: string;
    to: string;
    evidenceRefs: {
        kind: string;
        path: string;
        symbol: string | undefined;
        location: string | undefined;
    }[];
    confidence: number;
}>;
export declare const parserSummaryArbitrary: fc.Arbitrary<{
    sourcePath: string;
    symbols: {
        id: string;
        path: string;
        name: string;
        symbolKind: string;
        decorators: never[];
        members: string[];
        imports: string[];
        exports: string[];
        constructorDependencies: string[];
        lifecycleHooks: string[];
        references: string[];
    }[];
    diagnostics: never[];
    hasParseErrors: boolean;
}>;
//# sourceMappingURL=generators.d.ts.map