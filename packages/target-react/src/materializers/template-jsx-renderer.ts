import type { TemplateIr } from '@spa-bridge/source-angular';

export type TemplateLogicContext = {
  stateNames: Set<string>;
  propertyNames: Set<string>;
  methodNames: Set<string>;
  propNames: Set<string>;
  transformExpression: (expression: string) => string;
  transformTemplateExpression: (expression: string) => string;
  toStateSetter: (name: string) => string;
  toIdentifier: (name: string, fallback: string) => string;
  formControlNames?: Set<string>;
};

export type ComponentRegistryEntry = {
  name: string;
  path: string;
};

export type TemplateJsxRenderResult = {
  lines: string[];
  usedSelectors: string[];
  helpers: string[];
  diagnostics: string[];
};

const knownDisplayPipes = new Set(['date', 'number', 'currency', 'uppercase', 'lowercase', 'json']);

const stripTrailingSemicolon = (value: string): string => value.trim().replace(/;\s*$/, '');

const rewriteAssetPath = (value: string): string => {
  if (/^(https?:|data:|\/)/i.test(value)) {
    return value;
  }
  if (value.startsWith('assets/')) {
    return `/${value}`;
  }
  return value;
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

const toControlIdentifier = (name: string, context: TemplateLogicContext): string =>
  `${context.toIdentifier(name.split('.').at(-1) ?? name, 'control')}Control`;

const parseNgFor = (expression: string): { item: string; iterable: string; index: string; trackBy?: string } | undefined => {
  const itemMatch = expression.match(/let\s+([A-Za-z_$][\w$]*)\s+of\s+([^;]+)/);
  if (!itemMatch?.[1] || !itemMatch[2]) {
    return undefined;
  }
  const indexMatch = expression.match(/index\s+as\s+([A-Za-z_$][\w$]*)/);
  const trackByMatch = expression.match(/trackBy\s*:\s*([^;]+)/);
  return {
    item: itemMatch[1],
    iterable: itemMatch[2].trim(),
    index: indexMatch?.[1] ?? 'index',
    trackBy: trackByMatch?.[1]?.trim(),
  };
};

const splitPipes = (expression: string): { base: string; pipes: string[] } => {
  const [base = expression, ...pipes] = expression.split('|').map((part) => part.trim()).filter(Boolean);
  return { base, pipes };
};

const renderPipeExpression = (
  expression: string,
  context: TemplateLogicContext,
  helpers: Set<string>,
  diagnostics: string[],
): string => {
  const { base, pipes } = splitPipes(expression);
  let current = context.transformExpression(base);
  for (const pipe of pipes) {
    const [pipeName = pipe, ...args] = pipe.split(':').map((part) => part.trim());
    if (pipeName === 'async') {
      diagnostics.push('async-pipe-handoff');
      current = context.transformTemplateExpression(`${base} | async`);
      continue;
    }
    if (!knownDisplayPipes.has(pipeName)) {
      helpers.add('formatUnknownPipe');
      diagnostics.push(`unknown-pipe:${pipeName}`);
      current = `formatUnknownPipe(${JSON.stringify(pipeName)}, ${current})`;
      continue;
    }
    const helperName = `format${pipeName.charAt(0).toUpperCase()}${pipeName.slice(1)}Pipe`;
    helpers.add(helperName);
    current = `${helperName}(${[current, ...args.map((arg) => context.transformExpression(arg))].join(', ')})`;
  }
  return current;
};

const transformNgClass = (expression: string, context: TemplateLogicContext, helpers: Set<string>): string => {
  helpers.add('applyClassMap');
  return `className={applyClassMap(${context.transformExpression(expression)})}`;
};

const transformNgStyle = (expression: string, context: TemplateLogicContext, helpers: Set<string>): string => {
  helpers.add('applyStyleMap');
  return `style={applyStyleMap(${context.transformExpression(expression)})}`;
};

export class TemplateJsxRenderer {
  render(
    templateText: string | undefined,
    templateIr: TemplateIr | undefined,
    context: TemplateLogicContext,
    selectorRegistry: Map<string, ComponentRegistryEntry>,
  ): TemplateJsxRenderResult {
    if (!templateText?.trim()) {
      return { lines: [], usedSelectors: [], helpers: [], diagnostics: [] };
    }

    const usedSelectors = new Set<string>();
    const helpers = new Set<string>();
    const diagnostics: string[] = [...(templateIr?.diagnostics.map((diagnostic) => diagnostic.code) ?? [])];
    const deferredTemplates = new Map<string, string>();
    let jsx = templateText.slice(0, 12_000).replace(/<!--[\s\S]*?-->/g, '');

    jsx = jsx.replace(/<ng-template\s+#([A-Za-z_$][\w$]*)[^>]*>([\s\S]*?)<\/ng-template>/g, (_match, name: string, body: string) => {
      deferredTemplates.set(name, body.trim());
      return '';
    });

    jsx = jsx.replace(/<ng-container([^>]*)>([\s\S]*?)<\/ng-container>/g, '<>$2</>');
    jsx = jsx.replace(/<ng-content[^>]*><\/ng-content>|<ng-content[^>]*\/>/g, '{props.children}');

    jsx = jsx.replace(/<([A-Za-z][A-Za-z0-9-]*)([^>]*)\s\*ngIf="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g, (_match, tag: string, before: string, expression: string, after: string, body: string) => {
      const elseMatch = expression.match(/^(.+?);\s*else\s+([A-Za-z_$][\w$]*)/);
      const condition = context.transformTemplateExpression(elseMatch?.[1] ?? expression);
      const inner = `<${tag}${before}${after}>${body}</${tag}>`;
      if (elseMatch?.[2]) {
        const elseBody = deferredTemplates.get(elseMatch[2]);
        if (elseBody) {
          return `{${condition} ? (${inner}) : (${elseBody})}`;
        }
        diagnostics.push(`unresolved-ngif-else:${elseMatch[2]}`);
      }
      return `{${condition} && (${inner})}`;
    });

    jsx = jsx.replace(/<([A-Za-z][A-Za-z0-9-]*)([^>]*)\s\*ngFor="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g, (_match, tag: string, before: string, expression: string, after: string, body: string) => {
      const parsed = parseNgFor(expression);
      if (!parsed) {
        diagnostics.push('unsupported-ngfor');
        return `<${tag}${before}${after}>${body}</${tag}>`;
      }
      const iterable = context.transformExpression(parsed.iterable);
      const key = parsed.trackBy ? `${context.transformExpression(parsed.trackBy)}(${parsed.item}, ${parsed.index})` : `${parsed.item}?.id ?? ${parsed.index}`;
      if (parsed.trackBy) {
        diagnostics.push('trackby-review');
      }
      return `{(${iterable} ?? []).map((${parsed.item}, ${parsed.index}) => (<${tag}${before}${after} key={${key}}>${body}</${tag}>))}`;
    });

    jsx = jsx
      .replace(/\s+class=/g, ' className=')
      .replace(/\s+for=/g, ' htmlFor=')
      .replace(/\s+\[formGroup\]="([^"]+)"/g, '')
      .replace(/\s+formGroupName=["']([^"']+)["']/g, '')
      .replace(/\s+formArrayName=["']([^"']+)["']/g, (_match, name: string) => {
        diagnostics.push(`form-array-review:${name}`);
        return ` data-form-array="${name}"`;
      })
      .replace(/\s+\(ngSubmit\)="([^"]+)"/g, (_match, expression: string) => {
        const transformed = context.transformExpression(expression.replace(/\$event/g, 'event'));
        return ` onSubmit={(event) => { event.preventDefault(); ${stripTrailingSemicolon(transformed)}; }}`;
      })
      .replace(/\s+formControlName=["']([^"']+)["']/g, (_match, name: string) => ` {...${toControlIdentifier(name, context)}.inputProps}`)
      .replace(/\s+\[ngClass\]="([^"]+)"/g, (_match, expression: string) => ` ${transformNgClass(expression, context, helpers)}`)
      .replace(/\s+\[ngStyle\]="([^"]+)"/g, (_match, expression: string) => ` ${transformNgStyle(expression, context, helpers)}`)
      .replace(/\s+\[\((ngModel)\)\]="([^"]+)"/g, (_match, _name: string, model: string) => {
        const identifier = context.toIdentifier(model.replace(/^this\./, ''), 'value');
        diagnostics.push('ngmodel-form-handoff');
        return ` {...${identifier}Control.inputProps}`;
      })
      .replace(/\s+\[ngModel\]="([^"]+)"/g, (_match, model: string) => {
        const identifier = context.toIdentifier(model.replace(/^this\./, ''), 'value');
        diagnostics.push('ngmodel-form-handoff');
        return ` {...${identifier}Control.inputProps}`;
      })
      .replace(/\s+\(ngModelChange\)="([^"]+)"/g, (_match, expression: string) => {
        const transformed = context.transformExpression(expression.replace(/\$event/g, 'event.target.value'));
        diagnostics.push('ngmodel-change-handoff');
        return ` onChange={(event) => ${stripTrailingSemicolon(transformed)}}`;
      })
      .replace(/\s+\[([A-Za-z0-9_.:-]+)\]="([^"]+)"/g, (_match, property: string, expression: string) => {
        if (property.startsWith('class.')) {
          helpers.add('applyClassMap');
          return ` className={applyClassMap({ ${JSON.stringify(property.slice('class.'.length))}: ${context.transformExpression(expression)} })}`;
        }
        if (property.startsWith('style.')) {
          helpers.add('applyStyleMap');
          const styleName = property.slice('style.'.length).replace(/\.px$/, '');
          return ` style={applyStyleMap({ ${JSON.stringify(styleName)}: ${context.transformExpression(expression)} })}`;
        }
        const prop = property === 'class' ? 'className' : property.replace(/^attr\./, '');
        return ` ${prop}={${renderPipeExpression(expression, context, helpers, diagnostics)}}`;
      })
      .replace(/\s+\(([A-Za-z0-9_.:-]+)\)="([^"]+)"/g, (_match, eventName: string, expression: string) => {
        const transformed = context.transformExpression(expression.replace(/\$event/g, 'event'));
        return ` ${toReactEventName(eventName)}={(event) => ${stripTrailingSemicolon(transformed)}}`;
      })
      .replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_match, expression: string) => `{${renderPipeExpression(expression, context, helpers, diagnostics)}}`)
      .replace(/\s(src|href)=["']([^"']+)["']/g, (_match, attr: string, value: string) => {
        if (/^javascript:/i.test(value)) {
          diagnostics.push('unsafe-reference');
          return ` data-review-${attr}="${value.replace(/"/g, '&quot;')}"`;
        }
        return ` ${attr}="${rewriteAssetPath(value)}"`;
      })
      .replace(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*?)(?<!\/)>/g, '<$1$2 />');

    for (const [selector, entry] of [...selectorRegistry.entries()].sort(([left], [right]) => right.length - left.length)) {
      const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const tagPattern = new RegExp(`(<\\/?\\s*)${escaped}(?=[\\s>/])`, 'gi');
      if (tagPattern.test(jsx)) {
        usedSelectors.add(selector);
        jsx = jsx.replace(tagPattern, `$1${entry.name}`);
      }
    }

    if (/<[a-z]+-[a-z0-9-]+/i.test(jsx)) {
      diagnostics.push('unknown-custom-selector');
    }

    if (!jsx.trim().startsWith('<') && !jsx.trim().startsWith('{')) {
      jsx = `<>{${JSON.stringify(jsx.trim())}}</>`;
    }

    return {
      lines: [
        '      {/* Converted from Angular template. Review generated diagnostics for advanced constructs. */}',
        ...jsx
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => `      ${line}`),
      ],
      usedSelectors: [...usedSelectors].sort(),
      helpers: [...helpers].sort(),
      diagnostics: [...new Set(diagnostics)].sort(),
    };
  }
}
