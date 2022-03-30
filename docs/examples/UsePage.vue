<template>
    <KoalaForm :render="render">
        <template #table_actions_extend>
            <FButton type="link">审核</FButton>
        </template>
    </KoalaForm>
</template>

<script>
import { usePage, KoalaForm } from '@koala-form/core';
import { useUser } from './user';
import { FButton } from '@fesjs/fes-design';

export default {
    components: { KoalaForm, FButton },
    setup() {
        const { fields, config } = useUser();
        const { render, actions } = usePage(fields, config);
        return {
            render,
        };
    },
};
</script>
