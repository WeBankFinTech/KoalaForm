<template>
    <KoalaForm :render="render">
        <!-- 定义字段id的渲染 -->
        <template #id="{ model }">
            <div>{{ model.id }}</div>
        </template>
        <!-- 定义字段update表单sex的formItem渲染，在insert表单中被忽略 -->
        <template #update_id="{ model }">
            <div>update {{ model.id }}</div>
        </template>
        <!-- 定义字段sex的formItem渲染 -->
        <template #formItem_sex="{ model }">
            <FFormItem label="性别选择：">
                <FSelect v-model="model.sex">
                    <FOption value="1" label="男"></FOption>
                    <FOption value="0" label="女"></FOption>
                </FSelect>
            </FFormItem>
        </template>
        <!-- 扩展form-item -->
        <template #extend_items="{ model }">
            <FFormItem label="model结果：">
                <div>{{ model }}</div>
            </FFormItem>
            <FFormItem label=" ">
                <FButton @click="resetFields">重置</FButton>
            </FFormItem>
        </template>
    </KoalaForm>
</template>

<script>
import { useForm, defineFields, KoalaForm } from '@koala-form/core';
const fields = defineFields([
    { name: 'id', label: 'id', insert: true, update: true },
    { name: 'name', label: '姓名', insert: true },
    { name: 'age', label: '年龄', type: 'number', insert: true },
    { name: 'sex', label: '性别', insert: true },
]);

export default {
    components: { KoalaForm },
    setup() {
        const { render, resetFields, initFields } = useForm(fields, 'insert');
        initFields({ id: 123, name: '蒙奇·D·路飞', age: 16 });

        return {
            resetFields,
            render,
        };
    },
};
</script>
