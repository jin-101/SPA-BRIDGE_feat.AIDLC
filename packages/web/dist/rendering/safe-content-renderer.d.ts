import type { WebKeyValueRow, WebSectionModel, WebTextFragment } from '../types.js';
export declare const escapeHtml: (value: string) => string;
export declare const renderSafeText: (value: string) => WebTextFragment;
export declare const renderSafeLabel: (value: string) => string;
export declare const createKeyValueRow: (label: string, value: string) => WebKeyValueRow;
export declare const createSectionModel: (id: string, title: string, rows: Array<WebKeyValueRow | [string, string]>, detail?: string) => WebSectionModel;
export declare const renderSectionRowsToHtml: (section: WebSectionModel) => string;
export declare const renderSectionsToHtml: (sections: WebSectionModel[]) => string;
export declare const renderSectionsToText: (sections: WebSectionModel[]) => string;
//# sourceMappingURL=safe-content-renderer.d.ts.map