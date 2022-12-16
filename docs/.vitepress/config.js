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
        text: '基础',
        children: [
          { text: '写一个表单', link: '/zh/guide/base/form' },
          { text: '组件描述', link: '/zh/guide/base/component' },
          { text: '字段描述', link: '/zh/guide/base/field' },
          { text: '联动基础', link: '/zh/guide/base/relation' },
          { text: '事件基础', link: '/zh/guide/base/event' },
          { text: '行为函数', link: '/zh/guide/base/handler' },
          { text: '插件基础', link: '/zh/guide/base/plugin' },
        ]
      },
      {
        text: '场景',
        children: [
          { text: 'useScene', link: '/zh/guide/useScene' },
          { text: 'useForm', link: '/zh/guide/useForm' },
          { text: 'useTable', link: '/zh/guide/useTable' },
          { text: 'useModal', link: '/zh/guide/useModal' },
          { text: 'useQuery', link: '/zh/guide/useQuery' },
          { text: 'usePage', link: '/zh/guide/usePage' },
        ]
      },
      {
        text: '深入插件',
        children: [
          // { text: 'useScene', link: '/zh/guide/useScene' },
          // { text: 'useForm', link: '/zh/guide/useForm' },
          // { text: 'useTable', link: '/zh/guide/useTable' },
          // { text: 'useModal', link: '/zh/guide/useModal' },
          // { text: 'useQuery', link: '/zh/guide/useQuery' },
          // { text: 'usePage', link: '/zh/guide/usePage' },
        ]
      },
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