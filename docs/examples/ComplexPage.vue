<!-- ComplexPage.vue -->

<template>
    <div class="wrapper">
        <!-- 查询表单 -->
        <QueryForm ref="refQueryForm" @click-query="handleClickQuery" @click-add="handleClickAdd"></QueryForm>

        <!-- Table -->
        <TableList :queryData="queryData" @edit="handleEdit"></TableList>

        <!-- 新增弹窗 -->
        <ModalEdit ref="refModalInsert" :action="KOALA_FORM_ACTION.INSERT" @ok="handleOk"></ModalEdit>

        <!-- 修改弹窗 -->
        <ModalEdit ref="refModalUpdate" :action="KOALA_FORM_ACTION.UPDATE" @ok="handleOk"></ModalEdit>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import QueryForm from './complexPage/QueryForm.vue';
import TableList from './complexPage/TableList.vue';
import ModalEdit from './complexPage/ModalEdit.vue';
import { KOALA_FORM_ACTION } from './complexPage/constants';

export default defineComponent({
    components: {
        QueryForm,
        TableList,
        ModalEdit,
    },
    setup() {
        const queryData = ref({});
        const refQueryForm = ref(null);
        const refModalInsert = ref(null);
        const refModalUpdate = ref(null);

        function handleClickQuery(data) {
            console.log('handleClickQuery:', data);
            queryData.value = data;
        }

        function handleClickAdd() {
            console.log('handleAdd');
            refModalInsert.value?.handleAdd();
        }

        function handleEdit(row) {
            console.log('handleEdit:', row);
            refModalUpdate.value?.handleUpdate(row);
        }

        function handleOk() {
            console.log('handleOk');
            refQueryForm.value?.handleQuery();
        }

        return {
            handleClickQuery,
            refQueryForm,
            refModalInsert,
            refModalUpdate,
            queryData,
            KOALA_FORM_ACTION,
            handleClickAdd,
            handleEdit,
            handleOk,
        };
    },
});
</script>

<style>
.wrapper {
    padding: 20px;
    background-color: #fff;
    overflow: auto;
}
</style>
