import { merge } from 'lodash-es';
import { Ref, Slots, VNodeChild, Component, ref, onUnmounted } from 'vue';
import { turnArray } from './helper';
import { installIn, Plugin, PluginFunction, pluginInstalled } from './plugins/define';
import { compileComponents, ComponentDesc, ComponentType, Field, Scheme } from './scheme';

export declare type Reactive<T = Record<string, any>> = T | Ref<T>;

export type EnumOption = { label: unknown; value: unknown; [key: string]: unknown };

export interface SceneContext {
    name: string;
    modelRef: Ref;
    schemes: Array<Scheme>;
    getComponent: (name: keyof typeof ComponentType | String | Component) => Component | string;
    render: (slots?: Slots) => VNodeChild;
    __config?: SceneConfig;
    __pluginStarted?: boolean;
    readonly __scopedId: string | number;
    readonly __plugins: PluginFunction[];
    /** 插件 */
    readonly use: (define: PluginFunction) => SceneContext;
}

export interface SceneConfig {
    ctx?: SceneContext;
    components?: ComponentDesc[] | ComponentDesc;
}

export type When<T extends SceneContext = SceneContext> = (ctx: T, invoke: (...args: unknown[]) => void, field?: Field) => void;

export type WhenPlugin<T, K extends SceneContext = SceneContext> = (args: T) => When<K> | undefined;

// 默认配置
const defaultConfig: {
    debug?: boolean;
    request?: (api: string, data?: unknown, config?: unknown) => Promise<any>;
    modelValueName: string;
} = {
    debug: process.env.NODE_ENV !== 'production',
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

    const createContext = (ctxName: string): SceneContext => {
        const __plugins: PluginFunction[] = [];
        scopeId++;
        const ctx: SceneContext = {
            name: ctxName,
            modelRef: ref(null),
            schemes: [],
            getComponent: (name) => name as string,
            render: () => [],
            use: (plugin) => {
                ctx.__pluginStarted && console.warn(`【${ctx.name}】插件添加不能在场景执行后`);
                installIn(plugin, __plugins);
                return ctx;
            },
            __scopedId: scopeId,
            __plugins,
        };
        return ctx;
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
        const ctx = getContext(name);
        Object.assign(ctx, values);
    };
    return {
        ctxs,
        /** ctxs[0] */
        ctx: ctxs[0],
        getContext,
        setContext,
    };
};

export const baseComPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('base-comp-plugin');
    api.onSelfStart(({ ctx, config }) => {
        const schemes = compileComponents(ctx.schemes || [], config.components);
        if (schemes) ctx.schemes = schemes;
        api.emit('baseSchemeLoaded');
        api.emit('schemeLoaded');
        api.emit('started');
    });
};

export function useScene<T extends SceneContext, K extends SceneConfig>(config: K): T {
    if (!config.ctx) {
        const { ctx } = useSceneContext('base');
        config.ctx = ctx;
    }
    const { ctx } = config;
    getGlobalConfig().debug && console.log(`【${ctx.name}】场景上下文`, ctx);
    ctx.__config = config;
    ctx.use(baseComPlugin);

    const pluginDefineList = [...pluginInstalled, ...ctx.__plugins];
    const plugins = pluginDefineList.map((define) => {
        const plugin = new Plugin(ctx.__scopedId, ctx);
        define(plugin);
        return plugin;
    });
    plugins.forEach((plugin) => {
        plugin.start(config);
    });
    ctx.__pluginStarted = true;

    onUnmounted(() => {
        const len = plugins.length;
        for (let index = 0; index < len; index++) {
            plugins[index].destroy();
            delete plugins[index];
        }
        plugins.length = 0;
        getGlobalConfig().debug && console.log(`【${ctx.name}】卸载场景及插件`);
        Object.keys(ctx).forEach((key) => delete ctx[key]);
    });
    return ctx as T;
}
