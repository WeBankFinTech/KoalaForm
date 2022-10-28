import { isFunction, isUndefined } from 'lodash-es';
import { ref } from 'vue';
import { SceneConfig, SceneContext } from '../base';
import { mergeRefProps, travelTree } from '../helper';
import { ComponentDesc } from '../scheme';
import { PluginFunction } from './define';

export const disabledPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('disabled-plugin');

    api.on('schemeLoaded', ({ ctx }) => {
        travelTree(ctx.schemes, (scheme) => {
            const disabled = (scheme.__node as ComponentDesc)?.disabled;
            if (isUndefined(disabled)) return;
            if (isFunction(disabled)) {
                const _disabled = ref(true);
                disabled(ctx, (value: any) => {
                    _disabled.value = !!value;
                });
                mergeRefProps(scheme, 'props', { disabled: _disabled });
            } else {
                mergeRefProps(scheme, 'props', { disabled: disabled });
            }
        });
        api.emit('started');
    });
};
