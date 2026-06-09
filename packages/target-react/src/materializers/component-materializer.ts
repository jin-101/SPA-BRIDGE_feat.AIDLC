import type { SourceRef } from '@spa-bridge/core-model';
import type { NormalizedFormArray, NormalizedFormControl, NormalizedFormGroup, NormalizedFormModel, ReactComponentDraft } from '@spa-bridge/transform-angular-react';

import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import type { GeneratedFileSpec } from '../types.js';
import { TemplateJsxRenderer, type ComponentRegistryEntry, type TemplateLogicContext } from './template-jsx-renderer.js';

const toComponentName = (name: string): string => name.replace(/[^A-Za-z0-9]/g, '');
const toIdentifier = (name: string, fallback: string): string => {
  const cleaned = name.replace(/[^A-Za-z0-9_$]/g, '');
  if (!cleaned || /^[0-9]/.test(cleaned)) {
    return fallback;
  }
  return cleaned;
};

const toStateSetter = (name: string): string => {
  const id = toIdentifier(name, 'value');
  return `set${id.charAt(0).toUpperCase()}${id.slice(1)}`;
};

const toReactEventName = (name: string): string => {
  const eventMap: Record<string, string> = {
    click: 'onClick',
    input: 'onInput',
    change: 'onChange',
    submit: 'onSubmit',
    focus: 'onFocus',
    blur: 'onBlur',
    keyup: 'onKeyUp',
    keydown: 'onKeyDown',
    mouseenter: 'onMouseEnter',
    mouseleave: 'onMouseLeave',
  };
  return eventMap[name.toLowerCase()] ?? `on${name.charAt(0).toUpperCase()}${name.slice(1)}`;
};

const needsReactImport = (component: ReactComponentDraft): boolean =>
  component.propertyInitializers.length > 0 || component.hooks.length > 0 || component.forms.length > 0;

const normalizeInitializer = (initializer: string | undefined): string => {
  if (!initializer || initializer.trim().length === 0) {
    return 'undefined';
  }

  const trimmed = initializer.trim();
  if (trimmed.startsWith('this.')) {
    return 'undefined';
  }
  return trimmed;
};

type ComponentLogicContext = {
  stateNames: Set<string>;
  propertyNames: Set<string>;
  methodNames: Set<string>;
  propNames: Set<string>;
};

type ComponentMaterializerContext = {
  selectorRegistry: Map<string, ComponentRegistryEntry>;
};

const stripTrailingSemicolon = (value: string): string => value.trim().replace(/;\s*$/, '');

const transformExpression = (expression: string, context: ComponentLogicContext): string => {
  let transformed = stripTrailingSemicolon(expression);

  for (const propName of context.propNames) {
    const escaped = propName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    transformed = transformed.replace(new RegExp(`this\\.${escaped}\\.emit\\(`, 'g'), `props.${propName}?.(`);
  }

  transformed = transformed.replace(/\bthis\.([A-Za-z_$][\w$]*)\b/g, (_match, member: string) => {
    const identifier = toIdentifier(member, 'value');
    if (context.propertyNames.has(member) || context.methodNames.has(member) || context.propNames.has(member)) {
      return identifier;
    }
    return identifier;
  });

  return transformed;
};

const transformTemplateExpression = (expression: string, context: ComponentLogicContext): string => {
  const [baseExpression, ...pipes] = expression.split('|').map((part) => part.trim()).filter(Boolean);
  const transformed = transformExpression(baseExpression ?? expression, context);
  return pipes.length > 0 ? `String(${transformed} ?? '')` : transformed;
};

