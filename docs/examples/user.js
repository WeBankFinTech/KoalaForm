// user.js

import { FMessage } from '@fesjs/fes-design';
import { defineFields, defineConfig } from '@koala-form/core';
import { onMounted, ref } from 'vue';
import { BASE_URL } from './const';
export function useUser() {
    const hobbyOptions = ref([]);

    const fields = defineFields([
        { name: 'id', label: 'ID', required: true, status: true, insert: false, update: { status: 'disabled' } },
        { name: 'name', label: '姓名', required: true, status: true },
        { name: 'age', label: '年龄', type: 'number', required: true, rules: { message: '年龄必须大于1', min: 1, type: 'number' }, status: true, insert: { span: 12 }},
        { name: 'sex', label: '性别', type: 'select', enumsName: 'sex', status: true, insert: { span: 12 }},
        { name: 'awaken', label: '霸气觉醒', type: 'switch', status: true, query: false },
        { name: 'reward', label: '赏金', type: 'radio', enumsName: 'reward', status: true },
        { name: 'hobby', label: '爱好', type: 'checkbox', options: hobbyOptions, status: true },
        { name: 'birthday', label: '出生日期', type: 'date', status: true, table: { props: { width: 120 } } },
        { name: 'birthdayTime', label: '出生时间', type: 'time', status: true },
        { name: 'dateTime', label: '出海时间', type: 'dateTime', status: true, table: { props: { width: 120 } } },
        { name: 'dateRange', label: '训练期', type: 'dates', status: true, query: { span: 6 }, table: { props: { width: 160 } } },
        { name: 'dateTimeRange', label: '具体训练期', type: 'dateTimes', status: true, query: false, table: { props: { width: 220 } } },
        {
            name: 'desc',
            label: '简介',
            type: 'text',
            props: { type: 'textarea' },
            rules: { message: '最大不能超过100个字', max: 100 },
            status: true,
            table: false,
            query: false
        },
        {
            name: 'actions',
            label: '操作',
            table: { status: true, props: { width: 280 } }
        },
    ]);

    const config = defineConfig({
        name: '用户',
        uniqueKey: 'id',
        query: {
            api: `${BASE_URL}user.json`,
            async before(params) {
                params.userId = 'aringlai';
                return params;
            },
        },
        insert: {
            api: `${BASE_URL}success.json`,
            async success(res) {
                if (res?.code !== 0) {
                    FMessage.error(res.message);
                    throw new Error(res.message);
                }
            },
        },
        update: {
            api: `${BASE_URL}success.json`,
        },
        delete: {
            api: `${BASE_URL}success.json`,
        },
        view: {},
    });

    onMounted(() => {
        // 异步枚举设置
        hobbyOptions.value = [
            { value: '1', label: '唱歌' },
            { value: '2', label: '吃肉' },
            { value: '3', label: '航海' },
            { value: '4', label: '贝里' },
        ];
    });

    const mockUser = {
        id: '1',
        name: '蒙奇·D·路飞',
        age: 16,
        sex: 1,
        awaken: true,
        reward: 1,
        hobby: ['2', '3'],
        birthday: 1115251200000,
        birthdayTime: '08:20:00',
        dateTime: 1576498525635,
        dateRange: [1576498525635, 1609910925635],
        dateTimeRange: [1576498525635, 1609910925635],
        desc: '外号“草帽”路飞，是草帽一伙、草帽大船团的船长，极恶的世代之一。橡胶果实能力者，悬赏金15亿贝里。梦想是找到传说中的One Piece，成为海贼王。',
    };

    return {
        mockUser,
        config,
        fields,
    };
}
