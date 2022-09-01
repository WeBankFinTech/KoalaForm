import { mergePlugins } from '../helper';
import { fieldPropsPlugin, renderComponentPlugin, renderActionPlugin } from '../plugins';
import { KoalaPlugin, useBaseScene } from '../base';
import { formItemPropsPlugin } from './formItemProps';
import { formPropsPlugin } from './formProps';
import { rulePlugin } from './formRule';
import { formStatePlugin } from './formState';
import { renderFormPlugin } from './renderForm';
import { FormSceneConfig } from './base';

export * from './formItemProps';
export * from './formProps';
export * from './formRule';
export * from './formState';
export * from './renderForm';
export * from './base';

const defaultPlugins: KoalaPlugin[] = [
    'componentPlugin',
    fieldPropsPlugin,
    formStatePlugin,
    formItemPropsPlugin,
    rulePlugin,
    formPropsPlugin,
    renderComponentPlugin,
    renderActionPlugin,
    renderFormPlugin,
] as KoalaPlugin[];

export function useForm(config: FormSceneConfig) {
    const plugins = mergePlugins(defaultPlugins, config.plugins || []);
    return useBaseScene({ ...config, plugins });
}
