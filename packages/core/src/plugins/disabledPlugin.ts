import { isFunction, isUndefined } from 'lodash-es';
import { Ref, computed, ref, unref } from 'vue';
import { SceneConfig, SceneContext } from '../base';
import { mergeRefProps, travelTree } from '../helper';
import { ComponentDesc } from '../scheme';
import { PluginFunction } from './define';

export const disabledPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('disabled-plugin');

    api.on('schemeLoaded', ({ ctx }) => {
        travelTree(ctx.schemes, (scheme) => {
            const node = scheme.__node as ComponentDesc;
            if (!node || isUndefined(node.disabled)) return;
            if (isFunction(node.disabled)) {
                const _disabled = ref(true);
                node.disabled(ctx, (value: any) => {
                    _disabled.value = !!value;
                });
                mergeRefProps(scheme, 'props', { disabled: _disabled });
            } else {
                const props: any = scheme.props || {};
                props.disabled = computed(() => unref(node.disabled as Ref<boolean>));
                scheme.props = props;
            }
        });
        api.emit('started');
    });
};
