<template>
    <KoalaForm :fields="fields" :config="config"></KoalaForm>
</template>

<script>
import { KoalaForm, defineFields, defineConfig } from '@koala-form/core';
import { BASE_URL } from './const';

const fields = defineFields([
    { name: 'id', label: 'ID', view: true, update: { status: 'disabled' } },
    { name: 'name', label: '姓名', required: true, status: true },
    { name: 'age', label: '年龄', type: 'number', status: true },
    { name: 'actions', label: '操作', table: { props: { width: 220 } } },
]);

const config = defineConfig({
    name: '用户',
    query: { api: `${BASE_URL}user.json` },
    insert: { api: `${BASE_URL}success.json` },
    update: { api: `${BASE_URL}success.json` },
    delete: { api: `${BASE_URL}success.json` },
});

export default {
    components: { KoalaForm },
    setup() {
        return {
            fields,
            config,
        };
    },
};
</script>
