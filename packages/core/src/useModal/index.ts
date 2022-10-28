import { isArray } from 'lodash-es';
import { computed, reactive, ref, Ref } from 'vue';
import { Handle, SceneConfig, SceneContext, useBaseScene } from '../base';
import { Handler, HandlerConfig } from '../handles';
import { mergeRefProps, turnArray } from '../helper';
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
    ctx: ModalSceneContext;
    modal?: ComponentDesc;
    childrenCtx?: SceneContext[];
}

export const modalPlugin: PluginFunction<ModalSceneContext, ModalSceneConfig> = (api) => {
    api.describe('modal-plugin');

    api.onSelfStart(({ ctx, config: { modal } }) => {
        const state = reactive({
            show: false,
            title: '',
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

export const hOpen: Handler<ModalSceneContext> = (ctx) => {
    if (ctx.model) {
        ctx.model.show = true;
    }
};

export const hClose: Handler<ModalSceneContext> = (ctx) => {
    if (ctx.model) {
        ctx.model.show = false;
    }
};

export function useModal(config: ModalSceneConfig): ModalSceneContext {
    const modal = config?.modal || { name: ComponentType.Modal };
    config.ctx.use(modalPlugin as PluginFunction);
    const mergeConfig = { ...(config || {}), modal };
    useBaseScene(mergeConfig);

    const scheme = findScheme(config.ctx.schemes, mergeConfig.modal);
    if (scheme && config.childrenCtx?.length) {
        const children = (isArray(scheme.children) && scheme.children) || (scheme.children && [scheme.children]) || [];
        config.childrenCtx.forEach((child) => {
            children.push(...child.schemes);
        });
        scheme.children = children as SchemeChildren;
    }

    return config.ctx;
}
