// eslint-disable-next-line import/no-extraneous-dependencies
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
const ssrTransformCustomDir = () => ({
    props: [],
    needRuntime: true,
});

const BASE_URL = process.env.NODE_ENV === 'production' ? '/s/koala-form/' : '/';

export default {
    lang: 'zh-CN',
    title: 'Koala Form',
    base: BASE_URL,
    description: 'Koala Form',
    vite: {
        define: {
            __VUE_OPTIONS_API__: false
        },
        ssr: {
          // esm，ssr 渲染的时候编译成 cjs 的引入方式，会引发 nodejs 的模块加载异常错误
          noExternal: ['lodash-es', '@fesjs/fes-design'],
          external: ['@vue/repl']
      },
        resolve: {
          extensions: [
              '.mjs',
              '.js',
              '.ts',
              '.jsx',
              '.tsx',
              '.json',
              '.vue',
          ],
          alias: {
              '@koala-form/core': path.resolve('packages/core/src/index.ts'),
              '@koala-form/fes-plugin': path.resolve('packages/fes-plugin/src/index.ts'),
          },
      },
        json: {
            stringify: true
        },
        plugins: [
            vueJsx({}),
        ],
    },
    vue: {
        template: {
            ssr: true,
            compilerOptions: {
                directiveTransforms: {
                    drag: ssrTransformCustomDir,
                    mousewheel: ssrTransformCustomDir,
                    sticky: ssrTransformCustomDir,
                },
            },
        },
    },
    themeConfig: {
        logo: '/logo.png',
        nav: [
            { text: '教程', link: '/zh/guide/', activeMatch: '^/zh/guide' },
            {
              text: 'UI库插件',
              link: '/zh/ui',
              activeMatch: '^/zh/ui',
              items: [
                { text: 'Fes Plugin', link: '/zh/ui/fes' },
              ]
            },
            { text: '精彩示例', link: '/zh/demos/', activeMatch: '^/zh/demos' },
            {
              text: 'Github',
              link: 'https://github.com/vuejs/vitepress/releases'
            }
        ],
        sidebar: {
            'zh/guide/': getGuideSidebar(),
            '/zh/ui/fes': [
              { text: 'Fes Plugin', link: '/zh/ui/fes' },
            ],
            '/zh/demos/': getDemosSidebar(),
        }
    }
};


function getDemosSidebar() {
  return [
    { text: '示例说明', link: '/zh/demos/' },
    { text: '示例1', link: '/zh/demos/demo1' }
  ]
}

function getGuideSidebar() {
    return [
      {
        text: '介绍',
        children: [
          { text: 'Koala Form是什么', link: '/zh/guide/' },
          { text: '快速上手', link: '/zh/guide/getting-started' },
          { text: '设计原理', link: '/zh/guide/design' },
        ]
      },
      {
        text: '基础场景',
        children: [
          // { text: 'Field', link: '/zh/guide/field' },
          // { text: 'Action', link: '/zh/guide/action' },
          // { text: 'Config', link: '/zh/guide/config' },
          { text: 'useForm', link: '/zh/guide/useForm' },
          { text: 'useTable', link: '/zh/guide/useTable' },
          { text: 'useModal', link: '/zh/guide/useModal' },
          { text: 'useQuery', link: '/zh/guide/useQuery' },
          { text: 'usePage', link: '/zh/guide/usePage' },
        ]
      },
      {
        text: '组合场景',
        children: [
          { text: 'useTableWithPager', link: '/zh/guide/useTableWithPager' },
          { text: 'useQueryPage', link: '/zh/guide/useQueryPage' },
          { text: 'useModalForm', link: '/zh/guide/useModalForm' },
          { text: 'useModalTable', link: '/zh/guide/useModalTable' },
          { text: 'useCurd', link: '/zh/guide/useCurd' },
        ]
      },
      {
        text: 'Preset进阶',
        children: [
          { text: 'Preset', link: '/zh/preset/index' }
        ]
      }
    ]
  }
  
  function getConfigSidebar() {
    return [
      {
        text: 'App Config',
        children: [{ text: 'Basics', link: '/config/basics' }]
      },
      {
        text: 'Theme Config',
        children: [
          { text: 'Homepage', link: '/config/homepage' },
          { text: 'Algolia Search', link: '/config/algolia-search' },
          { text: 'Carbon Ads', link: '/config/carbon-ads' }
        ]
      }
    ]
  }