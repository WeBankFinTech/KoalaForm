import { isFunction } from 'lodash-es';
import { ref } from 'vue';
import { KoalaPlugin, ComponentDesc } from '../base';
import { mergeRefProps } from '../helper';

export const disabledPlugin: KoalaPlugin = ({ ctx }, every) => {
    if (!every?.scheme || !every?.node) return;
    const { scheme, node } = every;
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
