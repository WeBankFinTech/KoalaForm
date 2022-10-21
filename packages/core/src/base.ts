import { isFunction, isString, merge } from 'lodash-es';
import mitt, { Emitter } from 'mitt';
import { Ref, Slots, VNodeChild, Component, DefineComponent, Slot } from 'vue';
import { travelTree, turnArray } from './helper';
import { renderPlugin } from './plugins';

export declare type Reactive<T = Record<string, any>> = T | Ref<T>;

interface BaseEvent {
    ctx: SceneContext;
    config: SceneConfig;
    pluginName: string;
}

type KoalaPluginResult = {
    // 插件执行前
    onPluginStart?: (event: BaseEvent) => void;
    // 插件执行后
    onPluginEnd?: (event: BaseEvent) => void;

    /** 组件库已加载 */
    onComponentsLoaded?: (event: BaseEvent) => void;

    [key: string]: (<T extends BaseEvent>(event: T) => void) | undefined;
};

// 插件定义
export type KoalaPlugin<T extends SceneContext = SceneContext, K extends SceneConfig = SceneConfig> = (
    opt: {
        ctx: T;
        config: K;
        emit: (name: string, event?: any) => void;
    },
    every?: {
        scheme: SchemeStatus;
        node: ComponentDesc | Field;
    },
) => KoalaPluginResult | void;

// 上下文定义相关
export type ModelRef = { ref: Reactive; name: string };
export type SchemeChildren = Array<SchemeStatus | string | ModelRef | Slot> | string | ModelRef | Slot;

export type EnumOption = { label: unknown; value: unknown; [key: string]: unknown };
export interface SchemeStatus {
    component: string | Component;
    props?: Reactive;
    vModels?: Record<string, ModelRef>;
    vShow?: Ref<boolean>;
    vIf?: Ref<boolean>;
    events?: Record<string, (...args: unknown[]) => void>;
    children?: SchemeChildren;
    slots?: Slots;
    __ref?: Ref;
    __node: unknown;
}
export interface SceneContext {
    name: string;
    model?: Reactive;
    schemes: Array<SchemeStatus>;
    getComponent: (name: keyof typeof ComponentType | String | Component) => Component | string;
    render: (slots?: Slots) => VNodeChild;
    __config?: SceneConfig;
}
export interface SceneConfig {
    ctx: SceneContext;
    components?: ComponentDesc[];
    plugins?: KoalaPlugin[];
}

export type When<T extends SceneContext = SceneContext> = (cxt: T, invoke: (...args: unknown[]) => void, field?: Field) => void;

export type WhenPlugin<T, K extends SceneContext = SceneContext> = (args: T) => When<K> | undefined;

export type Handle<T extends SceneContext = SceneContext, K = unknown> = (cxt: T, ...args: any[]) => Promise<K[] | void> | K[] | void;
export interface Action {
    when?: When;
    handles?: Handle | Handle[];
}
export interface ComponentDesc {
    name: string;
    props?: Reactive;
    vIf?: Reactive<boolean> | When;
    vShow?: Reactive<boolean> | When;
    disabled?: Reactive<boolean> | When;
    events?: Record<string, Handle | Handle[]>;
    slotName?: string;
    children?: Array<string | ComponentDesc>;
}
// Field定义相关
export type ValueType = 'string' | 'number' | 'boolean' | 'method' | 'regexp' | 'integer' | 'float' | 'array' | 'object' | 'enum' | 'date' | 'url' | 'hex' | 'email' | 'any';
export interface ValidateRule {
    required?: boolean;
    type?: ValueType;
    message?: string;
    trigger?: 'blur' | 'change' | ['change', 'blur'];
    validator?(rule: ValidateRule, value: any, callback: Function): void;
    min?: number;
    max?: number;
    enum?: string;
    len?: number;
    pattern?: RegExp;
}
export interface Field {
    type?: ValueType;
    label?: string;
    name?: string;
    vIf?: Ref<boolean> | boolean | When;
    vShow?: Ref<boolean> | boolean | When;
    option?: Ref<EnumOption[]> | EnumOption[] | Handle;
    props?: Reactive;
    components?: ComponentDesc | ComponentDesc[];
    defaultValue?: any;
    rules?: Array<ValidateRule>;
    required?: boolean;
    slotName?: string;
}

