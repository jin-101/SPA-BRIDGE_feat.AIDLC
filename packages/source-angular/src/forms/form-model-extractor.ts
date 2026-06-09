import type { SourceRef } from '@spa-bridge/core-model';

import { StableIdFactory } from '../model/stable-id-factory.js';
import type {
  AngularFormArrayModel,
  AngularFormControlModel,
  AngularFormDiagnostic,
  AngularFormGroupModel,
  AngularFormModel,
  AngularValidatorKind,
  AngularValidatorModel,
  FormSubmitIntent,
  FormTemplateBindingIntent,
  TemplateParseSummary,
  TypeScriptParseSummary,
} from '../types.js';

type ExtractContext = {
  sourcePath: string;
  ownerComponentId: string;
  ownerComponentPath: string;
};

const sourceRef = (path: string, symbol?: string): SourceRef => ({ kind: 'source', path, symbol });

const stripOuter = (value: string, open: string, close: string): string => {
  const trimmed = value.trim();
  if (trimmed.startsWith(open) && trimmed.endsWith(close)) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
};

const splitTopLevel = (value: string, separator = ','): string[] => {
  const result: string[] = [];
  let current = '';
  let depth = 0;
  let quote: string | undefined;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index] ?? '';
    const previous = value[index - 1];
    if (quote) {
      current += char;
      if (char === quote && previous !== '\\') {
        quote = undefined;
      }
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      current += char;
      continue;
    }
    if (char === '(' || char === '[' || char === '{') depth += 1;
    if (char === ')' || char === ']' || char === '}') depth = Math.max(0, depth - 1);
    if (char === separator && depth === 0) {
      if (current.trim()) result.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) {
    result.push(current.trim());
  }
  return result;
};

