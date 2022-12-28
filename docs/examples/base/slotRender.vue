<template>
    <KoalaRender :render="render">
        <template #fileUpload>
            <FUpload :v-model:fileList="model.file" />
        </template>
    </KoalaRender>
</template>

<script setup>
import { ComponentType, KoalaRender, useForm } from '@koala-form/core';
import { FUpload } from '@fesjs/fes-design';
const { render, model } = useForm({
    fields: [
        { name: 'name', label: '姓名', components: { name: ComponentType.Input } },
        { name: 'sex', label: '性别', components: { name: ComponentType.Select } },
        { name: 'file', label: '附件', slotName: 'fileUpload' },
    ],
});
</script>
