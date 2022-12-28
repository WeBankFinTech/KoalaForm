import '@koala-form/fes-plugin';
import { setupGlobalConfig, installPluginPreset } from '@koala-form/core';
import { FMessage } from '@fesjs/fes-design';
// 将依赖的插件安装到全局
installPluginPreset();

setupGlobalConfig({
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