// 默认配置
const defaultConfig: {
    componentPlugin?: KoalaPlugin;
    renderPlugin?: KoalaPlugin;
    request?: (api: string, data?: unknown, config?: unknown) => Promise<any>;
    modelValueName: string;
} = {
    renderPlugin,
    modelValueName: 'modelValue',
};

export const setupGlobalConfig = (config: typeof defaultConfig) => {
    merge(defaultConfig, config);
};

export const getGlobalConfig = () => defaultConfig;

// 常用组件
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
    TableColumn: 'TableColumn',
    Modal: 'Modal',
    Pagination: 'Pagination',
};

export function isComponent(component: DefineComponent): boolean {
    return !!(component && component.install && component.props);
}

export const findScheme = (schemes: SchemeStatus[], node: unknown): SchemeStatus | void => {
    if (!schemes || !node) return;
    for (let index = 0; index < schemes.length; index++) {
        const scheme = schemes[index];
        if (scheme?.__node === node) return scheme;
        const found = findScheme(scheme.children as SchemeStatus[], node);
        if (found) return found;
    }
};

export const mergePlugins = (...args: Array<KoalaPlugin | string>[]) => {
    const plugins: Array<KoalaPlugin | string> = [];
    args.forEach((items) => {
        if (items) plugins.push(...items);
    });
    const config = getGlobalConfig();
    const list: KoalaPlugin[] = [];
    plugins.forEach((plugin) => {
        const _plugin: KoalaPlugin = isString(plugin) ? config[plugin] : plugin;
        if (!list.includes(_plugin)) {
            list.push(_plugin);
        }
    });
    return list;
};

export const createScheme = (node: ComponentDesc | string | Field): SchemeStatus => {
    if (isString(node)) {
        return { __node: node, component: '', children: node };
    } else {
        return { __node: node, component: node.name || '', props: node.props };
    }
};

export const compileComponents = (ctx: SceneContext, components?: ComponentDesc | ComponentDesc[]) => {
    const comps = turnArray(components);
    if (comps.length) {
        const schemes = travelTree<ComponentDesc, SchemeStatus>(comps, (node) => {
            const scheme = findScheme(ctx.schemes, node) || createScheme(node);
            return scheme;
        });
        if (schemes) return schemes;
    }
};

export const useSceneContext = (names?: string[]) => {
    const ctxs: SceneContext[] = [];
    const ctxMap: Record<string, SceneContext> = {};

    const createContext = (cxtName: string): SceneContext => {
        return {
            name: cxtName,
            schemes: [],
            getComponent: (name) => name as string,
            render: () => [],
        };
    };

    names?.forEach((name) => {
        const ctx = createContext(name);
        ctxMap[name] = ctx;
        ctxs.push(ctx);
    });

    const getContext = <T extends SceneContext>(name: string): T => {
        return (ctxMap[name] || (ctxMap[name] = createContext(name))) as T;
    };

    const setContext = <T extends SceneContext>(name: string, values: T) => {
        const cxt = getContext(name);
        Object.assign(cxt, values);
    };
    return {
        ctxs,
        getContext,
        setContext,
    };
};

const addEventListener = (emitter: Emitter<any>, events: KoalaPluginResult) => {
    if (!events) return;
    Object.keys(events).forEach((key) => {
        const cb = events[key];
        isFunction(cb) && emitter.on(key, cb);
    });
};

export function useBaseScene<T extends SceneContext, K extends SceneConfig>(config: K): T {
    const { ctx, components } = config;
    ctx.__config = config;
    const emitter = mitt();
    const plugins: KoalaPlugin[] = mergePlugins(['renderPlugin', 'componentPlugin'], config.plugins || []);
    const schemes = compileComponents(ctx, components);
    if (schemes) ctx.schemes = schemes;
    const pluginOpt = { ctx, config, emit: emitter.emit as any };

    // 执行插件
    plugins.forEach((plugin) => {
        // const event: BaseEvent = { ctx, config, pluginName: plugin.name };
        // emitter.emit('onPluginStart', event);
        if (plugin.length > 1 && ctx.schemes) {
            travelTree(ctx.schemes, (scheme) => {
                const events = plugin(pluginOpt, { scheme, node: scheme.__node as ComponentDesc });
                events && addEventListener(emitter, events);
            });
        } else {
            const events = plugin(pluginOpt);
            events && addEventListener(emitter, events);
        }
        // emitter.emit('onPluginEnd', event);
    });

    console.log(ctx);
    return ctx as T;
}
