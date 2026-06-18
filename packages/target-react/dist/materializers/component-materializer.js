import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import { TemplateJsxRenderer } from './template-jsx-renderer.js';
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
const needsReactImport = (component) => component.propertyInitializers.length > 0 || component.hooks.length > 0 || component.forms.length > 0 || component.rxHooks.length > 0 || component.animations.some((animation) => animation.requiresClientComponent);
const needsClientComponent = (component) => component.animations.some((animation) => animation.requiresClientComponent) || component.rxHooks.length > 0 || component.forms.length > 0 || Boolean(component.reduxUsage);
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
const transformTemplateExpression = (expression, context, rxValueNames = new Map()) => {
    const [baseExpression, ...pipes] = expression.split('|').map((part) => part.trim()).filter(Boolean);
    if (pipes[0]?.startsWith('async')) {
        const streamExpression = (baseExpression ?? expression).replace(/^this\./, '').trim();
        return rxValueNames.get(streamExpression) ?? rxValueNames.get(streamExpression.replace(/\$$/, '')) ?? `${toIdentifier(streamExpression.replace(/\$$/, ''), 'observable')}Value`;
    }
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
    const storeDispatch = trimmed.match(/^(?:this\.)?store\.dispatch\s*\((.+)\);?$/);
    if (storeDispatch?.[1] && context.hasReduxDispatch) {
        return [`    dispatch(${transformExpression(storeDispatch[1], context)});`];
    }
    const storeSelect = trimmed.match(/^(?:this\.)?store\.select\s*\((.+)\);?$/);
    if (storeSelect?.[1]) {
        return [
            `    // AIDLC_MANUAL_REVIEW_NGRX: store.select(${storeSelect[1].replace(/\*\//g, '* /')}) should be represented by useAppSelector at render scope.`,
        ];
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
const toSourceRelativeComponentPath = (component) => {
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
const toTargetStyleExtension = (styleUrl) => {
    const extension = styleUrl.match(/\.[A-Za-z0-9]+$/)?.[0]?.toLowerCase() ?? '.css';
    return extension === '.css' ? '.css' : '.css';
};
const toRelativeImport = (fromPath, toPath) => {
    const fromDir = fromPath.split('/').slice(0, -1).join('/');
    const fromParts = fromDir.split('/').filter(Boolean);
    const toParts = toPath.replace(/\.(tsx|ts)$/i, '').split('/').filter(Boolean);
    while (fromParts.length > 0 && toParts.length > 0 && fromParts[0] === toParts[0]) {
        fromParts.shift();
        toParts.shift();
    }
    const prefix = fromParts.length > 0 ? '../'.repeat(fromParts.length) : './';
    return `${prefix}${toParts.join('/')}`;
};
const propertyDecorators = (property) => Array.isArray(property.decorators) ? property.decorators : [];
const isFormProperty = (component, propertyName) => component.forms.some((form) => form.rootControl.name === propertyName);
const collectControls = (form) => {
    const visit = (node) => {
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
const validatorFactory = (validator) => {
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
const renderInitialValue = (control) => {
    const value = control.initialValue?.trim();
    if (!value || /^this\./.test(value) || /new\s+/.test(value)) {
        return "''";
    }
    return value;
};
const renderFormLines = (component) => {
    if (component.forms.length === 0) {
        return [];
    }
    const lines = [];
    const emittedControls = new Set();
    for (const form of component.forms) {
        for (const control of collectControls(form)) {
            const controlIdentifier = `${toIdentifier(control.name, 'control')}Control`;
            if (emittedControls.has(controlIdentifier))
                continue;
            emittedControls.add(controlIdentifier);
            const validatorCalls = control.validators.map(validatorFactory).filter((value) => Boolean(value));
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
const renderRxHookLines = (component) => {
    if (component.rxHooks.length === 0) {
        return [];
    }
    const lines = [];
    for (const hook of component.rxHooks) {
        lines.push(...hook.reviewComments.map((comment) => `  /* ${comment.replace(/\*\//g, '* /')} */`));
        const valueName = toIdentifier(hook.valueName, 'observableValue');
        const sourceExpression = hook.dependencyExpressions[0] ?? hook.sourceStreamId;
        if (hook.hookKind === 'useObservable') {
            lines.push(`  const { value: ${valueName} } = useObservable(${sourceExpression}, ${hook.initialValueText});`);
        }
        else if (hook.hookKind === 'useSubjectValue') {
            lines.push(`  const { value: ${valueName} } = useSubjectValue(${sourceExpression}, ${hook.initialValueText});`);
        }
        else {
            lines.push(`  useSubscriptionEffect(() => ${sourceExpression}.subscribe(), [${sourceExpression}]);`);
        }
    }
    return [...lines, ''];
};
const renderReduxUsageLines = (component) => {
    if (!component.reduxUsage) {
        return [];
    }
    const lines = [];
    lines.push(...component.reduxUsage.reviewComments.map((comment) => `  /* ${comment.replace(/\*\//g, '* /')} */`));
    lines.push('  const dispatch = useAppDispatch();');
    for (const selectorRef of component.reduxUsage.selectorRefs) {
        const selectorName = toIdentifier(selectorRef.split('.').pop() ?? selectorRef, 'selector');
        lines.push(`  const ${selectorName}Value = useAppSelector((state) => (state as unknown as Record<string, unknown>)['${selectorName}']);`);
    }
    for (const actionRef of component.reduxUsage.actionRefs) {
        const actionName = toIdentifier(actionRef.split('.').pop() ?? actionRef, 'action');
        lines.push(`  const dispatch${actionName.charAt(0).toUpperCase()}${actionName.slice(1)} = (payload?: Record<string, unknown>) => dispatch({ type: '${actionRef.replace(/'/g, "\\'")}', payload });`);
    }
    return [...lines, ''];
};
const renderAnimationLines = (component) => {
    if (component.animations.length === 0) {
        return [];
    }
    const lines = [];
    for (const animation of component.animations) {
        lines.push(...animation.reviewComments.map((comment) => `  /* ${comment.replace(/\*\//g, '* /')} */`));
        const helperName = toIdentifier(`${animation.triggerName}AnimationClass`, 'animationClass');
        const defaultClass = Object.values(animation.stateClassNames)[0] ?? animation.cssClassPrefix;
        const bindingExpression = animation.bindings[0]?.bindingExpression;
        if (bindingExpression) {
            lines.push(`  const ${helperName} = ${JSON.stringify(defaultClass)}; // state source: ${bindingExpression.replace(/\*\//g, '* /')}`);
        }
        else {
            lines.push(`  const ${helperName} = ${JSON.stringify(defaultClass)};`);
        }
    }
    return [...lines, ''];
};
export class ComponentMaterializer {
    templateRenderer;
    constructor(templateRenderer = new TemplateJsxRenderer()) {
        this.templateRenderer = templateRenderer;
    }
    materialize(component, sourceRefs = [], context = { selectorRegistry: new Map() }) {
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
            const extension = toTargetStyleExtension(styleUrl);
            return `import '${toRelativeImport(componentPath, `src/styles/components/${safeName}${extension}`)}';`;
        });
        const imports = [
            ...(needsClientComponent(component) ? ['"use client";', ''] : []),
            ...(needsReactImport(component) ? ["import { useEffect, useState } from 'react';"] : []),
            ...(component.forms.length > 0 ? [`import { useFormArray, useFormControl, useFormGroup, validators as formValidators } from '${toRelativeImport(componentPath, 'src/utils/forms/index')}';`] : []),
            ...(component.rxHooks.length > 0 ? [`import { useObservable, useSubjectValue, useSubscriptionEffect } from '${toRelativeImport(componentPath, 'src/utils/rxjs/index')}';`] : []),
            ...(component.reduxUsage ? [`import { useAppDispatch, useAppSelector } from '${toRelativeImport(componentPath, 'src/store/hooks')}';`] : []),
            ...(component.animations.length > 0 ? [`import '${toRelativeImport(componentPath, 'src/animations/animations.css')}';`] : []),
            ...styleImports,
            ...(needsReactImport(component) || styleImports.length > 0 || component.forms.length > 0 || component.rxHooks.length > 0 || component.reduxUsage ? [''] : []),
        ];
        const logicContext = {
            stateNames: new Set(component.propertyInitializers.filter((property) => !property.readonly && !property.isEventEmitter && !propertyDecorators(property).includes('Input')).map((property) => property.name)),
            propertyNames: new Set(component.propertyInitializers.map((property) => property.name)),
            methodNames: new Set(component.methods.map((method) => method.name)),
            propNames: new Set(component.props),
            hasReduxDispatch: Boolean(component.reduxUsage),
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
        const templateLogicContext = {
            ...logicContext,
            transformExpression: (expression) => transformExpression(expression, logicContext),
            transformTemplateExpression: (expression) => transformTemplateExpression(expression, logicContext, new Map(component.rxHooks.flatMap((hook) => {
                const source = hook.dependencyExpressions[0] ?? hook.sourceStreamId;
                const stripped = source.replace(/^this\./, '');
                return [
                    [stripped, toIdentifier(hook.valueName, 'observableValue')],
                    [stripped.replace(/\$$/, ''), toIdentifier(hook.valueName, 'observableValue')],
                ];
            }))),
            toStateSetter,
            toIdentifier,
            formControlNames: new Set(component.forms.flatMap((form) => collectControls(form).map((control) => control.name))),
        };
        const template = this.templateRenderer.render(component.templateRawText, component.templateIr, templateLogicContext, context.selectorRegistry);
        const customComponentImports = template.usedSelectors
            .map((selector) => context.selectorRegistry.get(selector))
            .filter((entry) => !!entry && entry.name !== safeName)
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
            ...renderRxHookLines(component),
            ...renderReduxUsageLines(component),
            ...renderAnimationLines(component),
            ...lifecycleLines,
            ...(lifecycleLines.length > 0 ? [''] : []),
            ...methodLines,
            ...this.renderTemplateHelpers(template.helpers),
            ...usedIdentifiers.map((identifier) => `  void ${identifier};`),
            ...(component.reduxUsage?.actionRefs ?? []).map((actionRef) => {
                const actionName = toIdentifier(actionRef.split('.').pop() ?? actionRef, 'action');
                return `  void dispatch${actionName.charAt(0).toUpperCase()}${actionName.slice(1)};`;
            }),
            ...component.animations.map((animation) => `  void ${toIdentifier(`${animation.triggerName}AnimationClass`, 'animationClass')};`),
            ...(usedIdentifiers.length > 0 ? [''] : []),
            '  return (',
            `    <section data-component="${safeName}"${component.animations.length > 0 ? ` className={${toIdentifier(`${component.animations[0]?.triggerName ?? 'animation'}AnimationClass`, 'animationClass')}}` : ''}>`,
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
            const extension = toTargetStyleExtension(styleUrl);
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
        const selectorRegistry = new Map(components
            .filter((component) => component.selector)
            .map((component) => [component.selector, { name: toComponentName(component.name) || 'Component', path: toSourceRelativeComponentPath(component) }]));
        return components.flatMap((component) => this.materialize(component, [sourceRef], { selectorRegistry }));
    }
    renderTemplateHelpers(helpers) {
        const lines = [];
        if (helpers.includes('applyClassMap')) {
            lines.push('  const applyClassMap = (value: unknown): string => {', "    if (typeof value === 'string') return value;", '    if (Array.isArray(value)) return value.filter(Boolean).join(\' \');', "    if (value && typeof value === 'object') return Object.entries(value as Record<string, unknown>).filter(([, enabled]) => Boolean(enabled)).map(([name]) => name).join(' ');", "    return '';", '  };', '');
        }
        if (helpers.includes('applyStyleMap')) {
            lines.push('  const applyStyleMap = (value: unknown) => {', "    return value && typeof value === 'object' ? (value as Record<string, string | number>) : {};", '  };', '');
        }
        for (const helper of helpers.filter((name) => name.startsWith('format') && name.endsWith('Pipe'))) {
            if (helper === 'formatUnknownPipe') {
                lines.push(`  const ${helper} = (_pipeName: string, value: unknown): string => String(value ?? '');`, '');
            }
            else {
                lines.push(`  const ${helper} = (value: unknown): string => String(value ?? '');`, '');
            }
        }
        return lines;
    }
}
//# sourceMappingURL=component-materializer.js.map