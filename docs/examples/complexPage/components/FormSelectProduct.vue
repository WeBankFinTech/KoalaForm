<template>
    <FSpin :show="productLoading">
        <FFormItem label="产品:" prop="productId">
            <FSelect v-model="currentValue" placeholder="请选择" :options="options"></FSelect>
        </FFormItem>
    </FSpin>
</template>

<script>
import { computed } from 'vue';
import { useNormalModel } from '../use/useModel';
import { useProduct } from '../use/useProduct';

export default {
    props: {
        modelValue: {
            type: [String, Number],
            default: '',
        },
        hasAll: {
            type: Boolean,
            default: false,
        },
        departmentId: {
            type: [String, Number],
            default: '',
        },
    },
    emits: ['update:modelValue', 'update:departmentId'],
    setup(props, { emit }) {
        const [currentValue] = useNormalModel(props, emit);
        const [departmentId] = useNormalModel(props, emit, {
            prop: 'departmentId',
        });

        const { productList, productListAll, productLoading } = useProduct(departmentId);

        const options = computed(() => (props.hasAll ? productListAll.value : productList.value));

        return {
            currentValue,
            options,
            productLoading,
        };
    },
};
</script>

<style lang="less" scoped>
.fes-select {
    width: 100%;
}
</style>
