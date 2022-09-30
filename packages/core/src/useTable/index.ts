import { KoalaPlugin, mergePlugins, useBaseScene } from '../base';
import { tableSchemePlugin } from './schemePlugin';
import { TableSceneConfig, TableSceneContext } from './base';
import { vIfPlugin, vShowPlugin, disabledPlugin, eventsPlugin, slotPlugin } from '../plugins';

export * from './base';

const defaultPlugins: KoalaPlugin[] = [tableSchemePlugin, vIfPlugin, vShowPlugin, disabledPlugin, eventsPlugin, slotPlugin] as KoalaPlugin[];

export function useTable(config: TableSceneConfig): TableSceneContext {
    const plugins = mergePlugins(defaultPlugins, config.plugins || []);
    return useBaseScene({ ...config, plugins });
}
