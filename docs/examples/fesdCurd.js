import { defineComponent } from 'vue';
import {
    ComponentType,
    doCloseModal,
    doOpenModal,
    doQuery,
    doRefresh,
    doResetQuery,
    formatByOptions,
    useForm,
    useModal,
    usePager,
    useSceneContext,
    useTable,
} from '@koala-form/core';
import { genForm, genQueryAction, genTableAction } from '@koala-form/fes-plugin';
import { FMessage } from '@fesjs/fes-design';

const name = { name: 'name', label: '姓名' };
const age = { name: 'age', label: '年龄' };
const sex = {
    name: 'sex',
    label: '性别',
    options: [
        { value: '0', label: '女' },
        { value: '1', label: '男' },
    ],
};

const formFileds = [
    { ...name, components: { name: ComponentType.Input } },
    { ...age, components: { name: ComponentType.InputNumber } },
    { ...sex, components: { name: ComponentType.Select } },
];

export default defineComponent({
    setup() {
        const {
            ctxs: [query, table, pager, modal, edit],
        } = useSceneContext(['query', 'table', 'pager', 'modal', 'edit']);

        let isCreate = false;
        const queryActions = genQueryAction({
            query: () => doQuery({ api: '/user.json', form: query, table, pager }),
            reset: () => doResetQuery({ api: '/user.json', form: query, table, pager }),
            create: () => {
                doOpenModal({ modal, form: edit });
                modal.model.title = '新增用户';
                isCreate = true;
            },
        });
        const tableAction = genTableAction({
            view: ({ row }) => FMessage.info(row.name),
            delete: ({ row }) => {
                FMessage.success('删除 ' + row.name);
            },
            update: ({ row }) => {
                doOpenModal({ modal, form: edit, row });
                modal.model.title = '修改用户';
                isCreate = false;
            },
        });
        useForm({ ctx: query, fields: [...formFileds, queryActions], form: genForm('inline') });
        useTable({ ctx: table, fields: [name, age, { ...sex, format: formatByOptions }, tableAction] });
        usePager({ ctx: pager, pager: { events: { onChange: () => doRefresh({ api: '/user.json', form: query, table, pager }) } } });
        useForm({ ctx: edit, fields: formFileds });
        useModal({
            ctx: modal,
            modal: {
                children: edit,
                events: {
                    async onOk() {
                        debugger;
                        let api = '/success.json';
                        if (isCreate) {
                            api = '/error.json';
                        }
                        await doCloseModal({ api, form: edit, modal });
                        FMessage.success('保存成功');
                    },
                },
            },
        });

        return () => [query.render(), table.render(), pager.render(), modal.render()];
    },
});
