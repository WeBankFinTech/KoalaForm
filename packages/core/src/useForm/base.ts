import { SceneConfig, SceneContext, Reactive } from '../base';

export interface FormSceneContext extends SceneContext {
    initFields: (values: Record<string, unknown>, name?: string) => void;
    resetFields: () => void;
    getProps: (name: string, type: 'field' | 'form' | 'formItem' | 'action' | String) => Reactive;
    setProps: (values: Record<string, unknown>, type: 'field' | 'form' | 'formItem' | 'action' | String) => void;
    validate: (names?: string[]) => Promise<unknown>;
}

export interface FormSceneConfig extends SceneConfig {
    formProps?: Record<string, unknown>;
}
