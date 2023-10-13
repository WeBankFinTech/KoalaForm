import { defineBuildConfig } from '@fesjs/fes';

export default defineBuildConfig({
    access: {
        roles: {
            admin: ['*'],
            manager: ['/'],
        },
    },
    layout: {
        title: 'Fes.js',
        footer: 'Created by MumbleFE',
        navigation: 'mixin',
        multiTabs: false,
        menus: [
            {
                name: 'comp',
                title: '组件',
                children: [
                    {
                        name: 'basic',
                        title: '基本使用',
                    },
                    {
                        name: 'reactive',
                    },
                ],
            },
        ],
    },
    enums: {
        status: [
            ['0', '无效的'],
            ['1', '有效的'],
        ],
    },
});
