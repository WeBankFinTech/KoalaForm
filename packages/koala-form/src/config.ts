import { merge } from 'lodash-es';
import { Pager } from './const';
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ActionConfig {
    api?: string;
    open?: boolean;
    successTip?: boolean;
    validMessage?: string;
    method?: RequestMethod;
    before?(params: Record<string, any>): Promise<Record<string, any>>;
    success?(res: Record<string, any>): Promise<Record<string, any>>;
    error?(err: any): Promise<any>;
}

interface QueryActionConfig extends ActionConfig {
    queryAfterReset?: boolean;
    /** 开启首次自动调用 */
    firstAutoQuery?: boolean;
    success?(res: Record<string, any>): Promise<{ tableModel: Record<string, any>[]; pagerModel: Pager }>;
}

interface DeleteActionConfig extends ActionConfig {
    queryAfterSuccess?: boolean;
    getMessage?(model: Record<string, any>): string;
}

interface InsertActionConfig extends ActionConfig {
    queryAfterSuccess?: boolean;
}

interface UpdateActionConfig extends ActionConfig {
    queryAfterSuccess?: boolean;
}

export interface Config {
    /** 表单名称 */
    name: string;
    uniqueKey?: string;
    query?: QueryActionConfig;
    insert?: InsertActionConfig;
    update?: UpdateActionConfig;
    delete?: DeleteActionConfig;
    view?: ActionConfig;
}

const globalConfig: Config = {
    name: '',
    uniqueKey: 'id',
    query: {
        api: '',
        method: 'GET',
        queryAfterReset: true,
        firstAutoQuery: true,
        before: async (params) => params,
        success: async (res) => ({
            tableModel: res?.result?.list || [],
            pagerModel: res?.result?.pager,
        }),
        error: async (err) => err,
    },
    insert: {
        open: true,
        successTip: true,
        queryAfterSuccess: true,
        method: 'POST',
        validMessage: '请检查表单字段',
    },
    update: {
        open: true,
        successTip: true,
        queryAfterSuccess: true,
        method: 'PUT',
        validMessage: '请检查表单字段',
    },
    delete: {
        open: true,
        successTip: true,
        queryAfterSuccess: true,
        method: 'DELETE',
        getMessage() {
            return `确定删除该记录？`;
        },
    },
    view: {
        open: true,
        method: 'GET',
    },
};

export function setGlobalConfig(config: Config) {
    merge(globalConfig, config);
}

export function defineConfig(config: Config): Config {
    return merge({}, globalConfig, config);
}