const transformAngularStatement = (line: string, context: ComponentLogicContext): string[] => {
  const trimmed = line.trim();
  if (!trimmed) {
    return [];
  }

  const assignment = trimmed.match(/^this\.([A-Za-z_$][\w$]*)\s*=\s*(.+);?$/);
  if (assignment) {
    const [, rawName, rawExpression] = assignment;
    if (!rawName || !rawExpression) {
      return [`    // TODO: Review malformed Angular assignment: ${trimmed.replace(/\*\//g, '* /')}`];
    }
    const identifier = toIdentifier(rawName, 'value');
    if (context.stateNames.has(rawName)) {
      return [`    ${toStateSetter(identifier)}(${transformExpression(rawExpression, context)});`];
    }
    return [
      `    // TODO: Review assignment to non-state Angular member '${identifier}'.`,
      `    // ${trimmed.replace(/\*\//g, '* /')}`,
    ];
  }

  const operatorAssignment = trimmed.match(/^this\.([A-Za-z_$][\w$]*)\s*([+\-*/])=\s*(.+);?$/);
  if (operatorAssignment) {
    const [, rawName, operator, rawExpression] = operatorAssignment;
    if (!rawName || !operator || !rawExpression) {
      return [`    // TODO: Review malformed Angular operator assignment: ${trimmed.replace(/\*\//g, '* /')}`];
    }
    const identifier = toIdentifier(rawName, 'value');
    if (context.stateNames.has(rawName)) {
      return [`    ${toStateSetter(identifier)}((previous) => previous ${operator} (${transformExpression(rawExpression, context)}));`];
    }
  }

  const increment = trimmed.match(/^this\.([A-Za-z_$][\w$]*)(\+\+|--);?$/);
  if (increment) {
    const [, rawName, operator] = increment;
    if (!rawName || !operator) {
      return [`    // TODO: Review malformed Angular increment: ${trimmed.replace(/\*\//g, '* /')}`];
    }
    const identifier = toIdentifier(rawName, 'value');
    if (context.stateNames.has(rawName)) {
      const delta = operator === '++' ? '+ 1' : '- 1';
      return [`    ${toStateSetter(identifier)}((previous) => Number(previous ?? 0) ${delta});`];
    }
  }

  const returnStatement = trimmed.match(/^return\s+(.+);?$/);
  if (returnStatement?.[1]) {
    return [`    return ${transformExpression(returnStatement[1], context)};`];
  }

  const transformed = transformExpression(trimmed, context);
  if (transformed !== trimmed) {
    return [`    ${stripTrailingSemicolon(transformed)};`];
  }

  return [
    `    // TODO: Review Angular-specific statement before enabling.`,
    `    // ${trimmed.replace(/\*\//g, '* /')}`,
  ];
};

const renderConvertedBody = (bodyText: string, context: ComponentLogicContext): string[] => {
  if (!bodyText.trim()) {
    return ['    // Original Angular method had no body.'];
  }

  const convertedLines = bodyText
    .split('\n')
    .slice(0, 80)
    .flatMap((line) => transformAngularStatement(line, context));

  return convertedLines.length > 0 ? convertedLines : ['    // Original Angular method body could not be converted safely.'];
};

const toSourceRelativeComponentPath = (component: ReactComponentDraft): string => {
  const sourcePath = component.sourceRef?.path ?? component.sourceRelativePath ?? component.name;
  const normalized = sourcePath.replace(/\\/g, '/');
  const srcIndex = normalized.lastIndexOf('/src/');
  const relative = srcIndex >= 0 ? normalized.slice(srcIndex + '/src/'.length) : normalized.split('/').slice(-2).join('/');
  const withoutExtension = relative
    .replace(/\.ts$/i, '')
    .replace(/\.component$/i, '')
    .replace(/\.page$/i, '')
    .replace(/\.container$/i, '');
  const safeRelative = withoutExtension
    .split('/')
    .map((segment) => segment.replace(/[^A-Za-z0-9._-]/g, '-'))
    .filter(Boolean)
    .join('/');
  return `src/${safeRelative}/${toComponentName(component.name) || 'Component'}.tsx`;
};

const toRelativeImport = (fromPath: string, toPath: string): string => {
  const fromDir = fromPath.split('/').slice(0, -1).join('/');
  const fromParts = fromDir.split('/').filter(Boolean);
  const toParts = toPath.replace(/\.tsx$/i, '.js').split('/').filter(Boolean);
  while (fromParts.length > 0 && toParts.length > 0 && fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }
  const prefix = fromParts.length > 0 ? '../'.repeat(fromParts.length) : './';
  return `${prefix}${toParts.join('/')}`;
};

const propertyDecorators = (property: ReactComponentDraft['propertyInitializers'][number]): string[] =>
  Array.isArray(property.decorators) ? property.decorators : [];

const isFormProperty = (component: ReactComponentDraft, propertyName: string): boolean =>
  component.forms.some((form) => form.rootControl.name === propertyName);

