<!-- complexPage/TableList.vue -->

<template>
    <FSpin :show="tableLoading" description="加载中...">
        <KoalaForm :render="tableRender">
            <template #table_user="{ row }"> {{ row.userId }}({{ row.userName }}) </template>
            <template #table_status="{ row }">
                {{ row.status === 'enable' ? '有效' : '无效' }}
            </template>
            <template #table_actions="{ row }">
                <FButton type="link" @click="handleEdit(row)">编辑</FButton>
            </template>
        </KoalaForm>
    </FSpin>
</template>

<script>
import { defineComponent } from 'vue';
import { KoalaForm, useTable } from '@koala-form/core';
import { useFields } from './use/useFields';
import { useConfig } from './use/useConfig';
import { useTableList } from './use/useTableList';

export default defineComponent({
    components: {
        KoalaForm,
    },
    props: {
        queryData: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['edit'],
    setup(props, { emit }) {
        const { fields } = useFields();
        const { config } = useConfig();

        // table 列表
        const {
            setTableValue,
            setPagerValue,
            render: tableRender,
            pagerModel,
            setPagerProps,
            setTableProps,
        } = useTable(fields, config.uniqueKey);

        const { tableLoading } = useTableList(
            props,
            pagerModel,
            setTableValue,
            setPagerValue,
            setPagerProps,
            setTableProps,
        );

        function handleEdit(row) {
            emit('edit', { ...row });
        }

        return {
            tableRender,
            handleEdit,
            tableLoading,
        };
    },
});
</script>
