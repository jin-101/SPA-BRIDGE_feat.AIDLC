import { z } from 'zod';
import { AngularSourceModelRefSchema } from '../source-model/angular-source-model.js';
import { GeneratedArtifactRefSchema, IrRefSchema, SourceRefSchema, TraceLinkSchema } from '../traceability/traceability.js';
import { SafeDisplayStringSchema } from '../redaction/redaction.js';
import { validateSchema } from '../validation/validation.js';
export const IrComponentSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    selector: z.string().optional(),
    templateRefs: z.array(IrRefSchema).default([]),
    inputs: z.array(z.string().min(1)).default([]),
    outputs: z.array(z.string().min(1)).default([]),
    lifecycleHooks: z.array(z.string().min(1)).default([]),
    dependencyRefs: z.array(IrRefSchema).default([]),
    sourceRefs: z.array(SourceRefSchema).default([]),
    generatedRefs: z.array(GeneratedArtifactRefSchema).default([]),
    extensionSlots: z.record(z.unknown()).default({}),
});
export const IrTemplateSchema = z.object({
    id: z.string().min(1),
    componentId: z.string().min(1),
    kind: z.enum(['inline', 'external']),
    bindings: z.array(z.string().min(1)).default([]),
    events: z.array(z.string().min(1)).default([]),
    sourceRefs: z.array(SourceRefSchema).default([]),
});
export const IrRouteSchema = z.object({
    id: z.string().min(1),
    path: z.string().min(1),
    componentRef: IrRefSchema.optional(),
    lazyModuleRef: IrRefSchema.optional(),
    guards: z.array(z.string().min(1)).default([]),
    sourceRefs: z.array(SourceRefSchema).default([]),
});
export const IrServiceSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    providedIn: z.string().optional(),
    injections: z.array(z.string().min(1)).default([]),
    sourceRefs: z.array(SourceRefSchema).default([]),
});
export const IrStateModelSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    strategy: z.enum(['service', 'signals', 'store', 'local', 'unknown']),
    dependencies: z.array(IrRefSchema).default([]),
    sourceRefs: z.array(SourceRefSchema).default([]),
});
export const IrDependencySchema = z.object({
    id: z.string().min(1),
    fromRef: IrRefSchema,
    toRef: IrRefSchema,
    relation: z.enum(['imports', 'injects', 'uses', 'renders', 'navigates-to', 'depends-on']),
});
export const IntermediateRepresentationSchema = z.object({
    schemaVersion: z.number().int().positive(),
    sourceModelRef: AngularSourceModelRefSchema.optional(),
    projectName: z.string().min(1),
    components: z.array(IrComponentSchema).default([]),
    templates: z.array(IrTemplateSchema).default([]),
    routes: z.array(IrRouteSchema).default([]),
    services: z.array(IrServiceSchema).default([]),
    stateModels: z.array(IrStateModelSchema).default([]),
    dependencies: z.array(IrDependencySchema).default([]),
    traceLinks: z.array(TraceLinkSchema).default([]),
    notes: z.array(SafeDisplayStringSchema).default([]),
});
export const validateIntermediateRepresentation = (input) => validateSchema(IntermediateRepresentationSchema, input);
//# sourceMappingURL=ir.js.map