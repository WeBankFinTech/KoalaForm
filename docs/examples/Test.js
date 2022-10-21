import {
    ComponentType,
    useForm,
    useTable,
    when,
    usePager,
    useTableWithPager,
    useQueryPage,
    useSceneContext,
} from '@koala-form/core';
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';

const options = [
    { value: '0', label: '女' },
    { value: '1', label: '男' },
];
const tableFields = [
    { name: 'name', label: '姓名', slotName: 'tableName' },
    { name: 'age', label: '年龄' },
];

const formFields = [
    {
        name: 'name',
        label: '姓名:',
        slotName: 'name',
        components: {
            name: ComponentType.Input,
            disabled: when('age === 3'),
        },
    },
    {
        name: 'age',
        label: '年龄:',
        components: {
            name: ComponentType.InputNumber,
        },
        defaultValue: 2,
    },
    {
        name: 'sex',
        label: '性别:',
        vIf: when((model) => model.age >= 1),
        defaultValue: '1',
        components: {
            name: ComponentType.Select,
            props: {
                options,
            },
        },
    },
];

export default defineComponent({
    setup() {
        // const { render, formRef } = useForm(
        //     queryFormPreset([
        //         {
        //             name: 'name',
        //             label: '姓名:',
        //             slotName: 'name',
        //             components: {
        //                 name: ComponentType.Input,
        //                 disabled: when('age === 3'),
        //             },
        //         },
        //         {
        //             name: 'age',
        //             label: '年龄:',
        //             components: {
        //                 name: ComponentType.InputNumber,
        //             },
        //             defaultValue: 2,
        //         },
        //         {
        //             name: 'sex',
        //             label: '性别:',
        //             vIf: when((model) => model.age >= 1),
        //             defaultValue: '1',
        //             components: {
        //                 name: ComponentType.Select,
        //                 props: {
        //                     options,
        //                 },
        //             },
        //         },
        //     ]),
        // );

        // const { render: tableRender, model } = useTable({
        //     fields: [
        //         { name: 'name', label: '姓名', slotName: 'tableName' },
        //         { name: 'age', label: '年龄' },
        //     ],
        // });
        // model.value = [
        //     { name: 'aring', age: 18 },
        //     { name: 'aring', age: 20 },
        //     { name: 'aring', age: 23 },
        // ];

        // const pager = usePager({});

        // const { render, dataSource, pager } = useTableWithPager(
        //     {
        //         fields: [
        //             { name: 'name', label: '姓名', slotName: 'tableName' },
        //             { name: 'age', label: '年龄' },
        //         ],
        //     },
        //     {},
        // );

        // const list = [];
        // for (let index = 1; index <= 33; index++) {
        //     list.push({ name: 'aring', age: index });
        // }
        // dataSource.value = list;
        // pager.model.totalCount = 60;

        const {
            ctxs: [queryFormCtx, tableCtx, pagerCtx],
        } = useSceneContext(['queryForm', 'table', 'pager']);

        const { render } = useQueryPage({
            api: '/user.json',
            pager: { ctx: pagerCtx },
            table: { fields: tableFields, ctx: tableCtx },
            query: { fields: formFields, ctx: queryFormCtx },
        });

        const slots = {
            // name: (record) => {
            //     console.log(record, 'name default');
            //     return 'aring111';
            // },
            // tableName: (record) => {
            //     console.log(record, 'name default');
            //     return 'aring222';
            // },
            // tableName__header: (record) => {
            //     console.log(record, 'header');
            //     return '自定义';
            // },
        };
        return () => {
            // const vnodes = render(slots);
            // return vnodes.concat(tableRender(slots)).concat(pager.render());
            return render(slots);
        };
    },
});
