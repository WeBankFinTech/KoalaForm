import { KoalaPlugin, mergePlugins, useBaseScene } from '../base';
import { formRulePlugin } from './formRule';
import { formSchemePlugin } from './schemePlugin';
import { FormSceneConfig, FormSceneContext } from './base';
import { vIfPlugin, vShowPlugin, disabledPlugin, eventsPlugin, slotPlugin } from '../plugins';

export * from './formRule';
export * from './schemePlugin';
export * from './base';

const defaultPlugins: KoalaPlugin[] = [formSchemePlugin, formRulePlugin, vIfPlugin, vShowPlugin, disabledPlugin, eventsPlugin, slotPlugin] as KoalaPlugin[];

export function useForm(config: FormSceneConfig): FormSceneContext {
    const plugins = mergePlugins(defaultPlugins, config.plugins || []);
    return useBaseScene({ ...config, plugins });
}
