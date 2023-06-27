// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/vue';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}

Cypress.Commands.add('mount', mount);

import '@koala-form/fes-plugin';
import { setupGlobalConfig, installPluginPreset } from '@koala-form/core';
import { FMessage } from '@fesjs/fes-design';
// import { FMessage } from '@fesjs/fes-design';
// 将依赖的插件安装到全局
installPluginPreset();
setupGlobalConfig({
    debug: true,
    modelValueName: 'modelValue',
    // 实现网络请求的实现
    request: async (api, params) => {
        console.log('request.params => ', api, params);
        return {
            list: [
                {
                    id: '1',
                    name: '蒙奇·D·路飞',
                    age: 16,
                    sex: '1',
                    hobby: '2,3',
                    birthday: 1115251200000,
                    idCard: '440223198310130033',
                    address: '上海市普陀区金沙江路 1518 弄',
                    education: '1',
                },
                {
                    id: '2',
                    name: '罗罗诺亚·索隆',
                    age: 18,
                    sex: '1',
                    birthday: 1115251200000,
                    idCard: '440223193110130024',
                    address: '上海市普陀区金沙江路 1518 弄',
                    education: '2',
                },
            ],
            page: {
                currentPage: 1,
                totalCount: 23,
            },
        };
    },
});

// Example use:
// cy.mount(MyComponent)
