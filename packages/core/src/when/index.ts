import { isFunction, isString } from 'lodash-es';
import { watch } from 'vue';
import { WhenPlugin } from '../base';

export const when: WhenPlugin<string | ((model?: Record<string, unknown>) => unknown)> = (expression) => {
    if (!expression) return;
    return (ctx, invoke) => {
        let code: any;
        if (isString(expression)) {
            if (!ctx.modelRef) {
                console.warn('When: ctx.model not found!');
                return;
            }
            code = Function('state', `with(state){ return ${expression}}`);
        } else if (isFunction(expression)) {
            code = expression;
        }
        if (!code) return;
        watch(
            () => code(ctx.modelRef.value),
            (value) => invoke(value),
            { immediate: true },
        );
    };
};
