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
    title: '🐨 Koala Form',
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
              '@koala-form/core': path.resolve('packages/koala-form/src/index.ts'),
              '@koala-form/preset-antd': path.resolve('packages/koala-form-preset-antd'),
              '@koala-form/preset-fesd': path.resolve('packages/preset-fesd/src'),
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
        nav: [
            { text: '教程', link: '/zh/guide/', activeMatch: '^/zh/guide' },
            {
              text: '集成Preset',
              link: '/preset',
              items: [
                { text: 'Ant Design Preset', link: '/preset' },
                { text: 'Fes Design Preset', link: '/preset' },
              ]
            },
            {
              text: 'Github',
              link: 'https://github.com/vuejs/vitepress/releases'
            }
        ],
        sidebar: {
            '/config/': getConfigSidebar(),
            '/zh/guide/': getGuideSidebar()
        }
    }
};



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
        text: 'API',
        children: [
          { text: 'Field', link: '/zh/guide/field' },
          { text: 'Config', link: '/zh/guide/config' },
          { text: 'useForm', link: '/zh/guide/useForm' },
          { text: 'useTable', link: '/zh/guide/useTable' },
          { text: 'useFormAction', link: '/zh/guide/useFormAction' },
          { text: 'useModal', link: '/zh/guide/useModal' },
          { text: 'useQuery', link: '/zh/guide/useQuery' },
          { text: 'usePage', link: '/zh/guide/usePage' },
        ]
      },
      {
        text: '进阶',
        children: [
          { text: 'Preset', link: '/zh/guide/preset' }
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