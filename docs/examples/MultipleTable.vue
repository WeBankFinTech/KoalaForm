<template>
    <FButton @click="doSelectAll">全选/全不选</FButton>
    <KoalaForm :render="render"></KoalaForm>
</template>

<script>
import { useTable, KoalaForm, defineFields } from '@koala-form/core';
import { FButton, FMessage } from '@fesjs/fes-design';

export default {
    components: { KoalaForm, FButton },
    setup() {
        const files = defineFields([
            { name: '-', props: { type: 'selection' }, status: true },
            { name: 'id', label: 'ID', status: true },
            { name: 'name', label: '姓名', status: true },
        ]);
        const { setTableValue, render, setTableProps, tableRef } = useTable(files, 'id');

        const doSelectChange = (selection) => {
            FMessage.info(selection.join('、'));
            console.log(selection);
        };

        const doSelectAll = () => {
            tableRef.value.toggleAllSelection();
        };

        // 按照jsx规范，事件加on
        setTableProps({
            onSelectionChange: doSelectChange,
        });

        setTableValue([
            { id: 1, name: '蒙奇·D·路飞' },
            { id: 2, name: '罗罗诺亚·索隆' },
        ]);

        return {
            render,
            doSelectAll,
        };
    },
};
</script>
