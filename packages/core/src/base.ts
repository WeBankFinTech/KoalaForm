import { isFunction, isString, merge } from 'lodash-es';
import { getCurrentInstance, Ref, Slots, VNodeChild, Component, DefineComponent, ref } from 'vue';
import { travelTree, turnArray } from './helper';
import { renderPlugin } from './plugins';

export declare type Reactive<T = Record<string, any>> = T | Ref<T>;

// 插件定义
export type KoalaPlugin<T extends SceneContext = SceneContext, K extends SceneConfig = SceneConfig> = (
    cxt: T,
    config: K,
    scheme?: SchemeStatus,
    node?: ComponentDesc | Field,
) => void;

// 上下文定义相关
export type ModelRef = { ref: Reactive; name: string };
export type SchemeChildren = Array<SchemeStatus | string | ModelRef> | string | ModelRef;

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
    model?: Reactive;
    schemes: Array<SchemeStatus>;
    getComponent: (name: keyof typeof ComponentType | String | Component) => Component | string;
    render: (slots?: Slots) => VNodeChild;
    __config: SceneConfig;
}
export interface SceneConfig {
    name: string;
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
    // querySubmit: Record<;
    dataPath: {
        data?: string;
        list?: string;
        pageTotal?: string;
    };
} = {
    renderPlugin,
    modelValueName: 'modelValue',
    dataPath: {
        list: 'list',
        pageTotal: 'page.totalCount',
    },
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

export function createSceneContext<T extends SceneContext>(config: SceneConfig): T {
    const ctx: SceneContext = {
        schemes: [],
        getComponent: (name) => name as string,
        render: () => [],
        __config: config,
    };
    setSceneContext(config.name, ctx);
    return ctx as unknown as T;
}

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

export function useBaseScene<T extends SceneContext, K extends SceneConfig>(config: K): T {
    const ctx = createSceneContext<T>(config);
    const plugins: KoalaPlugin[] = mergePlugins(['renderPlugin', 'componentPlugin'], config.plugins || []);
    const schemes = compileComponents(ctx, config.components);
    if (schemes) ctx.schemes = schemes;

    // 执行插件
    plugins.forEach((plugin) => {
        if (plugin.length > 2 && ctx.schemes) {
            travelTree(ctx.schemes, (scheme) => {
                plugin(ctx, config, scheme, scheme.__node as ComponentDesc);
            });
        } else {
            plugin(ctx, config);
        }
    });

    console.log(ctx);
    return ctx;
}

const submitParamTemplate = {
    model: '...model',
    createTimeStart: 'model.createTime[0]',
    page: {
        current: 'currentPage',
        pageSize: 'pageSize',
    },
};

const resTemplate = {
    model: '...model',
    createTimeStart: 'model.createTime[0]',
    page: {
        current: 'currentPage',
        pageSize: 'pageSize',
    },
};
