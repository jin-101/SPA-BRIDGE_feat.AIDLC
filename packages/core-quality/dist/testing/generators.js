import fc from 'fast-check';
const nonEmptyString = fc.string({ minLength: 1, maxLength: 32 }).filter((value) => value.trim().length > 0);
export const qualityRequestArbitrary = fc.record({
    runId: nonEmptyString,
    correlationId: nonEmptyString,
    workspaceRoot: fc.constant('/workspace/spa-bridge'),
    selectedGateIds: fc.option(fc.uniqueArray(nonEmptyString, { minLength: 1, maxLength: 4 }), { nil: undefined }),
    artifactRefs: fc.option(fc.uniqueArray(fc.record({
        kind: fc.constant('generated'),
        path: nonEmptyString,
        segment: fc.option(nonEmptyString, { nil: undefined }),
    }), { minLength: 0, maxLength: 4 }), { nil: undefined }),
    seed: fc.option(fc.integer({ min: 1, max: 999999 }), { nil: undefined }),
    policyContext: fc.option(fc.dictionary(nonEmptyString, nonEmptyString, { maxKeys: 3 }), { nil: undefined }),
});
export const qualityGateDefinitionArbitrary = fc.record({
    gateId: nonEmptyString,
    displayName: nonEmptyString,
    order: fc.integer({ min: 1, max: 1000 }),
    kind: fc.constantFrom('build', 'lint', 'format', 'unit', 'integration', 'property'),
    blocking: fc.boolean(),
    toolRef: nonEmptyString,
    summaryTemplate: nonEmptyString,
    tags: fc.uniqueArray(nonEmptyString, { maxLength: 4 }),
});
export const propertyTestPlanArbitrary = fc.record({
    planId: nonEmptyString,
    subject: nonEmptyString,
    generatorFamily: nonEmptyString,
    propertyName: nonEmptyString,
    seed: fc.option(fc.integer({ min: 1, max: 999999 }), { nil: undefined }),
    shrinkStrategy: fc.constantFrom('default', 'aggressive', 'minimal'),
    exampleRegressions: fc.uniqueArray(nonEmptyString, { maxLength: 4 }),
});
export const qualityToolKindArbitrary = fc.constantFrom('build', 'lint', 'format', 'unit', 'integration', 'property');
//# sourceMappingURL=generators.js.map