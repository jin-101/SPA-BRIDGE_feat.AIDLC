import fc from 'fast-check';
import type { TransformationRequest } from '../types.js';
export type BenchmarkAnalysisOptions = {
    componentCount: number;
    includeUnsupportedTemplate: boolean;
};
export declare const benchmarkAnalysisOptionsArbitrary: fc.Arbitrary<{
    componentCount: number;
    includeUnsupportedTemplate: boolean;
}>;
export declare const benchmarkAnalysisArbitrary: fc.Arbitrary<import("@spa-bridge/source-angular").AngularAnalysisResult>;
export declare const transformationRequestArbitrary: fc.Arbitrary<TransformationRequest>;
export declare const transformationRequestListArbitrary: fc.Arbitrary<TransformationRequest[]>;
//# sourceMappingURL=generators.d.ts.map