import { ComponentDesc, ComponentType, Field } from '@koala-form/core';
import { isArray } from 'lodash-es';

export const genFesDButton = (
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

export const genFesDForm = (
    layout: 'horizontal' | 'inline' = 'horizontal',
    props?: { inlineItemWidth?: number | string; labelWidth?: number | string; labelPosition?: 'left' | 'top' | 'right' },
): ComponentDesc => {
    return {
        name: ComponentType.Form,
        props: { layout, ...(props || {}) },
    };
};

export const genFesDQueryAction = (handlers: { query?: () => void; reset?: () => void; create?: () => void }): Field => {
    return {
        label: ' ',
        components: {
            name: ComponentType.Space,
            children: [
                handlers.query && genFesDButton('查询', handlers.query),
                handlers.create && genFesDButton('新增', handlers.create),
                handlers.reset && genFesDButton('重置', handlers.reset, { type: 'default' }),
            ].filter(Boolean) as ComponentDesc[],
        },
    };
};

export const genFesDSubmitAction = (handlers: { save?: () => void; clear?: () => void; reset?: () => void }): Field => {
    return {
        label: ' ',
        components: {
            name: ComponentType.Space,
            children: [
                handlers.save && genFesDButton('保存', handlers.save),
                handlers.clear && genFesDButton('清空', handlers.clear, { type: 'default' }),
                handlers.reset && genFesDButton('重置', handlers.reset, { type: 'default' }),
            ].filter(Boolean) as ComponentDesc[],
        },
    };
};
