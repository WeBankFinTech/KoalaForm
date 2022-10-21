import { ComponentDesc, ComponentType, Field, Handle } from './base';
import { afterDoQuery, beforeDoQuery, wrapRequest } from './handles';
import { FormSceneContext, validate } from './useForm';
import { PagerSceneContext } from './usePager';
import { TableSceneContext } from './useTable';

export const doQueryHandles = (
    api: string,
    config?: {
        pagerCtx?: PagerSceneContext;
        tableCtx?: TableSceneContext;
        formCtx?: FormSceneContext;
        requestConfig?: unknown;
    },
): Handle[] => {
    return [
        validate(undefined, config?.formCtx),
        beforeDoQuery(config?.pagerCtx, config?.formCtx),
        wrapRequest(api, config?.requestConfig),
        afterDoQuery(config?.pagerCtx, config?.tableCtx),
    ];
};

export const queryAction = (handles: Handle[]): ComponentDesc => {
    return {
        name: ComponentType.Button,
        props: { type: 'primary' },
        children: ['查询'],
        events: {
            onClick: handles,
        },
    };
};

export const queryResetAction = (handles: Handle[]): ComponentDesc => {
    return {
        name: ComponentType.Button,
        props: {},
        children: ['重置'],
        events: {
            onClick: handles,
        },
    };
};
