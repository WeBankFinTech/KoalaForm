import { onMounted, Slots } from 'vue';
import { mergeRefProps, mergeWithStrategy } from '../helper';
import { presetDoQuery, presetDoResetQuery, presetPagerChange, presetQueryBtn, presetResetQueryBtn } from '../preset';
import { ComponentType } from '../scheme';
import { FormSceneConfig, useForm } from '../useForm';
import { PagerSceneConfig, usePager } from '../usePager';
import { useTable, TableSceneConfig } from '../useTable';

const getDefaultConfig = () => {
    return {
        withPreset: true,
        withInitQuery: true,
        table: { table: { name: ComponentType.Table }, fields: [] },
        pager: { pager: { name: ComponentType.Pagination } },
        query: {
            form: { name: ComponentType.Form, props: { layout: 'inline' } },
            fields: [],
        },
    };
};

export function useQueryPage(config: {
    api: string;
    table: TableSceneConfig;
    pager: PagerSceneConfig;
    query: FormSceneConfig;
    /** 使用preset逻辑 */
    withPreset?: boolean;
    /** 默认进行初始查询 */
    withInitQuery?: boolean;
    requestOpt?: Record<string, any>;
}) {
    const mergeConfig = getDefaultConfig() as unknown as typeof config;
    mergeWithStrategy(config, mergeConfig);
    const { withPreset, withInitQuery, table: tableConfig, pager: pagerConfig, query: queryConfig } = config;
    if (withPreset) {
        const handleConfig = {
            api: config.api,
            pager: pagerConfig.ctx,
            table: tableConfig.ctx,
            form: queryConfig.ctx,
            opt: config.requestOpt,
        };
        // 使用默认的查询和重置按钮
        config.query.fields.push({
            components: {
                name: ComponentType.Space,
                children: [presetQueryBtn(() => presetDoQuery(handleConfig)), presetResetQueryBtn(() => presetDoResetQuery(handleConfig))],
            },
        });

        mergeRefProps(config.pager.pager, 'events', {
            onChange: () => presetPagerChange(handleConfig),
        });

        if (withInitQuery) {
            onMounted(() => presetDoQuery(handleConfig));
        }
    }

    const query = useForm(config.query);
    const table = useTable(config.table);
    const pager = usePager(config.pager);

    const render = (slots: Slots) => [query.render(slots), table.render(slots), pager.render(slots)];

    return {
        query,
        table,
        pager,
        render,
    };
}
