import { KoalaPlugin, mergePlugins, useBaseScene } from '../base';
import { tableSchemePlugin } from './schemePlugin';
import { TableSceneConfig, TableSceneContext } from './base';
import { vIfPlugin, vShowPlugin, disabledPlugin, eventsPlugin, slotPlugin } from '../plugins';

import { Ref, Slots } from 'vue';
import { SceneConfig, SceneContext, Field, ComponentDesc } from '../base';
import { PagerSceneConfig, usePager } from '../usePager';
import { useTable } from '../useTable';

export interface TableWithPagerSceneContext extends SceneContext {
    ref: Ref;
}

export function useTableWithPager(table: TableSceneConfig, pager: PagerSceneConfig) {
    const tableCtx = useTable(table);
    const pagerCtx = usePager(pager);

    const render = (slots: Slots) => [tableCtx.render(slots), pagerCtx.render(slots)];

    return {
        table: tableCtx,
        pager: pagerCtx,
        render,
    };
}
