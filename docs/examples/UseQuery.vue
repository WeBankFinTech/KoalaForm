<template>
    <KoalaForm :render="render"></KoalaForm>
</template>

<script>
import { useQuery, KoalaForm } from '@koala-form/core';
import { useUser } from './user';

export default {
    components: { KoalaForm },
    setup() {
        const { fields, config } = useUser();
        const { query, table, render } = useQuery(fields, config);
        return {
            render,
        };
    },
};
</script>
