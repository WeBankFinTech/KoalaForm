import { isComponent, KoalaPlugin, setupGlobalConfig } from '@koala-form/core';
import * as fesd from '@fesjs/fes-design';

export const componentPlugin: KoalaPlugin = (cxt) => {
    cxt.getComponent = (name) => {
        const comp = fesd[`F${name}`];
        if (isComponent(comp)) return comp;
        else return name;
    };
};

setupGlobalConfig({
    componentPlugin,
});
