import { isArray, isFunction } from 'lodash-es';
import mitt from 'mitt';
import { Field } from '../field';
import { turnArray } from '../helper';
import { SceneContext } from '../base';
import { Handle, Action } from './base';
export * from './when';
export * from './base';

const emitter = mitt();

export const invokeHandles = async (cxt: SceneContext, handles?: Handle[] | Handle, args?: unknown[]) => {
    if (!handles) return;
    const _args = isArray(args) ? args : [args] || [];
    if (isFunction(handles)) {
        return await handles(cxt, ..._args);
    }
    if (isArray(handles)) {
        let res;
        for (let index = 0; index < handles.length; index++) {
            const handle = handles[index];
            if (index === 0) {
                res = await handle(cxt, ..._args);
            } else {
                res = await handle(cxt, res);
            }
        }
        return res;
    }
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
export const decToHandle = (fn: Function, params?: unknown[], ctx?: SceneContext | string): Handle | void => {
    if (!isFunction(fn)) return;
    return async (thisCtx, value) => {
        const _cxt = ctx || thisCtx;
        const _params = params || ['$value'];
        const index = _params.findIndex((item) => item === '$value');
        _params[index] = value;
        return await fn(..._params, _cxt);
    };
};

export const registerAction = (action: Action, cxt: SceneContext, field?: Field): void => {
    const type = Symbol();
    const invoke = (res: unknown) => emitter.emit(type, res);
    action.when(cxt, invoke, field);
    emitter.on(type, (res) => {
        invokeHandles(cxt, action.handles, res as unknown[]);
    });
};

export const useFieldsAction = (fields: Field[], cxt: SceneContext) => {
    if (!fields) return;
    fields.forEach((field) => {
        if (!field.actions) return;
        const actions = turnArray(field.actions);
        actions.forEach((action) => {
            registerAction(action, cxt, field);
        });
    });
};

export const useAction = (actions: Action | Action[], cxt: SceneContext) => {
    turnArray(actions).forEach((action) => {
        registerAction(action, cxt);
    });
};
