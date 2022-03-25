<template>
    <KoalaForm :render="render">
        <template #table_name="{ cellValue, text }">
            <a>{{ cellValue || text }}</a>
        </template>
        <template #table_name_header="{ column }">
            <a>{{ column?.props?.label }}</a>
        </template>
        <template #table_actions>
            <FButton type="link">自定义操作</FButton>
        </template>
    </KoalaForm>
</template>

<script>
import { useTable, KoalaForm } from '@koala-form/core';
import { useUser } from './user';
import { FButton } from '@fesjs/fes-design';

export default {
    components: { KoalaForm, FButton },
    setup() {
        const { fields, config, mockUser } = useUser();
        const { setTableValue, setPagerValue, render, setPagerProps } = useTable(fields, config.uniqueKey);
        setTableValue([mockUser]);

        setPagerValue({
            pageSize: 10,
            current: 1,
            total: 20,
            onChange(current) {
                setPagerValue({ current });
            },
        });

        setPagerProps({
            showSizeChanger: true,
        });

        return {
            render,
        };
    },
};
</script>
