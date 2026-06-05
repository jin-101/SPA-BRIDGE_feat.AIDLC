import path from 'node:path';

import {
  createDiagnostic,
  err,
  ok,
  type Diagnostic,
  type GeneratedArtifactRef,
  type Result,
  type SourceRef,
  type TraceLink,
} from '@spa-bridge/core-model';

import { ArtifactRefFactory } from '../model/artifact-ref-factory.js';
import { ContextNormalizer } from '../context/context-normalizer.js';
import { DraftBuilder } from '../drafts/draft-builder.js';
import { DraftValidator } from '../validation/draft-validator.js';
import { ExecutionPlanner } from '../planner/execution-planner.js';
import { PassSummaryCollector } from '../summary/pass-summary-collector.js';
import { RegistryValidator } from '../registry/registry-validator.js';
import { RuleRegistry } from '../registry/rule-registry.js';
import { TraceBuilder } from '../trace/trace-builder.js';
import { TransformationRequestValidator } from '../validation/transformation-request-validator.js';
import { createBuiltInRules } from '../registry/default-rules.js';
import type {
  ProviderNeutralMappingRequest,
  TransformationArtifactRefs,
  TransformationContext,
  TransformationError,
  TransformationPipelineOptions,
  TransformationRequest,
  TransformationResult,
  TransformationSummary,
  RuleContribution,
  ReactComponentDraft,
  ReactHookDraft,
  ReactRouteDraft,
  ReactServiceDraft,
  ReactStateDraft,
  ReactTargetDraftSet,
  ReactTemplateDraft,
} from '../types.js';

type DraftSourceCarrier = {
  sourceRef?: SourceRef;
  generatedRefs: GeneratedArtifactRef[];
  reviewItemIds: string[];
};

const targetKey = (target: TraceLink['target']): string => (target.kind === 'ir' ? target.id : target.path);

const collectDrafts = (draftSet: ReactTargetDraftSet): DraftSourceCarrier[] => [
  ...draftSet.components,
  ...draftSet.templates,
  ...draftSet.services,
  ...draftSet.routes,
  ...draftSet.state,
];

const summarizeDraftSet = (draftSet: ReactTargetDraftSet): TransformationSummary => ({
  totalComponents: draftSet.components.length,
  totalTemplates: draftSet.templates.length,
  totalServices: draftSet.services.length,
  totalRoutes: draftSet.routes.length,
  totalStateArtifacts: draftSet.state.length,
  totalDrafts: draftSet.components.length + draftSet.templates.length + draftSet.services.length + draftSet.routes.length + draftSet.state.length,
  totalDiagnostics: draftSet.diagnostics.length,
  totalReviewItems: draftSet.manualReviewItems.length,
  totalTraces: draftSet.traces.length,
  packageRefCount: 0,
});

export class TransformationPipeline {
  private readonly requestValidator = new TransformationRequestValidator();
  private readonly contextNormalizer = new ContextNormalizer();
  private readonly registryValidator = new RegistryValidator();
  private readonly planner = new ExecutionPlanner();
  private readonly draftValidator = new DraftValidator();
  private readonly passSummaryCollector = new PassSummaryCollector();
  private readonly artifactFactory = new ArtifactRefFactory();

  constructor(private readonly options: TransformationPipelineOptions = {}) {}

