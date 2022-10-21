import { isFunction } from 'lodash-es';
import { Ref, ref } from 'vue';
import { KoalaPlugin } from '../base';

export const vIfPlugin: KoalaPlugin = ({ ctx }, every) => {
    if (!every?.scheme || !every?.node) return;
    const { scheme, node } = every;
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
