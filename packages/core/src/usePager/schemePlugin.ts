import { PagerSceneConfig, PagerSceneContext } from './base';
import { compileComponents, ComponentType, createScheme, getGlobalConfig, KoalaPlugin, SchemeChildren, SchemeStatus } from '../base';
import { mergeRefProps } from '../helper';
import { computed, reactive, ref } from 'vue';

export const pagerSchemePlugin: KoalaPlugin<PagerSceneContext, PagerSceneConfig> = (ctx, { pager }) => {
    const state = reactive({
        pageSize: 10,
        currentPage: 1,
        totalCount: 0,
    });
    const scheme = createScheme(pager || { name: ComponentType.Pagination });
    scheme.__ref = ref(null);
    if (!scheme.component) {
        scheme.component = ComponentType.Pagination;
    }
    mergeRefProps(scheme, 'vModels', {
        pageSize: { ref: state, name: 'pageSize' },
        currentPage: { ref: state, name: 'currentPage' },
    });

    mergeRefProps(scheme, 'props', { totalCount: computed(() => state.totalCount) });

    ctx.model = state;
    ctx.ref = scheme.__ref;
    if (ctx.schemes) {
        ctx.schemes.push(scheme);
    } else {
        ctx.schemes = [scheme];
    }
};
