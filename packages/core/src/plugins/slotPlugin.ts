import { Slot, Slots } from 'vue';
import { SceneContext, SceneConfig, getGlobalConfig } from '../base';
import { mergeRefProps, travelTree } from '../helper';
import { ComponentDesc, Field, Scheme } from '../scheme';
import { PluginFunction } from './define';

const parseSlotName = (_slots: Slots, scheme: Scheme, node: ComponentDesc | Field, ctx: SceneContext) => {
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
            getGlobalConfig().debug && console.log(`【${ctx.name}】通过slotName(${node.slotName})解析出${scheme.component}组件${name}的插槽`);
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
                    if (slots && (scheme?.__node as ComponentDesc)?.slotName) {
                        parseSlotName(slots, scheme, scheme.__node as ComponentDesc, ctx);
                    }
                });
                return render(slots);
            };
            api.emit('started');
        }
    });
};
