import {
    ComponentType,
    useSceneContext,
    formatByOptions,
    genFormatByDate,
    useTable,
    useForm,
    usePager,
    useModal,
    LinkHandler,
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
import { defineComponent, h } from 'vue';

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

        const doQueryLink = new LinkHandler(hFormData, { ctx: query })
            .next(hBeforeDoQuery, { form: query, pager: pager })
            .next(hRequest, { api: '/user.json' })
            .next(hAfterDoQuery, { table: table, pager: pager });

        const doResetLink = new LinkHandler(hSetPager, { ctx: pager, currentPage: 1 })
            .next(hResetFields, query)
            .concat(doQueryLink);

        const doCreateLink = new LinkHandler(hValidate, { ctx: create })
            .next(hFormData, { ctx: create })
            .next(hRequest, {
                api: '/success.json',
            })
            .next(hClose, createModal)
            .concat(doResetLink);

        const doUpdateLink = new LinkHandler(hValidate, { ctx: update })
            .next(hFormData, { ctx: update })
            .next(hRequest, {
                api: '/success.json',
            })
            .next(hClose, updateModal)
            .concat(doResetLink);

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
                                    onClick: new LinkHandler(hSetPager, { ctx: pager, currentPage: 1 }).concat(
                                        doQueryLink,
                                    ),
                                },
                            },
                            {
                                name: ComponentType.Button,
                                props: { type: 'primary' },
                                children: '新增',
                                events: { onClick: new LinkHandler(hResetFields, create).next(hOpen, createModal) },
                            },
                            { name: ComponentType.Button, children: '重置', events: { onClick: doResetLink } },
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
                { ...USER.birthday, components: null, format: genFormatByDate() },
                {
                    label: '操作',
                    props: { width: 160 },
                    components: [
                        {
                            name: ComponentType.Button,
                            children: ['更新'],
                            props: { type: 'link' },
                            events: {
                                onClick: new LinkHandler(({ preVal }) => {
                                    return preVal[0].row;
                                })
                                    .next(hSetFields, { ctx: update })
                                    .next(hOpen, updateModal),
                            },
                        },
                        {
                            name: ComponentType.Tooltip,
                            props: { title: '是否删除当前记录', mode: 'confirm' },
                            events: {
                                onOk: new LinkHandler(({ preVal }) => {
                                    return preVal[0].row;
                                })
                                    .next(hRequest, { api: '/error.json' })
                                    .concat(doResetLink),
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

        usePager({ ctx: pager, pager: { events: { onChange: doQueryLink } } });

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
            childrenCtx: [create],
            modal: {
                events: {
                    onOk: doCreateLink,
                },
            },
        });
        createModal.model.title = '新增用户';

        useModal({
            ctx: updateModal,
            childrenCtx: [update],
            modal: {
                events: {
                    onOk: doUpdateLink,
                },
            },
        });
        updateModal.model.title = '更新用户';

        return () => {
            return [query.render(), table.render(), pager.render(), createModal.render(), updateModal.render()];
        };
    },
});
