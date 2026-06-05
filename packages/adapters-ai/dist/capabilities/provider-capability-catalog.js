import { err, ok } from '@spa-bridge/core-model';
import { ProviderErrorSchema, TargetCapabilityPackSchema, } from '../types.js';
import { compareStrings } from '../internal.js';
const createProviderError = (code, message) => ProviderErrorSchema.parse({
    code,
    message,
    retryable: false,
});
export const defaultCapabilityCatalog = [
    { category: 'template', tags: ['jsx', 'html', 'binding'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 50 },
    { category: 'lifecycle', tags: ['hook', 'effect', 'init', 'destroy'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 40 },
    { category: 'di', tags: ['inject', 'service', 'context'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 40 },
    { category: 'route', tags: ['route', 'guard', 'resolver', 'lazy'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 40 },
    { category: 'state', tags: ['store', 'effect', 'entity', 'signal'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 40 },
    { category: 'form', tags: ['control', 'validator', 'reactive-form', 'template-form'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 40 },
    { category: 'i18n', tags: ['translation', 'locale', 'interpolation'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 30 },
    { category: 'animation', tags: ['animation', 'lottie', 'gsap'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 30 },
    { category: 'map', tags: ['map', 'geojson', 'turf', 'mapbox'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 30 },
    { category: 'media', tags: ['image', 'capture', 'video', 'audio'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 30 },
    { category: 'qr', tags: ['qr', 'barcode'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 30 },
    { category: 'barcode', tags: ['barcode', 'qr'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 30 },
    { category: 'service-worker', tags: ['offline', 'cache', 'update'], supportsStructuredResponse: true, supportsSafeRationale: true, maxContextItems: 30 },
    { category: 'unknown', tags: ['unknown'], supportsStructuredResponse: false, supportsSafeRationale: false, maxContextItems: 10 },
];
export const getCapabilityTemplate = (category) => defaultCapabilityCatalog.find((entry) => entry.category === category);
export const createTargetCapabilityPack = (input) => {
    const pack = TargetCapabilityPackSchema.parse(input);
    const forbidden = pack.forbiddenMetadataFields.filter((field) => {
        const normalized = field.toLowerCase();
        return normalized.includes('customer') || normalized.includes('raw') || normalized.includes('secret') || normalized.includes('route') || normalized.includes('page');
    });
    if (forbidden.length > 0) {
        return err(createProviderError('INVALID_TARGET_CAPABILITY_PACK', `Forbidden metadata fields: ${forbidden.join(', ')}`));
    }
    return ok({
        ...pack,
        capabilityTags: [...new Set(pack.capabilityTags)].sort(compareStrings),
        supportedFrameworks: [...new Set(pack.supportedFrameworks)].sort(compareStrings),
        forbiddenMetadataFields: [...new Set(pack.forbiddenMetadataFields)].sort(compareStrings),
    });
};
//# sourceMappingURL=provider-capability-catalog.js.map