const attrPattern = /([*#[\]()A-Za-z0-9_.:-]+)(?:\s*=\s*"([^"]*)")?/g;
const tagPattern = /<([A-Za-z][A-Za-z0-9-]*)([^>]*)>|{{\s*([^}]+?)\s*}}/g;
const stableId = (sourcePath, ordinal) => `tpl-${sourcePath.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()}-${ordinal}`;
const parsePipeUsage = (expression) => {
    const parts = expression.split('|').map((part) => part.trim()).filter(Boolean);
    if (parts.length <= 1) {
        return [];
    }
    const base = parts[0] ?? '';
    return parts.slice(1).map((pipe) => {
        const [name = pipe, ...args] = pipe.split(':').map((part) => part.trim());
        return {
            name,
            expression: base,
            arguments: args,
        };
    });
};
const parseNgFor = (expression) => {
    const locals = {};
    const item = expression.match(/let\s+([A-Za-z_$][\w$]*)\s+of\s+([^;]+)/);
    if (item?.[1] && item[2]) {
        locals.item = item[1];
        locals.iterable = item[2].trim();
    }
    const index = expression.match(/index\s+as\s+([A-Za-z_$][\w$]*)/);
    if (index?.[1]) {
        locals.index = index[1];
    }
    const trackBy = expression.match(/trackBy\s*:\s*([^;]+)/);
    if (trackBy?.[1]) {
        locals.trackBy = trackBy[1].trim();
    }
    return locals;
};
const parseAttributes = (rawAttributes) => {
    const attributes = {};
    const directives = [];
    const bindings = [];
    const events = [];
    const pipes = [];
    for (const match of rawAttributes.matchAll(attrPattern)) {
        const rawName = match[1] ?? '';
        const value = match[2] ?? '';
        if (!rawName) {
            continue;
        }
        attributes[rawName] = value;
        if (rawName === '*ngIf') {
            directives.push({ kind: 'if', name: 'ngIf', expression: value, localVariables: {} });
            pipes.push(...parsePipeUsage(value));
            continue;
        }
        if (rawName === '*ngFor') {
            directives.push({ kind: 'for', name: 'ngFor', expression: value, localVariables: parseNgFor(value) });
            pipes.push(...parsePipeUsage(value));
            continue;
        }
        if (rawName === 'ngClass' || rawName === '[ngClass]') {
            directives.push({ kind: 'class', name: 'ngClass', expression: value, localVariables: {} });
            bindings.push({ name: 'ngClass', expression: value, bindingKind: 'class' });
            continue;
        }
        if (rawName === 'ngStyle' || rawName === '[ngStyle]') {
            directives.push({ kind: 'style', name: 'ngStyle', expression: value, localVariables: {} });
            bindings.push({ name: 'ngStyle', expression: value, bindingKind: 'style' });
            continue;
        }
        const twoWay = rawName.match(/^\[\(([^)]+)\)\]$/);
        if (twoWay?.[1]) {
            directives.push({ kind: 'form', name: twoWay[1], expression: value, localVariables: {} });
            bindings.push({ name: twoWay[1], expression: value, bindingKind: 'two-way' });
            continue;
        }
        const property = rawName.match(/^\[([^\]]+)\]$/);
        if (property?.[1]) {
            const name = property[1];
            const bindingKind = name.startsWith('attr.')
                ? 'attribute'
                : name.startsWith('class.')
                    ? 'class'
                    : name.startsWith('style.')
                        ? 'style'
                        : 'property';
            bindings.push({ name, expression: value, bindingKind });
            pipes.push(...parsePipeUsage(value));
            continue;
        }
        const event = rawName.match(/^\(([^)]+)\)$/);
        if (event?.[1]) {
            events.push({ name: event[1], expression: value });
        }
    }
    return { attributes, directives, bindings, events, pipes };
};
export class TemplateIrBuilder {
    build(sourcePath, templateText) {
        const rootNodes = [];
        const diagnostics = [];
        let ordinal = 1;
        for (const match of templateText.matchAll(tagPattern)) {
            const id = stableId(sourcePath, ordinal);
            ordinal += 1;
            if (match[3]) {
                const expression = match[3].trim();
                rootNodes.push({
                    id,
                    kind: 'interpolation',
                    expression,
                    attributes: {},
                    directives: [],
                    bindings: [],
                    events: [],
                    pipes: parsePipeUsage(expression),
                    children: [],
                });
                continue;
            }
            const tagName = match[1] ?? '';
            const parsed = parseAttributes(match[2] ?? '');
            const kind = tagName === 'ng-content' ? 'projection' : tagName === 'ng-template' ? 'deferred-fragment' : 'element';
            if (tagName === 'ng-container') {
                parsed.directives.push({ kind: 'container', name: 'ng-container', localVariables: {} });
            }
            if (tagName === 'ng-template') {
                parsed.directives.push({ kind: 'template', name: 'ng-template', localVariables: {} });
            }
            if (tagName === 'ng-content') {
                parsed.directives.push({ kind: 'projection', name: 'ng-content', localVariables: {} });
            }
            rootNodes.push({
                id,
                kind,
                tagName,
                attributes: parsed.attributes,
                directives: parsed.directives,
                bindings: parsed.bindings,
                events: parsed.events,
                pipes: parsed.pipes,
                children: [],
            });
        }
        if (templateText.includes('javascript:')) {
            diagnostics.push({
                code: 'TEMPLATE-IR-UNSAFE-REFERENCE',
                severity: 'security-blocker',
                message: 'Template contains an unsafe javascript reference.',
            });
        }
        return {
            schemaVersion: 1,
            sourcePath,
            rootNodes,
            diagnostics,
        };
    }
}
//# sourceMappingURL=template-ir-builder.js.map