// complexPage/use/useConfig.js

import { defineConfig } from '@koala-form/core';
import { FModal } from '@fesjs/fes-design';
import { BASE_URL } from '../../const';

async function before(params) {
    return new Promise((resolve, reject) => {
        const { status } = params;

        if (status === 'enable') {
            return resolve(params);
        }

        FModal.confirm({
            content: `确认设置为无效？`,
            onOk() {
                return resolve(params);
            },
            onCancel() {
                return reject(new Error('取消提交'));
            },
        });
    });
}

export function useConfig() {
    const config = defineConfig({
        name: '用户列表',
        uniqueKey: 'id', // 列表中每行数据唯一值的字段名
        insert: {
            api: `${BASE_URL}success.json`,
            success: async (res) => res,
            method: 'POST',
            before,
        },
        update: {
            api: `${BASE_URL}success.json`,
            success: async (res) => res,
            method: 'POST',
            before,
        },
    });

    return { config };
}
