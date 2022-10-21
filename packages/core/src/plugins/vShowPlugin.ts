import { isFunction } from 'lodash-es';
import { Ref, ref } from 'vue';
import { KoalaPlugin } from '../base';

export const vShowPlugin: KoalaPlugin = ({ ctx }, every) => {
    if (!every?.scheme || !every?.node) return;
    const { scheme, node } = every;
    if (isFunction(node.vShow)) {
        const vShow = ref(true);
        node.vShow(ctx, (value) => {
            vShow.value = !!value;
        });
        scheme.vShow = vShow;
    } else {
        scheme.vShow = node.vShow as Ref<boolean>;
    }
};