const collectControls = (form: NormalizedFormModel): NormalizedFormControl[] => {
  const visit = (node: NormalizedFormControl | NormalizedFormGroup | NormalizedFormArray): NormalizedFormControl[] => {
    if ('controls' in node) {
      return [
        ...node.controls,
        ...node.groups.flatMap(visit),
        ...node.arrays.flatMap(visit),
      ];
    }
    if ('initialItems' in node) {
      return node.initialItems.flatMap(visit);
    }
    return [node];
  };
  return visit(form.rootControl);
};

const validatorFactory = (validator: NormalizedFormControl['validators'][number]): string | undefined => {
  const firstArg = validator.arguments[0];
  switch (validator.kind) {
    case 'required':
      return 'formValidators.required()';
    case 'minLength':
      return `formValidators.minLength(${firstArg ?? 0})`;
    case 'maxLength':
      return `formValidators.maxLength(${firstArg ?? 0})`;
    case 'pattern':
      return `formValidators.pattern(${firstArg ?? "''"})`;
    case 'email':
      return 'formValidators.email()';
    case 'min':
      return `formValidators.min(${firstArg ?? 0})`;
    case 'max':
      return `formValidators.max(${firstArg ?? 0})`;
    default:
      return undefined;
  }
};

const renderInitialValue = (control: NormalizedFormControl): string => {
  const value = control.initialValue?.trim();
  if (!value || /^this\./.test(value) || /new\s+/.test(value)) {
    return "''";
  }
  return value;
};

const renderFormLines = (component: ReactComponentDraft): string[] => {
  if (component.forms.length === 0) {
    return [];
  }

  const lines: string[] = [];
  const emittedControls = new Set<string>();
  for (const form of component.forms) {
    for (const control of collectControls(form)) {
      const controlIdentifier = `${toIdentifier(control.name, 'control')}Control`;
      if (emittedControls.has(controlIdentifier)) continue;
      emittedControls.add(controlIdentifier);
      const validatorCalls = control.validators.map(validatorFactory).filter((value): value is string => Boolean(value));
      const reviewValidators = [...control.validators, ...control.asyncValidators].filter((validator) => validator.reviewRequired);
      if (reviewValidators.length > 0) {
        lines.push(`  /* AIDLC_MANUAL_REVIEW_FORM: validators for '${control.path}' need manual parity review. */`);
      }
      lines.push(`  const ${controlIdentifier} = useFormControl(${renderInitialValue(control)}, [${validatorCalls.join(', ')}]);`);
    }

    const rootName = toIdentifier(form.rootControl.name, 'form');
    if ('controls' in form.rootControl) {
      const controlEntries = collectControls(form)
        .filter((control) => !control.path.includes('['))
        .map((control) => `    ${toIdentifier(control.name, 'control')}: ${toIdentifier(control.name, 'control')}Control,`);
      lines.push(`  const ${rootName} = useFormGroup({`);
      lines.push(...controlEntries);
      lines.push('  });');
    }
    if ('initialItems' in form.rootControl) {
      lines.push(`  const ${rootName} = useFormArray([]);`);
    }
  }
  return lines.length > 0 ? [...lines, ''] : [];
};

export class ComponentMaterializer {
  constructor(private readonly templateRenderer = new TemplateJsxRenderer()) {}

