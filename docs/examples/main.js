import { usePreset } from '@koala-form/core';
// import antdPreset from '@koala-form/preset-antd';
import fesdPreset from '@koala-form/preset-fesd';

const enumsMap = {
    sex: [
        { value: 1, label: '男' },
        { value: 0, label: '女' },
    ],
    reward: [
        { value: 1, label: '15亿贝里' },
        { value: 2, label: '8亿贝里' },
        { value: 3, label: '2亿贝里' },
    ],
    awaken: [
        { value: true, label: '开' },
        { value: false, label: '关' },
    ],
};

usePreset({
    // ...antdPreset,
    ...fesdPreset,
    //可以自由覆盖antd preset的方法
    getEnums(key) {
        return enumsMap[key] || [];
    },
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
            return res.json();
        });
    },
});
