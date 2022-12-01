import { ComponentDesc, ComponentType, Field } from '@koala-form/core';
import { isArray } from 'lodash-es';

/**
 * 生产按钮配置
 * @param name 按钮名称
 * @param handler 按钮点击回调
 * @param props 按钮组件属性
 * @returns
 */
export const genButton = (
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

/**
 * 生产表单配置
 * @param layout 布局类型
 * @param props 组件属性
 * @returns
 */
export const genForm = (
    layout: 'horizontal' | 'inline' = 'horizontal',
    props?: { inlineItemWidth?: number | string; labelWidth?: number | string; labelPosition?: 'left' | 'top' | 'right' },
): ComponentDesc => {
    return {
        name: ComponentType.Form,
        props: { layout, ...(props || {}) },
    };
};

/**
 * 生成查询表单的行为配置
 * @param handlers 行为响应
 * @returns
 */
export const genQueryAction = (handlers: { query?: () => void; reset?: () => void; create?: () => void }): Field => {
    return {
        label: ' ',
        components: {
            name: ComponentType.Space,
            children: [
                handlers.query && genButton('查询', handlers.query),
                handlers.create && genButton('新增', handlers.create),
                handlers.reset && genButton('重置', handlers.reset, { type: 'default' }),
            ].filter(Boolean) as ComponentDesc[],
        },
    };
};

/**
 * 生成提交表单的行为配置
 * @param handlers 行为响应
 * @returns
 */
export const genSubmitAction = (handlers: { save?: () => void; clear?: () => void; reset?: () => void }): Field => {
    return {
        label: ' ',
        components: {
            name: ComponentType.Space,
            children: [
                handlers.save && genButton('保存', handlers.save),
                handlers.clear && genButton('清空', handlers.clear, { type: 'default' }),
                handlers.reset && genButton('重置', handlers.reset, { type: 'default' }),
            ].filter(Boolean) as ComponentDesc[],
        },
    };
};
