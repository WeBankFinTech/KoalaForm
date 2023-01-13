import { ComponentType, formatByOptions, genFormatByDate, useForm, useSceneContext, useTable } from '@koala-form/core';
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const optionsRef = ref([
            { value: '0', label: '女' },
            { value: '1', label: '男' },
        ]);

        const name = {
            name: 'name', // modelRef.value.name可以访问到值
            label: '姓名', // 表单项的名称
        };

        const sex = {
            name: 'sex',
            label: '性别',
            options: optionsRef,
        };

        const date = {
            name: 'date',
            label: '创建时间',
            format: genFormatByDate('YYYY-MM-DD HH:mm:ss'),
        };

        const {
            ctxs: [form, table],
        } = useSceneContext(['form', 'table']);
        useForm({
            ctx: form,
            form: { props: { labelWidth: '40px' } },
            fields: [
                {
                    ...name,
                    required: true,
                    rules: [{ min: 2, max: 10, message: '姓名长度为2-10' }],
                    defaultValue: '蒙奇·D·路飞', // 默认值
                    components: {
                        name: ComponentType.Input, // 表单组件是输入框
                    },
                },
                {
                    ...sex,
                    required: true,
                    components: {
                        name: ComponentType.Select,
                    },
                },
                {
                    ...sex,
                    format: (model, value) => <div>当前值-{value}</div>,
                },
                {
                    label: ' ',
                    components: {
                        name: ComponentType.Button,
                        children: '新增',
                        events: {
                            onClick: async () => {
                                await form.validate();
                                table.modelRef.value.push({
                                    ...form.modelRef.value,
                                    date: Date.now(),
                                });
                            },
                        },
                    },
                },
            ],
        });

        useTable({
            ctx: table,
            fields: [
                name,
                { ...sex, format: formatByOptions },
                date,
                {
                    label: '操作',
                    components: {
                        name: ComponentType.Button,
                        children: '删除',
                        props: { type: 'link' },
                        events: {
                            onClick(record) {
                                const { rowIndex } = record;
                                table.modelRef.value.splice(rowIndex, 1);
                            },
                        },
                    },
                },
            ],
        });

        return () => [form.render(), table.render()];
    },
});
