import { SceneConfig, SceneContext, useBaseScene } from '../base';
import { ref, Ref } from 'vue';
import { compileComponents, ComponentDesc, ComponentType, createScheme, Field, Scheme, SchemeChildren } from '../scheme';
import { PluginFunction } from '../plugins';
import { mergeRefProps } from '../helper';
export interface TableSceneContext extends SceneContext {
    ref: Ref;
    model: Ref<Array<unknown>>;
}

export interface TableSceneConfig extends SceneConfig {
    ctx: TableSceneContext;
    table: ComponentDesc;
    fields: Field[];
}

export const tableSchemePlugin: PluginFunction<TableSceneContext, TableSceneConfig> = (api) => {
    api.describe('table-plugin');

    api.onSelfStart(({ ctx, config: { fields, table } }) => {
        if (!fields) return;
        const state = ref([]);
        const schemeChildren: SchemeChildren = [];
        const scheme = createScheme(table || { name: ComponentType.Table });
        scheme.__ref = ref(null);

        fields.forEach((field) => {
            const scheme: Scheme = createScheme(field);
            scheme.component = ComponentType.TableColumn;
            scheme.children = compileComponents(ctx.schemes, field.components);
            mergeRefProps(scheme, 'props', { label: field.label, prop: field.name });
            schemeChildren.push(scheme);
        });
        scheme.children = schemeChildren;
        mergeRefProps(scheme, 'props', { data: state });

        ctx.model = state;
        ctx.ref = scheme.__ref;
        if (ctx.schemes) {
            ctx.schemes.push(scheme);
        } else {
            ctx.schemes = [scheme];
        }

        api.emit('tableSchemeLoaded');
        api.emit('schemeLoaded');
        api.emit('started');
    });
};

export function useTable(config: TableSceneConfig): TableSceneContext {
    config.ctx.use(tableSchemePlugin as PluginFunction);
    return useBaseScene(config);
}
