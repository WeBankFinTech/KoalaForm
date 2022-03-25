<template>
    <KoalaForm :render="render">
        <template #extend_items>
            <FFormItem label="model结果:">
                <div>{{ model }}</div>
            </FFormItem>
            <FFormItem label=" ">
                <FButton type="primary" @click="handleSave">保存</FButton>
                <FButton style="margin: 0 10px" @click="resetFields">重置</FButton>
            </FFormItem>
        </template>
    </KoalaForm>
    <!-- <Table /> -->
</template>

<script>
import { useForm, KoalaForm } from '@koala-form/core';
import { FMessage } from '@fesjs/fes-design';
import { Table } from 'ant-design-vue';
import { useUser } from './user';

export default {
    components: { KoalaForm, Table },
    setup() {
        const { fields, mockUser } = useUser();
        const { model, initFields, render, resetFields, validate, setFormProps } = useForm(fields, 'insert');
        initFields(mockUser);
        setFormProps({labelWidth: 100})

        const handleSave = () => {
            validate()
                .then(() => {
                    FMessage.success('validate success!');
                })
                .catch((error) => {
                    FMessage.error('validate error!');
                    console.error(error);
                });
        };

        return {
            model,
            render,
            handleSave,
            resetFields,
        };
    },
};
</script>
