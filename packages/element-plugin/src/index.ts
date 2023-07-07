import {
    ComponentDesc,
    ComponentType,
    Field,
    installInGlobal,
    isComponent,
    mergeRefProps,
    PluginFunction,
    SceneConfig,
    SceneContext,
    setupGlobalConfig,
    travelTree,
} from '@koala-form/core';
import * as ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { unref, VNode } from 'vue';
import { genSelectSlots } from './slots';
export * from './preset';
export * from './useCurd';

export const componentPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    setupGlobalConfig({
        modelValueName: 'modelValue',
    });

    api.describe('element-plugin');

    api.onSelfStart(({ ctx }) => {
        ctx.getComponent = (name) => {
            if (typeof name === 'string') {
                if (name === 'Select') return ElementPlus.ElSelectV2;
                if (name === 'Modal') name = 'Dialog';
                const comp = ElementPlus[`El${name}`];
                if (isComponent(comp)) return comp;
                else return name;
            } else {
                return name;
            }
        };
        api.emit('componentLoaded');
    });

    api.on('modalSchemeLoaded', ({ ctx }) => {
        const modalScheme = ctx.schemes[0];
        mergeRefProps(modalScheme.vModels, 'modelValue', modalScheme.vModels?.show);
    });

    api.on('modalSchemeLoaded', ({ ctx }) => {
        const modalScheme = ctx.schemes[0];
        mergeRefProps(modalScheme.vModels, 'modelValue', modalScheme.vModels?.show);
    });

    api.on('pagerSchemeLoaded', ({ ctx }) => {
        const pagerScheme = ctx.schemes[0];
        mergeRefProps(pagerScheme, 'props', { layout: 'prev, pager, next' });
    });

    api.on('started', ({ ctx, name }) => {
        if (name === 'format-plugin') {
            travelTree(ctx.schemes, (scheme) => {
                const field = scheme.__node as Field;
                if (scheme.component === ComponentType.TableColumn && field?.format) {
                    scheme.slots = {
                        ...scheme.slots,
                        default: ({ row, column }) => {
                            return field.format?.(row, row[column.property], scheme) as VNode[];
                        },
                    };
                }
            });
        }
    });
};

installInGlobal(componentPlugin);
