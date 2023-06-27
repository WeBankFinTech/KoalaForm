import { isFunction, isUndefined } from 'lodash-es';
import { Ref, ref } from 'vue';
import { SceneConfig, SceneContext } from '../base';
import { travelTree } from '../helper';
import { ComponentDesc } from '../scheme';
import { PluginFunction } from './define';

export const vIfPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('v-if-plugin');

    api.on('schemeLoaded', ({ ctx }) => {
        travelTree(ctx.schemes, (scheme) => {
            const node = scheme.__node as ComponentDesc;
            if (!node || isUndefined(node.vIf)) return;
            if (isFunction(node.vIf)) {
                const vIf = ref(true);
                node.vIf(ctx, (value: any) => {
                    vIf.value = !!value;
                });
                scheme.vIf = vIf;
            } else {
                scheme.vIf = node.vIf as Ref<boolean>;
            }
        });
        api.emit('started');
    });
};
