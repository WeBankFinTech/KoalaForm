// complexPage/use/useField.js

import { defineFields } from '@koala-form/core';
import { KOALA_FORM_FIELD_STATUS } from '../constants';

export function useFields() {
    const fieldList = [
        {
            name: 'queryUserName',
            label: '用户名',
            query: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
            table: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            insert: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            update: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
        },
        {
            name: 'userId',
            label: '用户ID',
            required: true,
            query: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            table: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            insert: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
            update: {
                status: KOALA_FORM_FIELD_STATUS.DISABLED,
            },
        },
        {
            name: 'userName',
            label: '用户姓名',
            required: true,
            query: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            table: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
            },
            insert: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
            update: {
                status: KOALA_FORM_FIELD_STATUS.DISABLED,
            },
        },
        {
            name: 'departmentId',
            label: '部门',
            query: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
            table: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
                props: { width: 180 },
            },
            insert: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
            update: {
                status: KOALA_FORM_FIELD_STATUS.DISABLED,
            },
            rules: [
                {
                    required: true,
                    message: '部门为必填项',
                    trigger: 'blur',
                    type: 'number',
                },
            ],
        },
        {
            name: 'productId',
            label: '产品',
            query: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
            table: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
                props: { width: 180 },
            },
            insert: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
            update: {
                status: KOALA_FORM_FIELD_STATUS.TRUE,
            },
        },
        {
            name: 'actions',
            label: '操作',
            table: {
                status: KOALA_FORM_FIELD_STATUS.FALSE,
                props: { align: 'center', width: 100, fixed: 'right' },
            },
        },
    ];

    const fields = defineFields(fieldList);

    const getDefaultFields = (data = {}) => {
        let defaultFields = {};

        fieldList.forEach((item) => {
            defaultFields[item.name] = '';
        });

        defaultFields = Object.assign({}, defaultFields, data);

        return defaultFields;
    };

    return {
        fields,
        getDefaultFields,
    };
}
