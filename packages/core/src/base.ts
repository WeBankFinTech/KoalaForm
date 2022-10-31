import { merge } from 'lodash-es';
import { Ref, Slots, VNodeChild, Component } from 'vue';
import { turnArray } from './helper';
import { installIn, Plugin, PluginFunction, pluginInstalled } from './plugins/define';
import { compileComponents, ComponentDesc, ComponentType, Field, Scheme } from './scheme';

export declare type Reactive<T = Record<string, any>> = T | Ref<T>;

export type EnumOption = { label: unknown; value: unknown; [key: string]: unknown };

export interface SceneContext {
    name: string;
    model?: Reactive;
    schemes: Array<Scheme>;
    getComponent: (name: keyof typeof ComponentType | String | Component) => Component | string;
    render: (slots?: Slots) => VNodeChild;
    __config?: SceneConfig;
    readonly __scopedId: string | number;
    readonly __plugins: PluginFunction[];
    /** 插件 */
    readonly use: (define: PluginFunction) => SceneContext;
}

export interface SceneConfig {
    ctx: SceneContext;
    components?: ComponentDesc[];
}

export type When<T extends SceneContext = SceneContext> = (cxt: T, invoke: (...args: unknown[]) => void, field?: Field) => void;

export type WhenPlugin<T, K extends SceneContext = SceneContext> = (args: T) => When<K> | undefined;

// 默认配置
const defaultConfig: {
    request?: (api: string, data?: unknown, config?: unknown) => Promise<any>;
    modelValueName: string;
} = {
    modelValueName: 'modelValue',
};

export const setupGlobalConfig = (config: typeof defaultConfig) => {
    merge(defaultConfig, config);
};

export const getGlobalConfig = () => defaultConfig;

let scopeId = 0;
export const useSceneContext = (names: string[] | string) => {
    const ctxs: SceneContext[] = [];
    const ctxMap: Record<string, SceneContext> = {};

    const createContext = (cxtName: string): SceneContext => {
        const __plugins: PluginFunction[] = [];
        scopeId++;
        const cxt: SceneContext = {
            name: cxtName,
            schemes: [],
            getComponent: (name) => name as string,
            render: () => [],
            use: (plugin) => {
                installIn(plugin, __plugins);
                return cxt;
            },
            __scopedId: scopeId,
            __plugins,
        };
        return cxt;
    };

    turnArray(names)?.forEach((name) => {
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
        /** ctxs[0] */
        ctx: ctxs[0],
        getContext,
        setContext,
    };
};

export function useBaseScene<T extends SceneContext, K extends SceneConfig>(config: K): T {
    const { ctx, components } = config;
    ctx.__config = config;
    const schemes = compileComponents(ctx.schemes || [], components);
    if (schemes) ctx.schemes = schemes;

    const pluginDefineList = [...pluginInstalled, ...ctx.__plugins];

    pluginDefineList
        .map((define) => {
            const plugin = new Plugin(ctx.__scopedId, ctx);
            define(plugin);
            return plugin;
        })
        .forEach((plugin) => {
            plugin.start(config);
        });
    return ctx as T;
}
