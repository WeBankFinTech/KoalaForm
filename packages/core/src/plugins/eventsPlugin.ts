import { isArray, isFunction } from 'lodash-es';
import { SceneContext, SceneConfig } from '../base';
// import { Handler, invokeHandler } from '../handles';
import { mergeRefProps, travelTree, turnArray } from '../helper';
import { ComponentDesc, Scheme } from '../scheme';
import { PluginFunction } from './define';

export const eventsPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('events-plugin');
    api.on('schemeLoaded', ({ ctx }) => {
        travelTree(ctx.schemes, (scheme) => {
            const _events = (scheme.__node as ComponentDesc)?.events;
            // if (!_events) return;
            // const events: Scheme['events'] = {};
            // Object.keys(_events).forEach((key) => {
            //     let handlers: Handler[] = [];
            //     let configs: any[] = [];
            //     const handler = _events?.[key];
            //     if (isFunction(handler)) {
            //         handlers = [handler];
            //     } else if (isArray(handler)) {
            //         handlers = handler;
            //     } else if (handler?.handlers?.length) {
            //         handlers = handler.handlers;
            //         configs = handler.args;
            //     }
            //     if (handlers.length) {
            //         events[key] = (...args) => {
            //             invokeHandler(handlers, configs, args?.length === 1 ? args[0] : args);
            //         };
            //     }
            // });
            mergeRefProps(scheme, 'events', _events);
        });
        api.emit('started');
    });
};
