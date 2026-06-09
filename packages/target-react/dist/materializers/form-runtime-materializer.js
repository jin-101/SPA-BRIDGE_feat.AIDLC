import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
const useFormControl = `import { useMemo, useState } from 'react';
import type { Validator, ValidationErrors } from './validators';

export type FormControlState<T = unknown> = {
  value: T;
  setValue: (value: T) => void;
  touched: boolean;
  dirty: boolean;
  errors: ValidationErrors | null;
  valid: boolean;
  invalid: boolean;
  inputProps: {
    value: T extends string | number | readonly string[] ? T : string;
    onChange: (event: { target: { value: unknown } }) => void;
    onBlur: () => void;
  };
};

export const useFormControl = <T = unknown>(initialValue: T, validators: Validator<T>[] = []): FormControlState<T> => {
  const [value, setValueState] = useState<T>(initialValue);
  const [touched, setTouched] = useState(false);
  const [dirty, setDirty] = useState(false);
  const errors = useMemo(() => {
    const merged = validators.reduce<ValidationErrors>((acc, validator) => ({ ...acc, ...validator(value) }), {});
    return Object.keys(merged).length > 0 ? merged : null;
  }, [value, validators]);

  const setValue = (nextValue: T) => {
    setDirty(true);
    setValueState(nextValue);
  };

  return {
    value,
    setValue,
    touched,
    dirty,
    errors,
    valid: !errors,
    invalid: Boolean(errors),
    inputProps: {
      value: (value ?? '') as T extends string | number | readonly string[] ? T : string,
      onChange: (event) => setValue(event.target.value as T),
      onBlur: () => setTouched(true),
    },
  };
};
`;
const useFormGroup = `import { useMemo } from 'react';

type ControlLike = {
  value: unknown;
  valid: boolean;
  invalid: boolean;
  errors: Record<string, unknown> | null;
  setValue?: (value: unknown) => void;
};

export const useFormGroup = <TControls extends Record<string, ControlLike | ReturnType<typeof useFormGroup>>>(controls: TControls) => {
  const value = useMemo(
    () => Object.fromEntries(Object.entries(controls).map(([name, control]) => [name, 'value' in control ? control.value : control.value])),
    [controls],
  );
  const errors = useMemo(
    () => Object.fromEntries(Object.entries(controls).filter(([, control]) => control.errors).map(([name, control]) => [name, control.errors])),
    [controls],
  );
  const invalid = Object.values(controls).some((control) => control.invalid);

  return {
    controls,
    value,
    errors: Object.keys(errors).length > 0 ? errors : null,
    valid: !invalid,
    invalid,
    handleSubmit: (callback: () => void) => (event: { preventDefault: () => void }) => {
      event.preventDefault();
      callback();
    },
  };
};
`;
const useFormArray = `import { useState } from 'react';

export const useFormArray = <T>(initialItems: T[] = []) => {
  const [items, setItems] = useState<T[]>(initialItems);
  return {
    items,
    append: (item: T) => setItems((current) => [...current, item]),
    remove: (index: number) => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index)),
    insert: (index: number, item: T) => setItems((current) => [...current.slice(0, index), item, ...current.slice(index)]),
    move: (from: number, to: number) => setItems((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      if (item !== undefined) next.splice(to, 0, item);
      return next;
    }),
    update: (index: number, item: T) => setItems((current) => current.map((existing, itemIndex) => itemIndex === index ? item : existing)),
  };
};
`;
const validators = `export type ValidationErrors = Record<string, unknown>;
export type Validator<T = unknown> = (value: T) => ValidationErrors;

const isEmpty = (value: unknown): boolean => value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

export const required = <T = unknown>(): Validator<T> => (value) => isEmpty(value) ? { required: true } : {};
export const minLength = (length: number): Validator<unknown> => (value) => String(value ?? '').length < length ? { minlength: { requiredLength: length, actualLength: String(value ?? '').length } } : {};
export const maxLength = (length: number): Validator<unknown> => (value) => String(value ?? '').length > length ? { maxlength: { requiredLength: length, actualLength: String(value ?? '').length } } : {};
export const pattern = (value: string): Validator<unknown> => {
  const regex = new RegExp(value.replace(/^\\\\/|\\\\/[gimsuy]*$/g, ''));
  return (input) => regex.test(String(input ?? '')) ? {} : { pattern: { requiredPattern: value, actualValue: input } };
};
export const email = (): Validator<unknown> => (value) => /^\\\\S+@\\\\S+\\\\.\\\\S+$/.test(String(value ?? '')) ? {} : { email: true };
export const min = (minimum: number): Validator<unknown> => (value) => Number(value) < minimum ? { min: { min: minimum, actual: Number(value) } } : {};
export const max = (maximum: number): Validator<unknown> => (value) => Number(value) > maximum ? { max: { max: maximum, actual: Number(value) } } : {};
export const validators = { required, minLength, maxLength, pattern, email, min, max };
`;
export class FormRuntimeMaterializer {
    materialize(enabled) {
        if (!enabled) {
            return [];
        }
        return [
            ['src/utils/forms/useFormControl.ts', useFormControl],
            ['src/utils/forms/useFormGroup.ts', useFormGroup],
            ['src/utils/forms/useFormArray.ts', useFormArray],
            ['src/utils/forms/validators.ts', validators],
            ['src/utils/forms/index.ts', "export * from './useFormControl';\nexport * from './useFormGroup';\nexport * from './useFormArray';\nexport * from './validators';\n"],
        ].map(([filePath, content]) => createFileSpec({
            path: filePath,
            kind: 'scaffold',
            content: `${content.trim()}\n`,
            overwrite: true,
        }));
    }
}
//# sourceMappingURL=form-runtime-materializer.js.map