import { Slot, Slots } from 'vue';
import { SceneContext, SceneConfig } from '../base';
import { mergeRefProps, travelTree } from '../helper';
import { ComponentDesc, Field, Scheme } from '../scheme';
import { PluginFunction } from './define';

const parseSlotName = (_slots: Slots, scheme: Scheme, node: ComponentDesc | Field) => {
    const slots: Record<string, Slot> = {};
    const slotNameRule = `${node.slotName}__`;
    Object.keys(_slots).forEach((key) => {
        let name = '';
        if (key === node.slotName || `${slotNameRule}default` === key) {
            name = 'default';
        } else if (key.startsWith(slotNameRule)) {
            name = key.slice(slotNameRule.length);
        }
        if (name) {
            slots[name] = _slots[key] as Slot;
        }
    });
    mergeRefProps(scheme, 'slots', slots);
};

export const slotPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    api.describe('slot-plugin');

    api.on('started', ({ name, ctx }) => {
        if (name === 'render-plugin') {
            const render = ctx.render;
            ctx.render = (slots) => {
                travelTree(ctx.schemes, (scheme) => {
                    if (slots && (scheme.__node as ComponentDesc)?.slotName) {
                        parseSlotName(slots, scheme, scheme.__node as ComponentDesc);
                    }
                });
                return render(slots);
            };
            api.emit('started');
        }
    });
};
