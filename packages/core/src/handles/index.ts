import { get, merge } from 'lodash-es';
import { getGlobalConfig, Handle, SceneContext } from '../base';
import { turnArray } from '../helper';
import { FormSceneContext, hFormData } from '../useForm';
import { PagerSceneContext } from '../usePager';
import { TableSceneContext } from '../useTable';

export type HandlerConfig<T extends SceneContext = SceneContext> = {
    ctx?: T;
    /** 前置传递的数据 */
    preVal?: any;
    [key: string]: any;
};

export type Handler<T = any[], R = void> = (...args: [...T]) => Promise<R> | R;
export class LinkHandler<T extends (...args: any) => any = Handler> {
    handlers: Handler[] = [];
    configs: Array<Record<string, any> | void> = [];

    constructor(handler: T, config?: Parameters<T>[0]) {
        if (handler) {
            this.handlers.push(handler);
            this.configs.push(config);
        }
    }

    next<T extends (...args: any) => any = Handler>(handler: T, config?: Parameters<T>[0]) {
        this.handlers.push(handler);
        this.configs.push(config);
        return this;
    }

    pre<T extends (...args: any) => any = Handler>(handler: T, config?: Parameters<T>[0]) {
        this.handlers.unshift(handler);
        this.configs.unshift(config);
        return this;
    }

    concat(link: LinkHandler) {
        this.handlers.push(...link.handlers);
        this.configs.push(...link.configs);
        return this;
    }
}

export const invokeHandler = async (handler: Handler | Handler[], config: Record<string, any> | Record<string, any>[], value?: any) => {
    const handlers = turnArray(handler);
    const configs = turnArray(config);
    let nextVal: any = value;
    for (let index = 0; index < handlers.length; index++) {
        const config = { preVal: nextVal, ...(configs[index] || {}) };
        console.log('----config---', config);
        nextVal = await handlers[index](config);
        console.log('----nextVal---', nextVal);
    }
    return nextVal;
};

export const genHandler = <T extends (...args: any) => any = Handler>(handler: T, ...args: [...Parameters<T>]) => {
    return (preVal) => {
        handler(...args);
    };
};

const pp: Handler = (name: string, preVal: string) => {};

genHandler(pp);

export const hRequest: Handler<
    {
        api: string;
        preVal?: Record<string, any>;
        data?: Record<string, any>;
        config?: Record<string, any>;
    },
    any
> = async (config) => {
    const globalConfig = getGlobalConfig();
    if (!globalConfig.request) throw new Error('hRequest: globalConfig.request not found, please config request by setupGlobalConfig');
    if (!config?.api) throw new Error('hRequest: config.api not found!');
    const params = config.data || {};
    merge(params, config.preVal || {});
    return await globalConfig.request(config.api, params, config.config);
};

/** 获取preVal path的值 */
export const hGetValue: Handler<
    {
        preVal?: Record<string, any>;
        path?: string;
    },
    any
> = (config): Handle => {
    return get(config.preVal, config.path || '') || config.preVal;
};

/**
 * 查询之前参数整理，handle的结果格式如下：
 * ```
 * {
 *    ...formModel, // 表单字段
 *    page?: { // 分页数据
 *      pageSize,
 *      currentPage
 *    }
 * }
 * ```
 * 如接口参数格式不是适配，可以后面新增一个handle进行处理
 * @param pagerCtx 分页上下文
 * @param formCtx 表单上下文
 * @returns
 */
export const hBeforeDoQuery: Handler<
    {
        form: FormSceneContext;
        pager?: PagerSceneContext;
    },
    any
> = ({ pager, form }) => {
    const { currentPage, pageSize } = pager?.model || ({} as PagerSceneContext['model']);
    return hFormData({ ctx: form, values: { page: { currentPage, pageSize } } });
};

/**
 * 解析查询结果到分页和列表上，handle期望的参数是
 * ```
 * preVal?: { list: any[]; page?: { totalCount: number } }
 * ```
 * 如果respond的结果不符合要求，可以再前面加一个handle
 * ```
 * @param pagerCtx 分页上下文
 * @param tableCtx 列表上下文
 * @returns
 */
export const hAfterDoQuery: Handler<{
    table: TableSceneContext;
    preVal?: {
        list: any[];
        page: PagerSceneContext['model'];
    };
    pager?: PagerSceneContext;
}> = ({ table, pager, preVal }) => {
    if (pager?.model) {
        pager.model.totalCount = preVal?.page?.totalCount || 0;
    }
    if (table?.model?.value) {
        table.model.value = preVal?.list || [];
    }
};
