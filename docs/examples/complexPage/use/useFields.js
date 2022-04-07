// complexPage/use/useFields.js

import { defineFields } from '@koala-form/core';
import { KOALA_FORM_FIELD_STATUS, KOALA_FORM_FIELD_TYPE } from '../constants';
import { appendAll } from '../utils';

const statusList = [
    { value: 'enable', label: '有效' },
    { value: 'disable', label: '无效' },
];
const statusListAll = appendAll(statusList);

export function useFields() {
    const fieldList = [
        {
            name: 'queryUserName',
            label: '用户名',
            status: KOALA_FORM_FIELD_STATUS.FALSE,
            query: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
        },
        {
            name: 'userId',
            label: '用户ID',
            required: true,
            status: KOALA_FORM_FIELD_STATUS.TRUE,
            query: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            table: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            update: {
                status: KOALA_FORM_FIELD_STATUS.DISABLED,
            },
        },
        {
            name: 'userName',
            label: '用户姓名',
            required: true,
            status: KOALA_FORM_FIELD_STATUS.TRUE,
            query: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            table: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
        },
        {
            name: 'id',
            label: 'ID',
            status: KOALA_FORM_FIELD_STATUS.FALSE,
            table: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
        },
        {
            name: 'user',
            label: '用户',
            status: KOALA_FORM_FIELD_STATUS.FALSE,
            table: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
        },
        {
            name: 'departmentId',
            label: '部门',
            status: KOALA_FORM_FIELD_STATUS.TRUE,
            table: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            rules: [
                {
                    required: true,
                    message: '部门为必填项',
                    trigger: ['blur', 'change'],
                    type: 'number',
                },
            ],
        },
        {
            name: 'departmentName',
            label: '部门',
            status: KOALA_FORM_FIELD_STATUS.FALSE,
            table: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
                props: { width: 180 },
            },
        },
        {
            name: 'productId',
            label: '产品',
            status: KOALA_FORM_FIELD_STATUS.TRUE,
            table: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            rules: [
                {
                    required: true,
                    message: '产品为必填项',
                    trigger: ['blur', 'change'],
                    type: 'number',
                },
            ],
        },
        {
            name: 'productName',
            label: '产品',
            status: KOALA_FORM_FIELD_STATUS.FALSE,
            table: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
                props: { width: 180 },
            },
        },
        {
            name: 'status',
            label: '状态',
            required: true,
            status: KOALA_FORM_FIELD_STATUS.TRUE,
            type: KOALA_FORM_FIELD_TYPE.RADIO,
            options: statusList,
            query: {
                type: KOALA_FORM_FIELD_TYPE.SELECT,
                options: statusListAll,
            },
            table: {
                props: { width: 100 },
            },
        },
        {
            name: 'actions',
            label: '操作',
            status: KOALA_FORM_FIELD_STATUS.FALSE,
            table: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
                props: { align: 'center', width: 100, fixed: 'right' },
            },
        },
    ];

    const fields = defineFields(fieldList);

    const getDefaultFields = () => {
        let defaultFields = {};

        fieldList.forEach((item) => {
            defaultFields[item.name] = '';
        });

        defaultFields = Object.assign({}, defaultFields, {
            status: 'enable',
        });

        return defaultFields;
    };

    return {
        fields,
        getDefaultFields,
    };
}
