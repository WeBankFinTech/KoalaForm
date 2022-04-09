import { watch } from 'vue';
import { Config } from './config';
import { Field } from './field';
import { Pager } from './const';
import { UseQueryResult, KoalaFormRenderFunction } from './types';
import useFormAction from './useFormAction';
import useTable from './useTable';
import { cloneDeep } from 'lodash-es';

export default function useQuery(fields: Array<Field>, config: Config): UseQueryResult {
    const table = useTable(fields, config.uniqueKey);

    // before加上分页逻辑
    const actionConfig = cloneDeep(config);
    const queryConfig = actionConfig.query || {};
    queryConfig.before = async (params) => {
        table.pagerModel.current = params.pager.current;
        params.pager.size = table.pagerModel.pageSize;
        return config.query?.before?.(params) || {};
    };
    actionConfig.query = queryConfig;
    const queryFormAction = useFormAction(fields, actionConfig, 'query');

    table.pagerModel.onChange = (current) => {
        queryFormAction.handleAction(undefined, current);
    };
    table.pagerModel.onPageSizeChange = (size) => {
        table.pagerModel.pageSize = size;
        queryFormAction.handleAction(undefined, 1);
    };

    watch(queryFormAction.actionRespRef, (resp) => {
        table.setTableValue(resp?.tableModel);
        const pagerModel: Pager = resp?.pagerModel;
        pagerModel && delete pagerModel.current;
        table.setPagerValue(resp?.pagerModel);
    });

    const render: KoalaFormRenderFunction = (slots) => {
        return [queryFormAction.render(slots), table.render(slots)];
    };

    return {
        query: queryFormAction,
        formAction: queryFormAction,
        table,
        render,
    };
}
