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
    private ctx?: T;
    private id: number;
    private events: any[];
    name = '';
    config?: K;

    constructor(scopeId: string | number, ctx: T) {
        this.scopeId = scopeId;
        this.ctx = ctx;
        this.id = seed++;
        this.events = [];
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
    }

    start(config: K) {
        this.config = config;
        this.emit('start');
    }

    on(type: string, handler: PluginHook<T, K>) {
        const eventName = this.getEventName(type);
        emitter.on(eventName, handler as any);
        this.events.push([eventName, handler]);
    }

    onSelf(type: string, handler: PluginHook<T, K>) {
        const eventName = this.getSelfEventName(type);
        emitter.on(this.getSelfEventName(type), handler as any);
        this.events.push([eventName, handler]);
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
    destroy() {
        this.events.forEach((event) => {
            emitter.off(event[0], event[2]);
        });
        this.events.length = 0;
        this.events;
        delete this.ctx;
        delete this.config;
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
