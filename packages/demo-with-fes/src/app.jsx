import { access, defineRuntimeConfig, request } from '@fesjs/fes';

import PageLoading from '@/components/pageLoading.vue';
import UserCenter from '@/components/userCenter.vue';
import { installInGlobal, installPluginPreset, setupGlobalConfig } from '@koala-form/core';

installPluginPreset();
setupGlobalConfig({
    request: request
})

export default defineRuntimeConfig({
    beforeRender: {
        loading: <PageLoading />,
        action() {
            const { setRole } = access;
            return new Promise((resolve) => {
                setTimeout(() => {
                    setRole('admin');
                    // 初始化应用的全局状态，可以通过 useModel('@@initialState') 获取，具体用法看@/components/UserCenter 文件
                    resolve({
                        userName: '李雷',
                    });
                }, 1000);
            });
        },
    },
    layout: {
        renderCustom: () => <UserCenter />,
    },
    request: {
        baseURL: '/',
        timeout: 10000, // 默认 10s
        method: 'get', // 默认 post
        mergeRequest: false, // 是否合并请求
        cacheData: false, // 是否缓存
        dataHandler(data, response) {
            // 处理响应内容异常
            if (data.code === '10000') {
                return Promise.reject(data);
            }
            return data?.result ? data.result : data;
        },
        // http 异常，和插件异常
        errorHandler(error) {
            if (error.response) {
                // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.msg) {
                console.log(error.msg);
            } else {
                // 发送请求时出了点问题
                console.log('Error', error.message);
            }
            console.log(error.config);
        },
    },
});
