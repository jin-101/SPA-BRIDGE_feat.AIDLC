import { createFileSpec } from '../write-plan/generated-file-spec-factory.js';
import type { GeneratedFileSpec } from '../types.js';

const useObservableSource = `import { useEffect, useState } from 'react';
import type { Observable, Subscription } from 'rxjs';

export type ObservableState<T> = {
  value: T;
  error: unknown;
  completed: boolean;
  loading: boolean;
};

export const useObservable = <T>(observable: Observable<T> | undefined, initialValue: T): ObservableState<T> => {
  const [state, setState] = useState<ObservableState<T>>({
    value: initialValue,
    error: undefined,
    completed: false,
    loading: Boolean(observable),
  });

  useEffect(() => {
    if (!observable) {
      setState((current) => ({ ...current, loading: false }));
      return undefined;
    }

    const subscription: Subscription = observable.subscribe({
      next: (value) => setState({ value, error: undefined, completed: false, loading: false }),
      error: (error) => setState((current) => ({ ...current, error, loading: false })),
      complete: () => setState((current) => ({ ...current, completed: true, loading: false })),
    });

    return () => subscription.unsubscribe();
  }, [observable]);

  return state;
};
`;

const useSubjectValueSource = `import { useObservable, type ObservableState } from './useObservable';
import type { Observable } from 'rxjs';

export const useSubjectValue = <T>(subject: Observable<T> | undefined, initialValue: T): ObservableState<T> => {
  return useObservable(subject, initialValue);
};
`;

const useSubscriptionEffectSource = `import { useEffect } from 'react';
import type { Subscription } from 'rxjs';

export const useSubscriptionEffect = (setup: () => Subscription | { unsubscribe: () => void } | void, dependencies: unknown[]): void => {
  useEffect(() => {
    const subscription = setup();
    return () => {
      subscription?.unsubscribe?.();
    };
  }, dependencies);
};
`;

export class RxjsRuntimeMaterializer {
  materialize(includeRuntime: boolean): GeneratedFileSpec[] {
    if (!includeRuntime) {
      return [];
    }

    return [
      createFileSpec({
        path: 'src/utils/rxjs/useObservable.ts',
        kind: 'scaffold',
        content: useObservableSource,
      }),
      createFileSpec({
        path: 'src/utils/rxjs/useSubjectValue.ts',
        kind: 'scaffold',
        content: useSubjectValueSource,
      }),
      createFileSpec({
        path: 'src/utils/rxjs/useSubscriptionEffect.ts',
        kind: 'scaffold',
        content: useSubscriptionEffectSource,
      }),
      createFileSpec({
        path: 'src/utils/rxjs/index.ts',
        kind: 'scaffold',
        content: [
          "export * from './useObservable';",
          "export * from './useSubjectValue';",
          "export * from './useSubscriptionEffect';",
          '',
        ].join('\n'),
      }),
    ];
  }
}
