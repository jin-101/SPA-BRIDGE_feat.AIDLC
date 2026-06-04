import { z } from 'zod';
import { SafeDisplayStringSchema, createSafeDisplayString } from '../redaction/redaction.js';
import { validateSchema } from '../validation/validation.js';
export const MaskTokenSchema = z.object({
    token: SafeDisplayStringSchema,
    category: z.string().min(1),
    originalLength: z.number().int().nonnegative(),
    restorable: z.boolean().default(false),
    restorationHint: SafeDisplayStringSchema.optional(),
});
export const MaskTokenMapSchema = z.object({
    schemaVersion: z.number().int().positive(),
    tokens: z.array(MaskTokenSchema),
});
export const validateMaskTokenMap = (input) => validateSchema(MaskTokenMapSchema, input);
export const createMaskToken = (token) => MaskTokenSchema.parse({
    ...token,
    token: createSafeDisplayString(token.token),
    restorationHint: token.restorationHint ? createSafeDisplayString(token.restorationHint) : undefined,
});
//# sourceMappingURL=masking.js.map