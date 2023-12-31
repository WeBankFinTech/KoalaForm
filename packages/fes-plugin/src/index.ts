import { installInGlobal, isComponent, PluginFunction, SceneConfig, SceneContext, setupGlobalConfig } from '@koala-form/core';
import * as fesD from '@fesjs/fes-design';
export * from './preset';
export * from './useCurd';

export const componentPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    setupGlobalConfig({
        modelValueName: 'modelValue',
    });

    api.describe('fes-plugin');

    api.onSelfStart(({ ctx }) => {
        ctx.getComponent = (name) => {
            if (typeof name === 'string') {
                const comp = (fesD as any)[`F${name}`];
                if (isComponent(comp)) return comp;
                else return name;
            } else {
                return name;
            }
        };
        api.emit('componentLoaded');
    });
};

installInGlobal(componentPlugin);
