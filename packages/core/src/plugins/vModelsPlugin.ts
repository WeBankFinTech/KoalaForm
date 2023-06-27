import { isUndefined } from 'lodash-es';
import { SceneConfig, SceneContext } from '../base';
import { mergeRefProps, travelTree } from '../helper';
import { ComponentDesc } from '../scheme';
import { PluginFunction } from './define';

export const vModelsPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('v-models-plugin');

    api.on('schemeLoaded', ({ ctx }) => {
        travelTree(ctx.schemes, (scheme) => {
            const node = scheme?.__node as ComponentDesc;
            if (!node || isUndefined(node.vModels)) return;
            mergeRefProps(scheme, 'vModels', node.vModels);
        });
        api.emit('started');
    });
};
