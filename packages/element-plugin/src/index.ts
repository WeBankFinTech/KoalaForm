import { ComponentType, Field, installInGlobal, isComponent, mergeRefProps, PluginFunction, SceneConfig, SceneContext, setupGlobalConfig, travelTree } from '@koala-form/core';
import * as ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { computed, Slot, unref, VNode } from 'vue';
import { genModalFooter, genOptions } from './slots';
import { isUndefined } from 'lodash-es';
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
        if (!modalScheme.slots) {
            modalScheme.slots = {};
        }
        modalScheme.slots = {
            footer: genModalFooter(modalScheme, ctx) as unknown as Slot,
            ...modalScheme.slots,
        };
    });

    api.on('pagerSchemeLoaded', ({ ctx }) => {
        const pagerScheme = ctx.schemes[0];
        const defaultProps = {
            layout: 'prev, pager, next',
            total: computed(() => ctx.modelRef?.value?.totalCount),
            background: true,
        };
        Object.keys(defaultProps).forEach((key) => {
            if (!isUndefined(unref(pagerScheme.props)?.[key])) {
                delete defaultProps[key];
            }
        });
        mergeRefProps(pagerScheme, 'props', defaultProps);
    });

    api.on('started', ({ ctx, name }) => {
        if (['format-plugin', 'options-plugin'].includes(name)) {
            travelTree(ctx.schemes, (scheme) => {
                const field = scheme.__node as Field;
                if (name === 'format-plugin') {
                    if (scheme.component === ComponentType.TableColumn && field?.format) {
                        scheme.slots = {
                            ...scheme.slots,
                            default: ({ row, column }) => {
                                return field.format?.(row, row[column.property], scheme) as VNode[];
                            },
                        };
                    }
                }
                if (name === 'options-plugin') {
                    // options渲染
                    const { component, props } = scheme;
                    if ([ComponentType.CheckboxGroup, ComponentType.RadioGroup].includes(component as string)) {
                        scheme.slots = {
                            ...scheme.slots,
                            default: genOptions(component as string, props),
                        };
                    }
                }
            });
        }
    });
};
