# V2-GAP-UOW-05 Domain Entities

## AngularNgrxActionModel

Represents NgRx action creators and action groups.

Fields:
- `id`: stable action ID.
- `sourceRef`: safe source reference.
- `name`: source action constant or creator name.
- `typeString`: NgRx action type string such as `[Flights] Load`.
- `payloadProps`: extracted `props<...>()` metadata as safe text.
- `actionGroup`: optional action group source name.
- `targetActionName`: Redux Toolkit action name.
- `diagnostics`: extraction and review findings.

## AngularNgrxReducerModel

Represents NgRx reducer definitions.

Fields:
- `id`: stable reducer ID.
- `sourceRef`: safe source reference.
- `featureName`: feature state key when available.
- `initialStateText`: safe initial state expression text.
- `handlers`: ordered `AngularNgrxReducerHandlerModel` entries.
- `targetSliceName`: Redux Toolkit slice name.
- `reviewRequired`: true when reducer logic is not safely convertible.

## AngularNgrxReducerHandlerModel

Represents one `on(action, handler)` reducer branch.

Fields:
- `id`: stable handler ID.
- `actionRefs`: referenced NgRx actions.
- `handlerBodyText`: safe handler body/expression text.
- `mutationStyle`: `immutable-return`, `draft-mutation`, `unknown`, or `unsupported`.
- `targetCaseName`: generated Redux Toolkit reducer case name.
- `reviewRequired`: true when logic may be lossy.

## AngularNgrxSelectorModel

Represents selectors and selector dependency graphs.

Fields:
- `id`: stable selector ID.
- `sourceRef`: safe source reference.
- `name`: selector name.
- `selectorKind`: `feature`, `derived`, `entity`, `router`, or `unknown`.
- `inputSelectors`: ordered dependency names.
- `projectorText`: safe projector expression text.
- `targetSelectorName`: generated selector function name.
- `reviewRequired`: true for complex or router-coupled selectors.

## AngularNgrxEffectModel

Represents NgRx effects.

Fields:
- `id`: stable effect ID.
- `sourceRef`: safe source reference.
- `name`: effect property name.
- `sourceExpression`: safe effect observable expression.
- `actionFilters`: action types or action creators observed by `ofType`.
- `operatorChainIds`: associated RxJS operator chain IDs.
- `dispatchesAction`: true when effect dispatches an action.
- `targetEffectKind`: `thunk`, `listener-middleware`, `review-only`, or `unknown`.
- `reviewRequired`: true for side-effect-heavy or ambiguous effects.

## AngularNgrxEntityAdapterModel

Represents `@ngrx/entity` adapter usage.

Fields:
- `id`: stable entity adapter ID.
- `sourceRef`: safe source reference.
- `entityName`: inferred entity type/name.
- `adapterName`: source adapter variable name.
- `stateInterfaceName`: entity state interface name.
- `selectorRefs`: adapter selector names.
- `targetAdapterName`: Redux Toolkit entity adapter name.
- `reviewRequired`: true for custom sort/selectId or complex adapter extensions.

## AngularNgrxComponentUsageModel

Represents component-level Store usage.

Fields:
- `id`: stable usage ID.
- `componentId`: owner component ID.
- `sourceRef`: safe source reference.
- `storeInjectionName`: constructor-injected store variable name.
- `selectCalls`: ordered selector call metadata.
- `dispatchCalls`: ordered dispatch call metadata.
- `targetHookUsages`: `useAppSelector` and `useAppDispatch` intents.
- `reviewRequired`: true when selector/action resolution is ambiguous.

## ReactReduxToolkitDraft

Represents target Redux output.

Fields:
- `id`: stable draft ID.
- `featureName`: target feature name.
- `sliceName`: Redux Toolkit slice name.
- `actions`: target action creators.
- `reducers`: target reducer cases.
- `selectors`: target selector functions.
- `effects`: target thunk/listener middleware drafts.
- `entityAdapters`: target entity adapter drafts.
- `componentUsages`: component hook rewrite intents.
- `diagnostics`: conversion and review diagnostics.

