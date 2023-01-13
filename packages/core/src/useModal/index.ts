import { computed, ref, Ref } from 'vue';
import { SceneConfig, SceneContext, useScene, useSceneContext } from '../base';
import { mergeRefProps } from '../helper';
import { PluginFunction } from '../plugins';
import { compileComponents, ComponentDesc, ComponentType, createScheme } from '../scheme';

export interface ModalSceneContext extends SceneContext {
    modelRef: Ref<{
        show: boolean;
        title: string;
    }>;
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
        const { modelRef } = ctx;
        modelRef.value = {
            show: false,
            title: title || '',
        };
        const scheme = createScheme(modal || { name: ComponentType.Modal });
        scheme.__ref = ref(null);
        if (!scheme.component) {
            scheme.component = ComponentType.Modal;
        }
        mergeRefProps(scheme, 'vModels', {
            show: { ref: modelRef, name: 'show' },
        });

        mergeRefProps(scheme, 'props', { title: computed(() => modelRef.value.title) });

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

export const doOpen = (ctx: ModalSceneContext) => {
    if (ctx.modelRef.value) {
        ctx.modelRef.value.show = true;
    }
};

export const doClose = (ctx: ModalSceneContext) => {
    if (ctx.modelRef.value) {
        ctx.modelRef.value.show = false;
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
    return useScene(mergeConfig);
}
