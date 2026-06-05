import { createRedactedString, createSafeDisplayString, err, ok, type Result } from '@spa-bridge/core-model';

import { createSecurityError, type MaskedPayload, type MaskingMode, type SensitiveFinding, type TokenScope } from '../types.js';
import { TokenVault, type IssuedToken } from '../token-vault/token-vault.js';

const replaceRanges = (
  source: string,
  replacements: Array<{ start: number; end: number; text: string }>,
): string => {
  let output = source;
  for (const replacement of [...replacements].sort((left, right) => right.start - left.start)) {
    if (replacement.start < 0 || replacement.end < replacement.start || replacement.end > output.length) {
      continue;
    }
    output = `${output.slice(0, replacement.start)}${replacement.text}${output.slice(replacement.end)}`;
  }
  return output;
};

export class SafeOutputValidator {
  validate(input: unknown): Result<void, ReturnType<typeof createSecurityError>> {
    const forbiddenKeys = new Set(['excerpt', 'rawSnippet', 'rawValue', 'rawText']);
    const stack: unknown[] = [input];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current || typeof current !== 'object') {
        continue;
      }

      for (const [key, value] of Object.entries(current as Record<string, unknown>)) {
        if (forbiddenKeys.has(key)) {
          return err(createSecurityError('SAFE_OUTPUT_REJECTED', `Unsafe output field '${key}' was detected.`));
        }
        if (typeof value === 'string') {
          if (value.includes('Bearer ') || value.includes('sessionid=') || value.includes('eyJ')) {
            return err(createSecurityError('SAFE_OUTPUT_REJECTED', 'Unsafe raw content was detected in output.'));
          }
        } else if (typeof value === 'object') {
          stack.push(value);
        }
      }
    }

    return ok(undefined);
  }
}

export type MaskingRequest = {
  payloadId: string;
  payload: unknown;
  findings: SensitiveFinding[];
  mode: MaskingMode;
  scope: TokenScope;
  allowRestoration?: boolean;
};

export type MaskingPipelineDependencies = {
  tokenVault: TokenVault;
};

export class MaskingPipeline {
  private readonly outputValidator = new SafeOutputValidator();

  constructor(private readonly dependencies: MaskingPipelineDependencies) {}

  mask(input: MaskingRequest): Result<MaskedPayload, ReturnType<typeof createSecurityError>> {
    try {
      const serialized = typeof input.payload === 'string' ? input.payload : JSON.stringify(input.payload, null, 0) ?? '';
      const replacements: Array<{ start: number; end: number; text: string }> = [];
      const tokenRefs: IssuedToken[] = [];

      for (const finding of input.findings) {
        const span = finding.span;
        if (!span) {
          continue;
        }

        const useToken = input.mode !== 'redacted' && (input.mode === 'tokenized' || finding.severity !== 'critical');
        const issued = useToken
          ? this.dependencies.tokenVault.issueToken({
              scope: input.scope,
              category: finding.category,
              secret: serialized.slice(span.start, span.end),
              restorationHint: finding.reasonCode,
              restorable: input.allowRestoration ?? true,
            })
          : null;

        if (issued && !issued.ok) {
          return err(createSecurityError('MASKING_FAILED', 'Token issuance failed during masking.', issued.error));
        }

        if (issued?.ok) {
          tokenRefs.push(issued.value);
        }

        replacements.push({
          start: span.start,
          end: span.end,
          text: issued?.ok ? issued.value.token : createRedactedString(finding.category),
        });
      }

      const redactedText = createSafeDisplayString(replaceRanges(serialized, replacements));
      const maskedPayload = {
        id: input.payloadId,
        mode: input.mode,
        redactedText,
        tokenRefs: tokenRefs.map((token) => ({
          token: token.token,
          category: token.category,
          originalLength: token.originalLength,
          restorable: token.restorable,
          restorationHint: token.restorationHint,
        })),
        findings: input.findings,
        safe: true,
      } satisfies MaskedPayload;

      const validation = this.outputValidator.validate(maskedPayload);
      if (!validation.ok) {
        return validation;
      }

      return ok(maskedPayload);
    } catch (cause) {
      return err(createSecurityError('MASKING_FAILED', 'Masking pipeline failed.', cause));
    }
  }
}
