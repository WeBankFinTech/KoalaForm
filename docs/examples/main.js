import '@koala-form/fes-plugin';
import { setupGlobalConfig } from '@koala-form/core';

setupGlobalConfig({
    request(api, params, config) {
        const paramStr = Object.keys(params)
            .map((key) => `${key}=${params[key] || ''}`)
            .join('&');
        return fetch(`${api}?${paramStr}`, {
            cache: 'no-cache',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then((res) => {
            return res.json()?.result;
        });
    },
});
