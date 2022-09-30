import { isFunction } from 'lodash-es';
import { Ref, ref } from 'vue';
import { KoalaPlugin } from '../base';

export const vIfPlugin: KoalaPlugin = (ctx, config, scheme, node) => {
    if (!scheme || !node) return;
    if (isFunction(node.vIf)) {
        const vIf = ref(true);
        node.vIf(ctx, (value) => {
            vIf.value = !!value;
        });
        scheme.vIf = vIf;
    } else {
        scheme.vIf = node.vIf as Ref<boolean>;
    }
};
