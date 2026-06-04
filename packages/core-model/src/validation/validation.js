import { err, ok } from '../result/result.js';
export const createValidationError = (issues) => ({
    name: 'ValidationError',
    message: 'Validation failed',
    issues,
});
export const validateSchema = (schema, input) => {
    const result = schema.safeParse(input);
    if (result.success) {
        return ok(result.data);
    }
    return err(createValidationError(result.error.issues.map((issue) => ({
        path: issue.path,
        code: issue.code,
        message: issue.message,
    }))));
};
export const parseSchema = (schema, input) => validateSchema(schema, input);
//# sourceMappingURL=validation.js.map