// export interface ReactiveModel extends Record<string, any> {

import { Ref, Slot, Slots, VNodeChild } from 'vue';
import { Pager } from './const';

/** 字段类型 */
export type Field_TYPE = 'text' | 'input' | 'number' | 'select' | 'date' | 'dateTime' | 'dates' | 'dateTimes' | 'radio' | 'checkbox' | 'switch' | 'time';

export type ReactiveModel<T = Record<string, any>> = T;

export type KoalaFormRenderFunction = (slots: Slots) => VNodeChild | null | undefined;

export type HandleActionFunction = (extend?: Record<string, any>, currentPage?: number) => Promise<any>;

/**
 * @param params 参数
 * @param slots 插槽
 */
export type PresetRenderFunction<K = Record<string, any>, T = Record<string, Slot>> = (params: K, slots?: T | Slots) => VNodeChild | null | undefined;

export type TypeActionRenderFunction = PresetRenderFunction<
    {
        handleAction: HandleActionFunction;
        handleReset: Function;
    },
    {
        extendAction: Slot;
    }
>;

export interface BtnProps extends Record<string, any> {
    show?: Boolean;
    text?: String;
    onClick?: Function;
}

export interface UseFormResult {
    model: ReactiveModel;
    formRef: Ref<any>;
    /**
     * @deprecated 请使用rules, 将在1.2.0版本移除
     */
    rulesRef: ReactiveModel;
    rules: ReactiveModel;
    formProps: ReactiveModel;
    render: KoalaFormRenderFunction;
    formItemRender: KoalaFormRenderFunction;
    initFields: (fields?: Record<string, any>) => void;
    resetFields: (fields?: Record<string, any>) => void;
    validate: (nameList?: string[] | undefined) => Promise<any>;
    setFields: (value: Record<string, any>) => void;
    setFormProps: (props: Record<string, any>) => void;
}

export interface UseTableResult {
    columns: Record<string, any>[];
    /**
     * @deprecated 请使用tableDataRef, 将在1.2.0版本移除
     */
    tableModel: Ref<Record<string, any>[]>;
    tableDataRef: Ref<Record<string, any>[]>;
    pagerModel: ReactiveModel<Pager>;
    tableProps: ReactiveModel;
    pagerProps: ReactiveModel;
    tableRef: Ref;
    pagerRef: Ref;
    render: KoalaFormRenderFunction;
    setTableValue: (values?: Record<string, any> | Record<string, any>[] | undefined, index?: number | undefined) => void;
    setPagerValue: (value?: Pager | undefined) => void;
    setPagerProps: (props?: Record<string, any> | undefined) => void;
    setTableProps: (props?: Record<string, any> | undefined) => void;
}

export interface UseFormActionResult {
    form: UseFormResult;
    /**
     * @deprecated 请使用    actionRespRef，将在1.2.0版本移除
     */
    respModel: Ref<Record<string, any> | null>;
    /**
     * @deprecated 请使用actionErrorRef，将在1.2.0版本移除
     */
    errorRef: Ref<Record<string, any> | null>;
    actionRespRef: Ref<Record<string, any> | null>;
    actionErrorRef: Ref<Record<string, any> | null>;
    handleAction: HandleActionFunction;
    handleReset: () => void;
    render: KoalaFormRenderFunction;
}

export interface UseModalResult {
    /**
     * @deprecated 请使用formAction，将在1.2.0版本移除
     */
    form: UseFormResult;
    formAction: UseFormActionResult;
    modalModel: ReactiveModel;
    modalProps: ReactiveModel;
    open: (data?: Record<string, any>) => Promise<void>;
    render: KoalaFormRenderFunction;
    handleOk: () => void;
    handleCancel: () => void;
    setModalProps: (props?: Record<string, any>) => void;
}

export interface UseQueryResult {
    /**
     * @deprecated 请使用formAction，将在1.2.0版本移除
     */
    query: UseFormActionResult;
    formAction: UseFormActionResult;
    table: UseTableResult;
    render: KoalaFormRenderFunction;
}

export interface UsePageResult {
    /**
     * @deprecated 将在1.2.0版本移除
     */
    actions: {
        insert?: UseModalResult;
        update?: UseModalResult;
        view?: UseModalResult;
        delete?: UseModalResult;
    };
    query: UseQueryResult;
    insert?: UseModalResult;
    update?: UseModalResult;
    view?: UseModalResult;
    delete?: UseModalResult;
    render: KoalaFormRenderFunction;
}
