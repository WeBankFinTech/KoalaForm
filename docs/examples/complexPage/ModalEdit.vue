<!-- complexPage/ModalEdit.vue -->

<template>
    <KoalaForm :render="modalRender">
        <template #formItem_departmentId="{ model }">
            <FormSelectDepartment
                v-model="model.departmentId"
                class="fes-grid-item-24"
                @change="handleDeptChange"
            ></FormSelectDepartment>
        </template>
        <template #formItem_productId="{ model }">
            <FormSelectProduct
                v-model="model.productId"
                :departmentId="model.departmentId"
                class="fes-grid-item-24"
            ></FormSelectProduct>
        </template>
    </KoalaForm>
</template>

<script>
import { defineComponent, nextTick, watch } from 'vue';
import { KoalaForm, useModal } from '@koala-form/core';
import { useFields } from './use/useFields';
import { KOALA_FORM_ACTION, KOALA_FORM_PROPS } from './constants';
import { useConfig } from './use/useConfig';
import FormSelectDepartment from './components/FormSelectDepartment.vue';
import FormSelectProduct from './components/FormSelectProduct.vue';

export default defineComponent({
    components: {
        KoalaForm,
        FormSelectProduct,
        FormSelectDepartment,
    },
    props: {
        action: {
            type: String,
            required: true,
            validator(value) {
                return Object.values(KOALA_FORM_ACTION).includes(value);
            },
        },
    },
    emits: ['ok'],
    setup(props, { emit }) {
        const { fields, getDefaultFields } = useFields();

        const { config } = useConfig();

        function handleQuery() {
            emit('ok');
        }

        // update-modal 修改弹窗
        const { render: modalRender, open, form } = useModal(fields, config, props.action, handleQuery);

        form.setFormProps({
            ...KOALA_FORM_PROPS,
        });

        async function handleDeptChange() {
            await nextTick();
            // 部门变更后，产品清空
            form.model.productId = '';
        }

        watch([() => form.model.userId, () => form.model.userName], async () => {
            await nextTick();
            form.model.userId = form.model.userId.trim();
            form.model.userName = form.model.userName.trim();
        });

        function handleAdd() {
            open(getDefaultFields());
        }
        function handleUpdate(row) {
            open(row);
        }

        return {
            modalRender,
            handleAdd,
            handleUpdate,
            handleDeptChange,
        };
    },
});
</script>
