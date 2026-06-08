import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
const toComponentName = (name) => name.replace(/[^A-Za-z0-9]/g, '');
const toIdentifier = (name, fallback) => {
    const cleaned = name.replace(/[^A-Za-z0-9_$]/g, '');
    if (!cleaned || /^[0-9]/.test(cleaned)) {
        return fallback;
    }
    return cleaned;
};
const toStateSetter = (name) => {
    const id = toIdentifier(name, 'value');
    return `set${id.charAt(0).toUpperCase()}${id.slice(1)}`;
};
const toReactEventName = (name) => {
    const eventMap = {
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
const needsReactImport = (component) => component.propertyInitializers.length > 0 || component.hooks.length > 0;
const normalizeInitializer = (initializer) => {
    if (!initializer || initializer.trim().length === 0) {
        return 'undefined';
    }
    const trimmed = initializer.trim();
    if (trimmed.startsWith('this.')) {
        return 'undefined';
    }
    return trimmed;
};
const stripTrailingSemicolon = (value) => value.trim().replace(/;\s*$/, '');
const transformExpression = (expression, context) => {
    let transformed = stripTrailingSemicolon(expression);
    for (const propName of context.propNames) {
        const escaped = propName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        transformed = transformed.replace(new RegExp(`this\\.${escaped}\\.emit\\(`, 'g'), `props.${propName}?.(`);
    }
    transformed = transformed.replace(/\bthis\.([A-Za-z_$][\w$]*)\b/g, (_match, member) => {
        const identifier = toIdentifier(member, 'value');
        if (context.propertyNames.has(member) || context.methodNames.has(member) || context.propNames.has(member)) {
            return identifier;
        }
        return identifier;
    });
    return transformed;
};
const transformTemplateExpression = (expression, context) => {
    const [baseExpression, ...pipes] = expression.split('|').map((part) => part.trim()).filter(Boolean);
    const transformed = transformExpression(baseExpression ?? expression, context);
    return pipes.length > 0 ? `String(${transformed} ?? '')` : transformed;
};
const transformAngularStatement = (line, context) => {
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
const renderConvertedBody = (bodyText, context) => {
    if (!bodyText.trim()) {
        return ['    // Original Angular method had no body.'];
    }
    const convertedLines = bodyText
        .split('\n')
        .slice(0, 80)
        .flatMap((line) => transformAngularStatement(line, context));
    return convertedLines.length > 0 ? convertedLines : ['    // Original Angular method body could not be converted safely.'];
};
const rewriteAssetPath = (value) => {
    if (/^(https?:|data:|\/)/i.test(value)) {
        return value;
    }
    if (value.startsWith('assets/')) {
        return `/${value}`;
    }
    return value;
};
const convertAngularTemplateToJsx = (templateText, context) => {
    if (!templateText?.trim()) {
        return [];
    }
    let jsx = templateText
        .slice(0, 8_000)
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+\*ngIf="([^"]+)"/g, (_match, expression) => ` data-ng-if="${transformTemplateExpression(expression, context)}"`)
        .replace(/\s+\*ngFor="([^"]+)"/g, (_match, expression) => ` data-ng-for="${expression.replace(/"/g, '&quot;')}"`)
        .replace(/\s+class=/g, ' className=')
        .replace(/\s+for=/g, ' htmlFor=')
        .replace(/\s+\[\((ngModel)\)\]="([^"]+)"/g, (_match, _name, model) => {
        const identifier = toIdentifier(model.replace(/^this\./, ''), 'value');
        return ` value={${identifier} ?? ''} onChange={(event) => ${toStateSetter(identifier)}((event.target as HTMLInputElement).value)}`;
    })
        .replace(/\s+\[([A-Za-z0-9_.:-]+)\]="([^"]+)"/g, (_match, property, expression) => {
        const prop = property === 'class' ? 'className' : property;
        return ` ${prop}={${transformTemplateExpression(expression, context)}}`;
    })
        .replace(/\s+\(([A-Za-z0-9_.:-]+)\)="([^"]+)"/g, (_match, eventName, expression) => {
        const transformed = transformExpression(expression.replace(/\$event/g, 'event'), context);
        return ` ${toReactEventName(eventName)}={(event) => ${stripTrailingSemicolon(transformed)}}`;
    })
        .replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_match, expression) => `{${transformTemplateExpression(expression, context)}}`)
        .replace(/\s(src|href)=["']([^"']+)["']/g, (_match, attr, value) => ` ${attr}="${rewriteAssetPath(value)}"`)
        .replace(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*?)(?<!\/)>/g, '<$1$2 />');
    if (!jsx.trim().startsWith('<')) {
        jsx = `<>{${JSON.stringify(jsx.trim())}}</>`;
    }
    return [
        '      {/* Converted from Angular template. Review data-ng-* markers for structural directives. */}',
        ...jsx
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => `      ${line}`),
    ];
};
export class ComponentMaterializer {
    materialize(component, sourceRefs = []) {
        const safeName = toComponentName(component.name) || 'Component';
        const propsType = component.props.length > 0
            ? `type Props = {\n${component.props.map((prop) => `  ${prop.replace(/[^A-Za-z0-9_]/g, '')}?: unknown;`).join('\n')}\n};`
            : 'type Props = Record<string, never>;';
        const styleImports = component.styleUrls.map((styleUrl) => {
            const extension = styleUrl.match(/\.[A-Za-z0-9]+$/)?.[0] ?? '.css';
            return `import '../styles/components/${safeName}${extension}';`;
        });
        const imports = [
            ...(needsReactImport(component) ? ["import { useEffect, useState } from 'react';"] : []),
            ...styleImports,
            ...(needsReactImport(component) || styleImports.length > 0 ? [''] : []),
        ];
        const logicContext = {
            stateNames: new Set(component.propertyInitializers.filter((property) => !property.readonly).map((property) => property.name)),
            propertyNames: new Set(component.propertyInitializers.map((property) => property.name)),
            methodNames: new Set(component.methods.map((method) => method.name)),
            propNames: new Set(component.props),
        };
        const stateLines = component.propertyInitializers
            .filter((property) => !property.readonly)
            .map((property) => {
            const id = toIdentifier(property.name, 'value');
            return `  const [${id}, ${toStateSetter(id)}] = useState(${normalizeInitializer(property.initializer)});`;
        });
        const readonlyLines = component.propertyInitializers
            .filter((property) => property.readonly)
            .map((property) => `  const ${toIdentifier(property.name, 'value')} = ${normalizeInitializer(property.initializer)};`);
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
        const templateLines = convertAngularTemplateToJsx(component.templateRawText, logicContext);
        const fallbackTemplateLines = [
            `      <h2>${safeName}</h2>`,
            ...(component.propertyInitializers.length > 0
                ? component.propertyInitializers.map((property) => `      <p data-field="${toIdentifier(property.name, 'value')}">{String(${toIdentifier(property.name, 'value')} ?? '')}</p>`)
                : []),
        ];
        const content = [
            ...imports,
            propsType,
            '',
            `export const ${safeName} = (props: Props) => {`,
            '  void props;',
            ...stateLines,
            ...readonlyLines,
            ...(stateLines.length > 0 || readonlyLines.length > 0 ? [''] : []),
            ...lifecycleLines,
            ...(lifecycleLines.length > 0 ? [''] : []),
            ...methodLines,
            ...usedIdentifiers.map((identifier) => `  void ${identifier};`),
            ...(usedIdentifiers.length > 0 ? [''] : []),
            '  return (',
            `    <section data-component="${safeName}">`,
            ...(templateLines.length > 0 ? templateLines : fallbackTemplateLines),
            '    </section>',
            '  );',
            '};',
            '',
        ].join('\n');
        const componentFile = createFileSpec({
            path: `src/components/${safeName}.tsx`,
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
    materializeMany(components, sourceRef) {
        return components.flatMap((component) => this.materialize(component, [sourceRef]));
    }
}
//# sourceMappingURL=component-materializer.js.map