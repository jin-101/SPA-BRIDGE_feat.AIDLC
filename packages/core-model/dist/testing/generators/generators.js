import fc from 'fast-check';
import { createSafeDisplayString } from '../../redaction/redaction.js';
import { DiagnosticsCollectionSchema, DiagnosticSchema } from '../../diagnostics/diagnostics.js';
import { IrComponentSchema } from '../../ir/ir.js';
import { ConversionReportSchema } from '../../report/report.js';
import { MaskTokenMapSchema, MaskTokenSchema } from '../../masking/masking.js';
import { AngularSourceModelBoundarySchema, AngularSourceModelRefSchema } from '../../source-model/angular-source-model.js';
import { GeneratedArtifactRefSchema, IrRefSchema, SourceRefSchema, TraceLinkSchema, TraceabilityMapSchema, } from '../../traceability/traceability.js';
const safeString = fc
    .string({ minLength: 1, maxLength: 24 })
    .map((value) => createSafeDisplayString(value.replace(/\s+/g, ' ').trim()));
const isoDateString = fc.constant('2026-06-04T00:00:00.000Z');
const sourceRef = fc.record({
    kind: fc.constant('source'),
    path: fc
        .tuple(fc.string({ minLength: 1, maxLength: 8 }), fc.string({ minLength: 1, maxLength: 8 }))
        .map(([a, b]) => `${a}/${b}.ts`),
    symbol: fc.option(fc.string({ minLength: 1, maxLength: 12 }), { nil: undefined }),
    location: fc.option(fc.string({ minLength: 1, maxLength: 12 }), { nil: undefined }),
}).map((value) => SourceRefSchema.parse(value));
const angularSourceModelRef = fc
    .record({
    projectPath: fc.string({ minLength: 1, maxLength: 16 }),
    entryFile: fc.string({ minLength: 1, maxLength: 16 }),
    projectKind: fc.constantFrom('application', 'library', 'workspace'),
})
    .map((value) => AngularSourceModelRefSchema.parse(value));
const irRef = fc.record({
    kind: fc.constant('ir'),
    id: fc.string({ minLength: 1, maxLength: 16 }),
}).map((value) => IrRefSchema.parse(value));
const generatedRef = fc.record({
    kind: fc.constant('generated'),
    path: fc
        .tuple(fc.string({ minLength: 1, maxLength: 8 }), fc.string({ minLength: 1, maxLength: 8 }))
        .map(([a, b]) => `${a}/${b}.tsx`),
    segment: fc.option(fc.string({ minLength: 1, maxLength: 12 }), { nil: undefined }),
}).map((value) => GeneratedArtifactRefSchema.parse(value));
const traceLink = fc
    .record({
    id: fc.string({ minLength: 1, maxLength: 16 }),
    source: sourceRef,
    target: fc.oneof(irRef, generatedRef),
    relation: fc.constantFrom('maps-to', 'derived-from', 'emits', 'references'),
    confidence: fc.double({ min: 0, max: 1, noNaN: true, noDefaultInfinity: true }),
    notes: fc.option(safeString, { nil: undefined }),
})
    .map((value) => TraceLinkSchema.parse(value));
const diagnostic = fc
    .record({
    code: fc.string({ minLength: 1, maxLength: 16 }),
    severity: fc.constantFrom('info', 'warning', 'error', 'manual-review', 'security-blocker'),
    message: safeString,
    sourceRefs: fc.array(sourceRef, { maxLength: 3 }),
    generatedRefs: fc.array(generatedRef, { maxLength: 3 }),
    tags: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 3 }),
    remediationHint: fc.option(safeString, { nil: undefined }),
})
    .map((value) => DiagnosticSchema.parse(value));
const component = fc
    .record({
    id: fc.string({ minLength: 1, maxLength: 16 }),
    name: fc.string({ minLength: 1, maxLength: 16 }),
    selector: fc.option(fc.string({ minLength: 1, maxLength: 16 }), { nil: undefined }),
    templateRefs: fc.array(irRef, { maxLength: 3 }),
    inputs: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 3 }),
    outputs: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 3 }),
    lifecycleHooks: fc.array(fc.string({ minLength: 1, maxLength: 16 }), { maxLength: 4 }),
    dependencyRefs: fc.array(irRef, { maxLength: 3 }),
    sourceRefs: fc.array(sourceRef, { maxLength: 3 }),
    generatedRefs: fc.array(generatedRef, { maxLength: 3 }),
    extensionSlots: fc.dictionary(fc.string({ minLength: 1, maxLength: 8 }), fc.jsonValue(), { maxKeys: 3 }),
})
    .map((value) => IrComponentSchema.parse(value));
