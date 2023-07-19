import { ComponentDesc, ComponentType, Field } from '@koala-form/core';
import { ElButton, ElPopconfirm } from 'element-plus';
import { h } from 'vue';

/**
 * 生成按钮配置
 * @param name 按钮名称
 * @param handler 按钮点击回调
 * @param props 按钮组件属性
 * @returns
 */
export const genButton = (
    name: string,
    handler?: (rowData?: any) => void,
    props?: {
        type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
        size?: 'small' | 'default' | 'large';
        disabled?: ComponentDesc['disabled'];
        vIf?: ComponentDesc['vIf'];
        vShow?: ComponentDesc['vShow'];
        [key: string]: any;
    },
): ComponentDesc => {
    const { vIf, vShow, disabled, type, size, ...others } = props || {};
    const btn: ComponentDesc = {
        vIf,
        vShow: vShow,
        disabled: disabled,
        name: ComponentType.Button,
        props: { type: type || 'primary', size: size, ...others },
        children: [name],
    };
    if (handler) {
        btn.events = {
            onClick: handler,
        };
    }
    return btn;
};

/**
 * 生成表单配置
 * @param layout 布局类型
 * @param props 组件属性
 * @returns
 */
export const genForm = (inline = false, props?: { labelWidth?: number | string; labelPosition?: 'left' | 'top' | 'right' }): ComponentDesc => {
    return {
        name: ComponentType.Form,
        props: { inline, ...(props || {}) },
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

/**
 * 生成列表的行为配置
 * @param handlers 行为响应
 * @returns
 */
export const genTableAction = (handlers: { update?: () => void; delete?: () => void; view?: () => void }, label?: string): Field => {
    return {
        label: label || '操作',
        components: {
            name: ComponentType.Space,
            children: [
                handlers.view && genButton('详情', handlers.view, { link: true }),
                handlers.update && genButton('更新', handlers.update, { link: true }),
                handlers.delete && {
                    name: ElPopconfirm,
                    props: { title: '是否删除该记录？', width: 200 },
                    events: {
                        onConfirm: handlers.delete,
                    },
                    slots: {
                        reference: () => h(ElButton, { type: 'primary', link: true }, () => '删除'),
                    },
                },
            ].filter(Boolean) as ComponentDesc[],
        },
    };
};
