import { type ArtifactStoragePort, type ClockPort, type FileSystemPort, type RandomnessPort, type ReportExporterPort, type Result } from '@spa-bridge/core-model';
import { type RunWorkspaceManifest } from '../run/run.js';
import { RunWorkspaceManager } from '../workspace/workspace.js';
import { ResumePlanner } from '../resume/resume.js';
import { type WorkflowStepDefinition } from '../workflow/workflow.js';
import type { ApplicationError, ExportReportRequest, GetRunStatusRequest, ResumeRunRequest, ResolvedConversionConfig, StartConversionRequest } from '../types.js';
import type { Diagnostic } from '@spa-bridge/core-model';
export type ConversionApplicationDependencies = {
    fileSystem: FileSystemPort;
    artifactStorage: ArtifactStoragePort;
    reportExporter: ReportExporterPort;
    clock: ClockPort;
    randomness: RandomnessPort;
    logger: import('@spa-bridge/core-model').LoggerPort;
    audit: import('@spa-bridge/core-model').AuditPort;
};
export type StartConversionResponse = {
    runId: string;
    workspace: ReturnType<RunWorkspaceManager['derive']> extends Result<infer T, infer _> ? T : never;
    config: ResolvedConversionConfig;
    manifest: RunWorkspaceManifest;
    diagnostics: Diagnostic[];
};
export type ResumeRunResponse = {
    runId: string;
    workspaceRoot: string;
    resumePlan: ReturnType<ResumePlanner['plan']> extends Result<infer T, infer _> ? T : never;
};
export type ExportReportResponse = {
    runId: string;
    reportPath: string;
    exportedArtifact: string;
};
export declare class ConversionApplicationService {
    private readonly dependencies;
    private readonly configPipeline;
    private readonly pathGuard;
    private readonly workspaceManager;
    private readonly manifestMachine;
    private readonly policyGate;
    private readonly eventPublisher;
    private readonly reportHandoff;
    private readonly resumePlanner;
    private readonly statusReader;
    constructor(dependencies: ConversionApplicationDependencies);
    startConversion(request: StartConversionRequest, workflowSteps?: WorkflowStepDefinition[]): Promise<Result<StartConversionResponse, ApplicationError>>;
    getRunStatus(request: GetRunStatusRequest): Promise<Result<import("../run/run.js").RunStatusSnapshot, ApplicationError>>;
    resumeRun(request: ResumeRunRequest, workflowSteps?: WorkflowStepDefinition[]): Promise<Result<ResumeRunResponse, ApplicationError>>;
    exportReport(request: ExportReportRequest): Promise<Result<ExportReportResponse, ApplicationError>>;
    private executeWorkflow;
    private createRunId;
}
//# sourceMappingURL=application-service.d.ts.map