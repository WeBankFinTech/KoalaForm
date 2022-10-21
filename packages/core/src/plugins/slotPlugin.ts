import { Slot, Slots } from 'vue';
import { KoalaPlugin, SchemeStatus, ComponentDesc, Field } from '../base';
import { mergeRefProps } from '../helper';

const parseSlotName = (_slots: Slots, scheme: SchemeStatus, node: ComponentDesc | Field) => {
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

export const slotPlugin: KoalaPlugin = ({ ctx }, every) => {
    if (!every?.scheme || !every?.node) return;
    const { scheme, node } = every;
    const render = ctx.render;
    ctx.render = (slots) => {
        if (slots && scheme && node?.slotName) {
            parseSlotName(slots, scheme, node);
        }
        return render(slots);
    };
};
