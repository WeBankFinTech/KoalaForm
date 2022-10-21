import mitt from 'mitt';
import { ComponentDesc, Field, SceneContext, SchemeStatus } from '../base';

export * from './renderPlugin';
export * from './vIfPlugin';
export * from './vShowPlugin';
export * from './disabledPlugin';
export * from './eventsPlugin';
export * from './slotPlugin';

type PluginApiConfig = Record<string, any>;
interface PluginApiHookData<T extends SceneContext = SceneContext> {
    id: number;
    /** 插件名 */
    name: string;
    scopeId: string;
    ctx: T;
    scheme?: SchemeStatus;
    node?: ComponentDesc | Field;
    [key: string]: any;
}
type PluginApiHook<T extends SceneContext = SceneContext> = (data: PluginApiHookData<T>) => void;
type PluginFunction<T extends SceneContext = SceneContext, K = PluginApiConfig> = (api: PluginApi<T, K>, config?: K) => void;

let seed = 0;
const emitter = mitt();
const pluginApiMap = new Map<string, PluginApi>();
class PluginApi<T extends SceneContext = SceneContext, K = PluginApiConfig> {
    name = '';

    config?: K;

    listeners: Array<{ type: string; handler: PluginApiHook<T> }> = [];

    describe(name: string, config?: K) {
        this.name = name;
        this.config = config;
        pluginApiMap.set(name, this as any);
    }

    on(type: string, handler: PluginApiHook<T>) {
        this.listeners.push({ type, handler });
    }

    onSelf(type: string, handler: PluginApiHook<T>) {
        this.listeners.push({ type: `self-${type}`, handler });
    }

    onSelfCreated(handler: PluginApiHook<T>) {
        this.onSelf(`created`, handler);
    }

    onCreated(handler: PluginApiHook<T>) {
        this.on(`created`, handler);
    }

    onSelfStart(handler: PluginApiHook<T>) {
        this.onSelf(`start`, handler);
    }

    onStart(handler: PluginApiHook<T>) {
        this.on(`start`, handler);
    }

    /** 遍历Schemes执行插件 */
    onSelfLoop(handler: PluginApiHook<T>) {
        this.onSelf(`loop`, handler);
    }

    /** 遍历Schemes执行插件 */
    onLoop(handler: PluginApiHook<T>) {
        this.on(`loop`, handler);
    }
}

class Plugin<T extends SceneContext = SceneContext> {
    id: number;
    /** 插件名 */
    name: string;
    scopeId: string;
    ctx: T;

    private getEventName(name: string) {
        return `${this.scopeId}-${name}`;
    }

    private getSelfEventName(name: string) {
        return `${this.name}-${this.getEventName(name)}`;
    }

    constructor(api: PluginApi, scopeId: string, ctx: T) {
        this.id = seed++;
        this.scopeId = scopeId;
        this.ctx = ctx;
        this.name = api.name;
        api.listeners.forEach((listener) => {
            let type = listener.type;
            type = type.startsWith('self-') ? this.getSelfEventName(type) : this.getEventName(type);
            emitter.on(type, listener.handler as any);
        });
        this.emit('self-created');
        this.emit('created');
    }

    emit(type: string, event?: PluginApiHookData | any) {
        const data: PluginApiHookData = {
            id: this.id,
            name: this.name,
            scopeId: this.scopeId,
            ctx: this.ctx,
            emit: this.emit.bind(this),
            ...(event || {}),
        };
        emitter.emit(this.getEventName(type), data);
        emitter.emit(this.getSelfEventName(type), data);
    }

    start() {
        this.emit('self-start');
        this.emit('start');
    }

    loop(scheme?: SchemeStatus, node?: ComponentDesc | Field) {
        this.emit('self-loop', { scheme, node });
        this.emit('loop', { scheme, node });
    }
}

const pp: PluginFunction = (api, config) => {
    api.describe('pp', config);
    api.onSelfCreated(({ name }) => {
        console.log(name, '------in pp onSelfCreated');
    });
};

const tt: PluginFunction = (api, config) => {
    api.describe('tt', config);
    api.onSelfStart(({ scopeId }) => {
        console.log('tt--------', scopeId);
    });
};

const install = (plugin: PluginFunction, config?: Record<string, any>) => {
    const api = new PluginApi();
    plugin(api, config);
    return { install };
};

install(pp).install(tt);

pluginApiMap.forEach((api) => {
    const plugin = new Plugin(api, 'xxxxxxx');
    setTimeout(() => {
        plugin.start();
    }, 100);
});

pluginApiMap.forEach((api) => {
    const plugin = new Plugin(api, 'gggggggggg');
    setTimeout(() => {
        plugin.start();
    }, 100);
});
