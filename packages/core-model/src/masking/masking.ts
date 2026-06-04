import { z } from 'zod';

import { SafeDisplayStringSchema, createSafeDisplayString } from '../redaction/redaction.js';
import { validateSchema, type ValidationError } from '../validation/validation.js';
import type { Result } from '../result/result.js';

export const MaskTokenSchema = z.object({
  token: SafeDisplayStringSchema,
  category: z.string().min(1),
  originalLength: z.number().int().nonnegative(),
  restorable: z.boolean().default(false),
  restorationHint: SafeDisplayStringSchema.optional(),
});

export type MaskToken = z.infer<typeof MaskTokenSchema>;

export const MaskTokenMapSchema = z.object({
  schemaVersion: z.number().int().positive(),
  tokens: z.array(MaskTokenSchema),
});

export type MaskTokenMap = z.infer<typeof MaskTokenMapSchema>;

export const validateMaskTokenMap = (input: unknown): Result<any, ValidationError> =>
  validateSchema(MaskTokenMapSchema, input);

export const createMaskToken = (token: MaskToken): MaskToken =>
  MaskTokenSchema.parse({
    ...token,
    token: createSafeDisplayString(token.token),
    restorationHint: token.restorationHint ? createSafeDisplayString(token.restorationHint) : undefined,
  });
