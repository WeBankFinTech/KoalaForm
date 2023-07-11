

import usersAringCodeKoalaFormPackagesDemoWithFesSrcFesPluginLayoutViewsIndexJsx from '/Users/aring/code/koala-form/packages/demo-with-fes/src/.fes/plugin-layout/views/index.jsx'
import index from '/Users/aring/code/koala-form/packages/demo-with-fes/src/pages/index.vue'
import usersAringCodeKoalaFormPackagesDemoWithFesSrcFesPluginLayoutViews403 from '/Users/aring/code/koala-form/packages/demo-with-fes/src/.fes/plugin-layout/views/403.vue'
import usersAringCodeKoalaFormPackagesDemoWithFesSrcFesPluginLayoutViews404 from '/Users/aring/code/koala-form/packages/demo-with-fes/src/.fes/plugin-layout/views/404.vue'

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": usersAringCodeKoalaFormPackagesDemoWithFesSrcFesPluginLayoutViewsIndexJsx,
    "children": [
      {
        "path": "/",
        "component": index,
        "name": "index",
        "meta": {
          "name": "index",
          "title": "首页"
        },
        "count": 5
      },
      {
        "path": "/403",
        "name": "Exception403",
        "component": usersAringCodeKoalaFormPackagesDemoWithFesSrcFesPluginLayoutViews403,
        "meta": {
          "title": "403"
        }
      },
      {
        "path": "/404",
        "name": "Exception404",
        "component": usersAringCodeKoalaFormPackagesDemoWithFesSrcFesPluginLayoutViews404,
        "meta": {
          "title": "404"
        }
      }
    ]
  }
];
  return routes;
}

