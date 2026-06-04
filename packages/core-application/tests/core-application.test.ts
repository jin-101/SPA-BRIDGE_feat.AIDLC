import { describe, expect, it } from 'vitest';

import { createDiagnostic, type Diagnostic, type ManualReviewItem } from '@spa-bridge/core-model';

import {
  ConfigPipeline,
  ConversionApplicationService,
  FixedClock,
  FixedRandomness,
  InMemoryAudit,
  InMemoryFileSystem,
  InMemoryLogger,
  InMemoryReportExporter,
  ManifestStateMachine,
  PathGuard,
  PolicyGate,
  ReportHandoff,
  ResumePlanner,
  RunStatusReader,
  RunWorkspaceManager,
  StructuredEventPublisher,
  type WorkflowStepDefinition,
  validateRunWorkspaceManifest,
} from '@spa-bridge/core-application';
import { createSafeDisplayString, type TraceabilityMap } from '@spa-bridge/core-model';

describe('ConfigPipeline', () => {
  it('prefers overrides over project config', () => {
    const pipeline = new ConfigPipeline();
    const result = pipeline.resolve({
      projectRoot: '/repo',
      inputPath: '/repo/app',
      rawProjectConfig: {
        targetStrategy: 'custom',
        providerMode: 'external-only',
        outputPath: './project-out',
        reportFormats: ['json'],
        quality: { propertyTests: true },
      },
      overrides: {
        targetStrategy: 'vite-react-typescript',
        reportFormats: ['markdown', 'html'],
        quality: { build: false },
      },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.config.targetStrategy).toBe('vite-react-typescript');
    expect(result.value.config.providerMode).toBe('external-only');
    expect(result.value.config.reportFormats).toEqual(['markdown', 'html']);
    expect(result.value.config.quality.propertyTests).toBe(true);
    expect(result.value.config.quality.build).toBe(false);
  });
});

describe('PathGuard and RunWorkspaceManager', () => {
  it('derives deterministic workspace paths and blocks traversal', () => {
    const guard = new PathGuard();
    const derived = guard.deriveRunWorkspace('/repo', 'run-123');

    expect(derived.ok).toBe(true);
    if (!derived.ok) {
      return;
    }

    expect(derived.value.runRoot).toBe('/repo/.spa-bridge/runs/run-123');
    expect(guard.deriveRunWorkspace('/repo', '../escape').ok).toBe(false);
  });
});

describe('ManifestStateMachine', () => {
  it('supports valid transitions and rejects completed mutation', () => {
    const machine = new ManifestStateMachine();
    const manifest = machine.createRunningManifest({
      runId: 'run-1',
      projectRoot: '/repo',
      inputPath: '/repo/app',
      outputPath: '/repo/out',
      startedAt: '2026-06-04T00:00:00.000Z',
    });

    const checkpoint = machine.recordCheckpoint(manifest, {
      id: 'checkpoint-1',
      stepId: 'scan',
      artifactRefs: [],
      completedAt: '2026-06-04T00:01:00.000Z',
    });
    expect(checkpoint.ok).toBe(true);
    if (!checkpoint.ok) {
      return;
    }

    const completed = machine.finalizeCompleted(checkpoint.value);
    expect(completed.status).toBe('completed');
    expect(machine.recordCheckpoint(completed, { id: 'late', stepId: 'late', artifactRefs: [] }).ok).toBe(false);
  });
});

describe('PolicyGate', () => {
  it('fails closed when policy state is unclear', () => {
    const gate = new PolicyGate();
    const decision = gate.evaluate({
      providerMode: 'auto',
      externalProviderRequested: true,
      maskingReady: false,
      policyKnown: false,
      sensitiveDataPresent: true,
    });

    expect(decision.ok).toBe(true);
    if (!decision.ok) {
      return;
    }

    expect(decision.value.decision).toBe('block');
  });
});

describe('RunStatusReader and ResumePlanner', () => {
  it('reads manifest status and builds a resume plan from the last checkpoint', async () => {
    const fileSystem = new InMemoryFileSystem();
    const guard = new PathGuard();
    const manager = new RunWorkspaceManager(guard);
    const manifestMachine = new ManifestStateMachine();
    const workspace = manager.derive('/repo', 'run-1', '2026-06-04T00:00:00.000Z');
    expect(workspace.ok).toBe(true);
    if (!workspace.ok) {
      return;
    }

    const manifest = manifestMachine.finalizeFailed(
      manifestMachine.recordCheckpoint(
        manifestMachine.createRunningManifest({
          runId: 'run-1',
          projectRoot: '/repo',
          inputPath: '/repo/app',
          outputPath: '/repo/out',
          startedAt: '2026-06-04T00:00:00.000Z',
        }),
        { id: 'checkpoint-1', stepId: 'scan', artifactRefs: [], completedAt: '2026-06-04T00:01:00.000Z' },
      ).value,
      'boom',
    );

    await fileSystem.writeText(workspace.value.manifestPath, JSON.stringify(manifest));

    const reader = new RunStatusReader(fileSystem, (projectRoot, runId) => {
      const derived = guard.deriveRunWorkspace(projectRoot, runId);
      return derived.ok ? { ok: true, value: derived.value.manifestPath } : derived;
    });
    const status = await reader.read('/repo', 'run-1');
    expect(status.ok).toBe(true);
    if (!status.ok) {
      return;
    }
    expect(status.value.status).toBe('failed');
    expect(status.value.checkpointCount).toBe(1);

    const planner = new ResumePlanner();
    const plan = planner.plan(manifest, ['scan', 'transform', 'render']);
    expect(plan.ok).toBe(true);
    if (!plan.ok) {
      return;
    }
    expect(plan.value.recoverable).toBe(true);
    expect(plan.value.nextStepIndex).toBe(1);
  });
});

describe('ConversionApplicationService', () => {
  it('starts a run, persists workspace artifacts, and exports a report', async () => {
    const fileSystem = new InMemoryFileSystem();
    const reportExporter = new InMemoryReportExporter();
    const logger = new InMemoryLogger();
    const audit = new InMemoryAudit();
    const service = new ConversionApplicationService({
      fileSystem,
      artifactStorage: {
        saveArtifact: async () => ({ ok: true, value: undefined }),
        loadArtifact: async () => ({ ok: true, value: undefined }),
        listArtifacts: async () => ({ ok: true, value: [] }),
      },
      reportExporter,
      clock: new FixedClock(),
      randomness: new FixedRandomness(),
      logger,
      audit,
    });

    const steps: WorkflowStepDefinition[] = [
      {
        id: 'scan',
        execute: async () => ({
          ok: true,
          value: {
            artifactRefs: [{ kind: 'generated', path: '/repo/out/scan.json' }],
            manualReviewItems: [{ id: 'review-1', title: createSafeDisplayString('Check mapping'), status: 'open' } satisfies ManualReviewItem],
            nextStatus: 'running',
          },
        }),
      },
      {
        id: 'render',
        execute: async () => ({
          ok: true,
          value: {
            artifactRefs: [{ kind: 'generated', path: '/repo/out/render.json' }],
            nextStatus: 'completed',
          },
        }),
      },
    ];

    const start = await service.startConversion(
      {
        projectRoot: '/repo',
        inputPath: '/repo/app',
        projectConfig: {
          providerMode: 'local-first',
          outputPath: '/repo/out',
        },
      },
      steps,
    );

    expect(start.ok).toBe(true);
    if (!start.ok) {
      return;
    }

    expect(start.value.manifest.status).toBe('completed');
    expect(fileSystem.files.has(start.value.workspace.manifestPath)).toBe(true);
    expect(fileSystem.files.has(start.value.workspace.resolvedConfigPath)).toBe(true);

    const exportResult = await service.exportReport({
      projectRoot: '/repo',
      runId: start.value.runId,
      format: 'markdown',
    });

    expect(exportResult.ok).toBe(true);
    if (!exportResult.ok) {
      return;
    }

    expect(reportExporter.exports).toHaveLength(1);
    expect(exportResult.value.exportedArtifact).toContain('markdown:1');
  });
});
