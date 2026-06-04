import { z } from 'zod';
import { type ValidationError } from '../validation/validation.js';
import type { Result } from '../result/result.js';
export declare const DiagnosticSeveritySchema: z.ZodEnum<["info", "warning", "error", "manual-review", "security-blocker"]>;
export type DiagnosticSeverity = z.infer<typeof DiagnosticSeveritySchema>;
export declare const DiagnosticSchema: z.ZodObject<{
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
}>;
export type Diagnostic = z.infer<typeof DiagnosticSchema>;
export declare const DiagnosticsCollectionSchema: z.ZodObject<{
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
export type DiagnosticsCollection = z.infer<typeof DiagnosticsCollectionSchema>;
export declare const validateDiagnosticsCollection: (input: unknown) => Result<any, ValidationError>;
export declare const createDiagnostic: (input: Omit<Diagnostic, "message" | "remediationHint"> & {
    message: string;
    remediationHint?: string;
}) => Diagnostic;
//# sourceMappingURL=diagnostics.d.ts.map