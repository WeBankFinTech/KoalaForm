<template>
    <KoalaForm :fields="fields" :config="config">
        <template #id="{model}">
            <a>id slot：{{model.id}}</a>
        </template>
        <template #query_id="{model}">
            <FInput v-model="model.id" placeholder="query_id slot"/>
        </template>

        <template #formItem_name="{model}">
            <FFormItem label="formItem_name slot：">
                <FInput v-model="model.name" placeholder="formItem_name slot"/>
            </FFormItem>
        </template>

        <template #insert_formItem_name="{model}">
            <FFormItem label="insert_formItem_name slot：">
                <FInput v-model="model.name" placeholder="insert_formItem_name slot"/>
            </FFormItem>
        </template>

        <template #extend_items="{model}">
            <FFormItem label="extend_items slot：">
                <FInput v-model="model.extend" placeholder="extend_items slot"/>
            </FFormItem>
        </template>

        <template #insert_extend_items="{model}">
            <FFormItem label="insert_extend_items slot：">
                <FInput v-model="model.extend" placeholder="insert_extend_items slot"/>
            </FFormItem>
        </template>

        <template #table_id="{ cellValue }">
            <a>table_id slot：{{cellValue}}</a>
        </template>

        <template #table_id_header>
            <span>table_id_header slot</span>
        </template>

        <template #insert_action>
            <FButton @click="show = !show">insert_action slot</FButton>
        </template>

        <template #query_action_extend>
            <FButton>query_action_extend slot</FButton>
        </template>

        <!-- [type]_action 优先级大于 [type]_action_extend -->
        <!-- <template #query_action>
            <FButton>query_action_extend slot</FButton>
        </template> -->

        <template #table_actions_extend>
            <FButton type="link">table_actions_extend slot</FButton>
        </template>

        <!-- table_actions 优先级大于 table_actions_extend -->
        <!-- <template #table_actions>
            <FButton type="link">table_actions slot</FButton>
        </template> -->

    </KoalaForm>
</template>

<script>
import { KoalaForm, defineConfig, defineFields } from '@koala-form/core';
import { FButton, FInput, FFormItem } from '@fesjs/fes-design';
import { BASE_URL } from './const';

export default {
    components: { KoalaForm, FButton, FInput, FFormItem },
    setup() {
        const fields = defineFields([
            { name: 'id', label: 'ID', status: true },
            { name: 'name', label: '姓名', required: true, status: true },
            { name: 'age', label: '年龄', type: 'number', status: true, query: false },
            { name: 'actions', label: '操作', table: { status: true, props: { width: 420 } } },
        ]);

        const config = defineConfig({
            name: '用户',
            query: { api: `${BASE_URL}user.json` },
            insert: { api: `${BASE_URL}success.json` },
            update: { api: `${BASE_URL}success.json` },
            delete: { api: `${BASE_URL}success.json` },
        });

        return {
            fields,
            config,
        };
    },
};
</script>
