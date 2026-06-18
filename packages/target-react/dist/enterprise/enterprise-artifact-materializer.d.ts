import type { ManualReviewItem } from '@spa-bridge/core-model';
import type { EnterpriseParityArtifacts, GeneratedFileSpec, TargetGenerationRequest } from '../types.js';
import { EnvironmentContractBuilder } from './environment-contract-builder.js';
import { RegistryMigrationPlanner } from './registry-migration-planner.js';
import { SourceScriptTranslator } from './source-script-translator.js';
import { PackageManagerParityPlanner } from './package-manager-parity-planner.js';
export declare class EnterpriseArtifactMaterializer {
    private readonly registryPlanner;
    private readonly scriptTranslator;
    private readonly environmentBuilder;
    private readonly packageManagerPlanner;
    constructor(registryPlanner?: RegistryMigrationPlanner, scriptTranslator?: SourceScriptTranslator, environmentBuilder?: EnvironmentContractBuilder, packageManagerPlanner?: PackageManagerParityPlanner);
    buildArtifacts(request: TargetGenerationRequest): EnterpriseParityArtifacts;
    materialize(artifacts: EnterpriseParityArtifacts): GeneratedFileSpec[];
    createManualReviewItems(artifacts: EnterpriseParityArtifacts): ManualReviewItem[];
}
//# sourceMappingURL=enterprise-artifact-materializer.d.ts.map