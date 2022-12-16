import { isArray } from 'lodash-es';
import { getGlobalConfig } from '../base';
import { turnArray } from '../helper';
import { FormSceneContext, doGetFormData } from '../useForm';
import { PagerSceneContext } from '../usePager';
import { TableSceneContext } from '../useTable';

// /**
//  * 原子函数，为了方便复用，将表单中的操作分解成一些原子函数，由原子函数组可以装成执行链，按顺序执行，上一个原子的执行结果，将会传给下一个函数的最后一个参数。
//  * @param args handler参数，最后一个参数是上一个原子函数的执行结果。
//  */
// declare function handler(): Promise<any> | any;

// export type Handler = typeof handler;
// export class LinkHandler<T extends (...args: any) => any = Handler> {
//     handlers: Handler[] = [];
//     args: Array<any[]> = [];

//     constructor(handler: T, ...args: [...Parameters<typeof handler>]) {
//         if (handler) {
//             this.handlers.push(handler);
//             this.args.push(args);
//         }
//     }

//     next<T extends (...args: any) => any = Handler>(handler: T, ...args: [...Parameters<typeof handler>]) {
//         this.handlers.push(handler);
//         this.args.push(args);
//         return this;
//     }

//     pre<T extends (...args: any) => any = Handler>(handler: T, ...args: [...Parameters<typeof handler>]) {
//         this.handlers.unshift(handler);
//         this.args.unshift(args);
//         return this;
//     }

//     concat(link: LinkHandler) {
//         this.handlers.push(...link.handlers);
//         this.args.push(...link.args);
//         return this;
//     }
// }

// export const invokeHandler = async (handler: Handler | Handler[], arg: any[][] | any[], preVal?: any) => {
//     let args: any[][] = [];
//     const handlers = turnArray(handler);
//     if (isArray(handler)) {
//         args = arg;
//     } else {
//         args = [arg];
//     }
//     let nextVal: any = preVal;
//     for (let index = 0; index < handlers.length; index++) {
//         const handle = handlers[index];
//         const params = args[index] || [];
//         // if (params.length
//         params.push(nextVal);
//         console.log(`exec ==>【${handle.name}】==> `, ...params);
//         nextVal = await handle(...params);
//         console.log('----nextVal---', nextVal);
//     }
//     return nextVal;
// };

// export const proxyHandler = <T extends (...args: any) => any = Handler>(handler: T, ...args: [...Parameters<typeof handler>]) => {
//     return (preVal: any) => {
//         handler(...args, preVal);
//     };
// };

/**
 * 网络接口请求
 */
export const doRequest = async (api: string, params?: Record<string, any>, opt?: Record<string, any>) => {
    const globalConfig = getGlobalConfig();
    if (!globalConfig.request) throw new Error('doRequest: globalConfig.request not found, please config request by setupGlobalConfig');
    if (!api) throw new Error('doRequest: config.api not found!');
    return await globalConfig.request(api, params, opt);
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
 * @param pager 分页上下文
 * @param form 表单上下文
 * @returns
 */
export const doBeforeQuery = (
    form: FormSceneContext,
    pager?: PagerSceneContext,
): {
    [key: string]: any;
    page?: {
        pageSize: number;
        currentPage: number;
    };
} => {
    const { currentPage, pageSize } = pager?.model || ({} as PagerSceneContext['model']);
    return doGetFormData(form, { page: { currentPage, pageSize } });
};

/**
 * 解析查询结果解析到分页和列表上
 * @param pager 分页上下文
 * @param table 列表上下文
 * @returns
 */
export const doAfterQuery = (table: TableSceneContext, pager?: PagerSceneContext, data?: { list: any[]; page: PagerSceneContext['model'] }) => {
    if (pager?.model) {
        pager.model.totalCount = data?.page?.totalCount || 0;
    }
    if (table?.model?.value) {
        table.model.value = data?.list || [];
    }
};
