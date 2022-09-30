import { Ref } from 'vue';
import { SceneConfig, SceneContext, Reactive, Field, ComponentDesc } from '../base';

export interface FormSceneContext extends SceneContext {
    formRef: Ref;
    initFields: (values: Record<string, unknown>, name?: string) => void;
    resetFields: () => void;
    clearValidate: () => void;
    getProps: (name: string, type: 'field' | 'form' | 'formItem' | 'action' | String) => Reactive;
    setProps: (values: Record<string, unknown>, type: 'field' | 'form' | 'formItem' | 'action' | String) => void;
    validate: (names?: string[]) => Promise<unknown>;
}

export interface FormSceneConfig extends SceneConfig {
    form?: ComponentDesc;
    fields: Field[];
}
