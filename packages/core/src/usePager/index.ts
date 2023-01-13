import { computed, ref, Ref } from 'vue';
import { SceneConfig, SceneContext, useScene, useSceneContext } from '../base';
import { mergeRefProps } from '../helper';
import { PluginFunction } from '../plugins';
import { ComponentDesc, ComponentType, createScheme } from '../scheme';

export interface PagerSceneContext extends SceneContext {
    modelRef: Ref<{
        pageSize: number;
        currentPage: number;
        totalCount: number;
    }>;
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
        const { modelRef } = ctx;
        modelRef.value = {
            pageSize: 10,
            currentPage: 1,
            totalCount: 0,
        };
        const scheme = createScheme(pager || { name: ComponentType.Pagination });
        scheme.__ref = ref(null);
        if (!scheme.component) {
            scheme.component = ComponentType.Pagination;
        }
        mergeRefProps(scheme, 'vModels', {
            pageSize: { ref: modelRef, name: 'pageSize' },
            currentPage: { ref: modelRef, name: 'currentPage' },
        });

        mergeRefProps(scheme, 'props', { totalCount: computed(() => modelRef.value.totalCount) });

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
        throw new Error('doSetPager: config.ctx is not PagerSceneContext!');
    }
};

export const doSetPager = (
    ctx: PagerSceneContext,
    value: {
        currentPage?: number;
        pageSize?: number;
        totalCount?: number;
    },
) => {
    checkPager(ctx);
    Object.assign(ctx.modelRef.value, value);
    return ctx.modelRef;
};

export function usePager(config: PagerSceneConfig): PagerSceneContext {
    if (!config.ctx) {
        const { ctx } = useSceneContext('pager');
        config.ctx = ctx as PagerSceneContext;
    }
    const pager = config?.pager || { name: ComponentType.Pagination };
    mergeRefProps(pager, 'props', { style: { justifyContent: 'right', marginTop: '16px' } });
    config.ctx.isPager = true;
    config.ctx.use(pagerPlugin as PluginFunction);
    return useScene({ ...(config || {}), pager });
}
