import { ref, Ref, Slots, watch } from 'vue';
import { SceneContext } from '../base';
import { PagerSceneConfig, usePager } from '../usePager';
import { useTable, TableSceneConfig } from '../useTable';

export interface TableWithPagerSceneContext extends SceneContext {
    ref: Ref;
}

export function useTableWithPager(table: TableSceneConfig, pager: PagerSceneConfig) {
    const dataSource = ref([]);
    const tableCtx = useTable(table);
    const pagerCtx = usePager(pager);

    watch(
        [dataSource, pagerCtx.model],
        () => {
            const { currentPage, pageSize } = pagerCtx.model;
            if (dataSource.value?.length <= pageSize) {
                tableCtx.model.value = dataSource.value;
                return;
            }
            pagerCtx.model.totalCount = dataSource.value.length;
            tableCtx.model.value = dataSource.value.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];
        },
        { deep: true, immediate: true },
    );

    const render = (slots: Slots) => [tableCtx.render(slots), pagerCtx.render(slots)];

    return {
        dataSource,
        table: tableCtx,
        pager: pagerCtx,
        render,
    };
}
