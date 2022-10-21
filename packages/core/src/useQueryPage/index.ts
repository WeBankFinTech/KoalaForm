import { getCurrentInstance, onMounted, Slots, watch } from 'vue';
import { ComponentType } from '../base';
import { beforeDoQuery } from '../handles';
import { mergeRefProps, mergeWithStrategy } from '../helper';
import { invokeHandles } from '../plugins';
import { doQueryHandles, queryAction, queryResetAction } from '../preset';
import { FormSceneConfig, FormSceneContext, resetFields, useForm } from '../useForm';
import { PagerSceneConfig, PagerSceneContext, usePager } from '../usePager';
import { setPagerCurrent } from '../usePager/schemePlugin';
import { useTable, TableSceneConfig, TableSceneContext } from '../useTable';

const getDefaultConfig = () => {
    return {
        hasDefaultAction: true,
        hasFirstQueryCall: true,
        table: { table: { name: ComponentType.Table }, fields: [] },
        pager: { pager: { name: ComponentType.Pagination } },
        query: {
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
    hasDefaultAction?: boolean;
    hasFirstQueryCall?: boolean;
    requestConfig?: unknown;
}) {
    const mergeConfig = getDefaultConfig() as unknown as typeof config;
    mergeWithStrategy(mergeConfig, config);
    const { hasDefaultAction, hasFirstQueryCall, table: tableConfig, pager: pagerConfig, query: queryConfig } = mergeConfig;
    if (hasDefaultAction) {
        const queryHandles = doQueryHandles(mergeConfig.api || '', {
            pagerCtx: pagerConfig.ctx,
            tableCtx: tableConfig.ctx,
            formCtx: queryConfig.ctx,
            requestConfig: mergeConfig.requestConfig,
        });
        // 使用默认的查询和重置按钮
        mergeConfig.query.fields.push({
            components: {
                name: ComponentType.Space,
                children: [queryAction(queryHandles), queryResetAction([resetFields(), setPagerCurrent(1, pagerConfig.ctx), ...queryHandles])],
            },
        });

        mergeRefProps(mergeConfig.pager.pager, 'events', {
            onChange: queryHandles,
        });

        if (hasFirstQueryCall) {
            onMounted(() => invokeHandles(mergeConfig.query.ctx, queryHandles));
        }
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
