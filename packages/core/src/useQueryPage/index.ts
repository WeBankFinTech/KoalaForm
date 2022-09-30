import { Slots } from 'vue';
import { ComponentType } from '../base';
import { mergeWithStrategy } from '../helper';
import { doQueryHandles, queryAction, queryResetAction } from '../preset';
import { FormSceneConfig, resetFields, useForm } from '../useForm';
import { PagerSceneConfig, usePager } from '../usePager';
import { useTable, TableSceneConfig } from '../useTable';

const getDefaultConfig = () => {
    return {
        table: { name: 'table', table: { name: ComponentType.Table }, fields: [] },
        pager: { name: 'pager', pager: { name: ComponentType.Pagination } },
        query: {
            name: 'queryForm',
            form: { name: ComponentType.Form, props: { layout: 'inline' } },
            fields: [],
        },
    };
};

export function useQueryPage(config: {
    api?: string;
    table: TableSceneConfig;
    pager: PagerSceneConfig;
    query: FormSceneConfig;
    noDefaultAction?: boolean;
    requestConfig?: unknown;
}) {
    const mergeConfig: typeof config = getDefaultConfig();
    mergeWithStrategy(mergeConfig, config);
    if (!config.noDefaultAction) {
        const queryHandles = doQueryHandles(config.api || '', {
            pagerCtx: mergeConfig.pager.name,
            tableCtx: mergeConfig.table.name,
            requestConfig: config.requestConfig,
        });
        mergeConfig.query.fields.push({
            components: {
                name: ComponentType.Space,
                children: [queryAction(queryHandles), queryResetAction([resetFields(), ...queryHandles])],
            },
        });
    }

    const query = useForm(mergeConfig.query);
    const table = useTable(mergeConfig.table);
    const pager = usePager(mergeConfig.pager);

    const render = (slots: Slots) => [query.render(slots), table.render(slots), pager.render(slots)];

    return {
        query,
        table,
        pager,
        render,
    };
}
