import { ComponentType, Field, findScheme, FormSceneConfig, FormSceneContext, isComponent, mergeRefProps, PluginFunction, SceneConfig, SceneContext, Scheme, setupGlobalConfig, travelTree } from '@koala-form/core';
import * as ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { computed, DefineComponent, Slot, unref, VNode } from 'vue';
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
                if (name === 'SelectCascader') return ElementPlus.ElCascader;
                if (name === ComponentType.SelectTree) return ElementPlus.ElTreeSelect;
                if (name === 'Modal') name = 'Dialog';
                const comp = ElementPlus[`El${name}` as keyof typeof ElementPlus] as DefineComponent;
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

    api.on('formSchemeLoaded', (opt) => {
        const ctx = opt.ctx as FormSceneContext;
        const config = opt.config as FormSceneConfig;
        const { inline, span } = unref(config.form?.props) || {};
        if (!inline) return;
        const form = findScheme(ctx.schemes, config.form);
        if (!form) return;
        mergeRefProps(form, 'props', { style: {display: 'grid', gridTemplateColumns: 'repeat(24,minmax(0,1fr))' }  })
        config.fields?.forEach?.((filed) => {
            const scheme = findScheme(form.children as Scheme[], filed);
            if (!scheme) return;
            const fieldSpan = unref(filed.props)?.span || span || 6;
            mergeRefProps(scheme, 'props', { style: { gridColumn: `span ${fieldSpan}` } });
        })
        console.warn('formSchemeLoaded', ctx, config);
    })

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
