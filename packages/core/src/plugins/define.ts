import mitt from 'mitt';
import { SceneConfig, SceneContext } from '../base';

interface PluginHookData<T = SceneContext, K = SceneConfig> {
    id: number;
    /** 插件名 */
    name: string;
    scopeId: string;
    ctx: T;
    config: K;
    [key: string]: any;
}
type PluginHook<T = SceneContext, K = SceneConfig> = (data: PluginHookData<T, K>) => void;
export type PluginFunction<T = SceneContext, K = SceneConfig> = (api: Plugin<T, K>, config?: K) => void;

let seed = 0;
const emitter = mitt();
export const pluginInstalled: PluginFunction[] = [];

export class Plugin<T = SceneContext, K = SceneConfig> {
    private scopeId: string | number;
    private ctx: T;
    private id: number;
    name = '';
    config?: K;

    constructor(scopeId: string | number, ctx: T) {
        this.scopeId = scopeId;
        this.ctx = ctx;
        this.id = seed++;
    }

    private getEventName(type: string) {
        return `${this.scopeId}-${type}`;
    }

    private getSelfEventName(type: string) {
        return `${this.name}-${this.getEventName(type)}`;
    }

    describe(name: string) {
        if (!name) {
            throw new Error('plugin name is empty!');
        }
        this.name = name;
        // this.config = config;
    }

    start(config: K) {
        this.config = config;
        this.emit('start');
    }

    on(type: string, handler: PluginHook<T, K>) {
        emitter.on(this.getEventName(type), handler as any);
    }

    onSelf(type: string, handler: PluginHook<T, K>) {
        emitter.on(this.getSelfEventName(type), handler as any);
    }

    onSelfStart(handler: PluginHook<T, K>) {
        this.onSelf(`start`, handler);
    }

    onStart(handler: PluginHook<T, K>) {
        this.on(`start`, handler);
    }

    emit(type: string, event?: PluginHookData | any) {
        const data: PluginHookData = {
            id: this.id,
            name: this.name,
            scopeId: this.scopeId,
            ctx: this.ctx,
            config: this.config,
            ...(event || {}),
        };
        emitter.emit(this.getEventName(type), data);
        emitter.emit(this.getSelfEventName(type), data);
    }
}

export const installIn = (plugin: PluginFunction, where?: typeof pluginInstalled) => {
    where = where || pluginInstalled;
    where.push(plugin);
};

export const installInGlobal = (plugin: PluginFunction) => {
    installIn(plugin, pluginInstalled);
    return { append: installInGlobal };
};

// const pp: PluginFunction = (api) => {
//     api.describe('pp');

//     api.onSelf('start', ({ scopeId, name }) => {
//         console.log(scopeId, name, '--------in pp');
//         api.emit('started');
//     });
// };

// const tt: PluginFunction = (api) => {
//     api.describe('tt');

//     api.on('start', ({ scopeId, name }) => {
//         console.log(scopeId, name, '--------in tt');
//     });

//     api.on('started', (event) => {
//         console.log('started', event, '----- in tt');
//     });
// };

// installInGlobal(pp).append(tt);

// pluginInstalled
//     .map((define) => {
//         const plugin = new Plugin(111111, {});
//         define(plugin);
//         return plugin;
//     })
//     .forEach((plugin) => {
//         plugin.start();
//     });

// pluginInstalled
//     .map((define) => {
//         const plugin = new Plugin(2222222, {});
//         define(plugin);
//         return plugin;
//     })
//     .forEach((plugin) => {
//         plugin.start();
//     });
