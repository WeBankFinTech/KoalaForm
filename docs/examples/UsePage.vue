<template>
    <KoalaForm :render="render"></KoalaForm>
</template>

<script>
import { usePage, KoalaForm } from '@koala-form/core';
import { useUser } from './user';

export default {
    components: { KoalaForm },
    setup() {
        const { fields, config } = useUser();
        const { render, actions } = usePage(fields, config);
        return {
            render,
        };
    },
};
</script>
