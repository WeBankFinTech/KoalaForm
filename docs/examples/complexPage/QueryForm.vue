<!-- complexPage/QueryForm.vue -->

<template>
    <KoalaForm :render="queryFormRender">
        <!-- 因为部门和产品涉及到关联选择，所以需要自定义组件处理个性化逻辑 -->
        <template #query_formItem_departmentId="{ model }">
            <FormSelectDepartment
                v-model="model.departmentId"
                class="fes-grid-item-6"
                hasAll
                autoSelect
                @change="handleDeptChange"
            ></FormSelectDepartment>
        </template>
        <template #query_formItem_productId="{ model }">
            <FormSelectProduct
                v-model="model.productId"
                hasAll
                :departmentId="model.departmentId"
                class="fes-grid-item-6"
            ></FormSelectProduct>
        </template>
        <template #extend_items>
            <FFormItem>
                <FButton type="primary" class="btn-search" @click="handleQuery"> <SearchOutlined />查询 </FButton>
            </FFormItem>
        </template>
    </KoalaForm>
</template>

<script>
import { defineComponent, nextTick } from 'vue';
import { SearchOutlined } from '@fesjs/fes-design/icon';
import { useForm, KoalaForm } from '@koala-form/core';
import { useFields } from './use/useFields';
import { KOALA_FORM_ACTION, KOALA_FORM_PROPS } from './constants';
import FormSelectDepartment from './components/FormSelectDepartment.vue';
import FormSelectProduct from './components/FormSelectProduct.vue';

export default defineComponent({
    components: {
        SearchOutlined,
        KoalaForm,
        FormSelectDepartment,
        FormSelectProduct,
    },
    emits: ['clickQuery'],
    setup(props, { emit }) {
        const { fields, getDefaultFields } = useFields();
        // form 表单
        const {
            model: queryFormModel,
            render: queryFormRender,
            initFields,
            setFormProps,
        } = useForm(fields, KOALA_FORM_ACTION.QUERY);

        initFields(getDefaultFields({}));
        setFormProps({
            ...KOALA_FORM_PROPS,
        });

        function handleQuery() {
            emit('clickQuery', { ...queryFormModel });
        }

        async function handleDeptChange() {
            await nextTick();
            // 部门变更后，产品清空
            queryFormModel.productId = '';
        }

        return {
            queryFormRender,
            handleQuery,
            handleDeptChange,
        };
    },
});
</script>

<style lang="less" scoped>
.btn-search {
    margin-left: 115px;
}
</style>
