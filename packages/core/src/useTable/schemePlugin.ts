import { TableSceneConfig, TableSceneContext } from './base';
import { compileComponents, ComponentType, createScheme, KoalaPlugin, SchemeChildren, SchemeStatus } from '../base';
import { mergeRefProps } from '../helper';
import { ref } from 'vue';

export const tableSchemePlugin: KoalaPlugin<TableSceneContext, TableSceneConfig> = ({ ctx, config: { table, fields } }) => {
    if (!fields) return;
    const state = ref([]);
    const schemeChildren: SchemeChildren = [];
    const scheme = createScheme(table || { name: ComponentType.Table });
    scheme.__ref = ref(null);

    fields.forEach((field) => {
        const scheme: SchemeStatus = createScheme(field);
        scheme.component = ComponentType.TableColumn;
        scheme.children = compileComponents(ctx, field.components);
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
};
