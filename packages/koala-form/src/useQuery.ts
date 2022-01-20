import { Config } from './config';
import { Field } from './field';
import useFormAction from './useFormAction';
import useTable from './useTable';
import { VNodeChild, Slots, watch } from 'vue';
import { Pager } from './const';

export default function useQuery(fields: Array<Field>, config: Config) {
    const table = useTable(fields, config.uniqueKey);
    const query = useFormAction(fields, config, 'query');
    table.pagerModel.onChange = (current) => {
        query.handle(undefined, current);
    };
    query.extendRef.pagerModel = table.pagerModel;

    watch(query.respModel, (resp) => {
        table.setTableValue(resp?.tableModel);
        const pagerModel: Pager = resp?.pagerModel;
        pagerModel && delete pagerModel.current;
        table.setPagerValue(resp?.pagerModel);
    });

    const render = (slots: Slots): VNodeChild => {
        return [query.render(slots), table.render(slots)];
    };

    return {
        query,
        table,
        render,
    };
}
