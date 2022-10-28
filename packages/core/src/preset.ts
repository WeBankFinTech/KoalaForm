// import { Handle } from './base';
// import { afterDoQuery } from './handles';
import {
    disabledPlugin,
    eventsPlugin,
    formatPlugin,
    formRulePlugin,
    installInGlobal,
    optionsPlugin,
    PluginFunction,
    renderPlugin,
    slotPlugin,
    vIfPlugin,
    vShowPlugin,
} from './plugins';
// import { ComponentDesc, ComponentType } from './scheme';
// import { FormSceneContext } from './useForm';
// import { PagerSceneContext } from './usePager';
// import { TableSceneContext } from './useTable';

export const installPluginPreset = () => {
    installInGlobal(renderPlugin)
        .append(formRulePlugin as PluginFunction)
        .append(eventsPlugin)
        .append(vIfPlugin)
        .append(vShowPlugin)
        .append(slotPlugin)
        .append(disabledPlugin)
        .append(optionsPlugin)
        .append(formatPlugin as PluginFunction);
};

// export const doQueryHandles = (
//     api: string,
//     config?: {
//         pagerCtx?: PagerSceneContext;
//         tableCtx?: TableSceneContext;
//         formCtx?: FormSceneContext;
//         requestConfig?: unknown;
//     },
// ): Handle[] => {
//     return [
//         validate(undefined, config?.formCtx),
//         beforeDoQuery(config?.pagerCtx, config?.formCtx),
//         wrapRequest(api, config?.requestConfig),
//         afterDoQuery(config?.pagerCtx, config?.tableCtx),
//     ];
// };

// export const queryAction = (handles: Handle[]): ComponentDesc => {
//     return {
//         name: ComponentType.Button,
//         props: { type: 'primary' },
//         children: ['查询'],
//         events: {
//             onClick: handles,
//         },
//     };
// };

// export const queryResetAction = (handles: Handle[]): ComponentDesc => {
//     return {
//         name: ComponentType.Button,
//         props: {},
//         children: ['重置'],
//         events: {
//             onClick: handles,
//         },
//     };
// };
