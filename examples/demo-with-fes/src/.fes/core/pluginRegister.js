import { plugin } from './plugin';
import * as Plugin_0 from '/Users/aring/code/koala-form/packages/demo-with-fes/src/app.jsx';
import * as Plugin_1 from '@@/core/routes/runtime.js';
import * as Plugin_2 from '@@/plugin-access/runtime.js';
import * as Plugin_3 from '@@/plugin-layout/runtime.js';

function handleDefaultExport(pluginExports) {
  // 避免编译警告
  const defaultKey = 'default';
  if (pluginExports[defaultKey]) {
    const {default: defaultExport, ...otherExports} = pluginExports;
    return {
      ...defaultExport,
      ...otherExports
    }
  }
  return pluginExports;
}

  plugin.register({
    apply: handleDefaultExport(Plugin_0),
    path: '/Users/aring/code/koala-form/packages/demo-with-fes/src/app.jsx',
  });
  plugin.register({
    apply: handleDefaultExport(Plugin_1),
    path: '@@/core/routes/runtime.js',
  });
  plugin.register({
    apply: handleDefaultExport(Plugin_2),
    path: '@@/plugin-access/runtime.js',
  });
  plugin.register({
    apply: handleDefaultExport(Plugin_3),
    path: '@@/plugin-layout/runtime.js',
  });
