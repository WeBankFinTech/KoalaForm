import { isComponent, KoalaPlugin, setupGlobalConfig } from '@koala-form/core';
import * as fesd from '@fesjs/fes-design';

export const componentPlugin: KoalaPlugin = ({ ctx, emit }) => {
    ctx.getComponent = (name) => {
        if (typeof name === 'string') {
            const comp = fesd[`F${name}`];
            if (isComponent(comp)) return comp;
            else return name;
        } else {
            return name;
        }
    };

    emit('onPluginEnd', { name: 'componentPlugin' });
};

setupGlobalConfig({
    componentPlugin,
    modelValueName: 'modelValue',
});
