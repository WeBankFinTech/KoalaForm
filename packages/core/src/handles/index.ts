import { getGlobalConfig } from '../base';
import { FormSceneContext, doGetFormData } from '../useForm';
import { PagerSceneContext } from '../usePager';
import { TableSceneContext } from '../useTable';
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
    const { currentPage, pageSize } = pager?.modelRef.value || ({} as PagerSceneContext['modelRef']['value']);
    return doGetFormData(form, { page: { currentPage, pageSize } });
};

/**
 * 解析查询结果解析到分页和列表上
 * @param pager 分页上下文
 * @param table 列表上下文
 * @returns
 */
export const doAfterQuery = (table: TableSceneContext, pager?: PagerSceneContext, data?: { list: any[]; page: PagerSceneContext['modelRef']['value'] }) => {
    if (pager?.modelRef) {
        pager.modelRef.value.totalCount = data?.page?.totalCount || 0;
    }
    if (table?.modelRef?.value) {
        table.modelRef.value = data?.list || [];
    }
};
