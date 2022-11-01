import { ComponentDesc, ComponentType, Field } from '@koala-form/core';
import { isArray } from 'lodash-es';

export const presetFesDBtn = (
    name: string,
    handler: (rowData?: Record<string, any>) => void,
    props?: {
        type?: 'primary' | 'text' | 'link' | 'info' | 'success' | 'warning' | 'danger' | 'default';
        size?: 'small' | 'middle' | 'large';
        disabled?: ComponentDesc['disabled'];
        vIf?: ComponentDesc['vIf'];
        vShow?: ComponentDesc['vShow'];
    },
): ComponentDesc => {
    return {
        vIf: props?.vIf,
        vShow: props?.vShow,
        disabled: props?.disabled,
        name: ComponentType.Button,
        props: { type: props?.type || 'primary', size: props?.size },
        children: [name],
        events: {
            onClick(pre) {
                if (isArray(pre) && pre[0]) {
                    handler(pre[0].row);
                } else {
                    handler();
                }
            },
        },
    };
};

export const presetFesDForm = (
    layout: 'horizontal' | 'inline' = 'horizontal',
    props?: { inlineItemWidth?: number | string; labelWidth?: number | string; labelPosition?: 'left' | 'top' | 'right' },
): ComponentDesc => {
    return {
        name: ComponentType.Form,
        props: { layout, ...(props || {}) },
    };
};

export const fesDQueryAction = (handlers: { query?: () => void; reset?: () => void; create?: () => void }): Field => {
    return {
        label: ' ',
        components: {
            name: ComponentType.Space,
            children: [
                handlers.query && presetFesDBtn('查询', handlers.query),
                handlers.create && presetFesDBtn('新增', handlers.create),
                handlers.reset && presetFesDBtn('重置', handlers.reset, { type: 'default' }),
            ].filter(Boolean) as ComponentDesc[],
        },
    };
};
