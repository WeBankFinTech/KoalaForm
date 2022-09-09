import { merge } from 'lodash-es';
import { DefineComponent, getCurrentInstance, Ref, Slots, Slot, VNodeChild, Component, vShow } from 'vue';
import { Action } from './action';
import { Field } from './field';
import { mergePlugins, useState } from './helper';
import { isArray } from 'lodash-es';
import { renderPlugin } from './plugins';

export declare type Reactive<T = Record<string, any>> = T | Ref<T>;

// 默认配置
const defaultConfig: {
    componentPlugin?: KoalaPlugin;
} = {};

export const setupGlobalConfig = (config: typeof defaultConfig) => {
    merge(defaultConfig, config);
};

export const getGlobalConfig = () => defaultConfig;

// 组件
export const ComponentType = {
    Button: 'Button',
    Space: 'Space',
    Form: 'Form',
    FormItem: 'FormItem',
    Input: 'Input',
    InputNumber: 'InputNumber',
    Checkbox: 'Checkbox',
    Radio: 'Radio',
    Select: 'Select',
    Switch: 'Switch',
    TimePicker: 'TimePicker',
    DatePicker: 'DatePicker',
    Upload: 'Upload',
    SelectTree: 'SelectTree',
    SelectCascader: 'SelectCascader',
    Table: 'Table',
    Modal: 'Modal',
};
export function isComponent(component: DefineComponent): boolean {
    return !!(component && component.install && component.props);
}

// 场景
export type KoalaPlugin<T extends SceneContext = SceneContext, K extends SceneConfig = SceneConfig> = (cxt: T, config: K) => void;

export interface SchemeStatus {
    component: string | Component;
    props: Reactive;
    vModel: Reactive;
    vShow: Ref<boolean>;
    vIf: Ref<boolean>;
    events: Record<string, (...args: unknown[]) => void>;
    children: Array<SchemeStatus | string> | Slots;
}

interface SceneContext {
    schemes: Array<SchemeStatus>;
    getComponent: (name: keyof typeof ComponentType | String | Component) => DefineComponent<Record<string, any>> | string;
    render: (slots?: Slots) => VNodeChild;
}

// export interface SceneContext {
//     getState: () => Reactive;
//     setState: (value: unknown) => void;
//     getProps: (name: string, type: string) => Reactive | void;
//     setProps: (values: Record<string, unknown>, type: string) => void;
//     getComponent: (name: keyof typeof ComponentType | String) => DefineComponent<Record<string, any>> | void;
//     renderComponent: (name?: string, props?: Reactive, slots?: Slots) => VNodeChild;
//     renderAction: (action: Action) => VNodeChild;
//     render: (slots?: Slots) => VNodeChild;
// }

export interface SceneConfig {
    name: string;
    fields?: Field[];
    plugins?: KoalaPlugin[];
    actionsLayout?: {
        component: string;
        props?: Reactive;
    };
    actions?: Action | Action[];
}

export function getSceneContext<T = SceneContext>(name?: string | T): T | undefined {
    if (typeof name === 'string') {
        const vm = getCurrentInstance();
        const $scene = vm?.['$scene'];
        return $scene?.[name];
    } else return name;
}

export function setSceneContext<T extends SceneContext>(name: string, ctx: T) {
    const vm = getCurrentInstance();
    if (!vm) return;
    const $scene = vm?.['$scene'] || {};
    $scene[name] = ctx;
    vm['$scene'] = $scene;
}

export function createSceneContext<T extends SceneContext>(name: string): T {
    const ctx: SceneContext = {
        schemes: [],
        getComponent: (name) => name as string,
        render: () => [],
    };
    setSceneContext(name, ctx);
    return ctx as unknown as T;
}

export function useBaseScene<T extends SceneContext, K extends SceneConfig>(config: K): T {
    const ctx = createSceneContext<T>(config.name);
    const plugins: KoalaPlugin[] = mergePlugins([renderPlugin, defaultConfig.componentPlugin], config.plugins || []);

    plugins.forEach((plugin) => {
        if (typeof plugin === 'function') {
            plugin(ctx, config);
        }
    });

    return ctx;
}
