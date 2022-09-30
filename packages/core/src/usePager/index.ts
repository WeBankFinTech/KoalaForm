import { ComponentType, KoalaPlugin, mergePlugins, useBaseScene } from '../base';
import { pagerSchemePlugin } from './schemePlugin';
import { PagerSceneConfig, PagerSceneContext } from './base';
import { vIfPlugin, vShowPlugin, eventsPlugin } from '../plugins';
import { mergeRefProps } from '../helper';

export * from './base';

const defaultPlugins: KoalaPlugin[] = [pagerSchemePlugin, vIfPlugin, vShowPlugin, eventsPlugin] as KoalaPlugin[];

export function usePager(config: PagerSceneConfig): PagerSceneContext {
    const plugins = mergePlugins(defaultPlugins, config?.plugins || []);
    const pager = config?.pager || { name: ComponentType.Pagination };
    mergeRefProps(pager, 'props', { style: { justifyContent: 'right', marginTop: '16px' } });
    return useBaseScene({ ...(config || {}), plugins, pager });
}
