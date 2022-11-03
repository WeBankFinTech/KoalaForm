import { isArray } from 'lodash-es';
import { computed, reactive, ref, Ref, unref } from 'vue';
import { SceneConfig, SceneContext, useBaseScene, useSceneContext } from '../base';
import { mergeRefProps } from '../helper';
import { PluginFunction } from '../plugins';
import { compileComponents, ComponentDesc, ComponentType, createScheme, findScheme, SchemeChildren } from '../scheme';

export interface ModalSceneContext extends SceneContext {
    model: {
        show: boolean;
        title: string;
    };
    ref: Ref;
}

export interface ModalSceneConfig extends SceneConfig {
    ctx?: ModalSceneContext;
    title?: string;
    modal?: ComponentDesc;
}

export const modalPlugin: PluginFunction<ModalSceneContext, ModalSceneConfig> = (api) => {
    api.describe('modal-plugin');

    api.onSelfStart(({ ctx, config: { modal, title } }) => {
        const state = reactive({
            show: false,
            title: title || '',
        });
        const scheme = createScheme(modal || { name: ComponentType.Modal });
        scheme.__ref = ref(null);
        if (!scheme.component) {
            scheme.component = ComponentType.Modal;
        }
        mergeRefProps(scheme, 'vModels', {
            show: { ref: state, name: 'show' },
        });

        mergeRefProps(scheme, 'props', { title: computed(() => state.title) });

        ctx.model = state;
        ctx.ref = scheme.__ref;
        if (ctx.schemes) {
            ctx.schemes.push(scheme);
        } else {
            ctx.schemes = [scheme];
        }
        scheme.children = compileComponents(ctx.schemes, modal?.children as ComponentDesc[]);

        api.emit('modalSchemeLoaded');
        api.emit('schemeLoaded');
        api.emit('started');
    });
};

export const hOpen = (ctx: ModalSceneContext) => {
    if (ctx.model) {
        ctx.model.show = true;
    }
};

export const hClose = (ctx: ModalSceneContext) => {
    if (ctx.model) {
        ctx.model.show = false;
    }
};

export function useModal(config: ModalSceneConfig): ModalSceneContext {
    if (!config.ctx) {
        const { ctx } = useSceneContext('modal');
        config.ctx = ctx as ModalSceneContext;
    }
    const modal = config?.modal || { name: ComponentType.Modal };
    config.ctx.use(modalPlugin as PluginFunction);
    const mergeConfig = { ...(config || {}), modal };
    return useBaseScene(mergeConfig);
}
