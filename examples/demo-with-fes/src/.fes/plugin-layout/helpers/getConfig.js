import { plugin, ApplyPluginsType } from '@@/core/coreExports';
import { initialState } from '@@/initialState';

export default () => {
    const initConfig = {"title":"Fes.js","footer":"Created by MumbleFE","navigation":"mixin","multiTabs":false,"menus":[{"name":"index"}]}
    const runtimeConfig = plugin.applyPlugins({
        key: 'layout',
        type: ApplyPluginsType.modify,
        initialValue: initConfig,
        args: {
            initialState
        }
    });
    return runtimeConfig;
};
