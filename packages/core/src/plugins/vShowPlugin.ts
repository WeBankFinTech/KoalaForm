import { isFunction, isUndefined } from 'lodash-es';
import { Ref, ref } from 'vue';
import { SceneConfig, SceneContext } from '../base';
import { travelTree } from '../helper';
import { ComponentDesc } from '../scheme';
import { PluginFunction } from './define';

export const vShowPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('v-show-plugin');

    api.on('schemeLoaded', ({ ctx }) => {
        travelTree(ctx.schemes, (scheme) => {
            const node = scheme.__node as ComponentDesc;
            if (isUndefined(node.vShow)) return;
            if (isFunction(node.vShow)) {
                const vShow = ref(true);
                node.vShow(ctx, (value: any) => {
                    vShow.value = !!value;
                });
                scheme.vShow = vShow;
            } else {
                scheme.vShow = node.vShow as Ref<boolean>;
            }
        });
        api.emit('started');
    });
};
