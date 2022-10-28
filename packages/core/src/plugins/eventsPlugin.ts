import { isArray, isFunction } from 'lodash-es';
import { SceneContext, Handle, SceneConfig } from '../base';
import { Handler, invokeHandler } from '../handles';
import { mergeRefProps, travelTree, turnArray } from '../helper';
import { ComponentDesc, Scheme } from '../scheme';
import { PluginFunction } from './define';

/**
 * 按顺序执行所有的handle原子方法
 * @param cxt 默认执行上下文
 * @param handles 原子方法
 * @param args 第一个原子方法的参数
 * @returns
 */
export const invokeHandles = async (cxt: SceneContext, handles?: Handle[] | Handle, args?: unknown[]) => {
    if (!handles) return;
    const handleList = turnArray(handles);
    let res: unknown[] = args || [];
    for (let index = 0; index < handleList.length; index++) {
        const handle = handleList[index];
        if (isFunction(handle)) {
            res = (await handle(cxt, ...res)) || [];
        }
    }
    return res;
};

/**
 * 将fn装饰成Handle
 * ```js
 * // example, '$value'将会用Handle的参数value代替
 * decToHandle(fn, [param1, '$value', param2])
 * ```
 * @param fn 函数
 * @param params 函数的参数
 * @param ctx 函数依赖的上下文，不传指向当前场景上下文
 * @returns
 */
export const wrapToHandle = (fn: Function, params?: unknown[], ctx?: SceneContext | string): Handle => {
    return async (thisCtx, value) => {
        const _cxt = ctx || thisCtx;
        const _params = params || ['$value'];
        const index = _params.findIndex((item) => item === '$value');
        _params[index] = value;
        return await fn(..._params, _cxt);
    };
};

export const eventsPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('events-plugin');
    api.on('schemeLoaded', ({ ctx }) => {
        travelTree(ctx.schemes, (scheme) => {
            const _events = (scheme.__node as ComponentDesc)?.events;
            if (!_events) return;
            const events: Scheme['events'] = {};
            Object.keys(_events).forEach((key) => {
                let handlers: Handler[] = [];
                let configs: any[] = [];
                const handler = _events?.[key];
                if (isFunction(handler)) {
                    handlers = [handler];
                } else if (isArray(handler)) {
                    handlers = handler;
                } else if (handler?.handlers?.length) {
                    handlers = handler.handlers;
                    configs = handler.configs;
                }
                if (handlers.length) {
                    events[key] = (...args) => {
                        invokeHandler(handlers, configs, args);
                    };
                }
            });
            mergeRefProps(scheme, 'events', events);
        });
        api.emit('started');
    });
};

/** 取事件的值 */
export const hEventValue: Handler<
    {
        preVal: Array<any>;
    },
    any
> = (config) => {
    return config.preVal?.[0];
};
