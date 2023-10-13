

import usersAringCodeKoalaFormExamplesDemoWithFesSrcFesPluginLayoutViewsIndexJsx from '/Users/aring/code/koala-form/examples/demo-with-fes/src/.fes/plugin-layout/views/index.jsx'
import compBasic from '/Users/aring/code/koala-form/examples/demo-with-fes/src/pages/comp/basic.vue'
import compReactive from '/Users/aring/code/koala-form/examples/demo-with-fes/src/pages/comp/reactive.vue'
import index from '/Users/aring/code/koala-form/examples/demo-with-fes/src/pages/index.vue'
import usersAringCodeKoalaFormExamplesDemoWithFesSrcFesPluginLayoutViews403 from '/Users/aring/code/koala-form/examples/demo-with-fes/src/.fes/plugin-layout/views/403.vue'
import usersAringCodeKoalaFormExamplesDemoWithFesSrcFesPluginLayoutViews404 from '/Users/aring/code/koala-form/examples/demo-with-fes/src/.fes/plugin-layout/views/404.vue'

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": usersAringCodeKoalaFormExamplesDemoWithFesSrcFesPluginLayoutViewsIndexJsx,
    "children": [
      {
        "path": "/comp/basic",
        "component": compBasic,
        "name": "basic",
        "meta": {
          "name": "basic",
          "title": "基础使用"
        },
        "count": 14
      },
      {
        "path": "/comp/reactive",
        "component": compReactive,
        "name": "reactive",
        "meta": {
          "name": "reactive",
          "title": "联动控制"
        },
        "count": 14
      },
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
        "component": usersAringCodeKoalaFormExamplesDemoWithFesSrcFesPluginLayoutViews403,
        "meta": {
          "title": "403"
        }
      },
      {
        "path": "/404",
        "name": "Exception404",
        "component": usersAringCodeKoalaFormExamplesDemoWithFesSrcFesPluginLayoutViews404,
        "meta": {
          "title": "404"
        }
      }
    ]
  }
];
  return routes;
}

