import { watch } from 'vue';
import { WhenPlugin } from '../base';

export const whenIf: WhenPlugin<string> = (expression) => {
    if (!expression) return undefined;
    return (cxt, invoke) => {
        const state = cxt.getState?.();
        if (!state) return;
        const exp = `with(state){ return ${expression}}`;
        const code = Function('state', exp);
        watch(
            () => code(state),
            (value) => {
                if (value) invoke(value);
            },
        );
    };
};
