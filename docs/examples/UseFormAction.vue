<template>
    <div>
        <FDivider titlePlacement="left">查询表单</FDivider>
        <KoalaForm :render="query.render"></KoalaForm>
        <FDivider titlePlacement="left">新增表单</FDivider>
        <KoalaForm :render="insert.render">
            <template #insert_action_extend>
                <FButton>返回</FButton>
            </template>
        </KoalaForm>
    </div>
</template>

<script>
import { useFormAction, KoalaForm } from '@koala-form/core';
import { useUser } from './user';

export default {
    components: { KoalaForm },
    setup() {
        const { fields, config } = useUser();
        config.insert.api = '/error.json';
        const query = useFormAction(fields, config, 'query');
        const insert = useFormAction(fields, config, 'insert');

        return {
            query,
            insert,
        };
    },
};
</script>
