<!-- ComplexPage.vue -->

<template>
    <div class="wrapper">
        <!-- 查询表单 -->
        <QueryForm ref="refQueryForm" @click-query="handleClickQuery"></QueryForm>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import QueryForm from './complexPage/QueryForm.vue';

export default defineComponent({
    components: {
        QueryForm,
    },
    setup() {
        const queryData = ref({});
        const refQueryForm = ref(null);

        function handleClickQuery(data) {
            console.log('handleClickQuery:', data);
            queryData.value = data;
        }

        return {
            handleClickQuery,
            refQueryForm,
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