  materialize(component: ReactComponentDraft, sourceRefs: SourceRef[] = [], context: ComponentMaterializerContext = { selectorRegistry: new Map() }): GeneratedFileSpec[] {
    const safeName = toComponentName(component.name) || 'Component';
    const componentPath = toSourceRelativeComponentPath(component);
    const eventEmitterNames = new Set(component.propertyInitializers.filter((property) => property.isEventEmitter).map((property) => property.name));
    const propsType = component.props.length > 0
      ? `type Props = {\n${component.props.map((prop) => {
          const propName = prop.replace(/[^A-Za-z0-9_]/g, '');
          return eventEmitterNames.has(prop) ? `  ${propName}?: (value?: unknown) => void;` : `  ${propName}?: unknown;`;
        }).join('\n')}\n};`
      : 'type Props = Record<string, never>;';
    const styleImports = component.styleUrls.map((styleUrl) => {
      const extension = styleUrl.match(/\.[A-Za-z0-9]+$/)?.[0] ?? '.css';
      return `import '${toRelativeImport(componentPath, `src/styles/components/${safeName}${extension}`)}';`;
    });
    const imports = [
      ...(needsReactImport(component) ? ["import { useEffect, useState } from 'react';"] : []),
      ...(component.forms.length > 0 ? [`import { useFormArray, useFormControl, useFormGroup, validators as formValidators } from '${toRelativeImport(componentPath, 'src/utils/forms/index')}';`] : []),
      ...styleImports,
      ...(needsReactImport(component) || styleImports.length > 0 || component.forms.length > 0 ? [''] : []),
    ];
    const logicContext: ComponentLogicContext = {
      stateNames: new Set(component.propertyInitializers.filter((property) => !property.readonly && !property.isEventEmitter && !propertyDecorators(property).includes('Input')).map((property) => property.name)),
      propertyNames: new Set(component.propertyInitializers.map((property) => property.name)),
      methodNames: new Set(component.methods.map((method) => method.name)),
      propNames: new Set(component.props),
    };
    const stateLines = component.propertyInitializers
      .filter((property) => !property.readonly && !property.isEventEmitter && !propertyDecorators(property).includes('Input') && !isFormProperty(component, property.name))
      .map((property) => {
        const id = toIdentifier(property.name, 'value');
        return `  const [${id}, ${toStateSetter(id)}] = useState(${normalizeInitializer(property.initializer)});`;
      });
    const readonlyLines = component.propertyInitializers
      .filter((property) => property.readonly || propertyDecorators(property).includes('Input'))
      .map((property) => {
        const identifier = toIdentifier(property.name, 'value');
        return propertyDecorators(property).includes('Input')
          ? `  const ${identifier} = props.${identifier};`
          : `  const ${identifier} = ${normalizeInitializer(property.initializer)};`;
      });
    const lifecycleMethodNames = ['ngOnInit', 'ngOnDestroy', 'ngOnChanges', 'ngAfterViewInit', 'ngAfterContentInit'];
    const lifecycleMethods = component.methods.filter((method) => lifecycleMethodNames.includes(method.name));
    const lifecycleLines = lifecycleMethods.length > 0
      ? lifecycleMethods.flatMap((method) => [
          '  useEffect(() => {',
          ...renderConvertedBody(method.bodyText, logicContext),
          ...(method.name === 'ngOnDestroy'
            ? ['    return () => {', '      // TODO: Move Angular destroy cleanup here if needed.', '    };']
            : []),
          '  }, []);',
        ])
      : component.hooks.flatMap((hook) => [
          '  useEffect(() => {',
          `    // TODO: Map Angular lifecycle '${hook.intent}' safely.`,
          '  }, []);',
        ]);
    const methodLines = component.methods
      .filter((method) => !['ngOnInit', 'ngOnDestroy', 'ngOnChanges', 'ngAfterViewInit', 'ngAfterContentInit'].includes(method.name))
      .flatMap((method) => {
        const asyncPrefix = method.isAsync ? 'async ' : '';
        const params = method.parameters.join(', ');
        return [
          `  const ${toIdentifier(method.name, 'handler')} = ${asyncPrefix}(${params}) => {`,
          ...renderConvertedBody(method.bodyText, logicContext),
          '  };',
          '',
        ];
      });
    const usedIdentifiers = [
      ...component.propertyInitializers.map((property) => toIdentifier(property.name, 'value')),
      ...component.methods
        .filter((method) => !['ngOnInit', 'ngOnDestroy', 'ngOnChanges', 'ngAfterViewInit', 'ngAfterContentInit'].includes(method.name))
        .map((method) => toIdentifier(method.name, 'handler')),
    ];
    const templateLogicContext: TemplateLogicContext = {
      ...logicContext,
      transformExpression: (expression) => transformExpression(expression, logicContext),
      transformTemplateExpression: (expression) => transformTemplateExpression(expression, logicContext),
      toStateSetter,
      toIdentifier,
      formControlNames: new Set(component.forms.flatMap((form) => collectControls(form).map((control) => control.name))),
    };
    const template = this.templateRenderer.render(component.templateRawText, component.templateIr, templateLogicContext, context.selectorRegistry);
    const customComponentImports = template.usedSelectors
      .map((selector) => context.selectorRegistry.get(selector))
      .filter((entry): entry is ComponentRegistryEntry => !!entry && entry.name !== safeName)
      .map((entry) => `import { ${entry.name} } from '${toRelativeImport(componentPath, entry.path)}';`);
    const eventEmitterLines = [...eventEmitterNames].sort().map((eventName) => {
      const identifier = toIdentifier(eventName, 'event');
      return `  const ${identifier} = { emit: (value?: unknown) => props.${identifier}?.(value) };`;
    });
    const fallbackTemplateLines = [
      `      <h2>${safeName}</h2>`,
      ...(component.propertyInitializers.length > 0
        ? component.propertyInitializers.map((property) => `      <p data-field="${toIdentifier(property.name, 'value')}">{String(${toIdentifier(property.name, 'value')} ?? '')}</p>`)
        : []),
    ];

    const content = [
      ...imports,
      ...customComponentImports,
      ...(customComponentImports.length > 0 ? [''] : []),
      propsType,
      '',
      `export const ${safeName} = (props: Props) => {`,
      '  void props;',
      ...stateLines,
      ...readonlyLines,
      ...eventEmitterLines,
      ...(stateLines.length > 0 || readonlyLines.length > 0 || eventEmitterLines.length > 0 ? [''] : []),
      ...renderFormLines(component),
      ...lifecycleLines,
      ...(lifecycleLines.length > 0 ? [''] : []),
      ...methodLines,
      ...this.renderTemplateHelpers(template.helpers),
      ...usedIdentifiers.map((identifier) => `  void ${identifier};`),
      ...(usedIdentifiers.length > 0 ? [''] : []),
      '  return (',
      `    <section data-component="${safeName}">`,
      ...(template.lines.length > 0 ? template.lines : fallbackTemplateLines),
      '    </section>',
      '  );',
      '};',
      '',
    ].join('\n');

    const componentFile = createFileSpec({
        path: componentPath,
        kind: 'component',
        content,
        sourceRefs,
        overwrite: true,
      });
    const styleFiles = component.styleUrls.map((styleUrl) => {
      const extension = styleUrl.match(/\.[A-Za-z0-9]+$/)?.[0] ?? '.css';
      return createFileSpec({
        path: `src/styles/components/${safeName}${extension}`,
        kind: 'scaffold',
        content: [
          `/* Converted style placeholder for ${safeName}. */`,
          `/* Original Angular style reference: ${styleUrl.replace(/\*\//g, '* /')} */`,
          '',
        ].join('\n'),
        sourceRefs,
        overwrite: true,
      });
    });

    return [componentFile, ...styleFiles];
  }

