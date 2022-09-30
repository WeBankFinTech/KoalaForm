import { isFunction } from 'lodash-es';
import { ref } from 'vue';
import { KoalaPlugin } from '../base';
import { ComponentDesc } from '../field';
import { mergeRefProps } from '../helper';

export const disabledPlugin: KoalaPlugin = (ctx, config, scheme, node) => {
    if (!scheme || !node) return;
    const disabled = (node as ComponentDesc).disabled;
    if (isFunction(disabled)) {
        const _disabled = ref(true);
        disabled(ctx, (value) => {
            _disabled.value = !!value;
        });
        mergeRefProps(scheme, 'props', { disabled: _disabled });
    } else {
        mergeRefProps(scheme, 'props', { disabled: disabled });
    }
};
