import { ComponentType, Field, mergeRefProps, PluginFunction, SceneConfig, SceneContext, Scheme, setupGlobalConfig, travelTree } from '@koala-form/core';
import * as Antd from 'ant-design-vue';
import { computed, VNode } from 'vue';
export * from './preset';
export * from './useCurd';

export const componentPlugin: PluginFunction<SceneContext, SceneConfig> = (api) => {
    setupGlobalConfig({
        modelValueName: 'value',
    });

    api.describe('antd-plugin');

    api.onSelfStart(({ ctx }) => {
        ctx.getComponent = (name) => {
            if (typeof name === 'string') {
                const comp = (Antd as any)[`${name}`];
                return comp || name;
            } else {
                return name;
            }
        };
        api.emit('componentLoaded');
    });

    api.on('tableSchemeLoaded', ({ ctx }) => {
        const table = ctx.schemes[0];
        mergeRefProps(table, 'props', { dataSource: ctx.modelRef, pagination: false });
        (table.children as Scheme[])?.forEach((col) => {
            const node = col.__node as Field;
            mergeRefProps(col, 'props', { dataIndex: node?.name, title: node?.label });
        });
    });

    api.on('formSchemeLoaded', ({ ctx }) => {
        const form = ctx.schemes[0];
        (form.children as Scheme[])?.forEach((item) => {
            const node = item.__node as Field;
            mergeRefProps(item, 'props', { name: node?.name });
        });
    });

    api.on('modalSchemeLoaded', ({ ctx }) => {
        const modal = ctx.schemes[0];
        mergeRefProps(modal, 'vModels', { visible: modal.vModels?.show }); // 3.x

        mergeRefProps(modal, 'vModels', { open: modal.vModels?.show }); // 4.x
    });

    api.on('pagerSchemeLoaded', ({ ctx }) => {
        const pagerScheme = ctx.schemes[0];

        mergeRefProps(pagerScheme, 'props', {
            total: computed(() => ctx.modelRef?.value?.totalCount),
        });
        if (pagerScheme.props) {
            mergeRefProps(pagerScheme.props, 'style', { textAlign: 'right' });
        }
        mergeRefProps(pagerScheme, 'vModels', { current: pagerScheme.vModels?.currentPage });
    });

    api.on('started', ({ ctx, name }) => {
        if (['format-plugin'].includes(name)) {
            travelTree(ctx.schemes, (scheme) => {
                const field = scheme.__node as Field;
                if (name === 'format-plugin') {
                    if (scheme.component === ComponentType.TableColumn && field?.format) {
                        scheme.slots = {
                            ...scheme.slots,
                            default: ({ value, record }) => {
                                return field.format?.(record, value, scheme) as VNode[];
                            },
                        };
                    }
                }
            });
        }
    });
};
