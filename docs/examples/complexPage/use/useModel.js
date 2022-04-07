// complexPage/use/useModel.js

import { ref, watch } from 'vue';
import { isEqual } from 'lodash-es';

export const useNormalModel = (
    props,
    emit,
    config = {
        prop: 'modelValue',
        isEqual: false,
    },
) => {
    const usingProp = config?.prop ?? 'modelValue';
    const currentValue = ref(props[usingProp]);
    const updateCurrentValue = (value) => {
        if (value === currentValue.value || (config.isEqual && isEqual(value, currentValue.value))) {
            return;
        }
        currentValue.value = value;
    };
    watch(currentValue, () => {
        emit(`update:${usingProp}`, currentValue.value);
    });
    watch(
        () => props[usingProp],
        (val) => {
            updateCurrentValue(val);
        },
    );
    return [currentValue, updateCurrentValue];
};
