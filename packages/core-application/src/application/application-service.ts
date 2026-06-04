import { createDiagnostic, type ArtifactStoragePort, type ClockPort, type FileSystemPort, type PortError, type RandomnessPort, type ReportExporterPort, type Result, err, ok } from '@spa-bridge/core-model';
import { createSafeDisplayString } from '@spa-bridge/core-model';

import { ConfigPipeline } from '../config/config.js';
import { StructuredEventPublisher } from '../events/events.js';
import { ManifestStateMachine, RunStatusReader, type RunWorkspaceManifest } from '../run/run.js';
import { PathGuard, RunWorkspaceManager } from '../workspace/workspace.js';
import { PolicyGate } from '../policy/policy.js';
import { ReportHandoff } from '../report/report.js';
import { ResumePlanner } from '../resume/resume.js';
import { WorkflowCoordinator, type WorkflowStepDefinition, type WorkflowExecutionResult } from '../workflow/workflow.js';
import type {
  ApplicationError,
  ExportReportRequest,
  GetRunStatusRequest,
  ResumeRunRequest,
  ResolvedConversionConfig,
  StartConversionRequest,
} from '../types.js';
import { validateRunWorkspaceManifest } from '../run/run.js';

import type { Diagnostic } from '@spa-bridge/core-model';
import type { ConversionReport, GeneratedArtifactRef, TraceabilityMap } from '@spa-bridge/core-model';
import { validateTraceabilityMap } from '@spa-bridge/core-model';

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

export class ConversionApplicationService {
  private readonly configPipeline = new ConfigPipeline();
  private readonly pathGuard = new PathGuard();
  private readonly workspaceManager = new RunWorkspaceManager(this.pathGuard);
  private readonly manifestMachine = new ManifestStateMachine();
  private readonly policyGate = new PolicyGate();
  private readonly eventPublisher: StructuredEventPublisher;
  private readonly reportHandoff: ReportHandoff;
  private readonly resumePlanner = new ResumePlanner();
  private readonly statusReader: RunStatusReader;

  constructor(private readonly dependencies: ConversionApplicationDependencies) {
    this.eventPublisher = new StructuredEventPublisher(dependencies.logger, dependencies.audit);
    this.reportHandoff = new ReportHandoff(dependencies.reportExporter);
    this.statusReader = new RunStatusReader(
      dependencies.fileSystem,
      (projectRoot, runId) => {
        const derived = this.pathGuard.deriveRunWorkspace(projectRoot, runId);
        return derived.ok ? ok(derived.value.manifestPath) : derived;
      },
    );
  }

  async startConversion(
    request: StartConversionRequest,
    workflowSteps: WorkflowStepDefinition[] = [],
  ): Promise<Result<StartConversionResponse, ApplicationError>> {
    const runId = request.runId ?? this.createRunId();
    const nowResult = this.dependencies.clock.now();
    const initializedAt = nowResult.ok ? nowResult.value.toISOString() : new Date().toISOString();
    const configResult = this.configPipeline.resolve({
      projectRoot: request.projectRoot,
      inputPath: request.inputPath,
      rawProjectConfig: request.projectConfig,
      overrides: {
        ...request.overrides,
        outputPath: request.outputPath ?? request.overrides?.outputPath,
      },
    });

    if (!configResult.ok) {
      return err({
        code: 'VALIDATION_FAILED',
        message: 'Unable to resolve conversion config.',
        cause: configResult.error,
      });
    }

    const workspaceResult = this.workspaceManager.derive(
      request.projectRoot,
      runId,
      initializedAt,
    );
    if (!workspaceResult.ok) {
      return workspaceResult;
    }

    const startedAt = workspaceResult.value.initializedAt;
    const manifest = this.manifestMachine.createRunningManifest({
      runId,
      projectRoot: request.projectRoot,
      inputPath: request.inputPath,
      outputPath: configResult.value.config.outputPath,
      startedAt,
    });

    await this.dependencies.fileSystem.writeText(workspaceResult.value.manifestPath, JSON.stringify(manifest, null, 2));
    await this.dependencies.fileSystem.writeText(
      workspaceResult.value.resolvedConfigPath,
      JSON.stringify(configResult.value.config, null, 2),
    );

    const execution = workflowSteps.length
      ? await this.executeWorkflow(manifest, configResult.value.config, workflowSteps, runId)
      : ok({ manifest, completedStepIds: [] } satisfies WorkflowExecutionResult);

    if (!execution.ok) {
      const failedManifest = this.manifestMachine.finalizeFailed(manifest, execution.error.message);
      await this.dependencies.fileSystem.writeText(workspaceResult.value.manifestPath, JSON.stringify(failedManifest, null, 2));
      return err(execution.error);
    }

    const finalManifest = execution.value.manifest;
    await this.dependencies.fileSystem.writeText(workspaceResult.value.manifestPath, JSON.stringify(finalManifest, null, 2));

    return ok({
      runId,
      workspace: workspaceResult.value,
      config: configResult.value.config,
      manifest: finalManifest,
      diagnostics: configResult.value.diagnostics,
    });
  }

