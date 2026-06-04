import { z } from 'zod';
import type { ReportFormat } from '@spa-bridge/core-model';
export declare const ProviderModeSchema: z.ZodEnum<["local-first", "external-only", "auto"]>;
export type ProviderMode = z.infer<typeof ProviderModeSchema>;
export declare const TargetStrategySchema: z.ZodEnum<["vite-react-typescript", "user-selected", "custom"]>;
export type TargetStrategy = z.infer<typeof TargetStrategySchema>;
export declare const ReportFormatSchema: z.ZodEnum<["json", "markdown", "html"]>;
export type AppReportFormat = z.infer<typeof ReportFormatSchema>;
export declare const QualityOptionsSchema: z.ZodObject<{
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
export type QualityOptions = z.infer<typeof QualityOptionsSchema>;
export declare const RawProjectConfigSchema: z.ZodObject<{
    targetStrategy: z.ZodOptional<z.ZodEnum<["vite-react-typescript", "user-selected", "custom"]>>;
    providerMode: z.ZodOptional<z.ZodEnum<["local-first", "external-only", "auto"]>>;
    outputPath: z.ZodOptional<z.ZodString>;
    reportFormats: z.ZodOptional<z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">>;
    preservePartialArtifacts: z.ZodOptional<z.ZodBoolean>;
    manualReviewEnabled: z.ZodOptional<z.ZodBoolean>;
    quality: z.ZodOptional<z.ZodObject<{
        typecheck: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        lint: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        format: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        build: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        unitTests: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        propertyTests: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    }, {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    }>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    targetStrategy: z.ZodOptional<z.ZodEnum<["vite-react-typescript", "user-selected", "custom"]>>;
    providerMode: z.ZodOptional<z.ZodEnum<["local-first", "external-only", "auto"]>>;
    outputPath: z.ZodOptional<z.ZodString>;
    reportFormats: z.ZodOptional<z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">>;
    preservePartialArtifacts: z.ZodOptional<z.ZodBoolean>;
    manualReviewEnabled: z.ZodOptional<z.ZodBoolean>;
    quality: z.ZodOptional<z.ZodObject<{
        typecheck: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        lint: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        format: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        build: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        unitTests: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        propertyTests: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    }, {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    }>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    targetStrategy: z.ZodOptional<z.ZodEnum<["vite-react-typescript", "user-selected", "custom"]>>;
    providerMode: z.ZodOptional<z.ZodEnum<["local-first", "external-only", "auto"]>>;
    outputPath: z.ZodOptional<z.ZodString>;
    reportFormats: z.ZodOptional<z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">>;
    preservePartialArtifacts: z.ZodOptional<z.ZodBoolean>;
    manualReviewEnabled: z.ZodOptional<z.ZodBoolean>;
    quality: z.ZodOptional<z.ZodObject<{
        typecheck: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        lint: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        format: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        build: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        unitTests: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        propertyTests: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    }, {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    }>>;
}, z.ZodTypeAny, "passthrough">>;
export type RawProjectConfig = z.infer<typeof RawProjectConfigSchema>;
export declare const ConversionOverridesSchema: z.ZodObject<{
    targetStrategy: z.ZodOptional<z.ZodEnum<["vite-react-typescript", "user-selected", "custom"]>>;
    providerMode: z.ZodOptional<z.ZodEnum<["local-first", "external-only", "auto"]>>;
    outputPath: z.ZodOptional<z.ZodString>;
    reportFormats: z.ZodOptional<z.ZodArray<z.ZodEnum<["json", "markdown", "html"]>, "many">>;
    preservePartialArtifacts: z.ZodOptional<z.ZodBoolean>;
    manualReviewEnabled: z.ZodOptional<z.ZodBoolean>;
    quality: z.ZodOptional<z.ZodObject<{
        typecheck: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        lint: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        format: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        build: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        unitTests: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        propertyTests: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    }, {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    targetStrategy?: "vite-react-typescript" | "user-selected" | "custom" | undefined;
    providerMode?: "local-first" | "external-only" | "auto" | undefined;
    outputPath?: string | undefined;
    reportFormats?: ("json" | "markdown" | "html")[] | undefined;
    preservePartialArtifacts?: boolean | undefined;
    manualReviewEnabled?: boolean | undefined;
    quality?: {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    } | undefined;
}, {
    targetStrategy?: "vite-react-typescript" | "user-selected" | "custom" | undefined;
    providerMode?: "local-first" | "external-only" | "auto" | undefined;
    outputPath?: string | undefined;
    reportFormats?: ("json" | "markdown" | "html")[] | undefined;
    preservePartialArtifacts?: boolean | undefined;
    manualReviewEnabled?: boolean | undefined;
    quality?: {
        typecheck?: boolean | undefined;
        lint?: boolean | undefined;
        format?: boolean | undefined;
        build?: boolean | undefined;
        unitTests?: boolean | undefined;
        propertyTests?: boolean | undefined;
    } | undefined;
}>;
export type ConversionOverrides = z.infer<typeof ConversionOverridesSchema>;
export type ResolvedConversionConfig = {
    schemaVersion: number;
    projectRoot: string;
    inputPath: string;
    outputPath: string;
    targetStrategy: TargetStrategy;
    providerMode: ProviderMode;
    reportFormats: ReportFormat[];
    preservePartialArtifacts: boolean;
    manualReviewEnabled: boolean;
    quality: QualityOptions;
};
export type ApplicationErrorCode = 'VALIDATION_FAILED' | 'PATH_INVALID' | 'PORT_ERROR' | 'WORKFLOW_FAILED' | 'NOT_FOUND' | 'RESUME_NOT_POSSIBLE' | 'POLICY_BLOCKED';
export type ApplicationError = {
    code: ApplicationErrorCode;
    message: string;
    cause?: unknown;
};
export type StartConversionRequest = {
    projectRoot: string;
    inputPath: string;
    projectConfig?: RawProjectConfig;
    overrides?: ConversionOverrides;
    runId?: string;
    outputPath?: string;
};
export type GetRunStatusRequest = {
    projectRoot: string;
    runId: string;
};
export type ResumeRunRequest = {
    projectRoot: string;
    runId: string;
};
export type ExportReportRequest = {
    projectRoot: string;
    runId: string;
    format: ReportFormat;
};
//# sourceMappingURL=types.d.ts.map