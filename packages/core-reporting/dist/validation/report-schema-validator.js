import { validateSchema } from '@spa-bridge/core-model';
import { createReportError } from '../shared-errors.js';
import { CanonicalConversionReportSchema, ReportExportSetSchema, ReportSchemaVersion } from '../types.js';
export const validateCanonicalConversionReport = (input) => {
    const parsed = validateSchema(CanonicalConversionReportSchema, input);
    if (!parsed.ok) {
        return {
            ok: false,
            error: createReportError('VALIDATION_FAILED', 'Canonical report failed schema validation.', parsed.error.issues),
        };
    }
    if (parsed.value.schemaVersion !== ReportSchemaVersion) {
        return {
            ok: false,
            error: createReportError('SCHEMA_VERSION_MISMATCH', `Unsupported canonical report schema version ${parsed.value.schemaVersion}.`, [
                { path: ['schemaVersion'], code: 'schema_version_mismatch', message: `Expected ${ReportSchemaVersion}` },
            ]),
        };
    }
    if (parsed.value.exportMetadata.canonicalReportRef !== parsed.value.reportId) {
        return {
            ok: false,
            error: createReportError('VALIDATION_FAILED', 'Canonical report export metadata ref mismatch.', [
                { path: ['exportMetadata', 'canonicalReportRef'], code: 'mismatch', message: 'Export metadata reference must match reportId.' },
            ]),
        };
    }
    return { ok: true, value: parsed.value };
};
export const validateReportExportSet = (input) => {
    const parsed = validateSchema(ReportExportSetSchema, input);
    if (!parsed.ok) {
        return {
            ok: false,
            error: createReportError('VALIDATION_FAILED', 'Report export set failed schema validation.', parsed.error.issues),
        };
    }
    return { ok: true, value: parsed.value };
};
//# sourceMappingURL=report-schema-validator.js.map