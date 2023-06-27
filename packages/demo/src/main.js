import { createApp } from 'vue';
import { installPluginPreset, setupGlobalConfig } from '@koala-form/core';
import { createMemoryHistory, createRouter } from 'vue-router';
import './style.css';
import App from './App.vue';
installPluginPreset();
setupGlobalConfig({
    debug: true,
    // 实现网络请求的实现
    request(api, params, config) {
        console.log('request.params => ', params);
        return fetch(api)
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

const app = createApp(App);

app.use(
    createRouter({
        history: createMemoryHistory(),
        routes: [
            {
                path: '/home',
                components: {},
            },
        ],
    }),
);

app.mount('#app');