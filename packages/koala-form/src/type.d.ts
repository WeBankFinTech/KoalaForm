// export interface ReactiveModel extends Record<string, any> {

import { Ref, render, Slots } from 'vue';

// }

export type ReactiveModel = Record<string, any>;

export type KoalaFormRender = (slots: Slots) => VNodeChild;

export type PresetRender<K = Record<string, any>, T = Record<string, any>> = (opt: K, slots?: Slots<T>) => VNodeChild | null;

export interface UseFormResult {
    model: ReactiveModel;
    formRef: Ref<any>;
    rules: ReactiveModel;
    formProps: ReactiveModel;
    render: KoalaFormRender;
    formItemRender: KoalaFormRender;
    initFields: (fields?: Record<string, any>) => void;
    resetFields: (fields?: Record<string, any>) => void;
    validate: (nameList?: string[] | undefined) => Promise<any>;
    setFields: (value: Record<string, any>) => void;
    setFormProps: (props: Record<string, any>) => void;
}
