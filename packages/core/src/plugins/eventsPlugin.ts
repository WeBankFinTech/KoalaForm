import { isFunction } from 'lodash-es';
import { KoalaPlugin, SceneContext, SchemeStatus, Handle } from '../base';
import { ComponentDesc } from '../field';
import { mergeRefProps, turnArray } from '../helper';

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

export const eventsPlugin: KoalaPlugin = (ctx, config, scheme, node) => {
    if (!scheme || !node) return;
    const _events = (node as ComponentDesc).events;
    if (!_events) return;
    const events: SchemeStatus['events'] = {};
    Object.keys(_events).forEach((key) => {
        const handles = turnArray(_events?.[key]) as Handle<SceneContext, unknown>[];
        if (handles.length) {
            events[key] = (...args) => invokeHandles(ctx, handles, args);
        }
    });
    mergeRefProps(scheme, 'events', events);
};
