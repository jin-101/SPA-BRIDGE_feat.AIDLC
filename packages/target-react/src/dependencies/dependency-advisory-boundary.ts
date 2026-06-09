import type { DependencyCompatibilityAction } from '../types.js';

export type DependencyAdvisoryCandidate = {
  packageName: string;
  recommendedAction: DependencyCompatibilityAction;
  targetPackageName?: string;
  rationale?: string;
  confidence: number;
};

export type DependencyAdvisoryResponse = {
  schemaVersion: 1;
  candidates: DependencyAdvisoryCandidate[];
};

const isAction = (value: unknown): value is DependencyCompatibilityAction =>
  value === 'carry' || value === 'replace' || value === 'remove' || value === 'review';

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

export class DependencyAdvisoryBoundary {
  parseAdvisoryJson(raw: string): DependencyAdvisoryResponse {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return this.normalize(parsed);
    } catch {
      return { schemaVersion: 1, candidates: [] };
    }
  }

  normalize(value: unknown): DependencyAdvisoryResponse {
    if (!value || typeof value !== 'object') {
      return { schemaVersion: 1, candidates: [] };
    }

    const candidates = Array.isArray((value as { candidates?: unknown }).candidates)
      ? (value as { candidates: unknown[] }).candidates
      : [];

    return {
      schemaVersion: 1,
      candidates: candidates
        .map((candidate) => this.normalizeCandidate(candidate))
        .filter((candidate): candidate is DependencyAdvisoryCandidate => Boolean(candidate))
        .sort((left, right) => left.packageName.localeCompare(right.packageName)),
    };
  }

  private normalizeCandidate(candidate: unknown): DependencyAdvisoryCandidate | undefined {
    if (!candidate || typeof candidate !== 'object') {
      return undefined;
    }

    const record = candidate as Record<string, unknown>;
    const packageName = record.packageName;
    const recommendedAction = record.recommendedAction;
    const confidence = record.confidence;

    if (!isNonEmptyString(packageName) || !isAction(recommendedAction) || typeof confidence !== 'number' || confidence < 0.8) {
      return undefined;
    }

    const normalized: DependencyAdvisoryCandidate = {
      packageName,
      recommendedAction,
      confidence,
    };

    if (isNonEmptyString(record.targetPackageName)) {
      normalized.targetPackageName = record.targetPackageName;
    }

    if (isNonEmptyString(record.rationale)) {
      normalized.rationale = record.rationale;
    }

    return normalized;
  }
}
