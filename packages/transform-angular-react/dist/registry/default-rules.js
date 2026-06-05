import { ComponentConverter } from '../converters/component-converter.js';
import { TemplateConverter } from '../converters/template-converter.js';
import { BehaviorConverter } from '../converters/behavior-converter.js';
import { ServiceDiConverter } from '../converters/service-di-converter.js';
import { RouteConverter } from '../converters/route-converter.js';
import { StateStrategyConverter } from '../converters/state-strategy-converter.js';
import { createAngularEcosystemRules } from './angular-ecosystem-rules.js';
export const createBuiltInRules = () => {
    const componentConverter = new ComponentConverter();
    const templateConverter = new TemplateConverter();
    const behaviorConverter = new BehaviorConverter();
    const serviceDiConverter = new ServiceDiConverter();
    const routeConverter = new RouteConverter();
    const stateConverter = new StateStrategyConverter();
    return [
        {
            ruleId: 'component-conversion',
            displayName: 'Component Conversion',
            phase: 'component',
            priority: 10,
            appliesTo: ['component'],
            transform: (context) => componentConverter.convert(context),
        },
        {
            ruleId: 'template-conversion',
            displayName: 'Template Conversion',
            phase: 'template',
            priority: 10,
            appliesTo: ['template', 'component'],
            transform: (context) => templateConverter.convert(context),
        },
        {
            ruleId: 'behavior-conversion',
            displayName: 'Behavior Conversion',
            phase: 'behavior',
            priority: 10,
            appliesTo: ['component', 'template'],
            transform: (context) => behaviorConverter.convert(context),
        },
        {
            ruleId: 'service-di-conversion',
            displayName: 'Service and DI Conversion',
            phase: 'service',
            priority: 10,
            appliesTo: ['service'],
            transform: (context) => serviceDiConverter.convert(context),
        },
        {
            ruleId: 'route-conversion',
            displayName: 'Route Conversion',
            phase: 'route',
            priority: 10,
            appliesTo: ['route'],
            transform: (context) => routeConverter.convert(context),
        },
        {
            ruleId: 'state-conversion',
            displayName: 'State Strategy Conversion',
            phase: 'state',
            priority: 10,
            appliesTo: ['state'],
            transform: (context) => stateConverter.convert(context),
        },
        ...createAngularEcosystemRules(),
    ];
};
//# sourceMappingURL=default-rules.js.map