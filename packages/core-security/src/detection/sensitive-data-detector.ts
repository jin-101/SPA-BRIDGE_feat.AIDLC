import { createSafeDisplayString, err, ok, type Result, type SourceRef } from '@spa-bridge/core-model';

import {
  createSecurityError,
  type PayloadRef,
  type SensitiveFinding,
  type SecurityRulePack,
  type SecuritySeverity,
} from '../types.js';

type DetectionPattern = {
  category: string;
  severity: SecuritySeverity;
  regex: RegExp;
};

const DEFAULT_PATTERNS: DetectionPattern[] = [
  { category: 'email', severity: 'medium', regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
  { category: 'bearer-token', severity: 'high', regex: /Bearer\s+[A-Za-z0-9._~-]{12,}/g },
  { category: 'jwt', severity: 'high', regex: /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g },
  { category: 'api-key', severity: 'high', regex: /(?:api[_-]?key|token|secret)\s*[:=]\s*[A-Za-z0-9._~-]{8,}/gi },
  { category: 'session-cookie', severity: 'critical', regex: /(?:sessionid|sid|auth|refresh_token)\s*[:=]\s*[A-Za-z0-9._~-]{8,}/gi },
  { category: 'credit-card', severity: 'critical', regex: /\b(?:\d[ -]*?){13,19}\b/g },
];

const CATEGORY_TO_PATTERN = new Map(DEFAULT_PATTERNS.map((pattern) => [pattern.category, pattern]));

const stableStringify = (value: unknown): string => {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(',')}}`;
  }
  return JSON.stringify(String(value));
};

const allowedCategories = (rulePacks: SecurityRulePack[]): Set<string> => {
  const categories = new Set<string>();
  for (const pack of rulePacks) {
    for (const category of pack.categories) {
      categories.add(category);
    }
  }
  if (categories.size === 0) {
    for (const category of CATEGORY_TO_PATTERN.keys()) {
      categories.add(category);
    }
  }
  return categories;
};

export type SensitiveDataInput = {
  payload: unknown;
  sourceRefs?: SourceRef[];
  payloadId?: string;
  rulePacks?: SecurityRulePack[];
};

export type SensitiveDataDetectionResult = {
  payloadRef: PayloadRef;
  normalizedPayload: string;
  findings: SensitiveFinding[];
  hasSensitiveData: boolean;
};

export class SensitiveDataDetector {
  detect(input: SensitiveDataInput): Result<SensitiveDataDetectionResult, ReturnType<typeof createSecurityError>> {
    try {
      const normalizedPayload = typeof input.payload === 'string' ? input.payload : stableStringify(input.payload);
      const enabledCategories = allowedCategories(input.rulePacks ?? []);
      const payloadRef: PayloadRef = {
        kind: 'payload',
        id: input.payloadId ?? 'payload',
        category: 'transformed',
        sourceRef: input.sourceRefs?.[0],
      };

      const findings: SensitiveFinding[] = [];
      let counter = 0;

      for (const pattern of DEFAULT_PATTERNS) {
        if (!enabledCategories.has(pattern.category)) {
          continue;
        }

        pattern.regex.lastIndex = 0;
        for (const match of normalizedPayload.matchAll(pattern.regex)) {
          const start = match.index ?? -1;
          if (start < 0) {
            continue;
          }
          const end = start + match[0].length;
          findings.push({
            id: `${pattern.category}-${counter += 1}`,
            category: pattern.category,
            severity: pattern.severity,
            message: createSafeDisplayString(`Sensitive ${pattern.category} content detected.`),
            sourceRefs: input.sourceRefs ?? [],
            payloadRefs: [payloadRef],
            span: { start, end },
            rulePackId: input.rulePacks?.find((pack) => pack.categories.includes(pattern.category))?.id,
            reasonCode: 'DETECTED_PATTERN',
          });
        }
      }

      return ok({
        payloadRef,
        normalizedPayload,
        findings,
        hasSensitiveData: findings.length > 0,
      });
    } catch (cause) {
      return err(createSecurityError('DETECTION_FAILED', 'Sensitive data detection failed.', cause));
    }
  }
}

export class FindingMerger {
  merge(findings: SensitiveFinding[]): SensitiveFinding[] {
    const byKey = new Map<string, SensitiveFinding>();
    for (const finding of findings) {
      const start = finding.span?.start ?? -1;
      const end = finding.span?.end ?? -1;
      const sourcePath = finding.sourceRefs[0]?.path ?? '';
      const key = `${finding.category}::${start}::${end}::${sourcePath}::${finding.payloadRefs[0]?.id ?? ''}`;
      if (!byKey.has(key)) {
        byKey.set(key, finding);
      }
    }

    return [...byKey.values()].sort((left, right) => {
      const leftStart = left.span?.start ?? -1;
      const rightStart = right.span?.start ?? -1;
      if (leftStart !== rightStart) {
        return leftStart - rightStart;
      }
      if (left.category !== right.category) {
        return left.category.localeCompare(right.category);
      }
      return left.id.localeCompare(right.id);
    });
  }
}
