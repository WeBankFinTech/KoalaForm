<!-- complexPage/components/FormSelectDepartment.vue -->

<template>
    <FSpin :show="departmentLoading">
        <FFormItem label="部门:" prop="departmentId">
            <FSelect v-model="currentValue" placeholder="请选择" :options="options" @change="handleChange"> </FSelect>
        </FFormItem>
    </FSpin>
</template>

<script>
import { computed, watch } from 'vue';
import { useNormalModel } from '../use/useModel';
import { useDepartment } from '../use/useDepartment';

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
        autoSelect: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

        const { departmentList, departmentListAll, departmentLoading } = useDepartment();

        const options = computed(() => (props.hasAll ? departmentListAll.value : departmentList.value));

        watch(options, () => {
            if (props.autoSelect && options.value.length > 0) {
                updateCurrentValue(options.value[0].value);
                emit('change', currentValue.value);
            }
        });

        const handleChange = () => {
            emit('change', currentValue.value);
        };

        return {
            currentValue,
            options,
            handleChange,
            departmentLoading,
        };
    },
};
</script>

<style lang="less" scoped>
.fes-select {
    width: 100%;
}
</style>