const splitKeyValue = (entry: string): { key: string; value: string } | undefined => {
  let depth = 0;
  let quote: string | undefined;
  for (let index = 0; index < entry.length; index += 1) {
    const char = entry[index] ?? '';
    const previous = entry[index - 1];
    if (quote) {
      if (char === quote && previous !== '\\') quote = undefined;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '(' || char === '[' || char === '{') depth += 1;
    if (char === ')' || char === ']' || char === '}') depth = Math.max(0, depth - 1);
    if (char === ':' && depth === 0) {
      return {
        key: entry.slice(0, index).trim().replace(/^['"]|['"]$/g, ''),
        value: entry.slice(index + 1).trim(),
      };
    }
  }
  return undefined;
};

const inferValueType = (initialValue?: string): AngularFormControlModel['valueType'] => {
  const value = initialValue?.trim();
  if (!value) return 'unknown';
  if (/^['"`]/.test(value)) return 'string';
  if (/^(true|false)$/i.test(value)) return 'boolean';
  if (/^-?\d+(\.\d+)?$/.test(value)) return 'number';
  if (value.startsWith('[')) return 'array';
  if (value.startsWith('{')) return 'object';
  return 'unknown';
};

const normalizeName = (name: string): string => name.replace(/^this\./, '').replace(/[^A-Za-z0-9_$.-]/g, '_');

export class FormModelExtractor {
  private readonly ids = new StableIdFactory();

  extract(typeScriptSummaries: TypeScriptParseSummary[], templateSummaries: TemplateParseSummary[]): AngularFormModel[] {
    const templatesByOwner = new Map<string, TemplateParseSummary[]>();
    for (const template of templateSummaries) {
      const owner = template.ownerPath ?? template.sourcePath;
      templatesByOwner.set(owner, [...(templatesByOwner.get(owner) ?? []), template]);
    }

    const forms: AngularFormModel[] = [];
    for (const summary of typeScriptSummaries) {
      for (const symbol of summary.symbols.filter((candidate) => candidate.decorators.some((decorator) => decorator.kind === 'Component'))) {
        const context: ExtractContext = {
          sourcePath: summary.sourcePath,
          ownerComponentId: symbol.id,
          ownerComponentPath: summary.sourcePath,
        };
        const templateBindings = this.extractTemplateBindings(templatesByOwner.get(summary.sourcePath) ?? []);
        const submitIntents = this.extractSubmitIntents(templatesByOwner.get(summary.sourcePath) ?? []);

        for (const property of symbol.propertyInitializers) {
          const initializer = property.initializer ?? '';
          const form = this.extractPropertyForm(property.name, initializer, context, templateBindings, submitIntents);
          if (form) {
            forms.push(form);
          }
        }

        if (templateBindings.some((binding) => binding.kind === 'ngModel') && !forms.some((form) => form.ownerComponentPath === summary.sourcePath)) {
          for (const binding of templateBindings.filter((candidate) => candidate.kind === 'ngModel' && candidate.expression)) {
            const name = normalizeName(binding.expression ?? 'model');
            const control = this.control(name, name, "''", [], context, binding.expression);
            forms.push({
              schemaVersion: 1,
              id: this.ids.symbolId(summary.sourcePath, 'template-driven-form', name, forms.length + 1),
              ownerComponentId: symbol.id,
              ownerComponentPath: summary.sourcePath,
              sourceRef: sourceRef(summary.sourcePath, symbol.name),
              declarationKind: 'template-driven',
              rootControl: control,
              templateBindings: [binding],
              submitIntents,
              diagnostics: [],
            });
          }
        }
      }
    }

    return forms.sort((left, right) => left.id.localeCompare(right.id));
  }

  private extractPropertyForm(
    propertyName: string,
    initializer: string,
    context: ExtractContext,
    templateBindings: FormTemplateBindingIntent[],
    submitIntents: FormSubmitIntent[],
  ): AngularFormModel | undefined {
    const trimmed = initializer.trim();
    const declarationKind = /FormBuilder|\.group\(/.test(trimmed)
      ? 'form-builder'
      : /new\s+FormArray/.test(trimmed)
        ? 'form-array'
        : /new\s+FormControl/.test(trimmed)
          ? 'form-control'
          : /new\s+FormGroup/.test(trimmed)
            ? 'form-group'
            : undefined;
    if (!declarationKind) {
      return undefined;
    }

    const diagnostics: AngularFormDiagnostic[] = [];
    const parsed =
      declarationKind === 'form-control'
        ? this.parseControlExpression(propertyName, propertyName, trimmed, context)
        : declarationKind === 'form-array'
          ? this.parseArrayExpression(propertyName, propertyName, trimmed, context)
          : this.parseGroupExpression(propertyName, propertyName, trimmed, context, diagnostics);

    return {
      schemaVersion: 1,
      id: this.ids.symbolId(context.sourcePath, declarationKind, propertyName, 1),
      ownerComponentId: context.ownerComponentId,
      ownerComponentPath: context.ownerComponentPath,
      sourceRef: sourceRef(context.sourcePath, propertyName),
      declarationKind,
      rootControl: parsed,
      templateBindings: templateBindings.filter((binding) => !binding.expression || binding.expression === propertyName || binding.kind !== 'formGroup'),
      submitIntents,
      diagnostics,
    };
  }

  private parseGroupExpression(
    name: string,
    controlPath: string,
    expression: string,
    context: ExtractContext,
    diagnostics: AngularFormDiagnostic[],
  ): AngularFormGroupModel {
    const groupBody = this.extractFirstObjectArgument(expression);
    if (!groupBody) {
      diagnostics.push(this.diagnostic('FORM-EXTRACT-001', `Unable to fully parse form group '${name}'.`, context));
      return this.group(name, controlPath, [], [], [], [], context);
    }

    const controls: AngularFormControlModel[] = [];
    const groups: AngularFormGroupModel[] = [];
    const arrays: AngularFormArrayModel[] = [];
    for (const entry of splitTopLevel(groupBody)) {
      const pair = splitKeyValue(entry);
      if (!pair) continue;
      const childName = normalizeName(pair.key);
      const childPath = controlPath ? `${controlPath}.${childName}` : childName;
      const childExpression = pair.value.trim();
      if (/new\s+FormGroup|\.group\(|^\{/.test(childExpression)) {
        groups.push(this.parseGroupExpression(childName, childPath, childExpression, context, diagnostics));
      } else if (/new\s+FormArray|\.array\(/.test(childExpression)) {
        arrays.push(this.parseArrayExpression(childName, childPath, childExpression, context));
      } else {
        controls.push(this.parseControlExpression(childName, childPath, childExpression, context));
      }
    }

    return this.group(name, controlPath, controls, groups, arrays, [], context);
  }

  private parseControlExpression(name: string, controlPath: string, expression: string, context: ExtractContext): AngularFormControlModel {
    const args = this.extractCallArguments(expression);
    const initialValue = args[0] ?? (expression.startsWith('[') ? splitTopLevel(stripOuter(expression, '[', ']'))[0] : expression);
    const validatorText = args[1] ?? (expression.startsWith('[') ? splitTopLevel(stripOuter(expression, '[', ']'))[1] : undefined);
    const asyncValidatorText = args[2];
    return this.control(
      name,
      controlPath,
      initialValue,
      this.normalizeValidators(validatorText, context, false),
      context,
      expression,
      this.normalizeValidators(asyncValidatorText, context, true),
    );
  }

  private parseArrayExpression(name: string, controlPath: string, expression: string, context: ExtractContext): AngularFormArrayModel {
    const args = this.extractCallArguments(expression);
    const body = args[0] ?? (expression.startsWith('[') ? stripOuter(expression, '[', ']') : '');
    const initialItems = splitTopLevel(stripOuter(body, '[', ']')).slice(0, 20).map((item, index) => {
      const itemName = `${name}Item${index + 1}`;
      if (/new\s+FormGroup|\.group\(|^\{/.test(item)) {
        return this.parseGroupExpression(itemName, `${controlPath}[${index}]`, item, context, []);
      }
      if (/new\s+FormArray|\.array\(|^\[/.test(item)) {
        return this.parseArrayExpression(itemName, `${controlPath}[${index}]`, item, context);
      }
      return this.parseControlExpression(itemName, `${controlPath}[${index}]`, item, context);
    });
    const itemKind = initialItems[0] ? (initialItems[0].id.includes('form-group') ? 'group' : initialItems[0].id.includes('form-array') ? 'array' : 'control') : 'unknown';
    return {
      id: this.ids.symbolId(context.sourcePath, 'form-array', controlPath, 1),
      name,
      path: controlPath,
      itemKind,
      initialItems,
      mutatorRefs: [],
      complexity: initialItems.some((item) => item.id.includes('form-array')) ? 'review-required' : 'simple',
      validators: this.normalizeValidators(args[1], context, false),
    };
  }

  private group(
    name: string,
    controlPath: string,
    controls: AngularFormControlModel[],
    groups: AngularFormGroupModel[],
    arrays: AngularFormArrayModel[],
    validators: AngularValidatorModel[],
    context: ExtractContext,
  ): AngularFormGroupModel {
    return {
      id: this.ids.symbolId(context.sourcePath, 'form-group', controlPath, 1),
      name,
      path: controlPath,
      controls: controls.sort((left, right) => left.path.localeCompare(right.path)),
      groups: groups.sort((left, right) => left.path.localeCompare(right.path)),
      arrays: arrays.sort((left, right) => left.path.localeCompare(right.path)),
      validators,
    };
  }

  private control(
    name: string,
    controlPath: string,
    initialValue: string | undefined,
    validators: AngularValidatorModel[],
    context: ExtractContext,
    sourceExpression?: string,
    asyncValidators: AngularValidatorModel[] = [],
  ): AngularFormControlModel {
    return {
      id: this.ids.symbolId(context.sourcePath, 'form-control', controlPath, 1),
      name,
      path: controlPath,
      initialValue,
      valueType: inferValueType(initialValue),
      validators,
      asyncValidators,
      sourceExpression,
    };
  }

  private extractFirstObjectArgument(expression: string): string | undefined {
    const args = this.extractCallArguments(expression);
    const first = args[0] ?? expression;
    const objectStart = first.indexOf('{');
    const objectEnd = first.lastIndexOf('}');
    if (objectStart >= 0 && objectEnd > objectStart) {
      return first.slice(objectStart + 1, objectEnd);
    }
    return undefined;
  }

  private extractCallArguments(expression: string): string[] {
    const open = expression.indexOf('(');
    const close = expression.lastIndexOf(')');
    if (open < 0 || close <= open) {
      return [];
    }
    return splitTopLevel(expression.slice(open + 1, close));
  }

  private normalizeValidators(value: string | undefined, context: ExtractContext, forceAsync: boolean): AngularValidatorModel[] {
    if (!value?.trim()) return [];
    const raw = value.trim();
    const candidates = raw.startsWith('[') ? splitTopLevel(stripOuter(raw, '[', ']')) : [raw];
    return candidates.filter(Boolean).map((candidate, index) => {
      const text = candidate.trim();
      const kind = this.validatorKind(text, forceAsync);
      const args = text.includes('(') ? this.extractCallArguments(text) : [];
      return {
        id: this.ids.symbolId(context.sourcePath, forceAsync ? 'async-validator' : 'validator', `${kind}-${index}-${text}`, 1),
        kind,
        arguments: args,
        sourceRef: sourceRef(context.sourcePath, text),
        reviewRequired: forceAsync || kind === 'custom' || kind === 'unknown',
      };
    });
  }

  private validatorKind(text: string, forceAsync: boolean): AngularValidatorKind {
    if (forceAsync) return 'async';
    if (/Validators\.required\b/.test(text)) return 'required';
    if (/Validators\.minLength\b/.test(text)) return 'minLength';
    if (/Validators\.maxLength\b/.test(text)) return 'maxLength';
    if (/Validators\.pattern\b/.test(text)) return 'pattern';
    if (/Validators\.email\b/.test(text)) return 'email';
    if (/Validators\.min\b/.test(text)) return 'min';
    if (/Validators\.max\b/.test(text)) return 'max';
    if (/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)?(\(|$)/.test(text)) return 'custom';
    return 'unknown';
  }

  private extractTemplateBindings(templates: TemplateParseSummary[]): FormTemplateBindingIntent[] {
    const intents: FormTemplateBindingIntent[] = [];
    templates.forEach((template, templateIndex) => {
      const text = template.rawText ?? '';
      const patterns: Array<[FormTemplateBindingIntent['kind'], RegExp]> = [
        ['formGroup', /\[formGroup\]="([^"]+)"/g],
        ['formControlName', /formControlName=["']([^"']+)["']/g],
        ['formArrayName', /formArrayName=["']([^"']+)["']/g],
        ['ngModel', /\[\(ngModel\)\]=["']([^"']+)["']/g],
        ['ngModel', /\[ngModel\]=["']([^"']+)["']/g],
        ['ngModelChange', /\(ngModelChange\)=["']([^"']+)["']/g],
      ];
      for (const [kind, pattern] of patterns) {
        for (const match of text.matchAll(pattern)) {
          intents.push({
            id: this.ids.symbolId(template.sourcePath, `form-binding-${kind}`, `${templateIndex}-${match.index ?? 0}`, 1),
            kind,
            name: kind === 'formControlName' || kind === 'formArrayName' ? match[1] : undefined,
            expression: match[1],
            sourcePath: template.sourcePath,
          });
        }
      }
    });
    return intents.sort((left, right) => left.id.localeCompare(right.id));
  }

  private extractSubmitIntents(templates: TemplateParseSummary[]): FormSubmitIntent[] {
    return templates.flatMap((template) =>
      [...(template.rawText ?? '').matchAll(/\(ngSubmit\)=["']([^"']+)["']/g)].map((match) => ({
        id: this.ids.symbolId(template.sourcePath, 'form-submit', `${match.index ?? 0}-${match[1] ?? ''}`, 1),
        expression: match[1] ?? '',
        sourcePath: template.sourcePath,
      })),
    ).sort((left, right) => left.id.localeCompare(right.id));
  }

  private diagnostic(code: string, message: string, context: ExtractContext): AngularFormDiagnostic {
    return {
      code,
      severity: 'manual-review',
      message,
      sourceRef: sourceRef(context.sourcePath),
    };
  }
}
