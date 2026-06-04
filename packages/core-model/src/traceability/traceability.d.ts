import { z } from 'zod';
import { type Result } from '../result/result.js';
import { createValidationError } from '../validation/validation.js';
export declare const SourceRefSchema: z.ZodObject<{
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
export declare const IrRefSchema: z.ZodObject<{
    kind: z.ZodLiteral<"ir">;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    kind: "ir";
}, {
    id: string;
    kind: "ir";
}>;
export declare const GeneratedArtifactRefSchema: z.ZodObject<{
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
}>;
export type SourceRef = z.infer<typeof SourceRefSchema>;
export type IrRef = z.infer<typeof IrRefSchema>;
export type GeneratedArtifactRef = z.infer<typeof GeneratedArtifactRefSchema>;
export declare const TraceLinkSchema: z.ZodObject<{
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
}>;
export type TraceLink = z.infer<typeof TraceLinkSchema>;
export declare const TraceabilityMapSchema: z.ZodObject<{
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
export type TraceabilityMap = z.infer<typeof TraceabilityMapSchema>;
export type TraceabilityIndexes = {
    bySourcePath: Map<string, TraceLink[]>;
    byTargetId: Map<string, TraceLink[]>;
};
export declare const buildTraceabilityIndexes: (traceabilityMap: TraceabilityMap) => TraceabilityIndexes;
export declare const validateTraceabilityMap: (input: unknown) => Result<any, ReturnType<typeof createValidationError>>;
export declare const createTraceLink: (link: TraceLink) => TraceLink;
//# sourceMappingURL=traceability.d.ts.map