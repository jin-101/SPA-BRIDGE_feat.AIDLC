import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
const toServiceName = (name) => name.replace(/[^A-Za-z0-9]/g, '');
export class ServiceMaterializer {
    materialize(service, sourceRefs = []) {
        const safeName = toServiceName(service.name) || 'Service';
        const content = [
            `export type ${safeName}State = Record<string, unknown>;`,
            '',
            `export const create${safeName}Service = () => ({`,
            `  name: '${safeName}',`,
            `  kind: '${service.kind}',`,
            `  providerScope: ${service.providerScope ? `'${service.providerScope}'` : 'undefined'},`,
            '});',
            '',
        ].join('\n');
        return [
            createFileSpec({
                path: `src/services/${safeName}.ts`,
                kind: 'service',
                content,
                sourceRefs,
                overwrite: true,
            }),
        ];
    }
    materializeMany(services, sourceRef) {
        return services.flatMap((service) => this.materialize(service, [sourceRef]));
    }
}
//# sourceMappingURL=service-materializer.js.map