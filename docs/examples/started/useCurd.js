import {
    ComponentType,
    useSceneContext,
    formatByOptions,
    genFormatByDate,
    useTable,
    useForm,
    usePager,
    useModal,
    hFormData,
    hBeforeDoQuery,
    hAfterDoQuery,
    hResetFields,
    hRequest,
    hSetFields,
    hSetPager,
    hValidate,
    hClose,
    hOpen,
} from '@koala-form/core';
import { defineComponent, h, handleError } from 'vue';

const USER = {
    name: {
        name: 'name',
        label: '姓名',
        components: { name: ComponentType.Input },
    },
    sex: {
        name: 'sex',
        label: '性别',
        options: [
            { value: '0', label: '女' },
            { value: '1', label: '男' },
        ],
        components: { name: ComponentType.Select },
    },
    age: {
        name: 'age',
        label: '年龄',
        components: { name: ComponentType.InputNumber },
    },
    birthday: {
        name: 'birthday',
        label: '生日',
        components: { name: ComponentType.DatePicker },
    },
};

export default defineComponent({
    setup() {
        const {
            ctxs: [
                query,
                table,
                pager,
                create,
                update,
                createModal,
                updateModal,
            ],
        } = useSceneContext([
            'query',
            'table',
            'pager',
            'create',
            'update',
            'createModal',
            'updateModal',
        ]);

        const doQuery = async () => {
            const data = hBeforeDoQuery(query, pager);
            const res = await hRequest('/user.json', data);
            hAfterDoQuery(table, pager, res);
        };

        const doReset = async () => {
            hSetPager(pager, { currentPage: 1 });
            hResetFields(query);
            await doQuery();
        };

        const doCreate = async () => {
            await hValidate(create);
            const data = hFormData(create);
            await hRequest('/success.json', data);
            hClose(createModal);
            await doReset();
        };

        const doUpdate = async () => {
            await hValidate(update);
            const data = hFormData(update);
            await hRequest('/success.json', data);
            hClose(updateModal);
            await doReset();
        };

        useForm({
            ctx: query,
            form: { props: { layout: 'inline' } },
            fields: [
                { ...USER.name },
                { ...USER.sex },
                {
                    components: {
                        name: ComponentType.Space,
                        children: [
                            {
                                name: ComponentType.Button,
                                props: { type: 'primary' },
                                children: '查询',
                                events: {
                                    onClick: () => {
                                        hSetPager(pager, { currentPage: 1 });
                                        doQuery();
                                    },
                                },
                            },
                            {
                                name: ComponentType.Button,
                                props: { type: 'primary' },
                                children: '新增',
                                events: {
                                    onClick: () => {
                                        hResetFields(create);
                                        hOpen(createModal);
                                    },
                                },
                            },
                            {
                                name: ComponentType.Button,
                                children: '重置',
                                events: { onClick: doReset },
                            },
                        ],
                    },
                },
            ],
        });

        useTable({
            ctx: table,
            fields: [
                { ...USER.name, components: null },
                { ...USER.sex, components: null, format: formatByOptions },
                { ...USER.age, components: null },
                {
                    ...USER.birthday,
                    components: null,
                    format: genFormatByDate(),
                },
                {
                    label: '操作',
                    props: { width: 160 },
                    components: [
                        {
                            name: ComponentType.Button,
                            children: ['更新'],
                            props: { type: 'link' },
                            events: {
                                onClick: (record) => {
                                    hResetFields(update);
                                    hSetFields(update, record.row);
                                    hOpen(updateModal);
                                },
                            },
                        },
                        {
                            name: ComponentType.Tooltip,
                            props: {
                                title: '是否删除当前记录',
                                mode: 'confirm',
                            },
                            events: {
                                onOk: (record) => {
                                    hRequest('/error.json', record.row);
                                    doReset();
                                },
                            },
                            children: [
                                {
                                    name: ComponentType.Button,
                                    children: ['删除'],
                                    props: { type: 'link' },
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        usePager({ ctx: pager, pager: { events: { onChange: doQuery } } });

        useForm({
            ctx: create,
            fields: [
                { ...USER.name, required: true },
                { ...USER.sex },
                { ...USER.age },
                { ...USER.birthday },
            ],
        });

        useForm({
            ctx: update,
            fields: [
                { ...USER.name, required: true },
                { ...USER.sex },
                { ...USER.age },
                { ...USER.birthday },
            ],
        });

        useModal({
            ctx: createModal,
            childrenCtx: [create],
            modal: {
                events: {
                    onOk: doCreate,
                },
            },
        });
        createModal.model.title = '新增用户';

        useModal({
            ctx: updateModal,
            childrenCtx: [update],
            modal: {
                events: {
                    onOk: doUpdate,
                },
            },
        });
        updateModal.model.title = '更新用户';

        return () => {
            return [
                query.render(),
                table.render(),
                pager.render(),
                createModal.render(),
                updateModal.render(),
            ];
        };
    },
});
