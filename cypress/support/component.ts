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
// import { FMessage } from '@fesjs/fes-design';
// 将依赖的插件安装到全局
installPluginPreset();

setupGlobalConfig({
    debug: true,
    modelValueName: 'modelValue',
    // 实现网络请求的实现
    // request(api, params, config) {
    //     console.log('request.params => ', params);
    //     return fetch(BASE_URL + api)
    //         .then((res) => {
    //             return res.json();
    //         })
    //         .then((data) => {
    //             console.log('request.data => ', data);
    //             if (data.code !== 0) {
    //                 const msg = `${data.message}(${data.code})`;
    //                 FMessage.error(msg);
    //                 throw new Error(msg);
    //             }
    //             return data?.result;
    //         });
    // },
});

// Example use:
// cy.mount(MyComponent)
