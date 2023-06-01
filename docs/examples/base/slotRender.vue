<template>
    <KoalaRender :render="render">
        <!-- 定义phone的input组件prefix插槽 -->
        <template #phone__prefix>
            <span>+86</span>
        </template>
        <template #fileUpload>
            <FUpload :v-model:fileList="modelRef.file" />
        </template>
    </KoalaRender>
</template>

<script setup>
import { ComponentType, KoalaRender, useForm } from '@koala-form/core';
import { FUpload } from '@fesjs/fes-design';
const { render, modelRef } = useForm({
    fields: [
        { name: 'name', label: '姓名', components: { name: ComponentType.Input } },
        { name: 'sex', label: '性别', components: { name: ComponentType.Select } },
        { name: 'phone', label: '联系电话', components: { name: ComponentType.Input, slotName: 'phone' } },
        { name: 'file', label: '附件', slotName: 'fileUpload' },
    ],
});
</script>