  execute(request: TransformationRequest): Result<TransformationResult, TransformationError> {
    const requestResult = this.requestValidator.validate(request);
    if (!requestResult.ok) {
      return requestResult;
    }

    const contextResult = this.contextNormalizer.normalize(requestResult.value);
    if (!contextResult.ok) {
      return contextResult;
    }

    const context = contextResult.value;
    const registry = new RuleRegistry();
    registry.registerBuiltInRules(...(this.options.builtInRules ?? createBuiltInRules()));
    for (const pack of this.options.rulePacks ?? []) {
      registry.registerRulePack(pack.packId, ...pack.rules);
    }

    const selectedRules = registry.listRules(context.enabledRulePacks);
    const registryResult = this.registryValidator.validate(selectedRules);
    if (!registryResult.ok) {
      return registryResult;
    }

    const planResult = this.planner.plan(registryResult.value);
    if (!planResult.ok) {
      return planResult;
    }

    const draftBuilder = new DraftBuilder();
    const traceBuilder = new TraceBuilder();
    const mappingRequests = new Map<string, ProviderNeutralMappingRequest>();
    const seenTraceTargets = new Set<string>();

    const registerTrace = (source: SourceRef, target: TraceLink['target'], ruleId: string, confidence = 1): void => {
      const traceTarget = targetKey(target);
      if (seenTraceTargets.has(traceTarget)) {
        return;
      }

      const trace = traceBuilder.addTrace(source, target, ruleId, 'maps-to', confidence);
      draftBuilder.addTrace(trace);
      seenTraceTargets.add(traceTarget);
    };

    const registerContribution = (contribution: RuleContribution, ruleId: string): void => {
      for (const component of contribution.componentDrafts ?? []) {
        draftBuilder.addComponent(component);
        const source = component.sourceRef ?? { kind: 'source', path: context.sourceModelRef.entryFile };
        for (const hook of component.hooks) {
          const hookTarget = hook.generatedRefs[0] ?? { kind: 'generated', path: `${component.id}/hooks/${hook.id}.json`, segment: hook.id };
          registerTrace(source, hookTarget, `${ruleId}:component-hook`);
        }
      }

      for (const template of contribution.templateDrafts ?? []) {
        draftBuilder.addTemplate(template);
      }

      for (const service of contribution.serviceDrafts ?? []) {
        draftBuilder.addService(service);
      }

      for (const route of contribution.routeDrafts ?? []) {
        draftBuilder.addRoute(route);
      }

      for (const state of contribution.stateDrafts ?? []) {
        draftBuilder.addState(state);
      }

      for (const hook of contribution.hooks ?? []) {
        const source = hook.sourceRef ?? { kind: 'source', path: context.sourceModelRef.entryFile };
        const hookTarget = hook.generatedRefs[0] ?? { kind: 'generated', path: `${hook.id}.json`, segment: hook.id };
        registerTrace(source, hookTarget, `${ruleId}:hook`);
      }

      for (const diagnostic of contribution.diagnostics ?? []) {
        draftBuilder.addDiagnostic(diagnostic);
      }

      for (const reviewItem of contribution.reviewItems ?? []) {
        draftBuilder.addReviewItem(reviewItem);
      }

      for (const trace of contribution.traces ?? []) {
        registerTrace(trace.source, trace.target, `${ruleId}:trace`, trace.confidence);
      }

      for (const mappingRequest of contribution.mappingRequests ?? []) {
        mappingRequests.set(mappingRequest.mappingRequestId, mappingRequest);
      }
    };

    for (const rule of planResult.value.orderedRules) {
      registerContribution(rule.transform(context), rule.ruleId);
    }

    let draftSet = draftBuilder.finalize(context.targetFramework, context.targetProjectStrategy);

    for (const draft of collectDrafts(draftSet)) {
      const source = draft.sourceRef ?? { kind: 'source', path: context.sourceModelRef.entryFile };
      for (const ref of draft.generatedRefs) {
        registerTrace(source, ref, 'transformation-pipeline');
      }
    }

    draftSet = draftBuilder.finalize(context.targetFramework, context.targetProjectStrategy);

    const draftValidationResult = this.draftValidator.validate(draftSet);
    if (!draftValidationResult.ok) {
      return draftValidationResult;
    }

    const outputNamespace = request.outputNamespace?.trim() || path.join(context.sourceModelRef.projectPath, '.spa-bridge', 'transformation');
    const artifacts = this.artifactFactory.build(outputNamespace, context);
    const passSummary = this.passSummaryCollector.collect(planResult.value.orderedRules.length, planResult.value.skippedRules.length, draftSet);
    const summary = summarizeDraftSet(draftSet);
    summary.packageRefCount = context.packageRefs.length;
    const blockingDiagnostics = draftSet.diagnostics.filter((diagnostic) => diagnostic.severity === 'error' || diagnostic.severity === 'security-blocker');
    const status: TransformationResult['status'] =
      blockingDiagnostics.length > 0 ? 'partial' : draftSet.manualReviewItems.length > 0 ? 'partial' : 'succeeded';

    return ok({
      status,
      context,
      draftSet,
      mappingRequests: [...mappingRequests.values()].sort((left, right) => left.mappingRequestId.localeCompare(right.mappingRequestId)),
      summary,
      passSummary,
      artifacts,
    });
  }

  toDiagnostic(message: string): ReturnType<typeof createDiagnostic> {
    return createDiagnostic({
      code: 'UOW04-PIPELINE-001',
      severity: 'error',
      message,
      sourceRefs: [],
      generatedRefs: [],
      tags: ['uow04', 'pipeline'],
    });
  }
}
