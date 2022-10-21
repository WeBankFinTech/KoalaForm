import { get } from 'lodash-es';
import { getGlobalConfig, Handle } from '../base';
import { invokeHandles } from '../plugins';
import { FormSceneContext, getFormatFormData } from '../useForm';
import { PagerSceneContext } from '../usePager';
import { TableSceneContext } from '../useTable';

export const wrapRequest = (api: string, config?: unknown): Handle => {
    const globalConfig = getGlobalConfig();
    if (!globalConfig.request) throw new Error('request: globalConfig.request not found, please config request by setupGlobalConfig');
    return async (thisCtx, data) => {
        const res = await globalConfig.request?.(api, data, config);
        if (res) return [res];
    };
};

export const resDataField = (path?: string): Handle => {
    return (ctx, res) => {
        const data = get(res, path || '');
        return [data];
    };
};

/**
 * 查询之前参数整理，handle的结果格式如下：
 * ```
 * {
 *    ...formModel, // 表单字段
 *    pager?: { // 分页数据
 *      pageSize,
 *      currentPage
 *    }
 * }
 * ```
 * 如接口参数格式不是适配，可以后面新增一个handle进行处理,如：
 * ```
 * (cxt, data) => {
 *    const {page, ..._data} = {...data}
 *    _data.pageSize = page?.pageSize
 *    _data.currentPage = page?.currentPage
 *    return [_data];
 * }
 * ```
 * @param pagerCtx 分页上下文
 * @param formCtx 表单上下文
 * @returns
 */
export const beforeDoQuery = (pagerCtx?: PagerSceneContext, formCtx?: FormSceneContext): Handle => {
    return async (cxt) => {
        const _formCxt = formCtx || cxt;
        if (!_formCxt) return;
        let page;
        if (pagerCtx?.model) {
            page = {
                pageSize: pagerCtx.model.pageSize,
                currentPage: pagerCtx.model.currentPage,
            };
        }
        return getFormatFormData({ page })(_formCxt);
    };
};

/**
 * 解析查询结果到分页和列表上，handle期望的参数是
 * ```
 * (ctx, data?: { list: any[]; pager?: { totalCount: number } }) => void
 * ```
 * 如果respond的结果不符合要求，可以再前面加一个handle，如：
 * ```
 * (cxt, data) => {
 *      return [{
 *          list: data.resultList,
 *          page: { totalCount: data.pager.total }
 *      }]
 * }
 * ```
 * @param pagerCtx 分页上下文
 * @param tableCtx 列表上下文
 * @returns
 */
export const afterDoQuery = (pagerCtx?: PagerSceneContext, tableCtx?: TableSceneContext): Handle => {
    return (ctx, data?: { list: any[]; page?: { totalCount: number } }) => {
        const table = tableCtx || ctx;
        if (pagerCtx?.model) {
            pagerCtx.model.totalCount = data?.page?.totalCount || 0;
        }
        if (table?.model?.value) {
            table.model.value = data?.list || [];
        }
    };
};
