<template>
    <div>
        <KoalaRender :render="table.render"></KoalaRender>
    </div>
</template>

<script setup>
import { useTable, KoalaRender, ComponentType, travelTree, useSceneContext, renderSchemes } from '@koala-form/core';
import { watch } from 'vue';

const { ctx: table } = useSceneContext('table');

table.use((api) => {
    api.on('tableSchemeLoaded', ({ config, ctx }) => {
        console.log(config, ctx);
        travelTree(ctx.schemes, (scheme) => {
            if (scheme.component === 'TableColumn') {
                const fieldSchema = scheme.children[0];
                if (fieldSchema.scheme) return;
                scheme.slots = {
                    default: ({ row }) => {
                        fieldSchema.vModels = {
                            modelValue: {
                                ref: row,
                                name: scheme.__node.name,
                            },
                        };
                        return renderSchemes(ctx, fieldSchema);
                    },
                };
            }
        });
    });
});

useTable({
    ctx: table,
    fields: [
        { name: 'name', label: '姓名', components: { name: ComponentType.Input } },
        { name: 'age', label: '年龄', components: { name: ComponentType.InputNumber } },
    ],
});

table.modelRef.value = [
    { name: 'aring', age: 18 },
    { name: 'bob', age: 20 },
];

watch(
    table.modelRef,
    (val) => {
        console.log(val);
    },
    { deep: true },
);
</script>
