import { PagerSceneConfig, PagerSceneContext } from './base';
import { ComponentType, createScheme, Handle, KoalaPlugin } from '../base';
import { mergeRefProps } from '../helper';
import { computed, reactive, ref } from 'vue';

export const pagerSchemePlugin: KoalaPlugin<PagerSceneContext, PagerSceneConfig> = ({ ctx, config: { pager } }) => {
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

export const setPagerCurrent = (current = 1, ctx?: PagerSceneContext): Handle => {
    return (thisCtx) => {
        const _cxt = (ctx || thisCtx) as PagerSceneContext;
        if (_cxt?.model) {
            _cxt.model.currentPage = current;
        }
    };
};
