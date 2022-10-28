import '@koala-form/fes-plugin';
import { setupGlobalConfig, installPluginPreset } from '@koala-form/core';
installPluginPreset();
setupGlobalConfig({
    request(api, params, config) {
        console.log('request.params => ', params);
        const paramStr = Object.keys(params)
            .map((key) => `${key}=${params[key] || ''}`)
            .join('&');
        return fetch(`${api}?${paramStr}`, {
            cache: 'no-cache',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log('request.data => ', data);
                return data?.result;
            });
    },
});
