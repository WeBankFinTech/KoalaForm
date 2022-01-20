<template>
    <KoalaForm :render="render">
        <template #table_name="{ cellValue, text }">
            <a>{{ cellValue || text }}</a>
        </template>
        <template #table_name_header="{ column }">
            <a>{{ column?.props?.label }}</a>
        </template>
    </KoalaForm>
</template>

<script>
import { useTable, KoalaForm } from '@koala-form/core';
import { useUser } from './user';

export default {
    components: { KoalaForm },
    setup() {
        const { fields, config, mockUser } = useUser();
        const { setTableValue, setPagerValue, render } = useTable(fields, config.uniqueKey);
        setTableValue([mockUser]);

        setPagerValue({
            pageSize: 10,
            current: 1,
            total: 20,
            onChange(current) {
                setPagerValue({ current });
            },
        });

        return {
            render,
        };
    },
};
</script>
