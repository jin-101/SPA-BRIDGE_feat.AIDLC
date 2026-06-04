import { describe, expect, test } from 'vitest';
import fc from 'fast-check';

import {
  createMigrationRegistry,
  createRedactedString,
  createSafeDisplayString,
  err,
  isErr,
  isOk,
  ok,
  type PortError,
  type Result,
  type SourceRef,
  type ValidationError,
  coreModelArbitraries,
  createDiagnostic,
  createMaskToken,
  buildTraceabilityIndexes,
  validateConversionReport,
  validateDiagnosticsCollection,
  validateIntermediateRepresentation,
  validateMaskTokenMap,
  validateRunManifest,
  validateSchema,
  validateTraceabilityMap,
  type IntermediateRepresentation,
  IntermediateRepresentationSchema,
  DiagnosticsCollectionSchema,
  MaskTokenMapSchema,
  RunManifestSchema,
  TraceabilityMapSchema,
  AngularSourceModelBoundarySchema,
  ConversionReportSchema,
  DiagnosticSchema,
  MaskTokenSchema,
  createValidationError,
  type SchemaVersioned,
  type MigrationStep,
  type PortErrorCode,
} from '../src/index.js';
import { FileSystemPort, type AuditPort, type ClockPort, type LlmProviderPort, type LoggerPort, type RandomnessPort, type ReportExporterPort, type ToolRunnerPort } from '../src/ports/ports.js';
import { ok as resultOk } from '../src/result/result.js';
import { createSafeDisplayString as safeString } from '../src/redaction/redaction.js';

describe('core model schemas', () => {
  test('IR schema round-trips through JSON', () => {
    fc.assert(
      fc.property(coreModelArbitraries.component, (component) => {
        const input: IntermediateRepresentation = {
          schemaVersion: 1,
          projectName: 'spa-bridge',
          components: [component],
          templates: [],
          routes: [],
          services: [],
          stateModels: [],
          dependencies: [],
          traceLinks: [],
          notes: [safeString('ready')],
        };

        const parsed = IntermediateRepresentationSchema.parse(JSON.parse(JSON.stringify(input)));
        expect(parsed).toEqual(input);
      }),
    );
  });

  test('traceability and diagnostics preserve canonical shape', () => {
    fc.assert(
      fc.property(coreModelArbitraries.traceabilityMap, coreModelArbitraries.diagnostic, (traceabilityMap, diagnostic) => {
        expect(validateTraceabilityMap(traceabilityMap).ok).toBe(true);
        expect(validateDiagnosticsCollection({
          schemaVersion: 1,
          diagnostics: [diagnostic],
        }).ok).toBe(true);
      }),
    );
  });

  test('diagnostics round-trip through JSON without losing severity', () => {
    fc.assert(
      fc.property(coreModelArbitraries.diagnostic, (diagnostic) => {
        const parsed = DiagnosticSchema.parse(JSON.parse(JSON.stringify(diagnostic)));
        expect(parsed).toEqual(diagnostic);
      }),
    );
  });

  test('traceability indexes preserve link membership', () => {
    fc.assert(
      fc.property(coreModelArbitraries.traceabilityMap, (traceabilityMap) => {
        const indexes = buildTraceabilityIndexes(traceabilityMap);
        const countedLinks = Array.from(indexes.bySourcePath.values()).flat();

        expect(countedLinks).toHaveLength(traceabilityMap.traceLinks.length);
        for (const [sourcePath, links] of indexes.bySourcePath.entries()) {
          for (const link of links) {
            expect(link.source.path).toBe(sourcePath);
          }
        }
      }),
    );
  });

  test('report and manifest schemas round-trip through JSON', () => {
    fc.assert(
      fc.property(coreModelArbitraries.report, (report) => {
        const parsed = ConversionReportSchema.parse(JSON.parse(JSON.stringify(report)));
        expect(parsed).toEqual(report);
      }),
    );
  });

  test('mask token map schema round-trips', () => {
    fc.assert(
      fc.property(coreModelArbitraries.maskTokenMap, (maskTokenMap) => {
        const parsed = MaskTokenMapSchema.parse(JSON.parse(JSON.stringify(maskTokenMap)));
        expect(parsed).toEqual(maskTokenMap);
      }),
    );
  });

  test('Angular source boundary schema round-trips', () => {
    fc.assert(
      fc.property(coreModelArbitraries.sourceModelBoundary, (boundary) => {
        const parsed = AngularSourceModelBoundarySchema.parse(JSON.parse(JSON.stringify(boundary)));
        expect(parsed).toEqual(boundary);
      }),
    );
  });
});

