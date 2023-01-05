import {
    ComponentType,
    useSceneContext,
    formatByOptions,
    genFormatByDate,
    useTable,
    useForm,
    usePager,
    useModal,
    doGetFormData,
    doBeforeQuery,
    doAfterQuery,
    doResetFields,
    doRequest,
    doSetFields,
    doSetPager,
    doValidate,
    doClose,
    doOpen,
} from '@koala-form/core';
import { defineComponent } from 'vue';

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
            ctxs: [query, table, pager, create, update, createModal, updateModal],
        } = useSceneContext(['query', 'table', 'pager', 'create', 'update', 'createModal', 'updateModal']);

        const doQuery = async () => {
            const data = doBeforeQuery(query, pager);
            const res = await doRequest('/user.json', data);
            doAfterQuery(table, pager, res);
        };

        const doReset = async () => {
            doSetPager(pager, { currentPage: 1 });
            doResetFields(query);
            await doQuery();
        };

        const doCreate = async () => {
            await doValidate(create);
            const data = doGetFormData(create);
            await doRequest('/success.json', data);
            doClose(createModal);
            await doReset();
        };

        const doUpdate = async () => {
            await doValidate(update);
            const data = doGetFormData(update);
            await doRequest('/success.json', data);
            doClose(updateModal);
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
                                        doSetPager(pager, { currentPage: 1 });
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
                                        doResetFields(create);
                                        doOpen(createModal);
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
                        { name: 'div', slotName: 'extend' },
                        {
                            name: ComponentType.Button,
                            children: ['更新'],
                            props: { type: 'link' },
                            events: {
                                onClick: (record) => {
                                    doResetFields(update);
                                    doSetFields(update, record.row);
                                    doOpen(updateModal);
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
                                    doRequest('/error.json', record.row);
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
            fields: [{ ...USER.name, required: true }, { ...USER.sex }, { ...USER.age }, { ...USER.birthday }],
        });

        useForm({
            ctx: update,
            fields: [{ ...USER.name, required: true }, { ...USER.sex }, { ...USER.age }, { ...USER.birthday }],
        });

        useModal({
            ctx: createModal,
            modal: {
                children: create,
                events: {
                    onOk: doCreate,
                },
            },
        });
        createModal.model.title = '新增用户';

        useModal({
            ctx: updateModal,
            modal: {
                children: update,
                events: {
                    onOk: doUpdate,
                },
            },
        });
        updateModal.model.title = '更新用户';

        const slot = {
            extend(parmas) {
                console.log(parmas, '----');
                return 'ok';
            },
        };

        return () => {
            return [query.render(), table.render(slot), pager.render(), createModal.render(), updateModal.render()];
        };
    },
});