  materializeMany(components: ReactComponentDraft[], sourceRef: SourceRef): GeneratedFileSpec[] {
    const selectorRegistry = new Map(
      components
        .filter((component) => component.selector)
        .map((component) => [component.selector as string, { name: toComponentName(component.name) || 'Component', path: toSourceRelativeComponentPath(component) }]),
    );
    return components.flatMap((component) => this.materialize(component, [sourceRef], { selectorRegistry }));
  }

  private renderTemplateHelpers(helpers: string[]): string[] {
    const lines: string[] = [];
    if (helpers.includes('applyClassMap')) {
      lines.push(
        '  const applyClassMap = (value: unknown): string => {',
        "    if (typeof value === 'string') return value;",
        '    if (Array.isArray(value)) return value.filter(Boolean).join(\' \');',
        "    if (value && typeof value === 'object') return Object.entries(value as Record<string, unknown>).filter(([, enabled]) => Boolean(enabled)).map(([name]) => name).join(' ');",
        "    return '';",
        '  };',
        '',
      );
    }
    if (helpers.includes('applyStyleMap')) {
      lines.push(
        '  const applyStyleMap = (value: unknown) => {',
        "    return value && typeof value === 'object' ? (value as Record<string, string | number>) : {};",
        '  };',
        '',
      );
    }
    for (const helper of helpers.filter((name) => name.startsWith('format') && name.endsWith('Pipe'))) {
      if (helper === 'formatUnknownPipe') {
        lines.push(`  const ${helper} = (_pipeName: string, value: unknown): string => String(value ?? '');`, '');
      } else {
        lines.push(`  const ${helper} = (value: unknown): string => String(value ?? '');`, '');
      }
    }
    return lines;
  }
}
