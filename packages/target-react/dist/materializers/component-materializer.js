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
export class ComponentMaterializer {
    materialize(component, sourceRefs = []) {
        const safeName = toComponentName(component.name) || 'Component';
        const propsType = component.props.length > 0
            ? `type Props = {\n${component.props.map((prop) => `  ${prop.replace(/[^A-Za-z0-9_]/g, '')}?: unknown;`).join('\n')}\n};`
            : 'type Props = Record<string, never>;';
        const imports = needsReactImport(component) ? ["import { useEffect, useState } from 'react';", ''] : [];
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
            `      <h2>${safeName}</h2>`,
            ...(component.propertyInitializers.length > 0
                ? component.propertyInitializers.map((property) => `      <p data-field="${toIdentifier(property.name, 'value')}">{String(${toIdentifier(property.name, 'value')} ?? '')}</p>`)
                : []),
            '    </section>',
            '  );',
            '};',
            '',
        ].join('\n');
        return [
            createFileSpec({
                path: `src/components/${safeName}.tsx`,
                kind: 'component',
                content,
                sourceRefs,
                overwrite: true,
            }),
        ];
    }
    materializeMany(components, sourceRef) {
        return components.flatMap((component) => this.materialize(component, [sourceRef]));
    }
}
//# sourceMappingURL=component-materializer.js.map