const traceabilityMap = fc
    .record({
    schemaVersion: fc.integer({ min: 1, max: 5 }),
    traceLinks: fc.array(traceLink, { maxLength: 5 }),
})
    .map((value) => TraceabilityMapSchema.parse(value));
const sourceModelBoundary = fc
    .record({
    schemaVersion: fc.integer({ min: 1, max: 5 }),
    sourceModelRef: angularSourceModelRef,
    entryPoints: fc.array(fc.string({ minLength: 1, maxLength: 12 }), { maxLength: 5 }),
    notes: fc.array(safeString, { maxLength: 5 }),
})
    .map((value) => AngularSourceModelBoundarySchema.parse(value));
const manifest = fc
    .record({
    schemaVersion: fc.integer({ min: 1, max: 5 }),
    runId: fc.string({ minLength: 1, maxLength: 16 }),
    projectRoot: fc.constant('/workspace/project'),
    inputPath: fc.constant('/workspace/input'),
    outputPath: fc.constant('/workspace/output'),
    status: fc.constantFrom('pending', 'running', 'completed', 'failed'),
    startedAt: isoDateString,
    updatedAt: isoDateString,
    artifactRefs: fc.array(generatedRef, { maxLength: 4 }),
})
    .map((value) => value);
const runSummary = fc
    .record({
    startedAt: isoDateString,
    finishedAt: fc.option(isoDateString, { nil: undefined }),
    status: fc.constantFrom('pending', 'running', 'completed', 'failed'),
    totalConvertedFiles: fc.integer({ min: 0, max: 1000 }),
    totalDiagnostics: fc.integer({ min: 0, max: 1000 }),
})
    .map((value) => value);
const maskToken = fc
    .record({
    token: safeString,
    category: fc.string({ minLength: 1, maxLength: 12 }),
    originalLength: fc.integer({ min: 0, max: 64 }),
    restorable: fc.boolean(),
    restorationHint: fc.option(safeString, { nil: undefined }),
})
    .map((value) => MaskTokenSchema.parse(value));
const maskTokenMap = fc
    .record({
    schemaVersion: fc.integer({ min: 1, max: 5 }),
    tokens: fc.array(maskToken, { maxLength: 5 }),
})
    .map((value) => MaskTokenMapSchema.parse(value));
const diagnosticsCollection = fc
    .record({
    schemaVersion: fc.integer({ min: 1, max: 5 }),
    diagnostics: fc.array(diagnostic, { maxLength: 5 }),
})
    .map((value) => DiagnosticsCollectionSchema.parse(value));
const report = fc
    .record({
    schemaVersion: fc.integer({ min: 1, max: 5 }),
    runManifest: manifest,
    runSummary,
    convertedFiles: fc.array(fc.record({
        sourcePath: fc.string({ minLength: 1, maxLength: 16 }),
        outputPath: fc.string({ minLength: 1, maxLength: 16 }),
        status: fc.constantFrom('generated', 'updated', 'unchanged', 'skipped'),
    }), { maxLength: 5 }),
    diagnostics: diagnosticsCollection,
    qualityResults: fc.array(fc.record({
        gate: fc.constantFrom('typecheck', 'lint', 'format', 'build', 'unit-tests', 'property-tests'),
        status: fc.constantFrom('passed', 'failed', 'skipped'),
        durationMs: fc.option(fc.integer({ min: 0, max: 10000 }), { nil: undefined }),
        summary: fc.option(safeString, { nil: undefined }),
    }), { maxLength: 5 }),
    traceabilityMap,
    aiDecisionRecords: fc.array(fc.record({
        provider: fc.string({ minLength: 1, maxLength: 16 }),
        model: fc.option(fc.string({ minLength: 1, maxLength: 16 }), { nil: undefined }),
        decision: safeString,
        rationale: fc.option(safeString, { nil: undefined }),
    }), { maxLength: 5 }),
    securityEvents: fc.array(fc.record({
        eventType: fc.string({ minLength: 1, maxLength: 16 }),
        severity: fc.constantFrom('info', 'warning', 'error', 'critical'),
        detail: safeString,
    }), { maxLength: 5 }),
    manualReviewItems: fc.array(fc.record({
        id: fc.string({ minLength: 1, maxLength: 16 }),
        title: safeString,
        description: fc.option(safeString, { nil: undefined }),
        status: fc.constantFrom('open', 'resolved', 'deferred'),
    }), { maxLength: 5 }),
})
    .map((value) => ConversionReportSchema.parse(value));
export const coreModelArbitraries = {
    safeString,
    sourceRef,
    irRef,
    generatedRef,
    traceLink,
    diagnostic,
    component,
    traceabilityMap,
    angularSourceModelRef,
    sourceModelBoundary,
    manifest,
    runSummary,
    maskToken,
    maskTokenMap,
    diagnosticsCollection,
    report,
};
//# sourceMappingURL=generators.js.map