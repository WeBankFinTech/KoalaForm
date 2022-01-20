/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseField } from './field';
import { Slots, Slot, VNodeChild, Ref } from 'vue';
import { merge } from 'lodash';
import { ACTION_TYPES, Pager } from './const';
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
    /**
     * FormItem内容的渲染
     * @param field 字段定义
     * @param opt
     */
    formItemFieldRender?(
        field?: BaseField,
        opt?: {
            model?: Record<string, any>;
            type?: string;
            disabled?: boolean;
            props?: any;
            options?: any;
        },
    ): VNodeChild {
        return null;
    }
    /**
     * FormItem渲染
     * @param field 字段定义
     * @param defaultSlot FormItem内容的slot
     */
    formItemRender?(defaultSlot?: Slot, field?: BaseField, type?: string ): VNodeChild {
        return null;
    }
    /**
     * 表单渲染
     * @param defaultSlot 表单内容的slot
     * @param opt
     */
    formRender?(
        defaultSlot: Slot,
        opt?: {
            model?: Record<string, any>;
            formRef?: Ref<any>;
            rulesRef?: Record<string, any>;
            type: ACTION_TYPES;
        },
    ): VNodeChild {
        return null;
    }
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
     * 查询表单的操作的渲染
     * @param params
     */
    queryActionRender?(params: {
        /** 执行请求 */
        handle: Function;
        /** 重置表单 */
        reset: Function;
        extendRef?: {
            openInsertModal?: Function;
        };
        /** 操作扩展slot */
        extendSlot?: Slot;
    }): VNodeChild {
        return params.extendSlot?.();
    }
    insertActionRender?(params: { handle: Function; reset: Function; extendRef?: Record<string, any>; extendSlot?: Slot }): VNodeChild {
        return params.extendSlot?.();
    }
    updateActionRender?(params: { handle: Function; reset: Function; extendRef?: Record<string, any>; extendSlot?: Slot }): VNodeChild {
        return params.extendSlot?.();
    }
    deleteActionRender?(params: { handle: Function; reset: Function; extendRef?: Record<string, any>; extendSlot?: Slot }): VNodeChild {
        return params.extendSlot?.();
    }
    viewActionRender?(params: { handle: Function; reset: Function; extendRef?: Record<string, any>; extendSlot?: Slot }): VNodeChild {
        return params.extendSlot?.();
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
    tableRender?(
        slots: Slots,
        opt: {
            columns: any[];
            tableModel: Ref<Record<string, any>[]>;
            pagerModel: Pager;
            rowKey?: string;
        },
    ): VNodeChild {
        return null;
    }
    tableActionsRender?(params: {
        record: Record<string, any>;
        openUpdateModal?(data?: Record<string, any>): Promise<void>;
        openViewModal?(data?: Record<string, any>): Promise<void>;
        openDeleteModal?(data?: Record<string, any>): Promise<void>;
    }): VNodeChild {
        return null;
    }
    modalRender?(
        defaultSlot: Slot,
        params: {
            modalModel: Record<string, any>;
            onOk: Function;
            onCancel: Function;
        },
    ): VNodeChild {
        console.warn('preset.modalRender未提供实现！');
        return null;
    }
    pageRender?(defaultSlot: Slot): VNodeChild {
        return defaultSlot?.();
    }
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
