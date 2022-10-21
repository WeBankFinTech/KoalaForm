import { resetFields } from '@koala-form/core';
import { ComponentType, useForm, useSceneContext } from '@koala-form/core';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const { ctxs } = useSceneContext(['form']);
        const { render } = useForm({
            ctx: ctxs[0],
            form: { props: { labelWidth: '40px' } },
            fields: [
                {
                    name: 'name',
                    label: '姓名',
                    defaultValue: '蒙奇·D·路飞',
                    components: {
                        name: ComponentType.Input,
                    },
                },
                {
                    name: 'sex',
                    label: '性别',
                    defaultValue: '1',
                    components: {
                        name: ComponentType.Select,
                        props: {
                            options: [
                                { value: '0', label: '女' },
                                { value: '1', label: '男' },
                            ],
                        },
                    },
                },
                {
                    name: 'age',
                    label: '年龄',
                    components: {
                        name: ComponentType.InputNumber,
                    },
                },
                {
                    label: ' ',
                    components: {
                        name: ComponentType.Space,
                        children: [
                            {
                                name: ComponentType.Button,
                                children: ['保存'],
                                props: { type: 'primary' },
                                events: {
                                    onClick: (cxt, event) => {
                                        console.log(cxt.model, event);
                                    },
                                },
                            },
                            { name: ComponentType.Button, children: ['重置'], events: { onClick: [resetFields()] } },
                        ],
                    },
                },
            ],
        });
        return render;
    },
});
