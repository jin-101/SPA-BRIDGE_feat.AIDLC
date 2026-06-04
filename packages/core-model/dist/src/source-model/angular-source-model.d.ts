import { z } from 'zod';
export declare const AngularSourceModelRefSchema: z.ZodObject<{
    projectPath: z.ZodString;
    entryFile: z.ZodString;
    projectKind: z.ZodEnum<["application", "library", "workspace"]>;
}, "strip", z.ZodTypeAny, {
    projectPath: string;
    entryFile: string;
    projectKind: "application" | "library" | "workspace";
}, {
    projectPath: string;
    entryFile: string;
    projectKind: "application" | "library" | "workspace";
}>;
export type AngularSourceModelRef = z.infer<typeof AngularSourceModelRefSchema>;
export declare const AngularSourceModelBoundarySchema: z.ZodObject<{
    schemaVersion: z.ZodNumber;
    sourceModelRef: z.ZodObject<{
        projectPath: z.ZodString;
        entryFile: z.ZodString;
        projectKind: z.ZodEnum<["application", "library", "workspace"]>;
    }, "strip", z.ZodTypeAny, {
        projectPath: string;
        entryFile: string;
        projectKind: "application" | "library" | "workspace";
    }, {
        projectPath: string;
        entryFile: string;
        projectKind: "application" | "library" | "workspace";
    }>;
    entryPoints: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    notes: z.ZodDefault<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, "many">>;
}, "strip", z.ZodTypeAny, {
    notes: string[];
    schemaVersion: number;
    sourceModelRef: {
        projectPath: string;
        entryFile: string;
        projectKind: "application" | "library" | "workspace";
    };
    entryPoints: string[];
}, {
    schemaVersion: number;
    sourceModelRef: {
        projectPath: string;
        entryFile: string;
        projectKind: "application" | "library" | "workspace";
    };
    notes?: string[] | undefined;
    entryPoints?: string[] | undefined;
}>;
export type AngularSourceModelBoundary = z.infer<typeof AngularSourceModelBoundarySchema>;
//# sourceMappingURL=angular-source-model.d.ts.map