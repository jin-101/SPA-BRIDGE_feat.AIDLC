import { z } from 'zod';
import { type Diagnostic } from '@spa-bridge/core-model';
import { type Result } from '@spa-bridge/core-model';
import { type ValidationError } from '@spa-bridge/core-model';
import { type ConversionOverrides, type RawProjectConfig, type ResolvedConversionConfig } from '../types.js';
export declare const ResolvedConversionConfigSchema: z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    projectRoot: z.ZodString;
    inputPath: z.ZodString;
    outputPath: z.ZodString;
    targetStrategy: z.ZodEnum<["vite-react-typescript", "user-selected", "custom"]>;
    providerMode: z.ZodEnum<["local-first", "external-only", "auto"]>;
    reportFormats: z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">;
    preservePartialArtifacts: z.ZodBoolean;
    manualReviewEnabled: z.ZodBoolean;
    quality: z.ZodObject<{
        typecheck: z.ZodDefault<z.ZodBoolean>;
        lint: z.ZodDefault<z.ZodBoolean>;
        format: z.ZodDefault<z.ZodBoolean>;
        build: z.ZodDefault<z.ZodBoolean>;
        unitTests: z.ZodDefault<z.ZodBoolean>;
        propertyTests: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        typecheck: boolean;
        lint: boolean;
        format: boolean;
        build: boolean;
        unitTests: boolean;
        propertyTests: boolean;
    }, {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    targetStrategy: "vite-react-typescript" | "user-selected" | "custom";
    providerMode: "local-first" | "external-only" | "auto";
    outputPath: string;
    reportFormats: ("json" | "markdown" | "html")[];
    preservePartialArtifacts: boolean;
    manualReviewEnabled: boolean;
    quality: {
        typecheck: boolean;
        lint: boolean;
        format: boolean;
        build: boolean;
        unitTests: boolean;
        propertyTests: boolean;
    };
    schemaVersion: 1;
    projectRoot: string;
    inputPath: string;
}, {
    targetStrategy: "vite-react-typescript" | "user-selected" | "custom";
    providerMode: "local-first" | "external-only" | "auto";
    outputPath: string;
    reportFormats: ("json" | "markdown" | "html")[];
    preservePartialArtifacts: boolean;
    manualReviewEnabled: boolean;
    quality: {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    };
    schemaVersion: 1;
    projectRoot: string;
    inputPath: string;
}>;
export type ResolvedConfigResult = {
    config: ResolvedConversionConfig;
    diagnostics: Diagnostic[];
};
export declare const validateRawProjectConfig: (input: unknown) => Result<RawProjectConfig, ValidationError>;
export declare const validateOverrides: (input: unknown) => Result<ConversionOverrides, ValidationError>;
export declare class ConfigPipeline {
    resolve(input: {
        projectRoot: string;
        inputPath: string;
        rawProjectConfig?: unknown;
        overrides?: unknown;
    }): Result<ResolvedConfigResult, ValidationError>;
}
//# sourceMappingURL=config.d.ts.map