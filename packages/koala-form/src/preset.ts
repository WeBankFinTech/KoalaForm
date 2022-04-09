/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseField } from './field';
import { Slots, Slot, VNodeChild, Ref } from 'vue';
import { merge } from 'lodash';
import { ACTION_TYPES, Pager } from './const';
import { Config } from './config';
import { ReactiveModel, PresetRenderFunction, TypeActionRenderFunction, BtnProps } from './types';
export class Preset {
    constructor(preset?: Preset) {
        merge(this, preset);
    }

    /**
     * 获取name的枚举值
     * @param name
     * @returns
     */
    getEnums?(name: string): any[] {
        return [];
    }
    /**
     * model数据格式化成页面展示格式，比如在数据录入的组件上
     * @param data model数据
     */
    formatToEdit?(data: Record<string, any>, field: BaseField): Record<string, any> {
        return data;
    }
    /**
     * model数据格式化成页面展示格式，比如在列表上
     * @param field field定义
     * @param data model数据
     */
    formatToShow?(data: Record<string, any>, field: BaseField): Record<string, any> {
        return data;
    }
    /**
     * model数据格式化成接口请求参数
     * @param field meta定义
     * @param data model数据
     * @returns 格式化后的数据
     */
    formatToReqParams?(data: Record<string, any>, field: BaseField): Record<string, any> {
        return data;
    }
    buttonRender: PresetRenderFunction<BtnProps, { default?: Slot }> = (params, slots) => slots?.default?.(params);
    /**
     * FormItem内容的渲染
     */
    formItemFieldRender: PresetRenderFunction<{
        field: BaseField;
        model: ReactiveModel;
        type: ACTION_TYPES;
        props: ReactiveModel;
        options: any;
        disabled: boolean;
    }> = () => null;
    /**
     * FormItem渲染
     */
    formItemRender: PresetRenderFunction<
        {
            field: BaseField;
            type: ACTION_TYPES;
        },
        {
            default: Slot;
        }
    > = () => null;
    /**
     * 表单渲染
     */
    formRender: PresetRenderFunction<
        {
            model: ReactiveModel;
            formRef: ReactiveModel;
            rules: ReactiveModel;
            type: ACTION_TYPES;
            props: ReactiveModel;
        },
        {
            default: Slot;
        }
    > = () => null;
    formReset?(formRef: Ref<any>): void {
        formRef.value?.resetFields();
    }
    formValidate?(formRef: Ref<any>, nameList?: string[]): Promise<any> {
        return formRef.value?.validate();
    }
    /**
     * 接口请求
     * @param api 请求地址
     * @param params 请求参数
     * @param config 请求配置
     */
    request?(api: string, params?: Record<string, any>, config?: Record<string, any>): Promise<any> {
        return Promise.reject('preset.request未提供实现！');
    }
    /**
     * 定义列表的列定义
     * @param field 字段定义
     * @param options 字段需要匹配的options
     * @returns
     */
    defineTableColumn?(field: BaseField, options?: any): Record<string, any> {
        return {};
    }
    tableRender: PresetRenderFunction<{
        columns: Record<string, any>[];
        tableDataRef: Ref<Record<string, any>[]>;
        tableProps: ReactiveModel;
        pagerProps: ReactiveModel;
        pagerModel: ReactiveModel<Pager>;
        rowKey?: string;
        tableRef: Ref;
        pagerRef: Ref;
    }> = () => null;
    modalRender: PresetRenderFunction<
        {
            modalModel: ReactiveModel;
            modalProps: ReactiveModel;
            onOk: () => void;
            onCancel: () => void;
        },
        {
            default: Slot;
            footer: Slot;
        }
    > = () => {
        console.warn('preset.modalRender未提供实现！');
        return null;
    };
    drawerRender: PresetRenderFunction<
        {
            modalModel: ReactiveModel;
            modalProps: ReactiveModel;
            onOk: () => void;
            onCancel: () => void;
        },
        {
            default: Slot;
            footer: Slot;
        }
    > = () => {
        console.warn('preset.drawerRender未提供实现！');
        return null;
    };
    pageRender: PresetRenderFunction<
        Record<string, any>,
        {
            default: Slot;
        }
    > = (param, slots) => {
        return slots?.default?.();
    };
    confirm?(params: { title?: string; content?: string; onOk?: Function; onCancel?: Function }): void {
        console.warn('preset.confirm未提供实现！');
    }
    message? = {
        success(content: string, duration: number): void {
            console.warn('preset.message.success未提供实现！');
        },
        error(content: string, duration: number): void {
            console.warn('preset.message.error未提供实现！');
        },
        info(content: string, duration: number): void {
            console.warn('preset.message.info未提供实现！');
        },
        warning(content: string, duration: number): void {
            console.warn('preset.message.warning未提供实现！');
        },
    };
}

export const _preset = new Preset();

export function definePreset(preset: Preset) {
    return merge(new Preset(), preset);
}

export function usePreset(preset: Preset) {
    merge(_preset, preset);
}