describe('result helpers', () => {
  test('ok and err helpers discriminate correctly', () => {
    const success = ok('done');
    const failure = err(new Error('boom'));

    expect(isOk(success)).toBe(true);
    expect(isErr(success)).toBe(false);
    expect(isOk(failure)).toBe(false);
    expect(isErr(failure)).toBe(true);
  });
});

describe('migration registry', () => {
  type SampleArtifact = SchemaVersioned & {
    value: string;
  };

  const step: MigrationStep<SampleArtifact> = {
    fromVersion: 1,
    toVersion: 2,
    migrate: (artifact) =>
      resultOk({
        ...artifact,
        schemaVersion: 2,
        value: `${artifact.value}-migrated`,
      }),
  };

  test('migrates to the latest version', () => {
    const registry = createMigrationRegistry<SampleArtifact>(2);
    const upgraded = registry
      .register(step)
      .migrate({
        schemaVersion: 1,
        value: 'sample',
      });

    expect(upgraded.ok).toBe(true);
    if (upgraded.ok) {
      expect(upgraded.value).toEqual({
        schemaVersion: 2,
        value: 'sample-migrated',
      });
    }
  });
});

describe('port contracts and redaction helpers', () => {
  test('createDiagnostic canonicalizes display text', () => {
    const diagnostic = createDiagnostic({
      code: 'MAPPING-01',
      severity: 'warning',
      message: '  needs   review  ',
      sourceRefs: [],
      generatedRefs: [],
      tags: ['mapping'],
      remediationHint: '  trim    and normalize  ',
    });

    expect(diagnostic.message).toBe('needs review');
    expect(diagnostic.remediationHint).toBe('trim and normalize');
  });

  test('createMaskToken canonicalizes token display fields', () => {
    const maskToken = createMaskToken({
      token: '  token-1  ',
      category: 'api-key',
      originalLength: 12,
      restorable: true,
      restorationHint: '  restore   later ',
    });

    expect(maskToken.token).toBe('token-1');
    expect(maskToken.restorationHint).toBe('restore later');
  });

  test('redacted and safe display strings are canonicalized', () => {
    expect(createRedactedString()).toBe('[REDACTED]');
    expect(createRedactedString('token')).toBe('[REDACTED]:token');
    expect(createSafeDisplayString('  hello   world  ')).toBe('hello world');
  });

  test('ports can be typed against Result contracts', async () => {
    const fileSystem: FileSystemPort = {
      readText: async () => resultOk('content'),
      writeText: async () => resultOk(undefined),
      exists: async () => resultOk(true),
      list: async () => resultOk(['a.ts']),
    };

    const logger: LoggerPort = {
      debug: () => resultOk(undefined),
      info: () => resultOk(undefined),
      warn: () => resultOk(undefined),
      error: () => resultOk(undefined),
    };

    const audit: AuditPort = {
      record: () => resultOk(undefined),
    };

    const clock: ClockPort = {
      now: () => resultOk(new Date('2026-06-04T00:00:00.000Z')),
    };

    const randomness: RandomnessPort = {
      next: () => resultOk(0.5),
      nextBytes: () => resultOk(new Uint8Array([1, 2, 3])),
    };

    const toolRunner: ToolRunnerPort = {
      run: async () => resultOk({ exitCode: 0, stdout: 'ok', stderr: '' }),
    };

    const llm: LlmProviderPort = {
      generate: async () => resultOk({ text: 'response', tokensUsed: 1 }),
    };

    const exporter: ReportExporterPort = {
      exportReport: async () => resultOk('{}'),
    };

    const read = await fileSystem.readText('/tmp/input.txt');
    const generated = await llm.generate({ provider: 'local', prompt: 'hello' });
    const exported = await exporter.exportReport({}, 'json');

    expect(read.ok && read.value).toBe('content');
    expect(generated.ok && generated.value.text).toBe('response');
    expect(exported.ok && exported.value).toBe('{}');
    expect(logger.info('hello').ok).toBe(true);
    expect(audit.record({ eventType: 'test', payload: {} }).ok).toBe(true);
    expect(clock.now().ok).toBe(true);
    expect(randomness.next().ok).toBe(true);
    expect((await toolRunner.run({ command: 'echo', args: ['ok'] })).ok).toBe(true);
  });
});
