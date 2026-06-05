export type TargetEcosystemMetadataEntry = {
  category: string;
  description: string;
  keywords: string[];
};

export const targetEcosystemMetadataCatalog: TargetEcosystemMetadataEntry[] = [
  { category: 'component', description: 'Component conversion hints and target file patterns.', keywords: ['Angular 15', 'React', 'TSX'] },
  { category: 'routing', description: 'Route table conversion hints.', keywords: ['router', 'route guards', 'lazy load'] },
  { category: 'state', description: 'State strategy conversion hints.', keywords: ['service', 'signals', 'store', 'local'] },
  { category: 'forms', description: 'Form conversion hints for template bindings and validation.', keywords: ['forms', 'controls', 'validation'] },
  { category: 'ecosystem', description: 'Third-party package categories relevant to the first target application.', keywords: ['NgRx', 'i18n', 'animation', 'map', 'qr', 'barcode', 'service-worker'] },
];
