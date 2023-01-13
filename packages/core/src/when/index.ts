import { isFunction, isString } from 'lodash-es';
import { watch } from 'vue';
import { WhenPlugin } from '../base';

export const when: WhenPlugin<string | ((model?: Record<string, unknown>) => unknown)> = (expression) => {
    if (!expression) return;
    return (cxt, invoke) => {
        let code: any;
        if (isString(expression)) {
            if (!cxt.modelRef) {
                console.warn('When: cxt.model not found!');
                return;
            }
            code = Function('state', `with(state){ return ${expression}}`);
        } else if (isFunction(expression)) {
            code = expression;
        }
        if (!code) return;
        watch(
            () => code(cxt.modelRef.value),
            (value) => invoke(value),
            { immediate: true },
        );
    };
};
