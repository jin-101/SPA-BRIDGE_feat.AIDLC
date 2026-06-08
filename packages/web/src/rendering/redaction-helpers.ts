import { createRedactedString, createSafeDisplayString, isRedactedString } from '@spa-bridge/core-model';

import { renderSafeText } from './safe-content-renderer.js';

export const redactDisplayValue = (value: string, reasonCode?: string) =>
  renderSafeText(isRedactedString(value) ? value : createRedactedString(reasonCode ?? 'WEB_REVIEW_REDACTED'));

export const safeRefLabel = (kind: string, path?: string, id?: string): string =>
  createSafeDisplayString([kind, path ?? id ?? ''].filter(Boolean).join(':'));
