import { Field, travelFields } from './field';
import { ref, reactive, Slots, VNodeChild, Ref } from 'vue';
import { _preset as preset } from './preset';
import { getOptions } from './utils';
import { DEFAULT_PAGER, Pager } from './const';
import { UseTableResult } from './types';

export default function useTable(fields: Array<Field>, uniqueKey = 'id'): UseTableResult {
    const tableRef: Ref = ref(null);
    const pagerRef: Ref = ref(null);
    const tableDataRef: Ref<Record<string, any>[]> = ref([]);
    const pagerModel: Pager = reactive(DEFAULT_PAGER);
    const tableProps: Record<string, any> = reactive({});
    const pagerProps: Record<string, any> = reactive({});
    const columns: Record<string, any>[] = [];
    const { defineTableColumn, tableRender } = preset;

    travelFields(fields, 'table', (field) => {
        if (field.status && field.status !== 'hidden') {
            const column = defineTableColumn?.(field, getOptions(preset, field));
            column && columns.push(column);
        }
    });

    const setTableValue = (values?: Record<string, any>[] | Record<string, any>, index?: number) => {
        if (!values) return;
        if (Array.isArray(values)) {
            tableDataRef.value = values as Record<string, any>[];
        } else {
            if (index) tableDataRef.value[index] = values;
        }
    };

    const setPagerValue = (value?: Pager) => {
        if (!value) return;
        Object.assign(pagerModel, value);
    };

    const setPagerProps = (props?: Record<string, any>) => {
        if (!props) return;
        Object.assign(pagerProps, props);
    };

    const setTableProps = (props?: Record<string, any>) => {
        if (!props) return;
        Object.assign(tableProps, props);
    };

    const render = (slots: Slots): VNodeChild => {
        return tableRender(
            {
                columns,
                tableDataRef,
                tableProps,
                pagerModel,
                pagerProps,
                rowKey: uniqueKey,
                pagerRef,
                tableRef,
            },
            slots,
        );
    };

    return {
        columns,
        tableModel: tableDataRef,
        tableDataRef,
        tableProps,
        pagerModel,
        pagerProps,
        tableRef,
        pagerRef,
        render,
        setTableValue,
        setPagerValue,
        setPagerProps,
        setTableProps,
    };
}
