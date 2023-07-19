import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { installPluginPreset, setupGlobalConfig, installInGlobal } from '@koala-form/core';
import { componentPlugin } from '@koala-form/element-plugin';
import { FMessage } from '@fesjs/fes-design';

installInGlobal(componentPlugin);
const BASE_URL = '/'

installPluginPreset();

setupGlobalConfig({
    // 实现网络请求的实现
    modelValueName: 'modelValue',
    request(api, params, config) {
        console.log('request.params => ', params);
        return fetch(location.origin + BASE_URL + api)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log('request.data => ', data);
                if (data.code !== 0) {
                    const msg = `${data.message}(${data.code})`;
                    FMessage.error(msg);
                    throw new Error(msg);
                }
                return data?.result;
            });
    },
});

const app = createApp(App)

app.use(router)

app.mount('#app')
