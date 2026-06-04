import { z } from 'zod';
import { type ValidationError } from '../validation/validation.js';
import type { Result } from '../result/result.js';
export declare const IrComponentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    selector: z.ZodOptional<z.ZodString>;
    templateRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"ir">;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "ir";
        id: string;
    }, {
        kind: "ir";
        id: string;
    }>, "many">>;
    inputs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    outputs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    lifecycleHooks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    dependencyRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"ir">;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "ir";
        id: string;
    }, {
        kind: "ir";
        id: string;
    }>, "many">>;
    sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        path: z.ZodString;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }>, "many">>;
    generatedRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"generated">;
        path: z.ZodString;
        segment: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }, {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }>, "many">>;
    extensionSlots: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    sourceRefs: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[];
    generatedRefs: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[];
    name: string;
    templateRefs: {
        kind: "ir";
        id: string;
    }[];
    inputs: string[];
    outputs: string[];
    lifecycleHooks: string[];
    dependencyRefs: {
        kind: "ir";
        id: string;
    }[];
    extensionSlots: Record<string, unknown>;
    selector?: string | undefined;
}, {
    id: string;
    name: string;
    sourceRefs?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[] | undefined;
    generatedRefs?: {
        path: string;
        kind: "generated";
        segment?: string | undefined;
    }[] | undefined;
    selector?: string | undefined;
    templateRefs?: {
        kind: "ir";
        id: string;
    }[] | undefined;
    inputs?: string[] | undefined;
    outputs?: string[] | undefined;
    lifecycleHooks?: string[] | undefined;
    dependencyRefs?: {
        kind: "ir";
        id: string;
    }[] | undefined;
    extensionSlots?: Record<string, unknown> | undefined;
}>;
export declare const IrTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    componentId: z.ZodString;
    kind: z.ZodEnum<["inline", "external"]>;
    bindings: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    events: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        path: z.ZodString;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    kind: "inline" | "external";
    id: string;
    sourceRefs: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[];
    componentId: string;
    bindings: string[];
    events: string[];
}, {
    kind: "inline" | "external";
    id: string;
    componentId: string;
    sourceRefs?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[] | undefined;
    bindings?: string[] | undefined;
    events?: string[] | undefined;
}>;
export declare const IrRouteSchema: z.ZodObject<{
    id: z.ZodString;
    path: z.ZodString;
    componentRef: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"ir">;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "ir";
        id: string;
    }, {
        kind: "ir";
        id: string;
    }>>;
    lazyModuleRef: z.ZodOptional<z.ZodObject<{
        kind: z.ZodLiteral<"ir">;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "ir";
        id: string;
    }, {
        kind: "ir";
        id: string;
    }>>;
    guards: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        path: z.ZodString;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    path: string;
    id: string;
    sourceRefs: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[];
    guards: string[];
    componentRef?: {
        kind: "ir";
        id: string;
    } | undefined;
    lazyModuleRef?: {
        kind: "ir";
        id: string;
    } | undefined;
}, {
    path: string;
    id: string;
    sourceRefs?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[] | undefined;
    componentRef?: {
        kind: "ir";
        id: string;
    } | undefined;
    lazyModuleRef?: {
        kind: "ir";
        id: string;
    } | undefined;
    guards?: string[] | undefined;
}>;
export declare const IrServiceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    providedIn: z.ZodOptional<z.ZodString>;
    injections: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        path: z.ZodString;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    sourceRefs: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[];
    name: string;
    injections: string[];
    providedIn?: string | undefined;
}, {
    id: string;
    name: string;
    sourceRefs?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[] | undefined;
    providedIn?: string | undefined;
    injections?: string[] | undefined;
}>;
export declare const IrStateModelSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    strategy: z.ZodEnum<["service", "signals", "store", "local", "unknown"]>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"ir">;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "ir";
        id: string;
    }, {
        kind: "ir";
        id: string;
    }>, "many">>;
    sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        kind: z.ZodLiteral<"source">;
        path: z.ZodString;
        symbol: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }, {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    sourceRefs: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[];
    name: string;
    strategy: "unknown" | "service" | "signals" | "store" | "local";
    dependencies: {
        kind: "ir";
        id: string;
    }[];
}, {
    id: string;
    name: string;
    strategy: "unknown" | "service" | "signals" | "store" | "local";
    sourceRefs?: {
        path: string;
        kind: "source";
        symbol?: string | undefined;
        location?: string | undefined;
    }[] | undefined;
    dependencies?: {
        kind: "ir";
        id: string;
    }[] | undefined;
}>;
export declare const IrDependencySchema: z.ZodObject<{
    id: z.ZodString;
    fromRef: z.ZodObject<{
        kind: z.ZodLiteral<"ir">;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "ir";
        id: string;
    }, {
        kind: "ir";
        id: string;
    }>;
    toRef: z.ZodObject<{
        kind: z.ZodLiteral<"ir">;
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        kind: "ir";
        id: string;
    }, {
        kind: "ir";
        id: string;
    }>;
    relation: z.ZodEnum<["imports", "injects", "uses", "renders", "navigates-to", "depends-on"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    relation: "imports" | "injects" | "uses" | "renders" | "navigates-to" | "depends-on";
    fromRef: {
        kind: "ir";
        id: string;
    };
    toRef: {
        kind: "ir";
        id: string;
    };
}, {
    id: string;
    relation: "imports" | "injects" | "uses" | "renders" | "navigates-to" | "depends-on";
    fromRef: {
        kind: "ir";
        id: string;
    };
    toRef: {
        kind: "ir";
        id: string;
    };
}>;
export declare const IntermediateRepresentationSchema: z.ZodObject<{
    schemaVersion: z.ZodNumber;
    sourceModelRef: z.ZodOptional<z.ZodObject<{
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
    }>>;
    projectName: z.ZodString;
    components: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        selector: z.ZodOptional<z.ZodString>;
        templateRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"ir">;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "ir";
            id: string;
        }, {
            kind: "ir";
            id: string;
        }>, "many">>;
        inputs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        outputs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        lifecycleHooks: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        dependencyRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"ir">;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "ir";
            id: string;
        }, {
            kind: "ir";
            id: string;
        }>, "many">>;
        sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            path: z.ZodString;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }>, "many">>;
        generatedRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            path: z.ZodString;
            segment: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>, "many">>;
        extensionSlots: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        generatedRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        name: string;
        templateRefs: {
            kind: "ir";
            id: string;
        }[];
        inputs: string[];
        outputs: string[];
        lifecycleHooks: string[];
        dependencyRefs: {
            kind: "ir";
            id: string;
        }[];
        extensionSlots: Record<string, unknown>;
        selector?: string | undefined;
    }, {
        id: string;
        name: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        generatedRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
        selector?: string | undefined;
        templateRefs?: {
            kind: "ir";
            id: string;
        }[] | undefined;
        inputs?: string[] | undefined;
        outputs?: string[] | undefined;
        lifecycleHooks?: string[] | undefined;
        dependencyRefs?: {
            kind: "ir";
            id: string;
        }[] | undefined;
        extensionSlots?: Record<string, unknown> | undefined;
    }>, "many">>;
    templates: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        componentId: z.ZodString;
        kind: z.ZodEnum<["inline", "external"]>;
        bindings: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        events: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            path: z.ZodString;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        kind: "inline" | "external";
        id: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        componentId: string;
        bindings: string[];
        events: string[];
    }, {
        kind: "inline" | "external";
        id: string;
        componentId: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        bindings?: string[] | undefined;
        events?: string[] | undefined;
    }>, "many">>;
    routes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
        componentRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"ir">;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "ir";
            id: string;
        }, {
            kind: "ir";
            id: string;
        }>>;
        lazyModuleRef: z.ZodOptional<z.ZodObject<{
            kind: z.ZodLiteral<"ir">;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "ir";
            id: string;
        }, {
            kind: "ir";
            id: string;
        }>>;
        guards: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            path: z.ZodString;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        id: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        guards: string[];
        componentRef?: {
            kind: "ir";
            id: string;
        } | undefined;
        lazyModuleRef?: {
            kind: "ir";
            id: string;
        } | undefined;
    }, {
        path: string;
        id: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        componentRef?: {
            kind: "ir";
            id: string;
        } | undefined;
        lazyModuleRef?: {
            kind: "ir";
            id: string;
        } | undefined;
        guards?: string[] | undefined;
    }>, "many">>;
    services: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        providedIn: z.ZodOptional<z.ZodString>;
        injections: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            path: z.ZodString;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        name: string;
        injections: string[];
        providedIn?: string | undefined;
    }, {
        id: string;
        name: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        providedIn?: string | undefined;
        injections?: string[] | undefined;
    }>, "many">>;
    stateModels: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        strategy: z.ZodEnum<["service", "signals", "store", "local", "unknown"]>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"ir">;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "ir";
            id: string;
        }, {
            kind: "ir";
            id: string;
        }>, "many">>;
        sourceRefs: z.ZodDefault<z.ZodArray<z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            path: z.ZodString;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        name: string;
        strategy: "unknown" | "service" | "signals" | "store" | "local";
        dependencies: {
            kind: "ir";
            id: string;
        }[];
    }, {
        id: string;
        name: string;
        strategy: "unknown" | "service" | "signals" | "store" | "local";
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        dependencies?: {
            kind: "ir";
            id: string;
        }[] | undefined;
    }>, "many">>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        fromRef: z.ZodObject<{
            kind: z.ZodLiteral<"ir">;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "ir";
            id: string;
        }, {
            kind: "ir";
            id: string;
        }>;
        toRef: z.ZodObject<{
            kind: z.ZodLiteral<"ir">;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "ir";
            id: string;
        }, {
            kind: "ir";
            id: string;
        }>;
        relation: z.ZodEnum<["imports", "injects", "uses", "renders", "navigates-to", "depends-on"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        relation: "imports" | "injects" | "uses" | "renders" | "navigates-to" | "depends-on";
        fromRef: {
            kind: "ir";
            id: string;
        };
        toRef: {
            kind: "ir";
            id: string;
        };
    }, {
        id: string;
        relation: "imports" | "injects" | "uses" | "renders" | "navigates-to" | "depends-on";
        fromRef: {
            kind: "ir";
            id: string;
        };
        toRef: {
            kind: "ir";
            id: string;
        };
    }>, "many">>;
    traceLinks: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodObject<{
            kind: z.ZodLiteral<"source">;
            path: z.ZodString;
            symbol: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }, {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }>;
        target: z.ZodUnion<[z.ZodObject<{
            kind: z.ZodLiteral<"ir">;
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            kind: "ir";
            id: string;
        }, {
            kind: "ir";
            id: string;
        }>, z.ZodObject<{
            kind: z.ZodLiteral<"generated">;
            path: z.ZodString;
            segment: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }, {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }>]>;
        relation: z.ZodEnum<["maps-to", "derived-from", "emits", "references"]>;
        confidence: z.ZodDefault<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>>;
    }, "strip", z.ZodTypeAny, {
        source: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        };
        id: string;
        target: {
            kind: "ir";
            id: string;
        } | {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        };
        relation: "maps-to" | "derived-from" | "emits" | "references";
        confidence: number;
        notes?: string | undefined;
    }, {
        source: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        };
        id: string;
        target: {
            kind: "ir";
            id: string;
        } | {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        };
        relation: "maps-to" | "derived-from" | "emits" | "references";
        confidence?: number | undefined;
        notes?: string | undefined;
    }>, "many">>;
    notes: z.ZodDefault<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, string, string>, "many">>;
}, "strip", z.ZodTypeAny, {
    notes: string[];
    schemaVersion: number;
    traceLinks: {
        source: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        };
        id: string;
        target: {
            kind: "ir";
            id: string;
        } | {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        };
        relation: "maps-to" | "derived-from" | "emits" | "references";
        confidence: number;
        notes?: string | undefined;
    }[];
    dependencies: {
        id: string;
        relation: "imports" | "injects" | "uses" | "renders" | "navigates-to" | "depends-on";
        fromRef: {
            kind: "ir";
            id: string;
        };
        toRef: {
            kind: "ir";
            id: string;
        };
    }[];
    projectName: string;
    components: {
        id: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        generatedRefs: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[];
        name: string;
        templateRefs: {
            kind: "ir";
            id: string;
        }[];
        inputs: string[];
        outputs: string[];
        lifecycleHooks: string[];
        dependencyRefs: {
            kind: "ir";
            id: string;
        }[];
        extensionSlots: Record<string, unknown>;
        selector?: string | undefined;
    }[];
    templates: {
        kind: "inline" | "external";
        id: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        componentId: string;
        bindings: string[];
        events: string[];
    }[];
    routes: {
        path: string;
        id: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        guards: string[];
        componentRef?: {
            kind: "ir";
            id: string;
        } | undefined;
        lazyModuleRef?: {
            kind: "ir";
            id: string;
        } | undefined;
    }[];
    services: {
        id: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        name: string;
        injections: string[];
        providedIn?: string | undefined;
    }[];
    stateModels: {
        id: string;
        sourceRefs: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[];
        name: string;
        strategy: "unknown" | "service" | "signals" | "store" | "local";
        dependencies: {
            kind: "ir";
            id: string;
        }[];
    }[];
    sourceModelRef?: {
        projectPath: string;
        entryFile: string;
        projectKind: "application" | "library" | "workspace";
    } | undefined;
}, {
    schemaVersion: number;
    projectName: string;
    notes?: string[] | undefined;
    traceLinks?: {
        source: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        };
        id: string;
        target: {
            kind: "ir";
            id: string;
        } | {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        };
        relation: "maps-to" | "derived-from" | "emits" | "references";
        confidence?: number | undefined;
        notes?: string | undefined;
    }[] | undefined;
    sourceModelRef?: {
        projectPath: string;
        entryFile: string;
        projectKind: "application" | "library" | "workspace";
    } | undefined;
    dependencies?: {
        id: string;
        relation: "imports" | "injects" | "uses" | "renders" | "navigates-to" | "depends-on";
        fromRef: {
            kind: "ir";
            id: string;
        };
        toRef: {
            kind: "ir";
            id: string;
        };
    }[] | undefined;
    components?: {
        id: string;
        name: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        generatedRefs?: {
            path: string;
            kind: "generated";
            segment?: string | undefined;
        }[] | undefined;
        selector?: string | undefined;
        templateRefs?: {
            kind: "ir";
            id: string;
        }[] | undefined;
        inputs?: string[] | undefined;
        outputs?: string[] | undefined;
        lifecycleHooks?: string[] | undefined;
        dependencyRefs?: {
            kind: "ir";
            id: string;
        }[] | undefined;
        extensionSlots?: Record<string, unknown> | undefined;
    }[] | undefined;
    templates?: {
        kind: "inline" | "external";
        id: string;
        componentId: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        bindings?: string[] | undefined;
        events?: string[] | undefined;
    }[] | undefined;
    routes?: {
        path: string;
        id: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        componentRef?: {
            kind: "ir";
            id: string;
        } | undefined;
        lazyModuleRef?: {
            kind: "ir";
            id: string;
        } | undefined;
        guards?: string[] | undefined;
    }[] | undefined;
    services?: {
        id: string;
        name: string;
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        providedIn?: string | undefined;
        injections?: string[] | undefined;
    }[] | undefined;
    stateModels?: {
        id: string;
        name: string;
        strategy: "unknown" | "service" | "signals" | "store" | "local";
        sourceRefs?: {
            path: string;
            kind: "source";
            symbol?: string | undefined;
            location?: string | undefined;
        }[] | undefined;
        dependencies?: {
            kind: "ir";
            id: string;
        }[] | undefined;
    }[] | undefined;
}>;
export type IrComponent = z.infer<typeof IrComponentSchema>;
export type IrTemplate = z.infer<typeof IrTemplateSchema>;
export type IrRoute = z.infer<typeof IrRouteSchema>;
export type IrService = z.infer<typeof IrServiceSchema>;
export type IrStateModel = z.infer<typeof IrStateModelSchema>;
export type IrDependency = z.infer<typeof IrDependencySchema>;
export type IntermediateRepresentation = z.infer<typeof IntermediateRepresentationSchema>;
export declare const validateIntermediateRepresentation: (input: unknown) => Result<any, ValidationError>;
//# sourceMappingURL=ir.d.ts.map