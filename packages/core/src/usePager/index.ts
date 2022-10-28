import { computed, reactive, ref, Ref } from 'vue';
import { Handle, SceneConfig, SceneContext, useBaseScene } from '../base';
import { Handler } from '../handles';
import { mergeRefProps } from '../helper';
import { PluginFunction } from '../plugins';
import { ComponentDesc, ComponentType, createScheme } from '../scheme';

export interface PagerSceneContext extends SceneContext {
    model: {
        pageSize: number;
        currentPage: number;
        totalCount: number;
    };
    ref: Ref;
    isPager: boolean;
}

export interface PagerSceneConfig extends SceneConfig {
    ctx: PagerSceneContext;
    pager: ComponentDesc;
}

export const pagerPlugin: PluginFunction<PagerSceneContext, PagerSceneConfig> = (api) => {
    api.describe('pager-plugin');

    api.onSelfStart(({ ctx, config: { pager } }) => {
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

        api.emit('pagerSchemeLoaded');
        api.emit('schemeLoaded');
        api.emit('started');
    });
};

const checkPager = (ctx: PagerSceneContext) => {
    if (!ctx?.isPager) {
        throw new Error('hSetPager: config.ctx is not PagerSceneContext!');
    }
};

export const hSetPager: Handler<
    {
        ctx: PagerSceneContext;
        currentPage?: number;
        pageSize?: number;
        totalCount?: number;
    },
    PagerSceneContext['model']
> = (config) => {
    const { ctx, ...page } = config;
    checkPager(ctx);
    Object.assign(config.ctx.model, page);
    return config.ctx.model;
};

export function usePager(config: PagerSceneConfig): PagerSceneContext {
    const pager = config?.pager || { name: ComponentType.Pagination };
    mergeRefProps(pager, 'props', { style: { justifyContent: 'right', marginTop: '16px' } });
    config.ctx.isPager = true;
    config.ctx.use(pagerPlugin as PluginFunction);
    return useBaseScene({ ...(config || {}), pager });
}
