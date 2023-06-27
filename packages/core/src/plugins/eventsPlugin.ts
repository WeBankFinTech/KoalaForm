import { SceneContext, SceneConfig } from '../base';
import { mergeRefProps, travelTree } from '../helper';
import { ComponentDesc } from '../scheme';
import { PluginFunction } from './define';

export const eventsPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('events-plugin');
    api.on('schemeLoaded', ({ ctx }) => {
        travelTree(ctx.schemes, (scheme) => {
            const _events = (scheme?.__node as ComponentDesc)?.events;
            if (!_events) return;
            mergeRefProps(scheme, 'events', _events);
        });
        api.emit('started');
    });
};
