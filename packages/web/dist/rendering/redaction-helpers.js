import { createRedactedString, createSafeDisplayString, isRedactedString } from '@spa-bridge/core-model';
import { renderSafeText } from './safe-content-renderer.js';
export const redactDisplayValue = (value, reasonCode) => renderSafeText(isRedactedString(value) ? value : createRedactedString(reasonCode ?? 'WEB_REVIEW_REDACTED'));
export const safeRefLabel = (kind, path, id) => createSafeDisplayString([kind, path ?? id ?? ''].filter(Boolean).join(':'));
//# sourceMappingURL=redaction-helpers.js.map