  async getRunStatus(request: GetRunStatusRequest) {
    return this.statusReader.read(request.projectRoot, request.runId);
  }

  async resumeRun(
    request: ResumeRunRequest,
    workflowSteps: WorkflowStepDefinition[] = [],
  ): Promise<Result<ResumeRunResponse, ApplicationError>> {
    const workspaceResult = this.pathGuard.deriveRunWorkspace(request.projectRoot, request.runId);
    if (!workspaceResult.ok) {
      return workspaceResult;
    }

    const manifestResult = await this.dependencies.fileSystem.readText(workspaceResult.value.manifestPath);
    if (!manifestResult.ok) {
      return err({
        code: 'NOT_FOUND',
        message: manifestResult.error.message,
        cause: manifestResult.error,
      });
    }

    const parsedManifest = validateRunWorkspaceManifest(JSON.parse(manifestResult.value));
    if (!parsedManifest.ok) {
      return err({
        code: 'VALIDATION_FAILED',
        message: 'Stored manifest is invalid.',
        cause: parsedManifest.error,
      });
    }

    const resumePlanResult = this.resumePlanner.plan(
      parsedManifest.value,
      workflowSteps.map((step) => step.id),
    );
    if (!resumePlanResult.ok) {
      return resumePlanResult;
    }

    return ok({
      runId: request.runId,
      workspaceRoot: workspaceResult.value.runRoot,
      resumePlan: resumePlanResult.value,
    });
  }

  async exportReport(request: ExportReportRequest): Promise<Result<ExportReportResponse, ApplicationError>> {
    const workspaceResult = this.pathGuard.deriveRunWorkspace(request.projectRoot, request.runId);
    if (!workspaceResult.ok) {
      return workspaceResult;
    }

    const manifestResult = await this.dependencies.fileSystem.readText(workspaceResult.value.manifestPath);
    if (!manifestResult.ok) {
      return err({
        code: 'NOT_FOUND',
        message: manifestResult.error.message,
        cause: manifestResult.error,
      });
    }

    const parsedManifest = validateRunWorkspaceManifest(JSON.parse(manifestResult.value));
    if (!parsedManifest.ok) {
      return err({
        code: 'VALIDATION_FAILED',
        message: 'Stored manifest is invalid.',
        cause: parsedManifest.error,
      });
    }

    const emptyDiagnostics = {
      schemaVersion: 1,
      diagnostics: [],
    };
    const emptyTraceability = validateTraceabilityMap({
      schemaVersion: 1,
      traceLinks: [],
    }).ok
      ? { schemaVersion: 1, traceLinks: [] }
      : { schemaVersion: 1, traceLinks: [] };

    const report = this.reportHandoff.buildSnapshot({
      manifest: parsedManifest.value,
      diagnostics: emptyDiagnostics,
      traceabilityMap: emptyTraceability as TraceabilityMap,
    });
    const exportResult = await this.reportHandoff.export(report, request.format);
    if (!exportResult.ok) {
      return exportResult;
    }

    const reportPath = `${workspaceResult.value.reportsDir}/report.${request.format}`;
    await this.dependencies.fileSystem.writeText(reportPath, exportResult.value);
    return ok({
      runId: request.runId,
      reportPath,
      exportedArtifact: exportResult.value,
    });
  }

  private async executeWorkflow(
    manifest: RunWorkspaceManifest,
    config: ResolvedConversionConfig,
    workflowSteps: WorkflowStepDefinition[],
    runId: string,
  ) {
    const coordinator = new WorkflowCoordinator(this.manifestMachine, this.policyGate, this.eventPublisher);
    return coordinator.execute(manifest, config, workflowSteps, runId);
  }

  private createRunId(): string {
    const nowResult = this.dependencies.clock.now();
    const now = nowResult.ok ? nowResult.value.getTime().toString(36) : Date.now().toString(36);
    const entropy = this.dependencies.randomness.nextBytes(4);
    const entropyHex = entropy.ok
      ? Array.from(entropy.value, (byte: number) => byte.toString(16).padStart(2, '0')).join('')
      : '00000000';
    return `run-${now}-${entropyHex}`;
  }
}
