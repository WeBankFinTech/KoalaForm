import { isFunction } from 'lodash-es';
import { Ref, ref } from 'vue';
import { KoalaPlugin } from '../base';

export const vShowPlugin: KoalaPlugin = (ctx, config, scheme, node) => {
    if (!scheme || !node) return;
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
